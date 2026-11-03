import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  xp: number;
  level: number;
  coins: number;
  stars: number;
  unlockedLevels: number[];
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      xp: 350,
      level: 3,
      coins: 120,
      stars: 9,
      unlockedLevels: [1, 2, 3],
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    }),
    { name: 'bisa-math-storage' }
  )
);
