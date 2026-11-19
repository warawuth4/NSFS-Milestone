import React, { useState, useRef, useEffect } from 'react';
import type { Task, Status, Priority } from '../../types';
import { CheckCircle2, Clock, ChevronDown, CheckSquare, Square, Tag, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onToggleCriterion?: (criterionId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  allSprints?: { id: string; name: string }[];
  onAssignSprint?: (taskId: string, sprintId: string) => void;
}

const statusConfig: Record<
  Status,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  TODO: {
    label: 'To Do',
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  IN_REVIEW: {
    label: 'In Review',
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  DONE: {
    label: 'Done',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
};

const priorityConfig: Record<Priority, { label: string; text: string; bg: string }> = {
  LOW: { label: 'Low', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  MEDIUM: { label: 'Med', text: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-950/60' },
  HIGH: { label: 'High', text: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/60' },
  CRITICAL: { label: 'Urgent', text: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/60' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onToggleCriterion,
  onEditTask,
  onDeleteTask,
  allSprints = [],
  onAssignSprint,
}) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close status dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStatus = statusConfig[task.status] || statusConfig.TODO;
  const currentPriority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const statuses: Status[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

  return (
    <article
      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
      aria-label={`Task: ${task.title}`}
    >
      {/* Header: Title, 2-Click Status Changer, and Delete Button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${currentPriority.bg} ${currentPriority.text}`}
            >
              {currentPriority.label}
            </span>

            {task.sprint && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Tag className="w-3 h-3" aria-hidden="true" />
                {task.sprint.name}
              </span>
            )}
          </div>

          <h3
            onClick={() => onEditTask?.(task)}
            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            {task.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* 2-Click Task Progress Controller (Requirement 7 & 8) */}
          <div className="relative" ref={menuRef}>
            {/* Click 1: Click the status badge to open the menu */}
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} hover:opacity-90`}
              aria-expanded={isStatusMenuOpen}
              aria-haspopup="true"
              aria-label={`Task status: ${currentStatus.label}. Click 1 to open status choices.`}
              title="Click to change progress status (2 clicks)"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} aria-hidden="true" />
              <span>{currentStatus.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" aria-hidden="true" />
            </button>

            {/* Click 2: Click the target status from dropdown */}
            {isStatusMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-xl z-20 py-1"
                role="menu"
              >
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Status (Click 2)
                </div>
                {statuses.map((status) => {
                  const conf = statusConfig[status];
                  const isSelected = task.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        onStatusChange(task.id, status);
                        setIsStatusMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        isSelected
                          ? 'font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                      role="menuitem"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${conf.dot}`} aria-hidden="true" />
                        {conf.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delete Task Button */}
          {onDeleteTask && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete task "${task.title}"?`)) {
                  onDeleteTask(task.id);
                }
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title={`Delete task "${task.title}"`}
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* User Story Template Box: As a ..., I want to ..., so that... */}
      {(task.role || task.want || task.soThat) && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2.5 text-xs border border-slate-200/80 dark:border-slate-800 space-y-1">
          {task.role && (
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">As a</span> {task.role}
            </p>
          )}
          {task.want && (
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">I want to</span> {task.want}
            </p>
          )}
          {task.soThat && (
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">so that</span> {task.soThat}
            </p>
          )}
        </div>
      )}

      {/* Acceptance Criteria (Given ..., When ..., Then ...) */}
      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowCriteria(!showCriteria)}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>
              {task.acceptanceCriteria.filter((ac) => ac.isMet).length}/
              {task.acceptanceCriteria.length} Sleep Score Criteria
            </span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showCriteria ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {showCriteria && (
            <ul className="mt-2 space-y-2 pl-1 border-l-2 border-slate-200 dark:border-slate-700" aria-label="Acceptance Criteria">
              {task.acceptanceCriteria.map((ac) => (
                <li
                  key={ac.id}
                  onClick={() => onToggleCriterion?.(ac.id)}
                  className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer flex items-start gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded transition-colors"
                >
                  {ac.isMet ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                  )}
                  <div className={ac.isMet ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Given </span>
                    {ac.given}
                    <span className="font-semibold text-slate-900 dark:text-slate-100"> When </span>
                    {ac.when}
                    <span className="font-semibold text-slate-900 dark:text-slate-100"> Then </span>
                    {ac.then}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Footer: Sprint Assignment Selector */}
      {allSprints.length > 0 && onAssignSprint && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            Sprint:
          </span>
          <select
            value={task.sprintId || ''}
            onChange={(e) => onAssignSprint(task.id, e.target.value)}
            className="text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
            aria-label="Assign to sprint"
          >
            <option value="">(Backlog / No Sprint)</option>
            {allSprints.map((s) => (
              <option key={s.id} value={s.id} className="dark:bg-slate-900">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </article>
  );
};
