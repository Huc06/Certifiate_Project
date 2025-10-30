import { toPng } from "html-to-image";
import { useRef, useState } from "react";

interface CertificateGeneratorProps {
  name: string;
  setName: (v: string) => void;
  onGenerated?: (name: string, url: string) => void;
}

export default function CertificateGenerator({ name, setName, onGenerated }: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateCertificate = async () => {
    if (!certRef.current) return;
    const dataUrl = await toPng(certRef.current, { pixelRatio: 2 });
    setImageUrl(dataUrl);
    if (onGenerated) onGenerated(name, dataUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-row gap-2 items-center mx-auto">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter student name"
          className="border rounded p-2 w-[240px] text-base"
          maxLength={32}
        />
        <button
          onClick={generateCertificate}
          disabled={!name}
          className="bg-blue-600 text-white rounded px-5 py-2 font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
        >
          Generate
        </button>
      </div>
      
      {/* Nếu chưa generate, hiện template live; nếu đã generate, hiện ảnh PNG */}
      {!imageUrl ? (
        <div
          ref={certRef}
          id="certificate"
          className="relative w-[480px] h-[350px] rounded-lg overflow-hidden shadow select-none mx-auto"
          style={{
            fontFamily: "serif",
            backgroundImage: "url('/template.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Chỉ điền tên sinh viên vào đúng vị trí */}
          <div 
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "140px" }}
          >
            <h1 className="text-3xl font-bold text-[#274877] italic text-center whitespace-nowrap">
              {name || "[NAME HERE]"}
            </h1>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <img
            src={imageUrl}
            alt="Generated Certificate"
            className="border rounded-xl shadow w-[480px] h-[350px] object-cover mx-auto"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
