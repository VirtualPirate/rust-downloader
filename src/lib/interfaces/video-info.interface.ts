export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  quality: string;
  width: number;
  height: number;
  url: string;
  contentLength: string;
  video_format: string;
  hasAudio: boolean;
}

export interface Audio {
  quality: string;
  url: string;
  contentLength: string;
  audio_format: string;
}

export interface YouTubeVideo {
  title: string;
  description: string;
  videoUrl: string;
  videoId: string;
  videoLength: string;
  viewCount: string;
  category: string;
  publishDate: string;
  channelName: string;
  subscriberCount: number;
  channelUrl: string;
  thumbnails: Thumbnail[];
  videos: Video[];
  audios: Audio[];
  status: string;
}
