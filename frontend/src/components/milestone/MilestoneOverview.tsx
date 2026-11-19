import React, { useState } from 'react';
import type { Milestone, Sprint, Task, Status } from '../../types';
import { TaskCard } from './TaskCard';
import {
  Calendar,
  Filter,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

interface MilestoneOverviewProps {
  milestone: Milestone;
  sprints: Sprint[];
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onToggleCriterion?: (criterionId: string) => void;
  onAssignSprint: (taskId: string, sprintId: string) => void;
  onOpenCreateItem: (type?: 'epic' | 'story' | 'task' | 'criteria') => void;
  onOpenCreateSprint: () => void;
}

export const MilestoneOverview: React.FC<MilestoneOverviewProps> = ({
  milestone,
  sprints,
  tasks,
  onStatusChange,
  onToggleCriterion,
  onAssignSprint,
  onOpenCreateItem,
  onOpenCreateSprint,
}) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const progress = milestone.progress || {
    totalTasks: tasks.length,
    doneTasks: tasks.filter((t) => t.status === 'DONE').length,
    inProgressTasks: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    inReviewTasks: tasks.filter((t) => t.status === 'IN_REVIEW').length,
    todoTasks: tasks.filter((t) => t.status === 'TODO').length,
    percentage:
      tasks.length > 0
        ? Math.round((tasks.filter((t) => t.status === 'DONE').length / tasks.length) * 100)
        : 0,
  };

  // Filter tasks based on selected sprint and status
  const filteredTasks = tasks.filter((task) => {
    if (selectedSprintId !== 'all') {
      if (selectedSprintId === 'unassigned') {
        if (task.sprintId) return false;
      } else if (task.sprintId !== selectedSprintId) {
        return false;
      }
    }
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const columns: { status: Status; title: string; count: number; color: string }[] = [
    {
      status: 'TODO',
      title: 'To Do',
      count: filteredTasks.filter((t) => t.status === 'TODO').length,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
    {
      status: 'IN_PROGRESS',
      title: 'In Progress',
      count: filteredTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      color: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300',
    },
    {
      status: 'IN_REVIEW',
      title: 'In Review',
      count: filteredTasks.filter((t) => t.status === 'IN_REVIEW').length,
      color: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
    },
    {
      status: 'DONE',
      title: 'Done',
      count: filteredTasks.filter((t) => t.status === 'DONE').length,
      color: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <main className="space-y-6" id="main-content">
      {/* Landing Page Hero: Project Milestone Dashboard for Sleeping Score (Requirement 4) */}
      <section
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors"
        aria-labelledby="milestone-title"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Landing Milestone
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {milestone.status}
              </span>
              {milestone.targetDate && (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  Target: {new Date(milestone.targetDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 id="milestone-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {milestone.title}
            </h1>

            {milestone.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {milestone.description}
              </p>
            )}
          </div>

          {/* Milestone Progress Bar & Metric Stats */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-5 min-w-[280px] sm:min-w-[340px] space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                Sleep Milestone Progress
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {progress.percentage}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div
              className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden"
              role="progressbar"
              aria-valuenow={progress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Milestone progress: ${progress.percentage}% completed`}
            >
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            {/* Task Breakdown Pills */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 p-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{progress.todoTasks}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">To Do</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 p-1.5">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400">{progress.inProgressTasks}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Doing</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 p-1.5">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-400">{progress.inReviewTasks}</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Review</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 p-1.5">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{progress.doneTasks}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Done</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Filters */}
      <section
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
        aria-label="Filter Tasks"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Filter Sprint:</span>
          </div>

          <select
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter tasks by sprint"
          >
            <option value="all">All Sprints ({tasks.length} tasks)</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.status})
              </option>
            ))}
            <option value="unassigned">Backlog / No Sprint</option>
          </select>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 dark:text-slate-600 mx-1">|</span>
            <span className="text-slate-500 dark:text-slate-400">Status:</span>
            {(['all', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCreateSprint}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            + New Sprint
          </button>
          <button
            type="button"
            onClick={() => onOpenCreateItem('task')}
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-xs transition"
          >
            + Add Task
          </button>
        </div>
      </section>

      {/* Task Progress Board: Changing Task Progress Directly On Milestone Page (Requirement 7 & 8) */}
      <section aria-label="Milestone Task Board">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.status);
            return (
              <div
                key={column.status}
                className="bg-slate-100/60 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 flex flex-col space-y-3 min-h-[420px] transition-colors"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${column.color}`}>
                      {column.count}
                    </span>
                    <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {column.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCreateItem('task')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    title={`Add task to ${column.title}`}
                    aria-label={`Add task to ${column.title}`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                {/* Task Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                      No tasks in {column.title}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onToggleCriterion={onToggleCriterion}
                        allSprints={sprints}
                        onAssignSprint={onAssignSprint}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
