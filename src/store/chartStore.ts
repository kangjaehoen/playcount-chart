import { create } from "zustand";
import type { ChartType, DisplayMode } from "@/lib/api/types";

const MAX_SELECTED_CHARTS = 3;

type ChartStore = {
  selectedDate: string;
  selectedCharts: ChartType[];
  displayMode: DisplayMode;
  page: number;
  pageSize: number;
  refreshSeed: number;
  setDate: (date: string) => void;
  toggleChart: (chartType: ChartType) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refreshMockData: () => void;
};

export const useChartStore = create<ChartStore>((set) => ({
  selectedDate: "2026-03-01",
  selectedCharts: ["soundat", "ytmusic", "melon"],
  displayMode: "total",
  page: 0,
  pageSize: 10,
  refreshSeed: 0,
  setDate: (date) => set({ selectedDate: date, page: 0 }),
  toggleChart: (chartType) =>
    set((state) => {
      if (state.selectedCharts.includes(chartType)) {
        const nextCharts = state.selectedCharts.filter((item) => item !== chartType);
        return { selectedCharts: nextCharts.length ? nextCharts : state.selectedCharts, page: 0 };
      }

      if (state.selectedCharts.length >= MAX_SELECTED_CHARTS) {
        return state;
      }

      return { selectedCharts: [...state.selectedCharts, chartType], page: 0 };
    }),
  setDisplayMode: (displayMode) => set({ displayMode }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 0 }),
  refreshMockData: () => set((state) => ({ refreshSeed: state.refreshSeed + 1, page: 0 })),
}));
