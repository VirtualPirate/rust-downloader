import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Input } from "./components/ui/input";
import { ThemeProvider } from "./components/ui/theme-provider";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="m-4">
        <Input type="email" placeholder="Email" />
      </div>
    </ThemeProvider>
  );
}

export default App;
