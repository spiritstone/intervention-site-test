"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModalityType } from "../types/modality";

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [n, setN] = useState("");
  const [m, setM] = useState("");
  const [q, setQ] = useState("");

  const handleSubmit = () => {
    const nArray = n.split(",").map((v) => parseInt(v.trim(), 10));
    const mArray = m.split(",").map((v) => parseInt(v.trim(), 10));
    const qArray = q.split(",").map((v) => v.trim() as ModalityType);

    const validModalities: ModalityType[] = [
      "camera",
      "image",
      "text",
      "voice",
      "empty",
    ];
    const isValidQ = qArray.every((modality) =>
      validModalities.includes(modality)
    );

    if (!username || nArray.some(isNaN) || mArray.some(isNaN) || !isValidQ) {
      alert("입력값을 확인해주세요.");
      return;
    }

    if (nArray.length !== mArray.length || nArray.length !== qArray.length) {
      alert("배열의 길이는 같아야 합니다.");
      return;
    }

    // 추후 Firebase 저장 혹은 localStorage 저장 가능
    localStorage.setItem(
      "experimentConfig",
      JSON.stringify({
        username,
        n: nArray,
        m: mArray,
        q: qArray,
      })
    );

    router.push("/admin/logs");
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>실험 관리자 설정</h1>
      <label>
        이름
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        릴스 개수 (n)
        <input value={n} onChange={(e) => setN(e.target.value)} />
      </label>
      <label>
        모달리티 시간 (m)
        <input value={m} onChange={(e) => setM(e.target.value)} />
      </label>
      <label>
        모달리티 종류 (q)
        <input value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <button onClick={handleSubmit}>시작</button>
    </div>
  );
}
