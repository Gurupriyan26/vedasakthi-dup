import { create } from 'zustand';

export type MetricType = 
  | 'general'
  | 'infra_status'
  | 'total_schools'
  | 'attendance'
  | 'neet_qualified'
  | 'coaching_schools'
  | 'neet_coaching_enrolment_est'
  | 'jee_coaching_enrolment_est'
  | 'total_coaching_enrolment_est'
  | 'hi_tech_labs'
  | 'teachers_staffed'
  | 'electricity'
  | 'wash_audited'
  | 'active_blocks';

interface DashboardState {
  selectedMetric: MetricType;
  selectedDistrictId: number | null;
  theme: 'light' | 'dark';
  setMetric: (metric: MetricType) => void;
  setSelectedDistrictId: (id: number | null) => void;
  toggleTheme: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedMetric: 'coaching_schools', // Default metric to coaching schools
  selectedDistrictId: null,
  theme: 'dark', // Default to dark mode
  setMetric: (metric) => set({ selectedMetric: metric }),
  setSelectedDistrictId: (id) => set({ selectedDistrictId: id }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
