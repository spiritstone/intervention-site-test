import SimpleText from "@/components/SimpleText";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const CameraFeed = dynamic(() => import("@/components/CameraFeed"), {
  ssr: false,
});

export default function IntervenePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // URL에서 ?name=다미 가져오기

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>당신은 지금 어떤 모습인가요?</h1>
      <p>이 화면을 통해 스스로를 되돌아보는 시간을 가져보세요.</p>

      {name && (
        <p style={{ fontSize: "1.5rem", marginTop: "1.5rem" }}>
          <strong>{name}</strong> 님, 안녕하세요.
        </p>
      )}

      <div style={{ marginTop: "2rem" }}>
        <SimpleText />
      </div>
    </main>
  );
}
