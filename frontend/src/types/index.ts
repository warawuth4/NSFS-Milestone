export type Status = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type MilestoneStatus = 'PLANNED' | 'IN_PROGRESS' | 'ACHIEVED' | 'PAUSED';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MilestoneProgress {
  totalTasks: number;
  doneTasks: number;
  inProgressTasks: number;
  inReviewTasks: number;
  todoTasks: number;
  percentage: number;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
  status: MilestoneStatus;
  progress?: MilestoneProgress;
  sprints?: Sprint[];
  epics?: Epic[];
  createdAt: string;
  updatedAt: string;
}

export interface SprintProgress {
  totalTasks: number;
  doneTasks: number;
  inProgressTasks: number;
  inReviewTasks: number;
  todoTasks: number;
  percentage: number;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: SprintStatus;
  milestoneId?: string | null;
  milestone?: Milestone;
  tasks?: Task[];
  progress?: SprintProgress;
  createdAt: string;
  updatedAt: string;
}

export interface Epic {
  id: string;
  title: string;
  role?: string | null;
  want?: string | null;
  soThat?: string | null;
  description?: string | null;
  status: Status;
  priority: Priority;
  milestoneId?: string | null;
  stories?: Story[];
  acceptanceCriteria?: AcceptanceCriterion[];
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  role?: string | null;
  want?: string | null;
  soThat?: string | null;
  description?: string | null;
  status: Status;
  priority: Priority;
  epicId?: string | null;
  epic?: Epic;
  tasks?: Task[];
  acceptanceCriteria?: AcceptanceCriterion[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  role?: string | null;
  want?: string | null;
  soThat?: string | null;
  description?: string | null;
  status: Status;
  priority: Priority;
  storyId?: string | null;
  story?: Story;
  sprintId?: string | null;
  sprint?: Sprint;
  acceptanceCriteria?: AcceptanceCriterion[];
  createdAt: string;
  updatedAt: string;
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
  isMet: boolean;
  epicId?: string | null;
  storyId?: string | null;
  taskId?: string | null;
  createdAt: string;
  updatedAt: string;
}
