import React from 'react';
import type { ProjectMetadata } from '../types/project';
import { Plus, Folder, Trash2, Copy, X } from 'lucide-react';

interface ProjectSidebarProps {
  projects: ProjectMetadata[];
  currentProjectId?: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onClose: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  currentProjectId,
  onSelect,
  onCreate,
  onDelete,
  onDuplicate,
  onClose
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full animate-in slide-in-from-left duration-200">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">My Projects</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400">
           <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={onCreate}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-6">
        {projects.length === 0 && (
          <div className="text-center py-12 px-6">
            <Folder className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-xs text-gray-400">No projects yet. Create your first one to get started!</p>
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              currentProjectId === project.id
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => onSelect(project.id)}
          >
            <Folder className={`w-4 h-4 ${currentProjectId === project.id ? 'text-blue-500' : 'text-gray-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{project.title}</p>
              <p className="text-[10px] text-gray-400">
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(project.id); }}
                className="p-1 hover:bg-gray-200 rounded text-gray-400"
                title="Duplicate"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                className="p-1 hover:bg-red-100 rounded text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSidebar;
