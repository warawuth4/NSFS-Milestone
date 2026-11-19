import React from 'react';
import { Sprint, Task, Status } from '../../types';
import { Calendar, Edit, PlusCircle, CheckCircle2, Clock } from 'lucide-react';
import { TaskCard } from '../milestone/TaskCard';

interface SprintsViewProps {
  sprints: Sprint[];
  tasks: Task[];
  onEditSprint: (sprint: Sprint) => void;
  onOpenCreateSprint: () => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onToggleCriterion?: (criterionId: string) => void;
  onAssignSprint: (taskId: string, sprintId: string) => void;
}

export const SprintsView: React.FC<SprintsViewProps> = ({
  sprints,
  tasks,
  onEditSprint,
  onOpenCreateSprint,
  onStatusChange,
  onToggleCriterion,
  onAssignSprint,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sprint Management</h1>
          <p className="text-xs text-slate-500">
            Create, edit, and allocate tasks into agile sprints (Requirements 5 & 6)
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateSprint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>New Sprint</span>
        </button>
      </div>

      {/* Sprints List */}
      <div className="space-y-6">
        {sprints.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" aria-hidden="true" />
            <p className="text-sm">No sprints created yet.</p>
            <button
              type="button"
              onClick={onOpenCreateSprint}
              className="mt-3 text-xs text-indigo-600 font-semibold hover:underline"
            >
              + Create your first sprint
            </button>
          </div>
        ) : (
          sprints.map((sprint) => {
            const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
            const total = sprintTasks.length;
            const done = sprintTasks.filter((t) => t.status === 'DONE').length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <section
                key={sprint.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                aria-label={`Sprint: ${sprint.name}`}
              >
                {/* Sprint Header */}
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                          sprint.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sprint.status === 'COMPLETED'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sprint.status}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">{sprint.name}</h2>
                    </div>

                    {sprint.goal && (
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Goal:</span> {sprint.goal}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      {sprint.startDate && sprint.endDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                          {new Date(sprint.endDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        {total} {total === 1 ? 'task' : 'tasks'} allocated
                      </span>
                    </div>
                  </div>

                  {/* Sprint Velocity / Progress & Edit Button */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-medium">Sprint Completion</div>
                      <div className="text-lg font-bold text-slate-900">{pct}%</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEditSprint(sprint)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                      aria-label={`Edit ${sprint.name}`}
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                      <span>Edit Sprint</span>
                    </button>
                  </div>
                </div>

                {/* Sprint Tasks Grid */}
                <div className="p-5">
                  {sprintTasks.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      No tasks assigned to this sprint yet. Click &quot;Edit Sprint&quot; to allocate tasks.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sprintTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={onStatusChange}
                          onToggleCriterion={onToggleCriterion}
                          allSprints={sprints}
                          onAssignSprint={onAssignSprint}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
