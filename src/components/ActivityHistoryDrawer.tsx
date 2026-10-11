import React, { useState } from 'react';
import {
  X,
  History,
  Sparkles,
  Edit3,
  Download,
  Cloud,
  Users,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityLog[];
}

export const ActivityHistoryDrawer: React.FC<ActivityHistoryDrawerProps> = ({
  isOpen,
  onClose,
  activities,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = filterType === 'all'
    ? activities
    : activities.filter((a) => a.type === filterType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'generate':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'edit':
        return <Edit3 className="w-3.5 h-3.5 text-blue-500" />;
      case 'export':
        return <Download className="w-3.5 h-3.5 text-emerald-500" />;
      case 'sync':
        return <Cloud className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Users className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col text-xs">
          {/* Drawer Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/70">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm">
                  Activity & Audit Trail
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Real-time log of team edits, prompt runs, and exports
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="p-3 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {['all', 'generate', 'edit', 'export', 'sync'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Timeline Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No activity records for this filter.</p>
              </div>
            ) : (
              filtered.map((item, index) => (
                <div key={item.id || index} className="relative pl-6 pb-2 group">
                  {/* Timeline track line */}
                  {index < filtered.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
                  )}

                  {/* Node icon */}
                  <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>

                  {/* Log Content Card */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white">
                        <span>{item.author}</span>
                        <span className="text-[10px] font-normal text-neutral-400">
                          {item.action}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live SSE Sync Active
            </span>
            <span>{activities.length} total events recorded</span>
          </div>
        </div>
      </div>
    </div>
  );
};
