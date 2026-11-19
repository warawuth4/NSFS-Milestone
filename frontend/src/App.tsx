import React, { useState, useEffect } from 'react';
import { Milestone, Sprint, Epic, Story, Task, Status } from './types';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { MilestoneOverview } from './components/milestone/MilestoneOverview';
import { SprintsView } from './components/sprint/SprintsView';
import { BacklogView } from './components/backlog/BacklogView';
import { CreateItemModal, ItemType } from './components/forms/CreateItemModal';
import { SprintModal } from './components/sprint/SprintModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'milestones' | 'sprints' | 'backlog'>('milestones');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
    showToast('Epic created successfully');
    loadData();
  };

  const handleCreateStory = async (data: any) => {
    await api.stories.create(data);
    showToast('Story created successfully');
    loadData();
  };

  const handleCreateTask = async (data: any) => {
    await api.tasks.create(data);
    showToast('Task created successfully');
    loadData();
  };

  const handleCreateCriteria = async (data: any) => {
    await api.acceptanceCriteria.create(data);
    showToast('Acceptance criterion created');
    loadData();
  };

  // Sprint Create / Edit Handler
  const handleSaveSprint = async (data: Partial<Sprint>, assignedTaskIds: string[]) => {
    if (sprintToEdit) {
      await api.sprints.update(sprintToEdit.id, data);
      // Re-assign tasks
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
    title: 'Q1 Core Milestone',
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
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
      />

      {/* Main Page Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400">
            Loading milestone workspace...
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
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          NSFS Milestone Tracker &bull; NestJS Backend on Render &bull; React Frontend on Vercel &bull; Supabase PostgreSQL
        </div>
      </footer>
    </div>
  );
}

export default App;
