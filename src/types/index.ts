export interface Project {
  id: bigint;
  name: string;
  description: string;
  website: string;
  creator: `0x${string}`;
  createdAt: bigint;
  isActive: boolean;
}

export interface ProjectFormData {
  name: string;
  description: string;
  website: string;
}

export interface StatsData {
  totalProjects: number;
  totalCreators: number;
  myProjectsCount: number;
}

