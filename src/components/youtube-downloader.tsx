import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import Image from "next/image";

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("720p");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<{
    title: string;
    thumbnail: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDownloading(true);
    setProgress(0);

    // Simulating video info fetch
    setVideoInfo({
      title: "Sample YouTube Video",
      thumbnail: "/placeholder.svg?height=720&width=1280",
    });

    // Simulating download progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setDownloading(false);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Video Downloader</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="360p">360p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={downloading}>
              {downloading ? "Downloading..." : "Download"}
            </Button>
          </form>

          {videoInfo && (
            <div className="mt-6 space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  //   fill="true"
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold">{videoInfo.title}</h3>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {progress}% Downloaded
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
