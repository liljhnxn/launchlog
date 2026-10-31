"use client";

import React from "react";
import { Layers, Users, FolderGit2 } from "lucide-react";

interface StatsSectionProps {
  totalProjects: number;
  totalCreators: number;
  myProjectsCount: number;
  isConnected: boolean;
  isLoading: boolean;
}

export function StatsSection({
  totalProjects,
  totalCreators,
  myProjectsCount,
  isConnected,
  isLoading,
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Projects */}
      <div className="relative overflow-hidden rounded-2xl bg-charcoal-900 border border-charcoal-800 p-5 transition-all hover:border-charcoal-700 hover:shadow-subtle group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-accent-purple/5 rounded-full blur-2xl group-hover:bg-accent-purple/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
              Total Projects
            </p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {isLoading ? (
                <span className="inline-block w-8 h-8 rounded bg-charcoal-800 animate-pulse" />
              ) : (
                totalProjects
              )}
            </h3>
            <p className="text-[12px] text-charcoal-400 mt-1">
              Launches recorded on Botchain
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple-light group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Creators */}
      <div className="relative overflow-hidden rounded-2xl bg-charcoal-900 border border-charcoal-800 p-5 transition-all hover:border-charcoal-700 hover:shadow-subtle group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-accent-green/5 rounded-full blur-2xl group-hover:bg-accent-green/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
              Total Creators
            </p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {isLoading ? (
                <span className="inline-block w-8 h-8 rounded bg-charcoal-800 animate-pulse" />
              ) : (
                totalCreators
              )}
            </h3>
            <p className="text-[12px] text-charcoal-400 mt-1">
              Unique builder wallets
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green-light group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Your Published Projects */}
      <div className="relative overflow-hidden rounded-2xl bg-charcoal-900 border border-charcoal-800 p-5 transition-all hover:border-charcoal-700 hover:shadow-subtle group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-charcoal-800/20 rounded-full blur-2xl group-hover:bg-accent-purple/5 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
              Your Launches
            </p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {isLoading ? (
                <span className="inline-block w-8 h-8 rounded bg-charcoal-800 animate-pulse" />
              ) : isConnected ? (
                myProjectsCount
              ) : (
                <span className="text-sm font-normal text-charcoal-500">Connect wallet</span>
              )}
            </h3>
            <p className="text-[12px] text-charcoal-400 mt-1">
              {isConnected ? "Published by your address" : "To manage your launches"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-charcoal-300 group-hover:scale-105 transition-transform">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

