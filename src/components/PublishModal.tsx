"use client";

import React, { useState } from "react";
import { isValidUrl } from "@/utils/format";
import { X, AlertCircle, Loader2, Sparkles, ShieldAlert } from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; website: string }) => Promise<void>;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function PublishModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}: PublishModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedUrl = website.trim();

    if (!trimmedName) {
      setValidationError("Project name is required.");
      return;
    }
    if (trimmedName.length > 50) {
      setValidationError("Project name cannot exceed 50 characters.");
      return;
    }

    if (!trimmedDesc) {
      setValidationError("Project description is required.");
      return;
    }
    if (trimmedDesc.length > 200) {
      setValidationError("Project description cannot exceed 200 characters.");
      return;
    }

    if (!trimmedUrl) {
      setValidationError("Website URL is required.");
      return;
    }
    if (trimmedUrl.length > 200) {
      setValidationError("Website URL cannot exceed 200 characters.");
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setValidationError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        description: trimmedDesc,
        website: trimmedUrl,
      });
      // Reset form
      setName("");
      setDescription("");
      setWebsite("");
    } catch {
      // Error handled by parent or errorMessage prop
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-charcoal-900 border border-charcoal-700 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple-light">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Publish New Project
          </h3>
        </div>
        <p className="text-xs text-charcoal-400 mb-5 ml-10">
          Record your project on the Botchain Mainnet for the world to discover.
        </p>

        {/* Notice on public on-chain data */}
        <div className="mb-5 rounded-xl bg-charcoal-850 border border-charcoal-800 p-3 flex items-start space-x-2.5 text-xs text-charcoal-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Project records are stored publicly on-chain. Please avoid submitting private keys, confidential notes, or personal data.
          </p>
        </div>

        {/* Errors */}
        {(validationError || errorMessage) && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 flex items-start space-x-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{validationError || errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-charcoal-200">
                Project Name <span className="text-red-400">*</span>
              </label>
              <span className={`text-[11px] font-mono ${name.length > 50 ? "text-red-400" : "text-charcoal-400"}`}>
                {name.length}/50
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="e.g. BotSwap DEX"
              required
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-white placeholder-charcoal-500 text-sm focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-charcoal-200">
                Short Description <span className="text-red-400">*</span>
              </label>
              <span className={`text-[11px] font-mono ${description.length > 200 ? "text-red-400" : "text-charcoal-400"}`}>
                {description.length}/200
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="A decentralized automated liquidity pool and token swap protocol..."
              required
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-white placeholder-charcoal-500 text-sm focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all resize-none"
            />
          </div>

          {/* Website URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-charcoal-200">
                Website URL <span className="text-red-400">*</span>
              </label>
              <span className={`text-[11px] font-mono ${website.length > 200 ? "text-red-400" : "text-charcoal-400"}`}>
                {website.length}/200
              </span>
            </div>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={200}
              placeholder="https://botswap.xyz"
              required
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-white placeholder-charcoal-500 text-sm focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-300 hover:text-white hover:bg-charcoal-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent-green hover:bg-accent-green-dark text-charcoal-950 transition-all shadow-glow-green disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming on-chain...</span>
                </>
              ) : (
                <span>Publish to Botchain</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

