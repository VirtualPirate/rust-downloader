import { DownloadStatus } from "@/store";
import { download } from "@tauri-apps/plugin-upload";

interface DownloadItem {
  id: string;
  url: string;
  dirFilename: string;
  status: DownloadStatus;
}

interface FileDownloaderOptions {
  parallelCount: number;
}

export class FileDownloader {
  pending: DownloadItem[];
  downloading: DownloadItem[];
  completed: DownloadItem[];
  parallelCount: number;
  checkInterval: any;

  constructor(options?: FileDownloaderOptions) {
    this.pending = [];
    this.downloading = [];
    this.completed = [];

    if (options) {
      this.parallelCount = options.parallelCount;
    } else {
      this.parallelCount = 1;
    }
    // this.startCheckingDownloads();

    console.log("FileDownloader initialized ...");
  }

  addDownloadTask(...downloadItems: DownloadItem[]) {
    downloadItems.forEach((i) => {
      this.pending.push(i);
    });

    this.startDownloadIfNotDownloading();

    console.log("Added file download to pending ...");
  }

  startDownloadIfNotDownloading() {
    if (this.pending.length === 0) return;
    if (this.downloading.length === 0) {
      for (let i = 0; i < this.parallelCount; i++) {
        if (this.pending.length === 0) return;

        this.downloading.push(this.pending[0]);
        this.pending.splice(0, 1);

        const currentDownloadItem =
          this.downloading[this.downloading.length - 1];

        let accumulatedProgress = 0;

        download(
          currentDownloadItem.url,
          currentDownloadItem.dirFilename,
          ({ progress, total }) => {
            accumulatedProgress += progress;
            if (accumulatedProgress === total) {
              const index = this.downloading.findIndex(
                (i) => i.id === currentDownloadItem.id
              );

              this.completed.push(this.downloading[index]);
              this.downloading.splice(index, 1);

              this.startDownloadIfNotDownloading();

              console.log(`File downloaded ${currentDownloadItem.id}`);
            }
          }
        );
      }
    }
  }

  // startCheckingDownloads() {
  //   this.checkInterval = setInterval(this.startDownloadIfNotDownloading, 3000);
  // }

  // // Make sure to clear the interval when the downloader is no longer needed
  // stopCheckingDownloads() {
  //   if (this.checkInterval) {
  //     clearInterval(this.checkInterval);
  //   }
  // }
}

// export const filedownloader = new FileDownloader({ parallelCount: 2 });
