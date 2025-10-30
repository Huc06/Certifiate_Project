import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";

interface CertificateGeneratorProps {
  name: string;
  setName: (v: string) => void;
  onGenerated?: (name: string, url: string) => void;
}

export default function CertificateGenerator({ name, setName, onGenerated }: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [templateSrc, setTemplateSrc] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile via viewport width
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  // Preload template as data URL (mobile only) to avoid CORS/decoding issues on iOS
  useEffect(() => {
    if (!isMobile) return; // desktop không cần dataURL
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/template.png', { cache: 'no-store' });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!cancelled) setTemplateSrc(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error('Failed to preload template.png', e);
      }
    })();
    return () => { cancelled = true; };
  }, [isMobile]);

  const generateCertificate = async () => {
    if (!certRef.current) return;
    try {
      if (imgRef.current && (imgRef.current as any).decode) {
        try { await (imgRef.current as any).decode(); } catch { /* ignore */ }
      }
      const options = (isMobile
        ? { pixelRatio: 2, cacheBust: true }
        : { pixelRatio: 2 }
      );
      const dataUrl = await toPng(certRef.current, options);
      setImageUrl(dataUrl);
      if (onGenerated) onGenerated(name, dataUrl);
    } catch (e) {
      console.error('Generate certificate failed', e);
    }
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
          disabled={!name || !templateLoaded || (isMobile && !templateSrc)}
          className="bg-blue-600 text-white rounded px-5 py-2 font-semibold shadow hover:bg-blue-700 disabled:opacity-60 w-full sm:w-auto whitespace-nowrap"
        >
          Generate
        </button>
      </div>
      <div className="relative w-full max-w-[480px] aspect-[480/350] mx-auto">
        {!imageUrl ? (
          <div ref={certRef} className="relative w-full h-full select-none rounded-lg overflow-hidden shadow">
            <img
              ref={imgRef}
              src={isMobile && templateSrc ? templateSrc : "/template.png"}
              alt="template"
              className="w-full h-full object-cover"
              onLoad={() => setTemplateLoaded(true)}
              crossOrigin="anonymous"
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
