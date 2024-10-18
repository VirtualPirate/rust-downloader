import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play } from "lucide-react";

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
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    // Simulating initial download items
    setDownloads([
      {
        id: "1",
        title: "Introduction to React Hooks",
        thumbnail: "/placeholder.svg?height=720&width=1280",
        size: "250 MB",
        progress: 45,
        speed: "2.5 MB/s",
        paused: false,
        quality: "720p",
      },
      {
        id: "2",
        title: "Advanced CSS Techniques",
        thumbnail: "/placeholder.svg?height=720&width=1280",
        size: "180 MB",
        progress: 72,
        speed: "3.1 MB/s",
        paused: false,
        quality: "1080p",
      },
      {
        id: "3",
        title: "Node.js for Beginners",
        thumbnail: "/placeholder.svg?height=720&width=1280",
        size: "320 MB",
        progress: 10,
        speed: "1.8 MB/s",
        paused: false,
        quality: "480p",
      },
    ]);

    // Simulating progress updates
    const interval = setInterval(() => {
      setDownloads((prevDownloads) =>
        prevDownloads.map((download) => ({
          ...download,
          progress: download.paused
            ? download.progress
            : Math.min(download.progress + Math.random() * 5, 100),
          speed: download.paused
            ? "0 MB/s"
            : `${(Math.random() * 3 + 1).toFixed(1)} MB/s`,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const togglePause = (id: string) => {
    setDownloads((prevDownloads) =>
      prevDownloads.map((download) =>
        download.id === id
          ? { ...download, paused: !download.paused }
          : download
      )
    );
  };

  return (
    <div className="space-y-4">
      <ScrollArea className=" w-full rounded-md border">
        <div className="p-4">
          {/* <h2 className="text-2xl font-bold mb-4">Downloads</h2> */}
          {downloads.map((download, index) => (
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
                  <Progress value={download.progress} className="mt-2 h-2" />
                  <div className="flex justify-between items-center text-sm mt-1">
                    <div className="flex items-center space-x-2">
                      <span>{download.progress.toFixed(1)}%</span>
                      <span className="text-muted-foreground">
                        {download.progress === 100
                          ? "Completed"
                          : download.paused
                            ? "Paused"
                            : "Downloading"}
                      </span>
                    </div>
                    {download.progress < 100 && (
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
                    )}
                  </div>
                </div>
              </div>
              {index < downloads.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
