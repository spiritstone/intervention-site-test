"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModalityType } from "../types/modality";

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [shortsCount, setShortsCount] = useState("");
  const [modalDuration, setM] = useState("");
  const [modalType, setModalType] = useState("");

  const handleSubmit = () => {
    const nArray = shortsCount.split(",").map((v) => parseInt(v.trim(), 10));
    const mArray = modalDuration.split(",").map((v) => parseInt(v.trim(), 10));
    const qArray = modalType.split(",").map((v) => v.trim() as ModalityType);

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
        shortsCount: nArray,
        modalDuration: mArray,
        modalType: qArray,
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
        릴스 개수 (shortsCount)
        <input
          value={shortsCount}
          onChange={(e) => setShortsCount(e.target.value)}
        />
      </label>
      <label>
        모달리티 시간 (modalDuration)
        <input value={modalDuration} onChange={(e) => setM(e.target.value)} />
      </label>
      <label>
        모달리티 종류 (modalType)
        <input
          value={modalType}
          onChange={(e) => setModalType(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}>시작</button>
    </div>
  );
}
