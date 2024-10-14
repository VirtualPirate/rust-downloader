import DependencyLoader from "@/components/dependency-loader";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const appDataDirectory = await appDataDir();

    const ffmpegExists = await invoke("ffmpeg_exists", {
      path: appDataDirectory,
    });
    const ytdlpExists = await invoke("ytdlp_exists", {
      path: appDataDirectory,
    });

    return { ffmpegExists, ytdlpExists };
  },
  loader: async (data) => {
    const appDataDirectory = await appDataDir();

    const { ffmpegExists, ytdlpExists } = data.context;

    if (!ffmpegExists) {
      await invoke("download_ffmpeg", {
        path: appDataDirectory,
      });
    }

    if (!ytdlpExists) {
      await invoke("download_ytdlp", {
        path: appDataDirectory,
      });
    }
  },
  wrapInSuspense: true,
  pendingComponent: () => {
    return <DependencyLoader />;
  }, // Show Loader component while loading
  component: () => {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    );
  },
});
