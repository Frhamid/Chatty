import { create } from "zustand";
import useUpdateTheme from "../Hooks/useUpdateTheme";

export const useThemeStore = create((set) => ({
  theme: "forest",
  setTheme: (newtheme) => {
    set(() => ({ theme: newtheme }));
  },
}));
