use futures::future::join_all;
use futures::TryStreamExt;
use std::path::Path;
use tokio::fs as async_fs;
use tokio::io::{AsyncWriteExt, BufWriter};

struct DownloadSegment {
    start: u64,
    end: u64,
    index: usize,
}

async fn get_file_size(url: &str) -> Result<u64, reqwest::Error> {
    let client = reqwest::Client::new();
    let response = client.head(url).send().await?;
    let content_length = response
        .headers()
        .get(reqwest::header::CONTENT_LENGTH)
        .and_then(|val| val.to_str().ok())
        .and_then(|val| val.parse::<u64>().ok())
        .unwrap_or(0);
    Ok(content_length)
}

async fn download_segment(
    url: &str,
    segment: DownloadSegment,
    output_dir: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    let DownloadSegment { start, end, index } = segment;
    println!("Segment Download started start: {} end: {}", start, end);

    let output_path = format!("{}/part_{}", output_dir, index);
    let mut file = BufWriter::new(async_fs::File::create(&output_path).await?);

    let client = reqwest::Client::new();
    let range_header = format!("bytes={}-{}", start, end);
    let response = client.get(url).header("Range", range_header).send().await?;

    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.try_next().await? {
        file.write_all(&chunk).await?;
    }
    file.flush().await?;

    println!("Downloaded segment {} (bytes {}-{})", index, start, end);
    Ok(output_path)
}

async fn download_file(
    url: &str,
    segments: usize,
    output_file_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let file_size = get_file_size(url).await?;
    let segment_size = (file_size as f64 / segments as f64).ceil() as u64;
    let output_dir = Path::new(output_file_path).parent().unwrap();
    let mut segment_paths = Vec::new();

    let mut segment_futures = Vec::new();
    for index in 0..segments {
        let start = index as u64 * segment_size;
        let end = if index == segments - 1 {
            file_size - 1
        } else {
            start + segment_size - 1
        };
        let segment = DownloadSegment { start, end, index };
        let url = url.to_string();
        let output_dir = output_dir.to_str().unwrap().to_string();
        segment_futures.push(async move { download_segment(&url, segment, &output_dir).await });
    }

    let results = join_all(segment_futures).await;
    for result in results {
        match result {
            Ok(path) => segment_paths.push(path),
            Err(e) => return Err(e),
        }
    }

    // Merge all parts
    segment_paths.sort();
    let mut write_stream = async_fs::File::create(output_file_path).await?;
    for segment_path in segment_paths {
        let data = async_fs::read(&segment_path).await?;
        write_stream.write_all(&data).await?;
        async_fs::remove_file(segment_path).await?; // Delete segment after merging
    }
    println!("Download complete: {}", output_file_path);

    Ok(())
}
