"use client";

import React, { useState, useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { CONTRACT_ADDRESS, LAUNCHLOG_ABI } from "@/config/contract";
import { botchainMainnet } from "@/config/chain";
import { Project } from "@/types";
import { Header } from "@/components/Header";
import { StatsSection } from "@/components/StatsSection";
import { ProjectCard } from "@/components/ProjectCard";
import { PublishModal } from "@/components/PublishModal";
import { EditModal } from "@/components/EditModal";
import { DeleteModal } from "@/components/DeleteModal";
import {
  Search,
  Sparkles,
  Layers,
  FolderGit2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Loader2,
  Wallet,
} from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  // Navigation tab state: 'explore' | 'my-projects'
  const [activeTab, setActiveTab] = useState<"explore" | "my-projects">("explore");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Transaction banner notification
  const [banner, setBanner] = useState<{
    type: "success" | "error" | "info";
    message: string;
    txHash?: string;
  } | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Read all projects directly from the smart contract
  const {
    data: rawProjects,
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LAUNCHLOG_ABI,
    functionName: "getAllProjects",
    chainId: botchainMainnet.id,
  });

  const { writeContractAsync } = useWriteContract();

  // Normalize project data from contract
  const allProjects = useMemo<Project[]>(() => {
    if (!rawProjects || !Array.isArray(rawProjects)) return [];
    return (rawProjects as any[]).map((p) => ({
      id: BigInt(p.id),
      name: String(p.name),
      description: String(p.description),
      website: String(p.website),
      creator: p.creator as `0x${string}`,
      createdAt: BigInt(p.createdAt),
      isActive: Boolean(p.isActive),
    }));
  }, [rawProjects]);

  // Connected user's projects
  const myProjects = useMemo<Project[]>(() => {
    if (!address) return [];
    return allProjects.filter(
      (p) => p.creator.toLowerCase() === address.toLowerCase()
    );
  }, [allProjects, address]);

  // Statistics
  const stats = useMemo(() => {
    const totalProjects = allProjects.length;
    const uniqueCreators = new Set(
      allProjects.map((p) => p.creator.toLowerCase())
    ).size;
    const myProjectsCount = myProjects.length;

    return {
      totalProjects,
      totalCreators: uniqueCreators,
      myProjectsCount,
    };
  }, [allProjects, myProjects]);

  // Filtered projects for the current tab + search
  const displayedProjects = useMemo(() => {
    const sourceList = activeTab === "explore" ? allProjects : myProjects;
    if (!searchQuery.trim()) return sourceList;

    const q = searchQuery.toLowerCase().trim();
    return sourceList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.creator.toLowerCase().includes(q)
    );
  }, [activeTab, allProjects, myProjects, searchQuery]);

  // Helper to wait for transaction confirmation and refetch
  const handleTxFlow = async (
    actionName: string,
    executeTx: () => Promise<`0x${string}`>
  ) => {
    setActionError(null);
    setIsSubmittingAction(true);
    setBanner({
      type: "info",
      message: `Awaiting wallet signature for ${actionName}...`,
    });

    try {
      const hash = await executeTx();
      setBanner({
        type: "info",
        message: `Transaction broadcasted! Confirming on Botchain Mainnet...`,
        txHash: hash,
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      await refetchProjects();

      setBanner({
        type: "success",
        message: `Success! ${actionName} confirmed on-chain.`,
        txHash: hash,
      });
      return true;
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err?.shortMessage ||
        err?.message ||
        "Transaction failed. Please try again.";
      setActionError(errMsg);
      setBanner({
        type: "error",
        message: errMsg,
      });
      return false;
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Publish Project Handler
  const handlePublish = async (data: {
    name: string;
    description: string;
    website: string;
  }) => {
    const success = await handleTxFlow("Project publication", () =>
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: LAUNCHLOG_ABI,
        functionName: "createProject",
        args: [data.name, data.description, data.website],
      })
    );

    if (success) {
      setIsPublishOpen(false);
    }
  };

  // Update Project Handler
  const handleUpdate = async (
    projectId: bigint,
    data: { name: string; description: string; website: string }
  ) => {
    const success = await handleTxFlow("Project update", () =>
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: LAUNCHLOG_ABI,
        functionName: "updateProject",
        args: [projectId, data.name, data.description, data.website],
      })
    );

    if (success) {
      setEditingProject(null);
    }
  };

  // Delete Project Handler
  const handleDelete = async (projectId: bigint) => {
    const success = await handleTxFlow("Project deletion", () =>
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: LAUNCHLOG_ABI,
        functionName: "deleteProject",
        args: [projectId],
      })
    );

    if (success) {
      setDeletingProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col selection:bg-accent-purple selection:text-white">
      {/* Navigation Header */}
      <Header onOpenPublish={() => setIsPublishOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Alert */}
        {banner && (
          <div
            className={`rounded-2xl p-4 border flex items-start justify-between gap-3 text-sm transition-all duration-200 ${
              banner.type === "success"
                ? "bg-accent-green/10 border-accent-green/30 text-accent-green-light"
                : banner.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-accent-purple/10 border-accent-purple/30 text-accent-purple-light"
            }`}
          >
            <div className="flex items-start space-x-3">
              {banner.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
              ) : banner.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-accent-purple shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-white">{banner.message}</p>
                {banner.txHash && (
                  <a
                    href={`https://scan.botchain.ai/tx/${banner.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs underline mt-1 hover:opacity-80"
                  >
                    <span>View on BotchainScan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => setBanner(null)}
              className="text-charcoal-400 hover:text-white text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero & Intro */}
        <div className="relative rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-charcoal-800 p-8 sm:p-10 overflow-hidden shadow-subtle">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-green/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-green-subtle border border-accent-green/30 text-accent-green-light text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Botchain Mainnet Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Every launch deserves a record.
            </h1>
            <p className="text-sm sm:text-base text-charcoal-300 mt-3 leading-relaxed">
              LaunchLog is the official on-chain registry for builders and creators. Connect your MetaMask wallet, record your launches directly on the Botchain Mainnet, and share them with the entire ecosystem.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isConnected ? (
                <button
                  onClick={() => setIsPublishOpen(true)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent-green hover:bg-accent-green-dark text-charcoal-950 transition-all shadow-glow-green"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Your Project</span>
                </button>
              ) : (
                <div className="text-xs text-charcoal-400 flex items-center space-x-2 bg-charcoal-800/60 px-3.5 py-2 rounded-xl border border-charcoal-700/60">
                  <Wallet className="w-4 h-4 text-accent-purple-light" />
                  <span>Connect MetaMask in the header to submit or manage your launches.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <StatsSection
          totalProjects={stats.totalProjects}
          totalCreators={stats.totalCreators}
          myProjectsCount={stats.myProjectsCount}
          isConnected={isConnected}
          isLoading={isLoadingProjects}
        />

        {/* Section Navigation & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 bg-charcoal-900 border border-charcoal-800 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "explore"
                  ? "bg-accent-purple text-white shadow-glow-purple"
                  : "text-charcoal-400 hover:text-charcoal-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Explore Projects</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === "explore" ? "bg-white/20 text-white" : "bg-charcoal-800 text-charcoal-400"
              }`}>
                {allProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("my-projects")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "my-projects"
                  ? "bg-accent-purple text-white shadow-glow-purple"
                  : "text-charcoal-400 hover:text-charcoal-200"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>My Projects</span>
              {isConnected && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === "my-projects" ? "bg-white/20 text-white" : "bg-charcoal-800 text-charcoal-400"
                }`}>
                  {myProjects.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, description, address..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs sm:text-sm text-white placeholder-charcoal-500 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>
        </div>

        {/* Projects Grid or Empty States */}
        {isLoadingProjects ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
            <p className="text-sm text-charcoal-400">Loading project records from Botchain Mainnet...</p>
          </div>
        ) : activeTab === "my-projects" && !isConnected ? (
          /* Disconnected State for My Projects */
          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-12 text-center max-w-md mx-auto my-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-charcoal-800 flex items-center justify-center mx-auto text-charcoal-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Connect Your Wallet</h4>
              <p className="text-xs text-charcoal-400 mt-1">
                Please connect your MetaMask wallet to view and manage your published projects on Botchain Mainnet.
              </p>
            </div>
          </div>
        ) : displayedProjects.length === 0 ? (
          /* Empty List State */
          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-12 text-center max-w-md mx-auto my-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-charcoal-800 flex items-center justify-center mx-auto text-charcoal-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                {searchQuery ? "No matching projects found" : "No projects recorded yet"}
              </h4>
              <p className="text-xs text-charcoal-400 mt-1">
                {searchQuery
                  ? "Try adjusting your search criteria or clearing filters."
                  : activeTab === "my-projects"
                  ? "You haven't published any projects yet. Launch your first project today on Mainnet!"
                  : "Be the pioneer builder and record the first launch on Botchain Mainnet!"}
              </p>
            </div>
            {isConnected && !searchQuery && (
              <button
                onClick={() => setIsPublishOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-green hover:bg-accent-green-dark text-charcoal-950 transition-all shadow-glow-green"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Project</span>
              </button>
            )}
          </div>
        ) : (
          /* Project Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id.toString()}
                project={project}
                currentUserAddress={address}
                onEdit={(proj) => setEditingProject(proj)}
                onDelete={(proj) => setDeletingProject(proj)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800/80 bg-charcoal-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-500">
          <p>© {new Date().getFullYear()} LaunchLog. Every launch deserves a record.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              <span>Botchain Mainnet (Chain ID: 677)</span>
            </span>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal-300 transition-colors"
            >
              Explorer ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => {
          setIsPublishOpen(false);
          setActionError(null);
        }}
        onSubmit={handlePublish}
        isSubmitting={isSubmittingAction}
        errorMessage={actionError}
      />

      <EditModal
        isOpen={Boolean(editingProject)}
        project={editingProject}
        onClose={() => {
          setEditingProject(null);
          setActionError(null);
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmittingAction}
        errorMessage={actionError}
      />

      <DeleteModal
        isOpen={Boolean(deletingProject)}
        project={deletingProject}
        onClose={() => {
          setDeletingProject(null);
          setActionError(null);
        }}
        onConfirm={handleDelete}
        isDeleting={isSubmittingAction}
        errorMessage={actionError}
      />
    </div>
  );
}
