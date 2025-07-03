"use client";
import { useState } from "react";
import { db, storage } from "../../utils/_firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file) {
      alert("이름과 이미지를 모두 입력해주세요.");
      return;
    }

    try {
      setUploading(true);
      console.log("### Uploading:", uploading);
      const imageRef = ref(storage, `selfies/${name}_${Date.now()}.jpg`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("#### upload info", { imageRef, snapshot, downloadURL });
      await setDoc(doc(db, "participants", name), {
        name,
        imageUrl: downloadURL,
        createdAt: new Date().toISOString(),
      });

      alert("업로드 성공!");
      setName("");
      setFile(null);
      console.log("Uploading image to:", imageRef.fullPath);
      console.log("Download URL:", downloadURL);
      console.log("Firestore document path:", `participants/${name}`);
    } catch (error) {
      console.error(error);
      alert("업로드 실패. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="text-xl font-bold">참가자 정보 업로드</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="font-semibold">이름</div>
          <input
            className="border-1 rounded-sm border-black"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="font-semibold">사진 선택:</div>
          <input
            className="border-1 rounded-sm border-black"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="rounded-xl bg-blue-500 text-white p-2"
        >
          {uploading ? "업로드 중..." : "업로드"}
        </button>
      </form>
    </div>
  );
}
