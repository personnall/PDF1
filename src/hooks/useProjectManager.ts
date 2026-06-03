import { useState, useEffect, useCallback } from 'react';
import type { Project, ProjectMetadata } from '../types/project';
import { DEFAULT_SETTINGS } from '../types/settings';
import { DEFAULT_STYLING } from '../types/styling';
import { DEFAULT_HF_SETTINGS } from '../types/headerFooter';

const PROJECTS_KEY = 'pdf-builder-projects-list';
const PROJECT_PREFIX = 'pdf-project-';

export const useProjectManager = () => {
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const loadProjectList = useCallback(() => {
    const saved = localStorage.getItem(PROJECTS_KEY);
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    loadProjectList();
  }, [loadProjectList]);

  const saveProject = useCallback((project: Project) => {
    const updatedProject = { ...project, updatedAt: Date.now() };
    localStorage.setItem(`${PROJECT_PREFIX}${project.id}`, JSON.stringify(updatedProject));

    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== project.id);
      const newList = [{ id: project.id, title: project.title, updatedAt: updatedProject.updatedAt }, ...filtered];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(newList));
      return newList;
    });

    setCurrentProject(updatedProject);
  }, []);

  const createProject = useCallback(() => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 11),
      title: 'New Project',
      content: '',
      settings: DEFAULT_SETTINGS,
      styling: DEFAULT_STYLING,
      hf: DEFAULT_HF_SETTINGS,
      updatedAt: Date.now()
    };
    saveProject(newProject);
    return newProject;
  }, [saveProject]);

  const deleteProject = useCallback((id: string) => {
    localStorage.removeItem(`${PROJECT_PREFIX}${id}`);
    setProjects(prev => {
      const newList = prev.filter(p => p.id !== id);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(newList));
      return newList;
    });
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const loadProject = useCallback((id: string) => {
    const saved = localStorage.getItem(`${PROJECT_PREFIX}${id}`);
    if (saved) {
      const project = JSON.parse(saved);
      setCurrentProject(project);
      return project;
    }
    return null;
  }, []);

  const duplicateProject = useCallback((id: string) => {
    const original = loadProject(id);
    if (original) {
      const duplicated: Project = {
        ...original,
        id: Math.random().toString(36).substring(2, 11),
        title: `${original.title} (Copy)`,
        updatedAt: Date.now()
      };
      saveProject(duplicated);
      return duplicated;
    }
    return null;
  }, [loadProject, saveProject]);

  const renameProject = useCallback((id: string, newTitle: string) => {
    const saved = localStorage.getItem(`${PROJECT_PREFIX}${id}`);
    if (saved) {
      const project = JSON.parse(saved);
      saveProject({ ...project, title: newTitle });
    }
  }, [saveProject]);

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    deleteProject,
    loadProject,
    saveProject,
    duplicateProject,
    renameProject
  };
};
