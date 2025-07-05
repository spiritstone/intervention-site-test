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
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">실험 로그</h1>

      {loading && <p>불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">Participants</h2>
            {participants.length === 0 ? (
              <p>참여자 없음</p>
            ) : (
              <table className="table-auto w-full border border-gray-300 mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">User ID</th>
                    <th className="border px-4 py-2">Shorts Count</th>
                    <th className="border px-4 py-2">Modal Duration</th>
                    <th className="border px-4 py-2">Modal Type</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id}>
                      <td className="border px-4 py-2">{p.userId}</td>
                      <td className="border px-4 py-2">
                        {p.shortsCount.join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        {p.modalDuration.join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        {p.modalType.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Logs</h2>
            {logs.length === 0 ? (
              <p>로그가 없습니다.</p>
            ) : (
              <table className="table-auto w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">User ID</th>
                    <th className="border px-4 py-2">Total Shorts Count</th>
                    <th className="border px-4 py-2">Total Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.logs_id}>
                      <td className="border px-4 py-2">{log.logs_userId}</td>
                      <td className="border px-4 py-2">
                        {log.totalShortsCount}
                      </td>
                      <td className="border px-4 py-2">{log.totalDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
