import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

interface YouTubeDownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoInfo: {
    title: string;
    thumbnail: string;
    description: string;
  };
}

export function DownloadPopup({
  isOpen,
  onClose,
  videoInfo,
}: YouTubeDownloadPopupProps) {
  const [format, setFormat] = useState<"mp3" | "mp4">("mp4");
  const [quality, setQuality] = useState("720p");
  const [fileLocation, setFileLocation] = useState("");

  const handleDownload = () => {
    // Implement the actual download logic here
    console.log("Downloading:", { format, quality, fileLocation });
    onClose();
  };

  const handleFileLocationPicker = () => {
    // Implement file location picker logic here
    // This would typically use a native file dialog in a desktop app
    const pickedLocation = "/path/to/download/folder"; // Placeholder
    setFileLocation(pickedLocation);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <img
                src={videoInfo.thumbnail}
                alt="Video thumbnail"
                width="100%"
                height={180}
                className="rounded-md"
              />
            </div>
            <p id="title" className="text-sm">
              {videoInfo.title}
            </p>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-semibold">
                Description
              </Label>
              <p
                id="description"
                className="text-sm text-gray-500 max-h-24 overflow-y-auto"
              >
                {videoInfo.description}
              </p>
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Format and Quality</Label>
              <div className="flex items-center space-x-4">
                <RadioGroup
                  id="format"
                  value={format}
                  onValueChange={(value: string) =>
                    setFormat(value as "mp3" | "mp4")
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mp3" id="mp3" />
                    <Label htmlFor="mp3">MP3</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mp4" id="mp4" />
                    <Label htmlFor="mp4">MP4</Label>
                  </div>
                </RadioGroup>
                {format === "mp4" && (
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger id="quality" className="w-[100px]">
                      <SelectValue placeholder="Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="360p">360p</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file-location" className="font-semibold">
                File Location
              </Label>
              <div className="flex gap-2">
                <Input
                  id="file-location"
                  value={fileLocation}
                  readOnly
                  className="flex-grow"
                />
                <Button onClick={handleFileLocationPicker}>Browse</Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="justify-between">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
