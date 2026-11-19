import React from 'react';
import { Target, Layers, PlusCircle, Calendar } from 'lucide-react';

interface NavbarProps {
  currentView: 'milestones' | 'sprints' | 'backlog';
  onViewChange: (view: 'milestones' | 'sprints' | 'backlog') => void;
  onOpenCreateModal: (type?: 'epic' | 'story' | 'task' | 'criteria') => void;
  onOpenSprintModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenCreateModal,
  onOpenSprintModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Target className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-base tracking-tight block">
                NSFS Milestones
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Agile Milestone & Sprint Tracker
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => onViewChange('milestones')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === 'milestones'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4" aria-hidden="true" />
                Milestone Landing
              </span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('sprints')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === 'sprints'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Sprints
              </span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('backlog')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === 'backlog'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" aria-hidden="true" />
                Epics & Stories
              </span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenSprintModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 transition"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>Sprint</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenCreateModal('task')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-900 transition"
            >
              <PlusCircle className="w-4 h-4 text-indigo-300" aria-hidden="true" />
              <span>Create Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
