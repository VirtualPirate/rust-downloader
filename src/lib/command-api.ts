import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

const appDataDirectory = await appDataDir();

export async function get_youtube_video(url: string) {
  return await invoke("fetch_youtube_video", {
    url,
    ytDlpPath: `${appDataDirectory}/yt-dlp`,
  });
}
