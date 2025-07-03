"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/_firebase"; // Firebase 초기화된 객체
import { ModalityType } from "../../types/modality";

interface LogEntry {
  id: string;
  name: string;
  stoppedAt: string;
  startTime: string;
  endTime: string;
  duration: string;
  n: number[];
  m: number[];
  q: ModalityType[];
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const snapshot = await getDocs(collection(db, "logs"));
      const entries: LogEntry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LogEntry[];
      setLogs(entries);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <h1>실험 로그</h1>
      {loading && <p>불러오는 중...</p>}
      {!loading && logs.length === 0 && <p>로그가 없습니다.</p>}
      {logs.map((log) => (
        <div
          key={log.id}
          style={{ border: "1px solid #ccc", padding: 12, marginBottom: 16 }}
        >
          <strong>이름:</strong> {log.name} <br />
          <strong>시작:</strong> {log.startTime} <br />
          <strong>중단:</strong> {log.endTime} <br />
          <strong>총 시간:</strong> {log.duration} <br />
          <strong>n:</strong> [{log.n.join(", ")}] <br />
          <strong>m:</strong> [{log.m.join(", ")}] <br />
          <strong>q:</strong> [{log.q.join(", ")}] <br />
        </div>
      ))}
    </main>
  );
}
