import React, { useState } from 'react';
import { Epic, Story, Sprint, Priority, Status } from '../../types';
import { X, HelpCircle, CheckSquare } from 'lucide-react';

export type ItemType = 'epic' | 'story' | 'task' | 'criteria';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ItemType;
  epics: Epic[];
  stories: Story[];
  sprints: Sprint[];
  onCreateEpic: (data: any) => Promise<void>;
  onCreateStory: (data: any) => Promise<void>;
  onCreateTask: (data: any) => Promise<void>;
  onCreateCriteria: (data: any) => Promise<void>;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'task',
  epics,
  stories,
  sprints,
  onCreateEpic,
  onCreateStory,
  onCreateTask,
  onCreateCriteria,
}) => {
  const [itemType, setItemType] = useState<ItemType>(defaultType);

  // Common Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<Status>('TODO');

  // User Story Template Fields: As a ..., I want to ..., so that ... (Requirement 1)
  const [role, setRole] = useState('');
  const [want, setWant] = useState('');
  const [soThat, setSoThat] = useState('');

  // Parent links
  const [selectedEpicId, setSelectedEpicId] = useState<string>(epics[0]?.id || '');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0]?.id || '');
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints[0]?.id || '');

  // Acceptance Criteria Template: Given ..., When ..., Then ... (Requirement 2)
  const [given, setGiven] = useState('');
  const [when, setWhen] = useState('');
  const [then, setThen] = useState('');

  // Also allow optional acceptance criterion when creating a task/story
  const [includeCriteria, setIncludeCriteria] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (itemType === 'epic') {
        await onCreateEpic({
          title,
          description: description || undefined,
          role: role || undefined,
          want: want || undefined,
          soThat: soThat || undefined,
          priority,
          status,
        });
      } else if (itemType === 'story') {
        await onCreateStory({
          title,
          description: description || undefined,
          role: role || undefined,
          want: want || undefined,
          soThat: soThat || undefined,
          priority,
          status,
          epicId: selectedEpicId || undefined,
        });
      } else if (itemType === 'task') {
        await onCreateTask({
          title,
          description: description || undefined,
          role: role || undefined,
          want: want || undefined,
          soThat: soThat || undefined,
          priority,
          status,
          storyId: selectedStoryId || undefined,
          sprintId: selectedSprintId || undefined,
          ...(includeCriteria && given && when && then
            ? {
                acceptanceCriteria: [{ given, when, then }],
              }
            : {}),
        });

        // If acceptance criteria was specified, create it too
        if (includeCriteria && given && when && then) {
          await onCreateCriteria({
            given,
            when,
            then,
            storyId: selectedStoryId || undefined,
          });
        }
      } else if (itemType === 'criteria') {
        await onCreateCriteria({
          given,
          when,
          then,
          storyId: selectedStoryId || undefined,
        });
      }

      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setRole('');
      setWant('');
      setSoThat('');
      setGiven('');
      setWhen('');
      setThen('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 id="modal-headline" className="text-base font-bold text-slate-900">
              Create Agile Work Item
            </h2>
            <p className="text-xs text-slate-500">
              Create structured Epics, Stories, Tasks, and Acceptance Criteria with template enforcement
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

        {/* Work Item Type Selector Tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 flex gap-2">
          {(['task', 'story', 'epic', 'criteria'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setItemType(type)}
              className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                itemType === type
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {type === 'criteria' ? 'Acceptance Criteria' : type}
            </button>
          ))}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-md">
              {error}
            </div>
          )}

          {/* Title Field (for Epic, Story, Task) */}
          {itemType !== 'criteria' && (
            <div className="space-y-1">
              <label htmlFor="item-title" className="block text-xs font-semibold text-slate-800">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="item-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement user authentication with OAuth2"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
              />
              {/* Requirement 3: Example sentence in gray text */}
              <p className="text-[11px] text-slate-400 italic">
                Example: &ldquo;Implement 2-click task progress transition on milestone dashboard&rdquo;
              </p>
            </div>
          )}

          {/* User Story Template Fill Boxes: As a ..., I want to ..., so that... (Requirement 1 & 3) */}
          {itemType !== 'criteria' && (
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span>Agile User Story Template (As a ..., I want to ..., so that ...)</span>
              </div>

              {/* Box 1: As a [role] */}
              <div className="space-y-1">
                <label htmlFor="item-role" className="block text-xs font-medium text-slate-700">
                  As a <span className="text-slate-400 font-normal">[role / persona]</span>
                </label>
                <input
                  id="item-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. project manager, customer, developer"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                {/* Requirement 3: Example sentence in gray text */}
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;lead developer reviewing sprint milestone progress&rdquo;
                </p>
              </div>

              {/* Box 2: I want to [goal] */}
              <div className="space-y-1">
                <label htmlFor="item-want" className="block text-xs font-medium text-slate-700">
                  I want to <span className="text-slate-400 font-normal">[action / feature capability]</span>
                </label>
                <input
                  id="item-want"
                  type="text"
                  value={want}
                  onChange={(e) => setWant(e.target.value)}
                  placeholder="e.g. update task status from TODO to DONE within 2 clicks"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                {/* Requirement 3: Example sentence in gray text */}
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;change task progress directly from the milestone page in 2 clicks&rdquo;
                </p>
              </div>

              {/* Box 3: so that [benefit] */}
              <div className="space-y-1">
                <label htmlFor="item-sothat" className="block text-xs font-medium text-slate-700">
                  so that <span className="text-slate-400 font-normal">[business benefit / outcome]</span>
                </label>
                <input
                  id="item-sothat"
                  type="text"
                  value={soThat}
                  onChange={(e) => setSoThat(e.target.value)}
                  placeholder="e.g. team velocity and milestone completion percentages remain real-time"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                {/* Requirement 3: Example sentence in gray text */}
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;our project milestone completion percentage updates immediately&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Acceptance Criteria Template Fill Boxes: Given ..., When ..., Then ... (Requirement 2 & 3) */}
          {(itemType === 'criteria' || includeCriteria) && (
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Acceptance Criteria Template (Given ..., When ..., Then ...)</span>
                </div>
                {itemType !== 'criteria' && (
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCriteria}
                      onChange={(e) => setIncludeCriteria(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Attach criterion</span>
                  </label>
                )}
              </div>

              {/* Given Box */}
              <div className="space-y-1">
                <label htmlFor="crit-given" className="block text-xs font-medium text-slate-700">
                  Given <span className="text-slate-400 font-normal">[precondition / initial context]</span>
                </label>
                <input
                  id="crit-given"
                  type="text"
                  required={itemType === 'criteria'}
                  value={given}
                  onChange={(e) => setGiven(e.target.value)}
                  placeholder="e.g. an authenticated developer is viewing the milestone overview"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                {/* Requirement 3: Example sentence in gray text */}
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;Given the user is on the milestone landing page&rdquo;
                </p>
              </div>

              {/* When Box */}
              <div className="space-y-1">
                <label htmlFor="crit-when" className="block text-xs font-medium text-slate-700">
                  When <span className="text-slate-400 font-normal">[action taken / trigger event]</span>
                </label>
                <input
                  id="crit-when"
                  type="text"
                  required={itemType === 'criteria'}
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder="e.g. the user changes a task status to DONE"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                {/* Requirement 3: Example sentence in gray text */}
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;When the user changes task progress within 2 clicks&rdquo;
                </p>
              </div>

              {/* Then Box */}
              <div className="space-y-1">
                <label htmlFor="crit-then" className="block text-xs font-medium text-slate-700">
                  Then <span className="text-slate-400 font-normal">[expected outcome / verification]</span>
                </label>
                <input
                  id="crit-then"
                  type="text"
                  required={itemType === 'criteria'}
                  value={then}
                  onChange={(e) => setThen(e.target.value)}
                  placeholder="e.g. the milestone progress bar recalculates and reflects the new percentage"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                {/* Requirement 3: Example sentence in gray text */}
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;Then the milestone completion percentage updates immediately&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Parent Relationships & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {itemType === 'story' && epics.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="parent-epic" className="block text-xs font-medium text-slate-700">
                  Parent Epic
                </label>
                <select
                  id="parent-epic"
                  value={selectedEpicId}
                  onChange={(e) => setSelectedEpicId(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {epics.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;Milestone Execution & Progress Management&rdquo;
                </p>
              </div>
            )}

            {itemType === 'task' && stories.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="parent-story" className="block text-xs font-medium text-slate-700">
                  Parent Story
                </label>
                <select
                  id="parent-story"
                  value={selectedStoryId}
                  onChange={(e) => setSelectedStoryId(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {stories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;2-Click Task Progress Quick Changer&rdquo;
                </p>
              </div>
            )}

            {itemType === 'task' && (
              <div className="space-y-1">
                <label htmlFor="assign-sprint" className="block text-xs font-medium text-slate-700">
                  Assign to Sprint (Requirement 6)
                </label>
                <select
                  id="assign-sprint"
                  value={selectedSprintId}
                  onChange={(e) => setSelectedSprintId(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">(Unassigned / Backlog)</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.status})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;Sprint 1 - Foundation & Milestone Board&rdquo;
                </p>
              </div>
            )}

            {itemType !== 'criteria' && (
              <div className="space-y-1">
                <label htmlFor="priority-select" className="block text-xs font-medium text-slate-700">
                  Priority
                </label>
                <select
                  id="priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;High priority work item&rdquo;
                </p>
              </div>
            )}

            {itemType !== 'criteria' && (
              <div className="space-y-1">
                <label htmlFor="status-select" className="block text-xs font-medium text-slate-700">
                  Initial Status
                </label>
                <select
                  id="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
                <p className="text-[11px] text-slate-400 italic">
                  Example: &ldquo;TODO (can transition in 2 clicks)&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Optional Detailed Description */}
          {itemType !== 'criteria' && (
            <div className="space-y-1 pt-1">
              <label htmlFor="item-desc" className="block text-xs font-medium text-slate-700">
                Detailed Notes / Scope (Optional)
              </label>
              <textarea
                id="item-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Include validation pipes, Prisma model schemas, and Swagger documentation."
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900"
              />
              <p className="text-[11px] text-slate-400 italic">
                Example: &ldquo;Include unit and integration test coverage with Jest&rdquo;
              </p>
            </div>
          )}

          {/* Modal Actions */}
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
              {isSubmitting ? 'Creating...' : `Create ${itemType.toUpperCase()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
