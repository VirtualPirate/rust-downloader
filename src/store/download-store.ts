import { create } from "zustand";
import { OrderedMap, Seq } from "immutable";

import { download } from "@tauri-apps/plugin-upload";

export enum DownloadStatus {
  PENDING = "pending",
  DOWNLOADING = "downloading",
  COMPLETED = "completed",
}
export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  size: number;
  progress: number;
  speed: number;
  dirFilename: string;
  status: DownloadStatus;
  quality: string;
  description: string;
}

type DownloadStore = {
  pending: OrderedMap<string, DownloadItem>;
  downloading: OrderedMap<string, DownloadItem>;
  completed: OrderedMap<string, DownloadItem>;
  parallelCount: number;
};

type DownloadItemKeys = keyof Pick<
  DownloadStore,
  "pending" | "downloading" | "completed"
>;

type DownloadStoreActions = {
  // Setters
  addItem: (item: DownloadItem, status?: DownloadStatus) => void;
  removeItem: (id: string) => void;
  setStatus: (id: string, status: DownloadStatus) => void;
  increaseProgress: (id: string, progress: number) => number;
  updateItem: (options: {
    id: string;
    values: Partial<Omit<DownloadItem, "id">>;
    from?: Array<DownloadItemKeys>;
  }) => void;
  startDownloadingIfNotDownloading: () => void;

  // Getters
  getAsIndexedSeq: () => Seq.Indexed<DownloadItem>;
};

const DOWNLOAD_ITEM_KEYS: Array<DownloadItemKeys> = [
  "pending",
  "downloading",
  "completed",
];

export const useDownloadStore = create<DownloadStore & DownloadStoreActions>(
  (set, get) => ({
    pending: OrderedMap(),
    downloading: OrderedMap(),
    completed: OrderedMap(),
    parallelCount: 2,
    // Adds a new download item to the store
    addItem(
      item: DownloadItem,
      status: DownloadStatus = DownloadStatus.PENDING
    ) {
      set((state) => ({
        [status]: state[status].set(item.id, { ...item, status }),
      }));
    },
    // Removes a download item from the store by its ID
    removeItem(id: string) {
      set((state) => ({
        pending: state.pending.delete(id),
        downloading: state.downloading.delete(id),
        completed: state.completed.delete(id),
      }));
    },

    setStatus(id: string, status: DownloadStatus) {
      set((state) => {
        for (const listName of DOWNLOAD_ITEM_KEYS) {
          const list = state[listName] as OrderedMap<string, DownloadItem>;
          const item = list.get(id);

          if (item && listName !== status) {
            // Add to the list which corresponds to the status
            get().addItem(item, status);

            // And remove from existing list
            set({
              [listName]: list.delete(id),
            });
          }
        }

        return get();
      });
    },

    updateItem(options: {
      id: string;
      values: Partial<Omit<DownloadItem, "id">>;
      from?: Array<DownloadItemKeys>;
    }) {
      const { id, values, from } = options;

      set((state) => {
        const itemsList: Array<DownloadItemKeys> = from || DOWNLOAD_ITEM_KEYS;

        for (const listName of itemsList) {
          const list = state[listName] as OrderedMap<string, DownloadItem>;
          // Update the fields if exists
          const updated = list.get(id)
            ? list.update(id, (item: DownloadItem | undefined) =>
                item ? { ...item, ...values } : undefined
              )
            : undefined;

          if (updated) {
            return {
              [listName]: updated,
            };
          }
        }

        return state;
      });
    },

    increaseProgress(id: string, progress: number): number {
      let currentProgress = 0;
      set((state) => {
        const item = state.downloading.get(id);
        if (item && item.size < item.progress + progress) {
          currentProgress = item.progress + progress;
          return {
            downloading: state.downloading.update(
              id,
              (item: DownloadItem | undefined) =>
                item
                  ? {
                      ...item,
                      progress: currentProgress,
                    }
                  : undefined
            ),
          };
        }
        return {
          downloading: get().downloading,
        };
      });

      return currentProgress;
    },

    startDownloadingIfNotDownloading() {
      set(() => {
        if (get().pending.size === 0) return get();
        if (get().downloading.size < get().parallelCount) {
          while (get().downloading.size < get().parallelCount) {
            if (get().pending.size === 0) return get();
            const pendingItem = get().pending.first();
            if (pendingItem) {
              // Move the download item to downloading status
              get().setStatus(pendingItem.id, DownloadStatus.DOWNLOADING);

              const downloadingItem = get().downloading.get(
                pendingItem.id
              ) as DownloadItem;

              let accumulatedProgress = 0;

              console.log(`File downloading ${downloadingItem.id}`);
              download(
                downloadingItem?.url,
                downloadingItem?.dirFilename,
                ({ progress, total }) => {
                  // IF the size of the file is not set
                  if (downloadingItem.size === 0) {
                    // Set the size of downloadItem
                    get().updateItem({
                      id: downloadingItem.id,
                      values: {
                        size: total,
                      },
                      from: ["downloading"],
                    });
                  }

                  accumulatedProgress += progress;
                  get().updateItem({
                    id: downloadingItem.id,
                    values: {
                      progress: accumulatedProgress,
                    },
                    from: [DownloadStatus.DOWNLOADING],
                  });

                  if (accumulatedProgress === total) {
                    get().setStatus(
                      downloadingItem.id,
                      DownloadStatus.COMPLETED
                    );

                    console.log(`File downloaded ${downloadingItem.id}`);

                    get().startDownloadingIfNotDownloading();
                  }
                }
              );
            }
          }
        }

        return get();
      });
    },

    getAsIndexedSeq() {
      return get()
        .downloading.concat(get().pending)
        .concat(get().completed)
        .toIndexedSeq();
    },
  })
);
