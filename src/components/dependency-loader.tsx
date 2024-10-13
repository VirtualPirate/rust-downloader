import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const dependencies = [
  { name: "ffmpeg", size: 50 },
  { name: "yt-dlp", size: 30 },
];

export default function DependencyLoader() {
  const [progress, setProgress] = useState(0);
  const [currentDependency, setCurrentDependency] = useState(dependencies[0]);
  const [completedDependencies, setCompletedDependencies] = useState<string[]>(
    []
  );
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const totalSize = dependencies.reduce((acc, dep) => acc + dep.size, 0);
    let installedSize = 0;
    let currentDependencyIndex = 0;

    const installInterval = setInterval(() => {
      if (currentDependencyIndex >= dependencies.length) {
        clearInterval(installInterval);
        setIsCompleted(true);
        return;
      }

      const dependency = dependencies[currentDependencyIndex];
      installedSize += 1;
      setCurrentDependency(dependency);
      setProgress(Math.round((installedSize / totalSize) * 100));

      if (installedSize >= dependency.size) {
        setCompletedDependencies((prev) => [...prev, dependency.name]);
        currentDependencyIndex++;
      }
    }, 100);

    return () => clearInterval(installInterval);
  }, []);

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
              : `Installing ${currentDependency.name}... (${progress}%)`}
          </p>
          <div className="space-y-2">
            {dependencies.map((dep) => (
              <div key={dep.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{dep.name}</span>
                {completedDependencies.includes(dep.name) ? (
                  <Badge variant="default">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Installed
                  </Badge>
                ) : currentDependency.name === dep.name && !isCompleted ? (
                  <Badge variant="secondary">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Installing
                  </Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        {isCompleted && (
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => alert("Application is ready to use!")}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Start Application
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
