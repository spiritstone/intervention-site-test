"use client";
import { useState } from "react";
import { db, storage } from "../../utils/firebase";
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
      const imageRef = ref(storage, `selfies/${name}_${Date.now()}.jpg`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

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
    <main style={{ padding: 32 }}>
      <h1>참가자 정보 업로드</h1>
      <form onSubmit={handleSubmit}>
        <label>
          이름: <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <label>
          사진 선택: <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </label>
        <br />
        <br />
        <button type="submit" disabled={uploading}>
          {uploading ? "업로드 중..." : "업로드"}
        </button>
      </form>
    </main>
  );
}
