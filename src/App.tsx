import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Input } from "./components/ui/input";
import { ThemeProvider } from "./components/ui/theme-provider";
import YouTubeDownloader from "./components/youtube-downloader";

import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { Label } from "./components/ui/label";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="m-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
          <Label htmlFor="dark-mode" className="sr-only">
            Dark Mode
          </Label>
          {darkMode ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </div>
        {/* <Input type="email" placeholder="Email" /> */}
        <YouTubeDownloader />
      </div>
    </ThemeProvider>
  );
}

export default App;
