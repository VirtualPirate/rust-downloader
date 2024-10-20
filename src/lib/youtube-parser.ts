import { DownloadItem, DownloadStatus } from "@/store";
import filenamify from "filenamify";

export type VideoResolutions =
  | "144p"
  | "240p"
  | "360p"
  | "480p"
  | "720p"
  | "1080p"
  | "2k"
  | "4k";
export type AudioResolutions = "medium" | "low";

export const VIDEO_TO_FORMAT_ID: Record<VideoResolutions, string[]> = {
  "144p": ["160"],
  "240p": ["133"],
  "360p": ["134", "18"],
  "480p": ["135"],
  "720p": ["136"],
  "1080p": ["137"],
  "2k": ["271"],
  "4k": ["313"],
};

export const AUDIO_TO_FORMAT_ID = {
  low: ["250"],
  medium: ["251"],
};

export enum MultimediaType {
  Audio = "audio",
  Video = "video",
}

export class YoutubeParser {
  static formatToDownloadItem(
    data: any,
    format: MultimediaType,
    resolution: VideoResolutions & AudioResolutions
  ): DownloadItem {
    let foundFormat: any;
    if (format === MultimediaType.Video) {
      foundFormat = data.formats.find((multimediaFormat: any) => {
        if (!multimediaFormat.format_id) {
          console.log("nofound", multimediaFormat);
        }
        return multimediaFormat.format_id === VIDEO_TO_FORMAT_ID[resolution][0];
      });
    } else if (format === MultimediaType.Audio) {
      foundFormat = data.formats.find(
        (multimediaFormat: any) =>
          multimediaFormat.format_id === AUDIO_TO_FORMAT_ID[resolution]
      );
    } else {
      throw new Error(
        `No Formats Found for Multimedia: ${format} | Resolution: ${resolution}`
      );
    }

    console.log("foundFormat", foundFormat);

    return {
      id: `${data.id}:${foundFormat.format_id}`,
      url: foundFormat.url,
      title: data.title,
      thumbnail: data.thumbnail,
      size: foundFormat.filesize,
      progress: 0,
      speed: 0,
      dirFilename: `./_data/${filenamify(data.title, { replacement: "_" })}.${foundFormat.ext}`,
      status: DownloadStatus.PENDING,
      quality: resolution,
      description: data.description,
    };
  }
}
