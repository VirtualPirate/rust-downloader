import { Badge, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DownloadItem {
  id: string;
  title: string;
  thumbnail?: string;
  size: string;
  progress: number;
  speed: string;
  paused: boolean;
  quality: string;
}

interface DownloadListItemProps {
  downloadItem: DownloadItem;
}

export function DownloadListItem({ downloadItem }: DownloadListItemProps) {
  //   const togglePause = (id: string) => {
  //     setDownloads((prevDownloads) =>
  //       prevDownloads.map((download) =>
  //         download.id === id
  //           ? { ...download, paused: !download.paused }
  //           : download
  //       )
  //     );
  //   };

  return (
    <div key={downloadItem.id}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-24 h-14 overflow-hidden rounded">
          <img
            src={downloadItem.thumbnail}
            alt={downloadItem.title}
            // fill
            className="object-cover"
          />
          <Badge className="absolute bottom-1 right-1 text-xs">
            {downloadItem.quality}
          </Badge>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-1">{downloadItem.title}</h3>
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{downloadItem.size}</span>
            <span>
              {downloadItem.progress < 100 ? downloadItem.speed : "Completed"}
            </span>
          </div>
          <Progress value={downloadItem.progress} className="mt-2 h-2" />
          <div className="flex justify-between items-center text-sm mt-1">
            <div className="flex items-center space-x-2">
              <span>{downloadItem.progress.toFixed(1)}%</span>
              <span className="text-muted-foreground">
                {downloadItem.progress === 100
                  ? "Completed"
                  : downloadItem.paused
                    ? "Paused"
                    : "Downloading"}
              </span>
            </div>
            {downloadItem.progress < 100 && (
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => togglePause(downloadItem.id)}
                aria-label={
                  downloadItem.paused ? "Continue download" : "Pause download"
                }
              >
                {downloadItem.paused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
