// import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play } from "lucide-react";
import { useDownloadStore, DownloadStatus } from "@/store";

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

  return (
    <div className="space-y-4">
      <ScrollArea className=" w-full rounded-md border">
        <div className="p-4">
          {/* <h2 className="text-2xl font-bold mb-4">Downloads</h2> */}
          {downloads.getAsIndexedSeq().map((download) => (
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
                    <span>{download.size}</span>
                    <span>
                      {download.progress < 100 ? download.speed : "Completed"}
                    </span>
                  </div>
                  <Progress
                    value={(download.progress / download.size) * 100}
                    className="mt-2 h-2"
                  />
                  <div className="flex justify-between items-center text-sm mt-1">
                    <div className="flex items-center space-x-2">
                      <span>{download.progress.toFixed(1)}%</span>
                      <span className="text-muted-foreground">
                        {download.status}
                      </span>
                    </div>
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
              {/* {index < downloads.length - 1 && <Separator className="my-4" />} */}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
