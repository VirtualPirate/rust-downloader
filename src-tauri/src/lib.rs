// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
pub mod binaries;
pub mod util;

use std::fs::create_dir_all;
use std::path::PathBuf;

use binaries::{convert_mp4_to_mp3, download_ffmpeg_if_not_exists, download_ytdlp_if_not_exists};
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn cmd_convert_mp4_to_mp3(app_handle: tauri::AppHandle, filename: &str) -> String {
    let path: PathBuf = app_handle.path().app_data_dir().unwrap().join("ffmpeg");

    convert_mp4_to_mp3(path, filename).expect("Error occured wile converting file");

    std::env::current_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .setup(|app| {
            let app_data_dir = app.handle().path().app_data_dir();

            match app_data_dir {
                Ok(path_buf) => {
                    println!("{:?} directory", path_buf);
                    create_dir_all(path_buf.clone())
                        .expect("Error occured in create_dir_all() method");

                    download_ffmpeg_if_not_exists(path_buf.clone())
                        .expect("Error occured while downloeding binary");

                    tauri::async_runtime::spawn(async move {
                        // also added move here
                        match download_ytdlp_if_not_exists(path_buf.clone()).await {
                            Ok(_) => (),
                            Err(e) => eprintln!("Error downloading yt-dlp: {:?}", e),
                        };
                    });
                }
                Err(_) => {
                    println!("Error occured");
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, cmd_convert_mp4_to_mp3])
        .run(context)
        .expect("error while running tauri application");
}
