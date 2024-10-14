use youtube_dl::download_yt_dlp;

use crate::binaries;
use std::path::PathBuf;

#[tauri::command]
pub fn ffmpeg_exists(path: String) -> bool {
    println!("[invoke] ffmpeg_exists");
    let path = PathBuf::from(path);
    let exists = binaries::ffmpeg_exists(&path);
    println!("[success] ffmpeg_exists");
    exists
}

#[tauri::command]
pub async fn ytdlp_exists(path: String) -> bool {
    println!("[invoke] ytdlp_exists");
    let path: PathBuf = PathBuf::from(path);
    let exists = binaries::ytdlp_exists(&path).await;
    println!("[success] ytdlp_exists");
    exists
}

#[tauri::command]
pub async fn download_ffmpeg(path: String) -> bool {
    println!("[invoke] download_ffmpeg");
    let path = PathBuf::from(path);
    let success = tokio::task::spawn_blocking(move || binaries::download_ffmpeg(&path).is_ok())
        .await
        .unwrap_or(false);
    println!("[success] download_ffmpeg");
    success
}

#[tauri::command]
pub async fn download_ytdlp(path: String) -> bool {
    println!("[invoke] download_ytdlp");
    let path = PathBuf::from(path);
    let success = download_yt_dlp(&path).await.is_ok();
    println!("[success] download_ytdlp");
    success
}
