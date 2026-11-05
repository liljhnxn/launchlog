"use client";

import React from "react";
import { Project } from "@/types";
import { truncateAddress, formatTimestamp } from "@/utils/format";
import { ExternalLink, Edit3, Trash2, Calendar, User, Globe } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  currentUserAddress?: string;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({
  project,
  currentUserAddress,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const isCreator =
    currentUserAddress &&
    project.creator.toLowerCase() === currentUserAddress.toLowerCase();

  // Ensure safe website URL
  const safeWebsiteUrl =
    project.website.startsWith("http://") || project.website.startsWith("https://")
      ? project.website
      : `https://${project.website}`;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 transition-all duration-200 hover:border-charcoal-700 hover:shadow-subtle hover:-translate-y-0.5 group">
      <div>
        {/* Card Header: Title & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-accent-purple-light transition-colors line-clamp-1">
              {project.name}
            </h4>
            <div className="flex items-center space-x-3 text-xs text-charcoal-400 mt-1">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-charcoal-500" />
                <span>{formatTimestamp(project.createdAt)}</span>
              </span>
              <span className="text-charcoal-600">•</span>
              <a
                href={`https://scan.botchain.ai/address/${project.creator}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Creator: ${project.creator}`}
                className="flex items-center space-x-1 font-mono hover:text-accent-purple-light transition-colors"
              >
                <User className="w-3.5 h-3.5 text-charcoal-500" />
                <span>{truncateAddress(project.creator)}</span>
              </a>
            </div>
          </div>

          {isCreator && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-accent-purple-subtle text-accent-purple-light border border-accent-purple/30">
              You
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-charcoal-300 leading-relaxed break-words mb-5 line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Card Footer: Actions */}
      <div className="pt-4 border-t border-charcoal-800/80 flex items-center justify-between gap-2">
        {/* Visit website */}
        <a
          href={safeWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-charcoal-800 hover:bg-charcoal-750 text-charcoal-200 hover:text-white border border-charcoal-700 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-accent-green" />
          <span>Visit Website</span>
          <ExternalLink className="w-3 h-3 text-charcoal-400 ml-0.5" />
        </a>

        {/* Creator actions: Edit & Delete */}
        {isCreator && (
          <div className="flex items-center space-x-1.5">
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="p-2 rounded-xl text-charcoal-400 hover:text-accent-purple-light hover:bg-accent-purple/10 border border-transparent hover:border-accent-purple/20 transition-all"
                title="Edit Project"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project)}
                className="p-2 rounded-xl text-charcoal-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
