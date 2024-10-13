import { createLazyFileRoute } from "@tanstack/react-router";

import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
// import { Input } from "./components/ui/input";
import YouTubeDownloader from "../components/youtube-downloader";

import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { Label } from "../components/ui/label";

import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "../components/ui/button";

// import { appDataDir } from "@tauri-apps/api/path";

// when using `"withGlobalTauri": true`, you may use
// const { open } = window.__TAURI__.dialog;

// Open a dialog
// const file = await open({
//   multiple: false,
//   directory: false,
// });
// console.log(file);

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
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

        <Button
          onClick={async () => {
            const file = await open({
              multiple: false,
              directory: false,
            });

            setFile(await invoke("cmd_convert_mp4_to_mp3", { filename: file }));
            // setFile(await appDataDir());
          }}
        >
          Open Dialogg
        </Button>

        {/* <div>{appDataDirPath}</div> */}
        <div>{file}</div>
      </div>
    </>
  );
}

export const Route = createLazyFileRoute("/")({
  component: () => <App />,
});
