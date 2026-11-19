import React, { useState } from 'react';
import type { Epic, Story, Sprint, Priority, Status } from '../../types';
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

// Topic-Specific Guidelines for Implementing Dashboard for Sleeping Score
const sleepScoreGuidelines = {
  epic: {
    titlePlaceholder: 'e.g. Sleep Score Health & Circadian Rhythm Analytics Engine',
    titleExample: 'Example: "Sleep Quality & Rest Recovery Analytics Dashboard"',
    rolePlaceholder: 'e.g. wellness enthusiast and wearable device user',
    roleExample: 'Example: "health-conscious user tracking nocturnal sleep recovery"',
    wantPlaceholder: 'e.g. aggregate multi-sensor biometric sleep scores into a unified nocturnal recovery dashboard',
    wantExample: 'Example: "view my holistic daily sleep score and sleep stage breakdown in a centralized health dashboard"',
    soThatPlaceholder: 'e.g. users gain transparent visibility into deep sleep deficits and recovery readiness trends',
    soThatExample: 'Example: "I can understand factors disrupting my deep sleep and optimize my nighttime recovery habits"',
    descPlaceholder: 'e.g. Integrates optical heart rate sensor logs, sleep debt metrics, and circadian rhythm models.',
    descExample: 'Example: "Consolidates biometric sleep duration, sleep efficiency percentages, and circadian rhythm trends"',
  },
  story: {
    titlePlaceholder: 'e.g. Nocturnal Sleep Stage Hypnogram & Restorative Score Gauge',
    titleExample: 'Example: "Sleep Stage Breakdown & REM Progression Chart"',
    rolePlaceholder: 'e.g. insomnia patient tracking sleep hygiene',
    roleExample: 'Example: "active athlete monitoring post-workout sleep recovery score"',
    wantPlaceholder: 'e.g. visualize the ratio of REM, deep, and light sleep compared to clinical benchmarks',
    wantExample: 'Example: "see an interactive hypnogram graph comparing my deep sleep cycles against clinical recommendations"',
    soThatPlaceholder: 'e.g. I can identify wakefulness interruptions and discuss actionable trends with my sleep physician',
    soThatExample: 'Example: "I can isolate nocturnal waking triggers that degrade my morning sleep readiness index"',
    descPlaceholder: 'e.g. Renders time-series hypnogram bar charts and calculates deep sleep target thresholds.',
    descExample: 'Example: "Implements color-coded sleep architecture timeline with micro-arousal indicators"',
  },
  task: {
    titlePlaceholder: 'e.g. Calculate Sleep Score Algorithm from Heart Rate Variability & Restless Episodes',
    titleExample: 'Example: "Compute Weighted 0-100 Sleep Score from Biometric Heart Rate & Tossing Frequency"',
    rolePlaceholder: 'e.g. health data engineer',
    roleExample: 'Example: "biometric algorithm developer"',
    wantPlaceholder: 'e.g. compute weighted 0-100 sleep scores combining total sleep time, heart rate variability, and tossing frequency',
    wantExample: 'Example: "implement 0-100 sleep score formula weighting sleep duration (40%), deep sleep (30%), and HRV (30%)"',
    soThatPlaceholder: 'e.g. the frontend dashboard renders accurate score gauges within 200 milliseconds of device sync',
    soThatExample: 'Example: "the sleep score gauge updates instantly upon morning wearable sync with 2-click status changing"',
    descPlaceholder: 'e.g. Normalize sensor inputs into standardized restorative sleep index with 2-click status updates.',
    descExample: 'Example: "Calibrate baseline resting heart rate dip and factor awake minutes into the final score"',
  },
  criteria: {
    givenPlaceholder: 'e.g. a user connects their sleep tracking wearable with 7 hours of logged nocturnal data',
    givenExample: 'Example: "Given an authenticated user has synchronized 420 minutes of nocturnal wearable sleep logs"',
    whenPlaceholder: 'e.g. the sleep score computation finishes analyzing deep sleep duration and awake minutes',
    whenExample: 'Example: "When the calculation engine completes analyzing deep sleep duration, awake minutes, and heart rate dip"',
    thenPlaceholder: 'e.g. the dashboard displays an overall sleep score between 0 and 100 with color-coded restorative tier badges',
    thenExample: 'Example: "Then the sleeping score dashboard renders a circular score gauge between 0 and 100 with restorative tier categorization"',
  },
};

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

  // User Story Template Fields: As a ..., I want to ..., so that ...
  const [role, setRole] = useState('');
  const [want, setWant] = useState('');
  const [soThat, setSoThat] = useState('');

  // Parent links
  const [selectedEpicId, setSelectedEpicId] = useState<string>(epics[0]?.id || '');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0]?.id || '');
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints[0]?.id || '');

  // Acceptance Criteria Template: Given ..., When ..., Then ...
  const [given, setGiven] = useState('');
  const [when, setWhen] = useState('');
  const [then, setThen] = useState('');

  const [includeCriteria, setIncludeCriteria] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentGuideline =
    itemType === 'epic'
      ? sleepScoreGuidelines.epic
      : itemType === 'story'
        ? sleepScoreGuidelines.story
        : sleepScoreGuidelines.task;

  const criteriaGuideline = sleepScoreGuidelines.criteria;

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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <div>
            <h2 id="modal-headline" className="text-base font-bold text-slate-900 dark:text-slate-100">
              Create Work Item &bull; Sleeping Score Dashboard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Agile work item creation for sleeping score calculation, hypnograms, and wearable sync
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Work Item Type Selector Tabs */}
        <div className="px-6 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
          {(['task', 'story', 'epic', 'criteria'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setItemType(type)}
              className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                itemType === type
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {type === 'criteria' ? 'Acceptance Criteria' : type}
            </button>
          ))}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-md">
              {error}
            </div>
          )}

          {/* Title Field with topic-specific sleeping score guidelines in gray text */}
          {itemType !== 'criteria' && (
            <div className="space-y-1">
              <label htmlFor="item-title" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Title ({itemType.toUpperCase()}) <span className="text-rose-500">*</span>
              </label>
              <input
                id="item-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={currentGuideline.titlePlaceholder}
                className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                {currentGuideline.titleExample}
              </p>
            </div>
          )}

          {/* User Story Template Fill Boxes: As a ..., I want to ..., so that... */}
          {itemType !== 'criteria' && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span>Sleep Score Template (As a ..., I want to ..., so that ...)</span>
              </div>

              {/* Box 1: As a [role] */}
              <div className="space-y-1">
                <label htmlFor="item-role" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  As a <span className="text-slate-400 dark:text-slate-500 font-normal">[role / sleep persona]</span>
                </label>
                <input
                  id="item-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={currentGuideline.rolePlaceholder}
                  className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {currentGuideline.roleExample}
                </p>
              </div>

              {/* Box 2: I want to [goal] */}
              <div className="space-y-1">
                <label htmlFor="item-want" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  I want to <span className="text-slate-400 dark:text-slate-500 font-normal">[sleep dashboard feature / capability]</span>
                </label>
                <input
                  id="item-want"
                  type="text"
                  value={want}
                  onChange={(e) => setWant(e.target.value)}
                  placeholder={currentGuideline.wantPlaceholder}
                  className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {currentGuideline.wantExample}
                </p>
              </div>

              {/* Box 3: so that [benefit] */}
              <div className="space-y-1">
                <label htmlFor="item-sothat" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  so that <span className="text-slate-400 dark:text-slate-500 font-normal">[restorative health benefit / outcome]</span>
                </label>
                <input
                  id="item-sothat"
                  type="text"
                  value={soThat}
                  onChange={(e) => setSoThat(e.target.value)}
                  placeholder={currentGuideline.soThatPlaceholder}
                  className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {currentGuideline.soThatExample}
                </p>
              </div>
            </div>
          )}

          {/* Acceptance Criteria Template Fill Boxes: Given ..., When ..., Then ... */}
          {(itemType === 'criteria' || includeCriteria) && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Sleeping Score Acceptance Criteria (Given ..., When ..., Then ...)</span>
                </div>
                {itemType !== 'criteria' && (
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
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
                <label htmlFor="crit-given" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Given <span className="text-slate-400 dark:text-slate-500 font-normal">[nocturnal biometric sensor baseline]</span>
                </label>
                <input
                  id="crit-given"
                  type="text"
                  required={itemType === 'criteria'}
                  value={given}
                  onChange={(e) => setGiven(e.target.value)}
                  placeholder={criteriaGuideline.givenPlaceholder}
                  className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {criteriaGuideline.givenExample}
                </p>
              </div>

              {/* When Box */}
              <div className="space-y-1">
                <label htmlFor="crit-when" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  When <span className="text-slate-400 dark:text-slate-500 font-normal">[sleep calculation / trigger condition]</span>
                </label>
                <input
                  id="crit-when"
                  type="text"
                  required={itemType === 'criteria'}
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder={criteriaGuideline.whenPlaceholder}
                  className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {criteriaGuideline.whenExample}
                </p>
              </div>

              {/* Then Box */}
              <div className="space-y-1">
                <label htmlFor="crit-then" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Then <span className="text-slate-400 dark:text-slate-500 font-normal">[dashboard score verification & display]</span>
                </label>
                <input
                  id="crit-then"
                  type="text"
                  required={itemType === 'criteria'}
                  value={then}
                  onChange={(e) => setThen(e.target.value)}
                  placeholder={criteriaGuideline.thenPlaceholder}
                  className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {criteriaGuideline.thenExample}
                </p>
              </div>
            </div>
          )}

          {/* Relationships & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {itemType === 'story' && epics.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="parent-epic" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Parent Epic
                </label>
                <select
                  id="parent-epic"
                  value={selectedEpicId}
                  onChange={(e) => setSelectedEpicId(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {epics.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Example: &ldquo;Sleep Score Health & Circadian Rhythm Analytics&rdquo;
                </p>
              </div>
            )}

            {itemType === 'task' && stories.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="parent-story" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Parent Story
                </label>
                <select
                  id="parent-story"
                  value={selectedStoryId}
                  onChange={(e) => setSelectedStoryId(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {stories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Example: &ldquo;Nocturnal Sleep Stage Hypnogram & Restorative Score Gauge&rdquo;
                </p>
              </div>
            )}

            {itemType === 'task' && (
              <div className="space-y-1">
                <label htmlFor="assign-sprint" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Assign to Sprint (Requirement 6)
                </label>
                <select
                  id="assign-sprint"
                  value={selectedSprintId}
                  onChange={(e) => setSelectedSprintId(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">(Unassigned / Backlog)</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.status})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Example: &ldquo;Sprint 1 - Sleep Score Algorithm & Hypnogram&rdquo;
                </p>
              </div>
            )}

            {itemType !== 'criteria' && (
              <div className="space-y-1">
                <label htmlFor="priority-select" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <select
                  id="priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Example: &ldquo;High priority sleep score feature&rdquo;
                </p>
              </div>
            )}

            {itemType !== 'criteria' && (
              <div className="space-y-1">
                <label htmlFor="status-select" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Initial Status
                </label>
                <select
                  id="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Example: &ldquo;TODO (can transition in 2 clicks on dashboard)&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {itemType !== 'criteria' && (
            <div className="space-y-1 pt-1">
              <label htmlFor="item-desc" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Detailed Scope / Notes (Optional)
              </label>
              <textarea
                id="item-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentGuideline.descPlaceholder}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                {currentGuideline.descExample}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
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
