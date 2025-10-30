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
  const [isIOS, setIsIOS] = useState<boolean>(false);

  // Desired vertical positions (as a fraction of height)
  const NAME_TOP_MOBILE = 0.47;   // iOS/mobile position (adjusted for 16:9)
  const NAME_TOP_DESKTOP = 0.46;  // desktop position (adjusted for 16:9)

  // Detect mobile + iOS
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener?.('change', update);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
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

  async function generateViaCanvas(text: string, src: string) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    await (img.decode?.() || new Promise<void>(res => (img.onload = () => res())));

    const width = 800;   // 16:9 aspect ratio
    const height = 450;
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    // draw background
    ctx.drawImage(img, 0, 0, width, height);

    // draw name
    ctx.fillStyle = '#274877';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 50px serif'; // scaled up for larger canvas
    const topFraction = (isMobile ? NAME_TOP_MOBILE : NAME_TOP_DESKTOP);
    ctx.fillText(text || '[NAME HERE]', width / 2, height * topFraction);

    return canvas.toDataURL('image/png');
  }

  const generateCertificate = async () => {
    if (!certRef.current) return;
    try {
      // iOS/mobile path: use Canvas (more reliable)
      if (isIOS || isMobile) {
        const src = templateSrc || '/template.png';
        const dataUrl = await generateViaCanvas(name, src);
        setImageUrl(dataUrl);
        if (onGenerated) onGenerated(name, dataUrl);
        return;
      }

      // Desktop path: html-to-image
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
      <div className="flex flex-col sm:flex-row gap-2 items-center mx-auto w-full max-w-md px-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter student name"
          className="border rounded px-3 py-2 w-full sm:w-[240px] text-base"
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
      <div className="relative w-full max-w-[800px] aspect-[16/9] mx-auto">
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
            <div className={`absolute left-1/2 -translate-x-1/2 w-full ${isMobile ? 'top-[47%]' : 'sm:top-[46%] top-[46%]'}`}>
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
