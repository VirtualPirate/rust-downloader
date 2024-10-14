import { useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useExternalBinaryStore, BinaryState } from "@/store";

const DownloadState = {
  [BinaryState.Absent]: "Pending",
  [BinaryState.InProgress]: "Downloading",
  [BinaryState.Available]: "Installed",
};

export default function DependencyLoader() {
  const { ffmpeg, ytdlp } = useExternalBinaryStore();
  const isCompleted =
    ffmpeg === BinaryState.Available && ytdlp === BinaryState.Available;

  // Calculate progress based on the installation state of each dependency
  const progress =
    (ffmpeg === BinaryState.Available ? 50 : 0) +
    (ytdlp === BinaryState.Available ? 50 : 0);

  useEffect(() => {
    // This effect is used to trigger any side effects related to the installation state
    // For example, you might want to notify the user when all dependencies are installed
    if (isCompleted) {
      // Notify user that the application is ready to use
      console.log("Application is ready to use!");
    }
  }, [isCompleted]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-[350px] max-w-[90vw]">
        <CardHeader>
          <CardTitle className="text-center">
            {isCompleted ? "Installation Complete" : "Installing Dependencies"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            {isCompleted
              ? "All dependencies have been installed successfully."
              : `Installing dependencies... (${progress}%)`}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ffmpeg</span>
              <Badge
                variant={
                  ffmpeg === BinaryState.Available ? "default" : "secondary"
                }
              >
                {ffmpeg === BinaryState.Available ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {DownloadState[ffmpeg]}
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    {DownloadState[ffmpeg]}
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">yt-dlp</span>
              <Badge
                variant={
                  ytdlp === BinaryState.Available ? "default" : "secondary"
                }
              >
                {ytdlp === BinaryState.Available ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {DownloadState[ytdlp]}
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    {DownloadState[ytdlp]}
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
        {/* {isCompleted && (
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => alert("Application is ready to use!")}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Start Application
            </Button>
          </CardFooter>
        )} */}
      </Card>
    </div>
  );
}
