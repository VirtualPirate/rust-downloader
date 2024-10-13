use youtube_dl::download_yt_dlp;

use crate::binaries;
use std::path::PathBuf;

#[tauri::command]
pub fn ffmpeg_exists(path: String) -> bool {
    let path = PathBuf::from(path);
    binaries::ffmpeg_exists(&path)
}

#[tauri::command]
pub async fn ytdlp_exists(path: String) -> bool {
    let path: PathBuf = PathBuf::from(path);
    binaries::ytdlp_exists(&path).await
}

#[tauri::command]
pub fn download_ffmpeg(path: String) -> bool {
    let path = PathBuf::from(path);
    binaries::download_ffmpeg(&path).is_ok()
}

#[tauri::command]
pub async fn download_ytdlp(path: String) -> bool {
    let path = PathBuf::from(path);
    download_yt_dlp(&path).await.is_ok()
}
