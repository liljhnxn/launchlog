"use client";

import React from "react";
import { Project } from "@/types";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: (projectId: bigint) => Promise<void>;
  isDeleting: boolean;
  errorMessage?: string | null;
}

export function DeleteModal({
  isOpen,
  project,
  onClose,
  onConfirm,
  isDeleting,
  errorMessage,
}: DeleteModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-charcoal-900 border border-charcoal-700 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Delete Project
            </h3>
            <p className="text-xs text-charcoal-400">
              This action permanently deactivates your project listing.
            </p>
          </div>
        </div>

        <div className="my-4 p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800">
          <p className="text-sm font-semibold text-white truncate">
            {project.name}
          </p>
          <p className="text-xs text-charcoal-400 truncate mt-0.5">
            {project.website}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-charcoal-300 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(project.id)}
            disabled={isDeleting}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting on-chain...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

