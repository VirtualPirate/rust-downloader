import DependencyLoader from "@/components/dependency-loader";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { BinaryState, useExternalBinaryStore } from "@/store";

const appDataDirectory = await appDataDir();

const ffmpegExists: boolean = await invoke("ffmpeg_exists", {
  path: appDataDirectory,
});
const ytdlpExists: boolean = await invoke("ytdlp_exists", {
  path: appDataDirectory,
});

useExternalBinaryStore.setState({
  ffmpeg: ffmpegExists ? BinaryState.Available : BinaryState.Absent,
  ytdlp: ytdlpExists ? BinaryState.Available : BinaryState.Absent,
});

export const Route = createRootRoute({
  loader: async () => {
    const appDataDirectory = await appDataDir();
    const { ffmpeg, ytdlp } = useExternalBinaryStore.getState();

    if (ffmpeg === BinaryState.Absent) {
      useExternalBinaryStore.setState({ ffmpeg: BinaryState.InProgress });
      await invoke("download_ffmpeg", {
        path: appDataDirectory,
      });
      useExternalBinaryStore.setState({ ffmpeg: BinaryState.Available });
    }

    if (ytdlp === BinaryState.Absent) {
      useExternalBinaryStore.setState({ ytdlp: BinaryState.InProgress });
      await invoke("download_ytdlp", {
        path: appDataDirectory,
      });
      useExternalBinaryStore.setState({ ytdlp: BinaryState.Available });
    }
  },
  wrapInSuspense: true,
  pendingComponent: () => {
    console.log("loader componenet");
    const { ffmpeg, ytdlp } = useExternalBinaryStore();
    if (ffmpeg === BinaryState.InProgress || ytdlp === BinaryState.InProgress) {
      return <DependencyLoader />;
    }
    return null;
  }, // Show Loader component while loading if ytdlp or ffmpeg is in progress
  component: () => {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* <div className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
        <hr /> */}
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    );
  },
});
