use anyhow::{Context, Result};
use reqwest::blocking::Client;
use std::fs::File;
use std::io::copy;
use std::path::{Path, PathBuf}; // For better error handling

// This function downloads a file from a URL and saves it to the provided directory.
pub fn download_file(url: &str, download_dir: &Path) -> Result<PathBuf> {
    // Create an HTTP client
    let client = Client::new();

    // Make a GET request to the provided URL
    let response = client
        .get(url)
        .send()
        .context("Failed to send request")?
        .error_for_status()
        .context("Server returned an error response")?;

    // Get the file name from the URL or use a default name
    let file_name = url.split('/').last().unwrap_or("downloaded_file");

    // Create the path where the file will be saved
    let file_path = download_dir.join(file_name);

    // Open the file in write mode
    let mut dest_file = File::create(&file_path).context("Failed to create file")?;

    // Stream the response bytes directly into the destination file
    let content = response.bytes().context("Failed to read content")?;
    copy(&mut content.as_ref(), &mut dest_file).context("Failed to write to file")?;

    // Return the path of the downloaded file
    Ok(file_path)
}
