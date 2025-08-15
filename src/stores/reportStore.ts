import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyReport, ReportSummary, ProjectInfo, UserSettings } from '@/types';

interface ReportStore {
  reports: DailyReport[];
  currentReport: DailyReport | null;
  projects: ProjectInfo[];
  settings: UserSettings;
  
  // Report actions
  createReport: (report: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: string, updates: Partial<DailyReport>) => void;
  deleteReport: (id: string) => void;
  setCurrentReport: (report: DailyReport | null) => void;
  getReportById: (id: string) => DailyReport | undefined;
  getReportsByProject: (projectName: string) => DailyReport[];
  getRecentReports: (limit?: number) => DailyReport[];
  
  // Project actions
  createProject: (project: Omit<ProjectInfo, 'id'>) => void;
  updateProject: (id: string, updates: Partial<ProjectInfo>) => void;
  deleteProject: (id: string) => void;
  getActiveProjects: () => ProjectInfo[];
  
  // Settings actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  
  // Summary helpers
  getReportSummaries: () => ReportSummary[];
  getTodayReport: () => DailyReport | undefined;
}

const defaultSettings: UserSettings = {
  defaultReporter: '',
  defaultSupervisor: '',
  favoriteTemplates: [],
  notificationSettings: {
    dailyReminder: true,
    reminderTime: '08:00',
    weeklyReport: false,
  },
};

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: [],
      currentReport: null,
      projects: [],
      settings: defaultSettings,

      createReport: (reportData) => {
        const newReport: DailyReport = {
          ...reportData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          reports: [...state.reports, newReport],
          currentReport: newReport,
        }));
      },

      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updates, updatedAt: new Date() }
              : report
          ),
          currentReport:
            state.currentReport?.id === id
              ? { ...state.currentReport, ...updates, updatedAt: new Date() }
              : state.currentReport,
        }));
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
          currentReport:
            state.currentReport?.id === id ? null : state.currentReport,
        }));
      },

      setCurrentReport: (report) => {
        set({ currentReport: report });
      },

      getReportById: (id) => {
        return get().reports.find((report) => report.id === id);
      },

      getReportsByProject: (projectName) => {
        return get().reports.filter((report) => report.projectName === projectName);
      },

      getRecentReports: (limit = 10) => {
        return get()
          .reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      createProject: (projectData) => {
        const newProject: ProjectInfo = {
          ...projectData,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },

      getActiveProjects: () => {
        return get().projects.filter((project) => project.isActive);
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      getReportSummaries: () => {
        return get().reports.map((report): ReportSummary => ({
          id: report.id,
          date: report.date,
          projectName: report.projectName,
          status: '提出済み', // TODO: implement status logic
          hasChanges: report.changes.length > 0,
          hasRequests: report.clientRequests.length > 0,
          hasConcerns: report.concerns.length > 0,
          photoCount: report.photos.length,
        }));
      },

      getTodayReport: () => {
        const today = new Date().toDateString();
        return get().reports.find(
          (report) => new Date(report.date).toDateString() === today
        );
      },
    }),
    {
      name: 'construction-report-storage',
      version: 1,
    }
  )
);