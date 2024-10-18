use youtube_dl::{Protocol, YoutubeDl, YoutubeDlOutput};

fn transform(output: &mut YoutubeDlOutput) {
    match output {
        // Handle the SingleVideo case
        YoutubeDlOutput::SingleVideo(video) => {
            if let Some(formats) = &mut video.formats {
                // Retain only formats that do not have a manifest_url
                formats.retain(|format| {
                    format.manifest_url.is_none()
                        && matches!(format.protocol, Some(Protocol::Https))
                });

                let allowed_format_ids = vec![
                    "250", "251", "160", "133", "134", "18", "135", "136", "137", "271", "313",
                ]; // Replace with actual format ids
                formats.retain(|format| {
                    allowed_format_ids.contains(&format.format_id.as_deref().unwrap_or(""))
                });
            }
        }
        // Playlist case remains unchanged
        YoutubeDlOutput::Playlist(_) => {
            // No action needed for Playlist
        }
    }
}

pub async fn fetch_youtube_video_info(
    url: &str,
    yt_dlp_path: &str,
) -> Result<serde_json::Value, anyhow::Error> {
    let output = YoutubeDl::new(url)
        .youtube_dl_path(yt_dlp_path)
        .socket_timeout("15") // Optional: Set socket timeout
        .run();

    match output {
        Ok(result) => {
            let mut result = result;
            transform(&mut result);
            let json = serde_json::to_value(&result)?;
            println!("Video details converted to JSON");
            Ok(json)
        }
        Err(e) => {
            println!("Failed to get video details: {}", e);
            Err(e.into())
        }
    }
}
