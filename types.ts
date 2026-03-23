import React from 'react';

export interface NavItem {
  name: string;
  view: string;
  icon: (props: React.ComponentProps<'svg'>) => React.ReactNode;
}

export enum Vote {
  For = 'For',
  Against = 'Against',
}

export type ProjectStage = 'funding' | 'progress' | 'completed' | 'failed';

export interface Resource {
    id: number;
    name: string;
    type: 'skill' | 'software' | 'hardware';
}

export interface UserProfile {
    id: string;
    address: string;
    talents: number[]; // Array of resource IDs
}

export interface ProjectRecommendation {
    projectId: number;
    rationale: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  proposer: string;
  votes: {
    for: number;
    against: number;
  };
  endDate: Date;
  stage: ProjectStage;
  guildId: number;
  neededResources: number[]; // Array of resource IDs
}

export type ProposalStatus = 'active' | 'passed' | 'failed';

export interface Proposal extends Omit<Project, 'stage' | 'neededResources'> {
  status: ProposalStatus;
}

export interface Guild {
  id: number;
  name:string;
  description: string;
  members: number;
  imageUrl: string;
}

export interface ProjectIdea {
    name: string;
    description: string;
    tags: string[];
}

export interface Opportunity {
  title: string;
  description: string;
  rationale: string;
  suggestedGuilds: number[];
}

export interface SagaChapter {
  title: string;
  description: string;
}

export interface Saga {
  title: string;
  narrative: string;
  chapters: SagaChapter[];
}