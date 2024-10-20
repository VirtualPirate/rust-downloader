import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { get_youtube_video } from "@/lib/command-api";
import { DownloadPopup } from "./download-popup";

export default function DownloadForm() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("720p");
  const [downloadPopipIsOpen, setDownloadPopupIsOpen] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>();

  const onDownloadClick = async () => {
    console.log("Invoke");
    const videoData = await get_youtube_video(url);
    console.log("videoData", videoData.SingleVideo);
    setVideoInfo(videoData.SingleVideo);
    setDownloadPopupIsOpen(true);
  };

  const onDownloadPopupClose = () => {
    setDownloadPopupIsOpen(false);
  };

  return (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter YouTube URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={onDownloadClick}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
        <div className="flex space-x-2">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="webm">WebM</SelectItem>
            </SelectContent>
          </Select>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger>
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="360p">360p</SelectItem>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Download Location"
            // value={downloadLocation}
            readOnly
          />
          <Button
            variant="outline"
            //    onClick={handleSelectLocation}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Select
          </Button>
        </div>
      </div>

      <DownloadPopup
        isOpen={downloadPopipIsOpen}
        onClose={onDownloadPopupClose}
        videoInfo={videoInfo}
      />
    </>
  );
}
