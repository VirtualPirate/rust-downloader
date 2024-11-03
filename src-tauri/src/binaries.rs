use ffmpeg_sidecar::{
    download::{check_latest_version, download_ffmpeg_package, ffmpeg_download_url, unpack_ffmpeg},
    version::ffmpeg_version_with_path,
};
use std::{
    path::{Component, PathBuf},
    process::Command,
};
use youtube_dl::{download_yt_dlp, downloader::YoutubeDlFetcher};

#[cfg(target_os = "macos")]
pub const YTDLP_FILENAME: &str = "yt-dlp_macos";

#[cfg(all(target_os = "linux", target_arch = "aarch64"))]
pub const YTDLP_FILENAME: &str = "yt-dlp_linux_aarch64";

#[cfg(all(target_os = "linux", not(target_arch = "aarch64")))]
pub const YTDLP_FILENAME: &str = "yt-dlp_linux";

#[cfg(target_os = "windows")]
pub const YTDLP_FILENAME: &str = "yt-dlp.exe";

pub fn ffmpeg_exists(path: &PathBuf) -> bool {
    match check_latest_version() {
        Ok(version) => {
            let ffmpeg_executable = if cfg!(target_os = "windows") {
                "ffmpeg.exe"
            } else {
                "ffmpeg"
            };
            match ffmpeg_version_with_path(path.join(ffmpeg_executable)) {
                Ok(current_version) => current_version == version,
                Err(_) => false,
            }
        }
        Err(_) => false,
    }
}

pub async fn ytdlp_exists(path: &PathBuf) -> bool {
    let ytdl_fetcher = YoutubeDlFetcher::default();

    let latest_release = match ytdl_fetcher.find_newest_release().await {
        Ok(release) => release,
        Err(_) => return false,
    };
    let path = path.join(YTDLP_FILENAME);
    match std::process::Command::new(&path).arg("--version").output() {
        Ok(output) => {
            let version = String::from_utf8_lossy(&output.stdout).trim().to_string();

            version == latest_release.tag
        }
        Err(_) => false,
    }
}

pub fn download_ffmpeg(path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    // These defaults will automatically select the correct download URL for your
    // platform.
    let download_url = ffmpeg_download_url()?;
    let destination = resolve_relative_path(path);

    // By default the download will use a `curl` command. You could also write
    // your own download function and use another package like `reqwest` instead.
    println!("Downloading from: {:?}", download_url);
    let archive_path = download_ffmpeg_package(download_url, &destination)?;
    println!("Downloaded package: {:?}", archive_path);

    // Extraction uses `tar` on all platforms (available in Windows since version 1803)
    println!("Extracting...");
    unpack_ffmpeg(&archive_path, &destination)?;

    // Use the freshly installed FFmpeg to check the version number
    let version = ffmpeg_version_with_path(destination.join("ffmpeg"))?;
    println!("FFmpeg version: {}", version);

    println!("Done! 🏁");

    Ok(())
}

pub fn download_ffmpeg_if_not_exists(path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    if !ffmpeg_exists(path) {
        download_ffmpeg(path)
    } else {
        Err("ffmpeg does not exist and could not be downloaded".into())
    }
}

pub async fn download_ytdlp_if_not_exists(
    path: &PathBuf,
) -> Result<PathBuf, Box<dyn std::error::Error>> {
    if !ytdlp_exists(path).await {
        download_yt_dlp(path).await.map_err(|e| e.into())
    } else {
        Err("ytdlp does not exist and could not be downloaded".into())
    }
}

fn resolve_relative_path(path_buf: &PathBuf) -> PathBuf {
    let mut components: Vec<PathBuf> = vec![];
    for component in path_buf.as_path().components() {
        match component {
            Component::Prefix(_) | Component::RootDir => {
                components.push(component.as_os_str().into())
            }
            Component::CurDir => (),
            Component::ParentDir => {
                if !components.is_empty() {
                    components.pop();
                }
            }
            Component::Normal(component) => components.push(component.into()),
        }
    }
    PathBuf::from_iter(components)
}

pub fn convert_mp4_to_mp3(
    ffmppeg_dir: PathBuf,
    input_file: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    // Create the output file name by replacing `.webm` with `.mp3`
    let output_file = format!("{}.mp3", input_file.trim_end_matches(".mp4"));

    // Construct and execute the ffmpeg command
    let status = Command::new(ffmppeg_dir)
        .arg("-i")
        .arg(input_file)
        .arg("-vn") // No video
        .arg("-ab")
        .arg("128k") // Audio bitrate
        .arg("-ar")
        .arg("44100") // Audio sampling rate
        .arg("-y") // Overwrite output files
        .arg(&output_file)
        .status()?; // Wait for command to complete and get the status

    if status.success() {
        println!("Conversion successful: {} -> {}", input_file, output_file);
        Ok(())
    } else {
        Err(format!("Failed to convert the file: {}", input_file).into())
    }
}
