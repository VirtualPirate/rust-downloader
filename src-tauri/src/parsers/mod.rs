mod youtube;

use crate::parsers::youtube::fetch_youtube_video_info;

#[tauri::command]
pub async fn fetch_youtube_video(
    url: String,
    yt_dlp_path: String,
) -> Result<serde_json::Value, String> {
    fetch_youtube_video_info(&url, &yt_dlp_path)
        .await
        .map_err(|e| e.to_string())
}
