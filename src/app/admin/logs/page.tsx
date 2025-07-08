"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Participant, LogEntry, SessionEntry } from "@/app/types/logTypes";
import { formatToKoreanTime } from "@/app/utils/format";

export default function LogsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/logs");
        const json = await res.json();

        console.log("🔍 API result:", json);
        if (!res.ok) {
          setError(json.error || "데이터를 불러오는 데 실패했습니다.");
          return;
        }
        setParticipants(json.participants || []);
        setLogs(json.logs || []);
        setSessions(json.sessions || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tableClassNames = useMemo(
    () => ({
      wrapper: ["px-4 table-auto w-full"],
      thead: ["bg-green-200", "text-black", "border-b", "border-divider"],
    }),
    []
  );
  return (
    <div className="flex flex-col gap-6 bg-white text-black">
      <div className="text-2xl font-bold p-6 text-black">실험 로그</div>

      {loading && <div className="p-4">불러오는 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <div className="p-0">
            <div className="text-xl font-semibold px-6 text-black">
              Participants
            </div>
            {participants.length === 0 ? (
              <div>참여자 없음</div>
            ) : (
              <Table classNames={tableClassNames}>
                <TableHeader className="">
                  <TableColumn className="border px-4 py-2">
                    User ID
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Shorts Count
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Modal Duration
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Modal Type
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {participants.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="border px-4 py-2">
                        {p.userId}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {p.shortsCount.join(", ")}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {p.modalDuration.join(", ")}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {p.modalType.join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div>
            <div className="text-xl font-semibold px-6">Logs</div>
            {logs.length === 0 ? (
              <div>로그가 없습니다.</div>
            ) : (
              <Table classNames={tableClassNames}>
                <TableHeader className="">
                  <TableColumn className="border px-4 py-2">
                    User ID
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Intervention Index
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Shorts Watched
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Modality Type
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Modality Duration
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Start Time
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Stop Time
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Duration (Sec)
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.logs_id}>
                      <TableCell className="border px-4 py-2">
                        {log.userId}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {log.interventionIndex}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {log.shortsWatched}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {log.modType}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {log.modDuration}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {formatToKoreanTime(log.startTime)}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {formatToKoreanTime(log.stopTime)}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {log.durationSec}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div>
            <div className="text-xl font-semibold px-6">Sessions</div>
            {sessions.length === 0 ? (
              <div>세션 로그가 없습니다.</div>
            ) : (
              <Table classNames={tableClassNames}>
                <TableHeader className="bg-gray-100">
                  <TableColumn className="border px-4 py-2">
                    User ID
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Action Type
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    App Enter
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    App Exit
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    App Duration (Seconds)
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Shorts Enter
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Shorts Exit
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Shorts Duration (Seconds)
                  </TableColumn>
                  {/* <TableColumn className="border px-4 py-2">
                    Shorts Watched
                  </TableColumn>
                  <TableColumn className="border px-4 py-2">
                    Modal Points
                  </TableColumn> */}
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.session_id}>
                      <TableCell className="border px-4 py-2">
                        {s.userId}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {s.actionType}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {formatToKoreanTime(s.appEnterTime)}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {formatToKoreanTime(s.appExitTime)}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {s.appDurationSec}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {formatToKoreanTime(s.shortsEnterTime)}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {formatToKoreanTime(s.shortsExitTime)}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {s.shortsDurationSec}
                      </TableCell>
                      {/* <TableCell className="border px-4 py-2">
                        {s.shortsWatchedTotal}
                      </TableCell>
                      <TableCell className="border px-4 py-2">
                        {s.modalPoints?.join(", ")}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
