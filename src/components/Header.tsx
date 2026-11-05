"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { truncateAddress } from "@/utils/format";
import { botchainMainnet } from "@/config/chain";
import {
  Rocket,
  Wallet,
  LogOut,
  ChevronDown,
  AlertCircle,
  Plus,
  ExternalLink,
  Globe,
  Compass,
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

  const isWrongNetwork = isConnected && chain?.id !== botchainMainnet.id;

  const handleConnect = () => {
    const injectedConnector =
      connectors.find((c) => c.id === "injected" || c.name.toLowerCase().includes("metamask")) ||
      connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-800 bg-charcoal-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Ecosystem Link */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple-dark flex items-center justify-center shadow-glow-purple">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Launch<span className="text-accent-purple-light">Log</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-accent-green-subtle text-accent-green-light border border-accent-green/30">
                  BOT Chain Mainnet
                </span>
              </div>
              <p className="text-xs text-charcoal-400 font-medium hidden sm:block">
                Every launch deserves a record.
              </p>
            </div>
          </div>

          {/* Quick Ecosystem Navigation Links */}
          <nav className="hidden md:flex items-center space-x-3 text-xs font-medium text-charcoal-300 pl-4 border-l border-charcoal-800">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-charcoal-850 transition-colors"
              title="Official BOT Chain Website"
            >
              <Globe className="w-3.5 h-3.5 text-accent-purple-light" />
              <span>botchain.ai</span>
              <ExternalLink className="w-2.5 h-2.5 text-charcoal-500" />
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-charcoal-850 transition-colors"
              title="Official BOT Chain Block Explorer"
            >
              <Compass className="w-3.5 h-3.5 text-accent-green-light" />
              <span>Explorer</span>
              <ExternalLink className="w-2.5 h-2.5 text-charcoal-500" />
            </a>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-900 border border-charcoal-700 shadow-subtle p-2 z-50">
                  <div className="px-3 py-2 border-b border-charcoal-800">
                    <p className="text-xs text-charcoal-400">Connected Wallet</p>
                    <p className="font-mono text-xs text-white truncate mt-0.5">{address}</p>
                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-accent-purple-light hover:underline inline-block mt-1"
                    >
                      View on BotchainScan ↗
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
