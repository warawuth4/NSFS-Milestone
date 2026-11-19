import React, { useState, useEffect } from 'react';
import { Sprint, Task, SprintStatus } from '../../types';
import { X, Calendar, CheckSquare, Square } from 'lucide-react';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprintToEdit?: Sprint | null;
  tasks: Task[];
  onSaveSprint: (data: Partial<Sprint>, assignedTaskIds: string[]) => Promise<void>;
}

export const SprintModal: React.FC<SprintModalProps> = ({
  isOpen,
  onClose,
  sprintToEdit,
  tasks,
  onSaveSprint,
}) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<SprintStatus>('PLANNED');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sprintToEdit) {
      setName(sprintToEdit.name);
      setGoal(sprintToEdit.goal || '');
      setStartDate(
        sprintToEdit.startDate
          ? new Date(sprintToEdit.startDate).toISOString().split('T')[0]
          : '',
      );
      setEndDate(
        sprintToEdit.endDate
          ? new Date(sprintToEdit.endDate).toISOString().split('T')[0]
          : '',
      );
      setStatus(sprintToEdit.status);
      const assigned = tasks
        .filter((t) => t.sprintId === sprintToEdit.id)
        .map((t) => t.id);
      setSelectedTaskIds(assigned);
    } else {
      setName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      setStatus('PLANNED');
      setSelectedTaskIds([]);
    }
  }, [sprintToEdit, tasks, isOpen]);

  if (!isOpen) return null;

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSaveSprint(
        {
          name,
          goal: goal || undefined,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          status,
        },
        selectedTaskIds,
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save sprint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sprint-modal-title"
    >
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 id="sprint-modal-title" className="text-base font-bold text-slate-900">
              {sprintToEdit ? 'Edit Sprint' : 'Create New Sprint'}
            </h2>
            <p className="text-xs text-slate-500">
              Manage sprint cycle, duration, and allocate tasks into sprint
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-md">
              {error}
            </div>
          )}

          {/* Sprint Name Box with gray example sentence (Requirement 3) */}
          <div className="space-y-1">
            <label htmlFor="sprint-name" className="block text-xs font-semibold text-slate-800">
              Sprint Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="sprint-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sprint 1 - Authentication & Core Workflow"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
            />
            {/* Requirement 3: Example sentence in gray text */}
            <p className="text-[11px] text-slate-400 italic">
              Example: &ldquo;Sprint 1 - Authentication & Project Shell&rdquo;
            </p>
          </div>

          {/* Sprint Goal Box with gray example sentence (Requirement 3) */}
          <div className="space-y-1">
            <label htmlFor="sprint-goal" className="block text-xs font-semibold text-slate-800">
              Sprint Goal
            </label>
            <textarea
              id="sprint-goal"
              rows={2}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Deliver milestone overview with 2-click task status progression."
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
            />
            {/* Requirement 3: Example sentence in gray text */}
            <p className="text-[11px] text-slate-400 italic">
              Example: &ldquo;Deliver landing milestone view and agile creation dialogs&rdquo;
            </p>
          </div>

          {/* Dates & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="sprint-start" className="block text-xs font-medium text-slate-700">
                Start Date
              </label>
              <input
                id="sprint-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 italic">Example: &ldquo;2026-03-01&rdquo;</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="sprint-end" className="block text-xs font-medium text-slate-700">
                End Date
              </label>
              <input
                id="sprint-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 italic">Example: &ldquo;2026-03-14&rdquo;</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="sprint-status" className="block text-xs font-medium text-slate-700">
                Status
              </label>
              <select
                id="sprint-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as SprintStatus)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="PLANNED">Planned</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <p className="text-[11px] text-slate-400 italic">Example: &ldquo;ACTIVE&rdquo;</p>
            </div>
          </div>

          {/* Task Allocation Box (Requirement 6: Put each task into each sprint) */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800">
                Allocate Tasks to this Sprint (Requirement 6)
              </label>
              <span className="text-[11px] text-slate-500">
                {selectedTaskIds.length} tasks selected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Example: &ldquo;Check tasks to include them in this sprint backlog&rdquo;
            </p>

            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 p-2 text-center">No tasks available yet</p>
              ) : (
                tasks.map((task) => {
                  const isChecked = selectedTaskIds.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskSelection(task.id)}
                      className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-950'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        )}
                        <span className="font-medium truncate">{task.title}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 ml-2">
                        {task.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-md text-xs font-semibold shadow-xs disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Saving...' : sprintToEdit ? 'Save Changes' : 'Create Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
