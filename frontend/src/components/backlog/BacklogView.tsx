import React from 'react';
import type { Epic, Story, Task, Status } from '../../types';
import { Layers } from 'lucide-react';
import { TaskCard } from '../milestone/TaskCard';

interface BacklogViewProps {
  epics: Epic[];
  stories: Story[];
  tasks: Task[];
  sprints: { id: string; name: string }[];
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onToggleCriterion?: (criterionId: string) => void;
  onAssignSprint: (taskId: string, sprintId: string) => void;
  onOpenCreateItem: (type?: 'epic' | 'story' | 'task' | 'criteria', parentId?: string) => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({
  epics,
  stories,
  tasks,
  sprints,
  onStatusChange,
  onToggleCriterion,
  onAssignSprint,
  onOpenCreateItem,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Sleep Score Epics & User Stories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hierarchical breakdown of Epics, Stories, and Tasks with sleeping score templates (Requirement 1)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenCreateItem('epic')}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            + New Epic
          </button>
          <button
            type="button"
            onClick={() => onOpenCreateItem('story')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md text-xs font-semibold shadow-xs transition"
          >
            + New Story
          </button>
        </div>
      </div>

      {/* Epics List */}
      <div className="space-y-6">
        {epics.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 dark:text-slate-500">
            <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            <p className="text-sm">No sleep score epics created yet.</p>
            <button
              type="button"
              onClick={() => onOpenCreateItem('epic')}
              className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              + Create an Epic with User Story Template
            </button>
          </div>
        ) : (
          epics.map((epic) => {
            const epicStories = stories.filter((s) => s.epicId === epic.id);

            return (
              <section
                key={epic.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5 transition-colors"
                aria-label={`Epic: ${epic.title}`}
              >
                {/* Epic Header */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        EPIC
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {epic.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenCreateItem('story', epic.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      + Add Story to Epic
                    </button>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{epic.title}</h2>

                  {/* As a ..., I want to ..., so that... breakdown */}
                  {(epic.role || epic.want || epic.soThat) && (
                    <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                      {epic.role && (
                        <p>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">As a</span> {epic.role}
                        </p>
                      )}
                      {epic.want && (
                        <p>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">I want to</span> {epic.want}
                        </p>
                      )}
                      {epic.soThat && (
                        <p>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">so that</span> {epic.soThat}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Nested Stories */}
                <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                  {epicStories.length === 0 ? (
                    <div className="text-xs text-slate-400 dark:text-slate-500 py-2">
                      No stories linked to this epic yet.{' '}
                      <button
                        type="button"
                        onClick={() => onOpenCreateItem('story', epic.id)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        Add Story
                      </button>
                    </div>
                  ) : (
                    epicStories.map((story) => {
                      const storyTasks = tasks.filter((t) => t.storyId === story.id);

                      return (
                        <div
                          key={story.id}
                          className="bg-slate-50/70 dark:bg-slate-800/40 rounded-lg p-4 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  STORY
                                </span>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{story.title}</h3>
                              </div>

                              {(story.role || story.want || story.soThat) && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                                  &ldquo;As a {story.role}, I want to {story.want}, so that {story.soThat}&rdquo;
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenCreateItem('task', story.id)}
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            >
                              + Add Task
                            </button>
                          </div>

                          {/* Story Tasks */}
                          {storyTasks.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                              {storyTasks.map((task) => (
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
                      );
                    })
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
