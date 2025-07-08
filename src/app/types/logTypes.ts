import { ModalityType } from "./modality";

export interface LogEntry {
  logs_id: number;
  userId: string;
  interventionIndex: number | null;
  shortsWatched: number | null;
  modType: string | null;
  modDuration: number | null;
  startTime: string | null;
  stopTime: string | null;
  durationSec: number | null;
}

export interface Participant {
  id: number;
  userId: string;
  shortsCount: number[];
  modalDuration: number[];
  modalType: ModalityType[];
}

export interface SessionEntry {
  session_id: number;
  userId: string | null;
  actionType: string | null;
  appEnterTime: string | null;
  appExitTime: string | null;
  appDurationSec: number | null;
  shortsEnterTime: string | null;
  shortsExitTime: string | null;
  shortsDurationSec: number | null;
  shortsWatchedTotal: number | null;
  modalPoints: number[] | null;
}
