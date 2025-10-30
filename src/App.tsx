import LetterGlitch from "./components/LetterGlitch";
import { Button } from "@/components/ui/button";
import { MyConnectButton } from "@/components/ui/MyConnectButton";
import { useState } from "react";
import { useCertificateMint } from "@/services/CertificateServices";
import CertificateGenerator from "@/components/CertificateGenerator";
import TextType from "@/components/TextType";

function App() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { mintCertificate, isPending, isError, error } = useCertificateMint();
  const [minted, setMinted] = useState(false);

  async function handleMint() {
    try {
      setMinted(false);
      const result = await mintCertificate(name);
      setMinted(true);
      console.log("Mint success!", result);
    } catch (e) {
      setMinted(false);
      console.error("Mint error", e);
    }
  }

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <LetterGlitch glitchSpeed={50} centerVignette outerVignette={false} smooth />
      </div>
      {/* Header (Tailwind) */}
      <header className="fixed left-0 right-0 top-4 sm:top-6 md:top-10 z-30 flex justify-center select-none pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-4 md:gap-6 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3 md:px-8 md:py-5 shadow-lg w-full max-w-[1100px] mx-4 md:mx-8">
          <div className="font-semibold text-slate-100">Dolphinder</div>
          <nav className="flex items-center space-x-3 md:space-x-6 text-slate-200 text-sm md:text-base">
            <a href="#" className="font-semibold text-slate-100 hover:text-blue-500 ">Home</a>
            <a href="https://dolphinder.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-100 hover:text-blue-500 ">Docs</a>
            <MyConnectButton />
          </nav>
        </div>
      </header>

      {/* Hero with CertificateGenerator */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-28 md:pt-40 px-4">
        <TextType
          text={["Congratulations", "You are now a real builder!"]}
          as="h1"
          className="m-0 mb-4 text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl text-center"
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
        <CertificateGenerator
          name={name}
          setName={setName}
          onGenerated={(_name, url) => { setImageUrl(url); }}
        />
        {imageUrl && (
          <div className="flex flex-row gap-3 mt-3">
            <a
              href={imageUrl}
              download={`${name.replace(/\s+/g, "_") || "certificate"}-gdu2025.png`}
              className="bg-green-600 text-white px-5 py-2 font-semibold rounded shadow hover:bg-green-700 transition"
            >
              Download PNG
            </a>
            <Button
              onClick={handleMint}
              disabled={!name || !imageUrl || isPending}
            >
              {isPending ? "Minting..." : minted ? "Minted!" : "Mint Certificate"}
            </Button>
          </div>
        )}
        {isError && error && (
          <div className="text-red-400 text-xs pt-2">{(error as Error).message}</div>
        )}
      </main>
    </>
  );
}

export default App;
