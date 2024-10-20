// import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play } from "lucide-react";
import { useDownloadStore, DownloadStatus } from "@/store";
import { format } from "bytes";

interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  progress: number;
  speed: string;
  paused: boolean;
  quality: string;
}

export default function DownloadList() {
  const downloads = useDownloadStore((state) => state);
  const downloadList = downloads.getAsIndexedSeq();

  return (
    <div className="space-y-4">
      <ScrollArea className=" w-full rounded-md border">
        <div className="p-4">
          {/* <h2 className="text-2xl font-bold mb-4">Downloads</h2> */}
          {downloadList.map((download, index) => {
            const currentProgress = (download.progress / download.size) * 100;
            const size = format(download.size, { unitSeparator: " " });
            const progress = format(download.progress, { unitSeparator: " " });

            return (
              <div key={download.id}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-24 h-14 overflow-hidden rounded">
                    <img
                      src={download.thumbnail}
                      alt={download.title}
                      // fill
                      className="object-cover"
                    />
                    <Badge className="absolute bottom-1 right-1 text-xs">
                      {download.quality}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">
                      {download.title}
                    </h3>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{`${progress} / ${size}`}</span>
                      <span>
                        {currentProgress < 100
                          ? `${format(download.speed, { unitSeparator: " " })}/s`
                          : "Completed"}
                      </span>
                    </div>
                    <Progress value={currentProgress} className="mt-2 h-2" />
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>{currentProgress.toFixed(2)}%</span>
                      <Badge variant="outline">{download.status}</Badge>
                      {/* {download.progress < 100 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePause(download.id)}
                        aria-label={
                          download.paused
                            ? "Continue download"
                            : "Pause download"
                        }
                      >
                        {download.paused ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </Button>
                    )} */}
                    </div>
                  </div>
                </div>
                {downloadList.size && index < downloadList?.size - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
