import { create } from "zustand";

interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  progress: number;
  speed: string;
  paused: boolean;
}

type DownloadStore = {
  items: Record<string, DownloadItem>;
  addItem: (item: DownloadItem) => void;
  removeItem: (id: string) => void;
  updateItem: (
    id: string,
    progress: number,
    speed: string,
    paused: boolean
  ) => void;
};

export const useDownloadStore = create<DownloadStore>((set) => ({
  items: {},
  // Adds a new download item to the store
  addItem: (item: DownloadItem) =>
    set((state) => ({
      items: {
        ...state.items,
        [item.id]: item,
      },
    })),
  // Removes a download item from the store by its ID
  removeItem: (id: string) =>
    set((state) => {
      const { [id]: removedItem, ...restItems } = state.items;
      return { items: restItems };
    }),
  // Updates a download item's progress, speed, and paused status in the store by its ID
  updateItem: (id: string, progress: number, speed: string, paused: boolean) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          ...state.items[id],
          progress,
          speed,
          paused,
        },
      },
    })),
}));
