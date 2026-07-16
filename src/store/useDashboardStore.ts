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
  setMetric: (metric: MetricType) => void;
  setSelectedDistrictId: (id: number | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedMetric: 'general', // Default metric
  selectedDistrictId: null,
  setMetric: (metric) => set({ selectedMetric: metric }),
  setSelectedDistrictId: (id) => set({ selectedDistrictId: id }),
}));
