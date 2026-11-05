"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { truncateAddress } from "@/utils/format";
import { botchainMainnet } from "@/config/chain";
import { CONTRACT_ADDRESS } from "@/config/contract";
import {
  Rocket,
  Wallet,
  LogOut,
  ChevronDown,
  AlertCircle,
  Plus,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

interface HeaderProps {
  onOpenPublish: () => void;
}

export function Header({ onOpenPublish }: HeaderProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== botchainMainnet.id;

  const handleConnect = () => {
    const injectedConnector =
      connectors.find((c) => c.id === "injected" || c.name.toLowerCase().includes("metamask")) ||
      connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-800 bg-charcoal-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple-dark flex items-center justify-center shadow-glow-purple shrink-0">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Launch<span className="text-accent-purple-light">Log</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-accent-green-subtle text-accent-green-light border border-accent-green/30">
                  <img src="/botchain-logo.png" alt="BOT Chain" className="w-3 h-3 rounded-full object-cover inline-block" />
                  <span>Mainnet</span>
                </span>
              </div>
              <p className="text-xs text-charcoal-400 font-medium hidden sm:block">
                Every launch deserves a record.
              </p>
            </div>
          </div>

          {/* BOT Chain Official Links in Header */}
          <nav className="hidden lg:flex items-center space-x-2 text-xs font-medium text-charcoal-300 pl-4 border-l border-charcoal-800">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-850 hover:text-white border border-charcoal-800 hover:border-charcoal-700 transition-all group"
              title="Official BOT Chain Website"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 rounded-full object-cover group-hover:scale-110 transition-transform"
              />
              <span className="font-semibold text-white">BOT Chain</span>
              <span className="text-charcoal-400 text-[11px]">(botchain.ai)</span>
              <ExternalLink className="w-3 h-3 text-charcoal-500" />
            </a>

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-850 hover:text-white border border-charcoal-800 hover:border-charcoal-700 transition-all group"
              title="Official BOT Chain Block Explorer"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 rounded-full object-cover group-hover:scale-110 transition-transform"
              />
              <span className="font-semibold text-accent-green-light">BOT Explorer</span>
              <span className="text-charcoal-400 text-[11px]">(scan.botchain.ai)</span>
              <ExternalLink className="w-3 h-3 text-charcoal-500" />
            </a>
          </nav>
        </div>

        {/* Action Controls & Contract Pill */}
        <div className="flex items-center space-x-3">
          {/* Mainnet Verified Contract Badge */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs">
            <span className="text-[11px] text-charcoal-400">Mainnet:</span>
            <a
              href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-accent-purple-light hover:underline"
              title={`View contract ${CONTRACT_ADDRESS} on BotchainScan`}
            >
              {truncateAddress(CONTRACT_ADDRESS)}
            </a>
            <button
              onClick={handleCopyContract}
              className="text-charcoal-400 hover:text-white p-0.5 rounded transition-colors"
              title="Copy Mainnet contract address"
            >
              {copiedContract ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isConnected && (
            <button
              onClick={onOpenPublish}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-accent-green hover:bg-accent-green-dark text-charcoal-950 transition-colors shadow-glow-green"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Publish Project</span>
              <span className="sm:hidden">Publish</span>
            </button>
          )}

          {/* Network Switch Warning */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainMainnet.id })}
              disabled={isSwitching}
              className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>{isSwitching ? "Switching..." : "Switch to BOT Chain"}</span>
            </button>
          )}

          {/* Wallet State */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-accent-purple hover:bg-accent-purple-dark text-white transition-all shadow-glow-purple disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect MetaMask"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-medium bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 border border-charcoal-700 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
                <span className="font-mono text-xs">{truncateAddress(address)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-charcoal-900 border border-charcoal-700 shadow-subtle p-2 z-50">
                  <div className="px-3 py-2 border-b border-charcoal-800">
                    <p className="text-xs text-charcoal-400">Connected Wallet</p>
                    <p className="font-mono text-xs text-white truncate mt-0.5">{address}</p>
                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-accent-purple-light hover:underline inline-flex items-center space-x-1 mt-1.5"
                    >
                      <img src="/botchain-logo.png" alt="BOT Chain" className="w-3 h-3 rounded-full object-cover inline" />
                      <span>View on BotchainScan ↗</span>
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setDropdownOpen(false);
                    }}
                    className="w-full mt-1.5 flex items-center space-x-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
