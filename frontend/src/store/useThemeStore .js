import { create } from "zustand";
import useUpdateTheme from "../Hooks/useUpdateTheme";

export const useThemeStore = create((set) => ({
  theme: "forest",
  setTheme: (newtheme) => {
    set(() => ({ theme: newtheme }));
  },
}));

export const useRequestStore = create((set) => ({
  Requests: 0,
  setRequests: (Request) => {
    set(() => ({ Requests: Request }));
  },
}));
