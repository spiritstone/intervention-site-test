"use client";

import { useEffect, useState } from "react";
import { ModalityType } from "../../types/modality";

interface LogEntry {
  logs_id: number;
  logs_userId: string;
  totalShortsCount: number;
  totalDuration: number;
}

interface Participant {
  id: number;
  userId: string;
  shortsCount: number[];
  modalDuration: number[];
  modalType: ModalityType[];
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/logs");
        const result = await res.json();

        if (res.ok) {
          setLogs(result.logs || []);
          setParticipants(result.participants || []);
        } else {
          console.error("Fetch failed:", result);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>실험 로그</div>
      {loading && <p>불러오는 중...</p>}
      {!loading && (
        <>
          <h2>Participants</h2>
          {participants.length === 0 ? (
            <p>참여자 없음</p>
          ) : (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginBottom: 32,
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #aaa", padding: 8 }}>
                    User ID
                  </th>
                  <th style={{ border: "1px solid #aaa", padding: 8 }}>
                    Shorts Count
                  </th>
                  <th style={{ border: "1px solid #aaa", padding: 8 }}>
                    Modal Duration
                  </th>
                  <th style={{ border: "1px solid #aaa", padding: 8 }}>
                    Modal Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td style={{ border: "1px solid #aaa", padding: 8 }}>
                      {p.userId}
                    </td>
                    <td style={{ border: "1px solid #aaa", padding: 8 }}>
                      {p.shortsCount.join(", ")}
                    </td>
                    <td style={{ border: "1px solid #aaa", padding: 8 }}>
                      {p.modalDuration.join(", ")}
                    </td>
                    <td style={{ border: "1px solid #aaa", padding: 8 }}>
                      {p.modalType.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2>Logs</h2>
          {logs.length === 0 ? (
            <p>로그가 없습니다.</p>
          ) : (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>
                    User ID
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>
                    Total Shorts Count
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>
                    Total Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.logs_id}>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {log.logs_userId}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {log.totalShortsCount}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {log.totalDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
