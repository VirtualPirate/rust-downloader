import { create } from "zustand";

export enum BinaryState {
  Absent = "absent",
  InProgress = "in_progress",
  Available = "available",
}

export interface ExternalBinaryState {
  ffmpeg: BinaryState;
  ytdlp: BinaryState;
}

export const useExternalBinaryStore = create<ExternalBinaryState>(() => ({
  ffmpeg: BinaryState.Absent,
  ytdlp: BinaryState.Absent,
}));
