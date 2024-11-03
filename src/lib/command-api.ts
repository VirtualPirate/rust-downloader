import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

const appDataDirectory = await appDataDir();
const YTDLPFilename = await getYTDLPFilename();

export async function get_youtube_video(url: string): Promise<any> {
  const data = await invoke("fetch_youtube_video", {
    url,
    ytDlpPath: `${appDataDirectory}/${YTDLPFilename}`,
  });

  return data;
}

export async function getYTDLPFilename(): Promise<string> {
  const data = await invoke("get_ytdlp_filename");
  return data as string;
}
