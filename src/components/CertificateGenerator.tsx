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
  const [templateLoaded, setTemplateLoaded] = useState(false);

  const generateCertificate = async () => {
    if (!certRef.current) return;
    const dataUrl = await toPng(certRef.current, { pixelRatio: 2 });
    setImageUrl(dataUrl);
    if (onGenerated) onGenerated(name, dataUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center mx-auto w-full max-w-md">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter student name"
          className="border rounded p-2 w-full sm:w-[240px] text-base"
          maxLength={32}
        />
        <button
          onClick={generateCertificate}
          disabled={!name || !templateLoaded}
          className="bg-blue-600 text-white rounded px-5 py-2 font-semibold shadow hover:bg-blue-700 disabled:opacity-60 w-full sm:w-auto whitespace-nowrap"
        >
          Generate
        </button>
      </div>
      <div className="relative w-full max-w-[480px] aspect-[480/350] mx-auto">
        {!imageUrl ? (
          <div ref={certRef} className="relative w-full h-full select-none rounded-lg overflow-hidden shadow">
            <img
              src="/template.png"
              alt="template"
              className="w-full h-full object-cover"
              onLoad={() => setTemplateLoaded(true)}
              draggable={false}
            />
            <div className="absolute left-1/2 -translate-x-1/2 top-[38%] sm:top-[40%] w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#274877] italic text-center whitespace-nowrap px-2">
                {name || "[NAME HERE]"}
              </h1>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Generated Certificate"
            className="w-full h-full rounded-xl shadow object-cover"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}
