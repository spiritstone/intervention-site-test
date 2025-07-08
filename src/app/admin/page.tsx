"use client";
import { useState } from "react";
import { ModalityType } from "../types/modality";

export default function AdminPage() {
  const [userId, setUserId] = useState("");
  const [shortsCount, setShortsCount] = useState("");
  const [modalDuration, setModalDuration] = useState("");
  const [modalType, setModalType] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nArray = shortsCount.split(",").map((v) => parseInt(v.trim(), 10));
    const mArray = modalDuration.split(",").map((v) => parseInt(v.trim(), 10));
    const qArray = modalType.split(",").map((v) => v.trim() as ModalityType);

    const validModalities: ModalityType[] = [
      "camera",
      "image",
      "text",
      "voice",
      "blank",
    ];
    const isValidQ = qArray.every((modality) =>
      validModalities.includes(modality)
    );

    if (!userId || nArray.some(isNaN) || mArray.some(isNaN) || !isValidQ) {
      alert("입력값을 확인해주세요.");
      return;
    }

    if (nArray.length !== mArray.length || nArray.length !== qArray.length) {
      alert("배열의 길이는 같아야 합니다.");
      return;
    }
    try {
      setUploading(true);
      console.log("### Uploading:", uploading);
      // supabase 업로드
      await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          shortsCount: nArray,
          modalDuration: mArray,
          modalType: qArray,
        }),
      });
      // 업로드 내용 콘솔
      console.log(
        "사용자 설정 업로드 (이름, 릴스 개수, 모달리티 시간, 모달리티 종류):",
        { userId, nArray, mArray, qArray }
      );
    } catch (error) {
      console.error(error);
      alert("업로드 실패. 다시 시도해주세요.\n" + error);
    } finally {
      // 업로드 후 상태 초기화
      setUserId("");
      setShortsCount("");
      setModalDuration("");
      setModalType("");
      // 로딩 해제
      setUploading(false);
    }

    // 추후 Firebase 저장 혹은 localStorage 저장 가능
    localStorage.setItem(
      "experimentConfig",
      JSON.stringify({
        userId: userId,
        shortsCount: nArray,
        modalDuration: mArray,
        modalType: qArray,
      })
    );

    // router.push("/admin/logs");
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-white text-black">
      <div className="text-xl font-bold">관리자 설정: 참가자 정보 업로드</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="font-semibold">
            사용자 ID (알파벳 한 자리 + 숫자 세 자리)
          </div>
          <input
            className="border-1 rounded-sm border-black"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">
            {" "}
            릴스 개수 (shortsCount) (입력 예: 1, 2, 3, 4, 5)
          </div>
          <input
            className="border-1 rounded-sm border-black"
            // type="text"
            value={shortsCount}
            onChange={(e) => setShortsCount(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">
            {" "}
            모달리티 시간 (modalDuration) (입력 예: 1, 2, 3, 4, 5)
          </div>
          <input
            className="border-1 rounded-sm border-black"
            // type="text"
            value={modalDuration}
            onChange={(e) => setModalDuration(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">
            모달리티 종류 (modalType) (입력 예: camera, image, text, voice,
            blank)
          </div>
          <input
            className="border-1 rounded-sm border-black"
            // type="text"
            value={modalType}
            onChange={(e) => setModalType(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-xl bg-blue-500 text-white p-2"
        >
          {uploading ? "업로드 중..." : "업로드"}
        </button>{" "}
      </form>
    </div>
  );
}
