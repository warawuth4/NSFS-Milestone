import React, { useState, useEffect } from 'react';
import type { Milestone, Sprint, Epic, Story, Task, Status } from './types';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { MilestoneOverview } from './components/milestone/MilestoneOverview';
import { SprintsView } from './components/sprint/SprintsView';
import { BacklogView } from './components/backlog/BacklogView';
import { CreateItemModal, ItemType } from './components/forms/CreateItemModal';
import { SprintModal } from './components/sprint/SprintModal';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'milestones' | 'sprints' | 'backlog'>('milestones');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Dark Mode State: Default to 'dark' as explicitly required
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default is dark mode
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
  const [createItemDefaultType, setCreateItemDefaultType] = useState<ItemType>('task');
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [mList, spList, epList, stList, tList] = await Promise.all([
        api.milestones.getAll(),
        api.sprints.getAll(),
        api.epics.getAll(),
        api.stories.getAll(),
        api.tasks.getAll(),
      ]);

      setMilestones(mList);
      setSprints(spList);
      setEpics(epList);
      setStories(stList);
      setTasks(tList);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Requirement 7 & 8: Change task progress within 2 clicks directly on milestone page
  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );

      // Perform update via API
      await api.tasks.updateStatus(taskId, newStatus);
      showToast(`Task progress updated to ${newStatus} in 2 clicks!`);

      // Refresh milestone progress calculations
      const updatedMilestones = await api.milestones.getAll();
      setMilestones(updatedMilestones);
    } catch (err) {
      console.error('Failed to update task status:', err);
      loadData();
    }
  };

  // Requirement 6: Put tasks into sprint
  const handleAssignSprint = async (taskId: string, sprintId: string) => {
    try {
      if (sprintId) {
        await api.sprints.assignTask(sprintId, taskId);
      } else {
        await api.sprints.unassignTask(sprintId, taskId);
      }
      showToast('Task sprint assignment updated');
      loadData();
    } catch (err) {
      console.error('Failed to assign task to sprint:', err);
    }
  };

  const handleToggleCriterion = async (criterionId: string) => {
    try {
      await api.acceptanceCriteria.toggle(criterionId);
      loadData();
    } catch (err) {
      console.error('Failed to toggle criterion:', err);
    }
  };

  // Create Item Handlers
  const handleCreateEpic = async (data: any) => {
    await api.epics.create(data);
    showToast('Sleep Score Epic created successfully');
    loadData();
  };

  const handleCreateStory = async (data: any) => {
    await api.stories.create(data);
    showToast('Sleep Score Story created successfully');
    loadData();
  };

  const handleCreateTask = async (data: any) => {
    await api.tasks.create(data);
    showToast('Sleep Score Task created successfully');
    loadData();
  };

  const handleCreateCriteria = async (data: any) => {
    await api.acceptanceCriteria.create(data);
    showToast('Sleeping score acceptance criterion created');
    loadData();
  };

  // Sprint Create / Edit Handler
  const handleSaveSprint = async (data: Partial<Sprint>, assignedTaskIds: string[]) => {
    if (sprintToEdit) {
      await api.sprints.update(sprintToEdit.id, data);
      for (const taskId of assignedTaskIds) {
        await api.sprints.assignTask(sprintToEdit.id, taskId);
      }
      showToast(`Sprint "${data.name}" updated`);
    } else {
      const created = await api.sprints.create(data);
      for (const taskId of assignedTaskIds) {
        await api.sprints.assignTask(created.id, taskId);
      }
      showToast(`Sprint "${data.name}" created with ${assignedTaskIds.length} tasks`);
    }
    loadData();
  };

  const activeMilestone = milestones[0] || {
    id: 'default',
    title: 'Milestone 1: Sleep Score Dashboard Engine',
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar with Theme Toggle Button in the Top Right Corner */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCreateModal={(type = 'task') => {
          setCreateItemDefaultType(type);
          setIsCreateItemModalOpen(true);
        }}
        onOpenSprintModal={() => {
          setSprintToEdit(null);
          setIsSprintModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
            Loading sleeping score milestone workspace...
          </div>
        ) : (
          <>
            {/* Requirement 4: Landing page is Project Milestone */}
            {currentView === 'milestones' && (
              <MilestoneOverview
                milestone={activeMilestone}
                sprints={sprints}
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onToggleCriterion={handleToggleCriterion}
                onAssignSprint={handleAssignSprint}
                onOpenCreateItem={(type = 'task') => {
                  setCreateItemDefaultType(type);
                  setIsCreateItemModalOpen(true);
                }}
                onOpenCreateSprint={() => {
                  setSprintToEdit(null);
                  setIsSprintModalOpen(true);
                }}
              />
            )}

            {/* Sprints Management View */}
            {currentView === 'sprints' && (
              <SprintsView
                sprints={sprints}
                tasks={tasks}
                onEditSprint={(sprint) => {
                  setSprintToEdit(sprint);
                  setIsSprintModalOpen(true);
                }}
                onOpenCreateSprint={() => {
                  setSprintToEdit(null);
                  setIsSprintModalOpen(true);
                }}
                onStatusChange={handleStatusChange}
                onToggleCriterion={handleToggleCriterion}
                onAssignSprint={handleAssignSprint}
              />
            )}

            {/* Backlog / Epics & Stories View */}
            {currentView === 'backlog' && (
              <BacklogView
                epics={epics}
                stories={stories}
                tasks={tasks}
                sprints={sprints}
                onStatusChange={handleStatusChange}
                onToggleCriterion={handleToggleCriterion}
                onAssignSprint={handleAssignSprint}
                onOpenCreateItem={(type = 'story') => {
                  setCreateItemDefaultType(type);
                  setIsCreateItemModalOpen(true);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={isCreateItemModalOpen}
        onClose={() => setIsCreateItemModalOpen(false)}
        defaultType={createItemDefaultType}
        epics={epics}
        stories={stories}
        sprints={sprints}
        onCreateEpic={handleCreateEpic}
        onCreateStory={handleCreateStory}
        onCreateTask={handleCreateTask}
        onCreateCriteria={handleCreateCriteria}
      />

      {/* Create / Edit Sprint Modal */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        sprintToEdit={sprintToEdit}
        tasks={tasks}
        onSaveSprint={handleSaveSprint}
      />

      {/* Accessible Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Sleep Score Dashboard &bull; NestJS Backend on Render &bull; React Frontend on Vercel &bull; Supabase PostgreSQL
        </div>
      </footer>
    </div>
  );
}

export default App;
