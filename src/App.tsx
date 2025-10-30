import LetterGlitch from "./components/LetterGlitch";
import { Button } from "@/components/ui/button";
import { MyConnectButton } from "@/components/ui/MyConnectButton";
import { useEffect, useState } from "react";
import { useCertificateMint } from "@/services/CertificateServices";
import CertificateGenerator from "@/components/CertificateGenerator";
import TextType from "@/components/TextType";
import { uploadImageToPinata } from "@/services/pinata";
import { toast } from "sonner";
import { ExternalLink, CheckCircle2, Loader2 } from "lucide-react";

function App() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const { mintCertificate } = useCertificateMint();
  const [minting, setMinting] = useState(false); // Local loading state
  const [minted, setMinted] = useState(false);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  async function handleImageGenerated(_name: string, url: string) {
    setImageUrl(url);
    setIpfsUrl(null);

    if (isMobile) {
      // Mobile: do not auto-upload; user will click Upload next
      toast.success("Image ready. Upload to IPFS to continue.");
      return;
    }

    // Desktop: auto-upload
    const toastId = toast.loading("Uploading to IPFS...");
    try {
      const { ipfsUrl } = await uploadImageToPinata(url, `${_name}.png`);
      setIpfsUrl(ipfsUrl);
      toast.success("Successfully uploaded to IPFS!", { id: toastId });
    } catch (e) {
      setIpfsUrl(null);
      toast.error("Failed to upload to Pinata! Please check your .env.local file.", { id: toastId });
      console.error("Pinata upload error:", e);
    }
  }

  async function handleManualUpload() {
    if (!imageUrl || !name) return;
    setUploading(true);
    const toastId = toast.loading("Uploading to IPFS...");
    try {
      const { ipfsUrl } = await uploadImageToPinata(imageUrl, `${name}.png`);
      setIpfsUrl(ipfsUrl);
      toast.success("Successfully uploaded to IPFS!", { id: toastId });
    } catch (e) {
      setIpfsUrl(null);
      toast.error("Failed to upload to Pinata! Please check your .env.local file.", { id: toastId });
      console.error("Pinata upload error:", e);
    } finally {
      setUploading(false);
    }
  }

  async function handleMint() {
    if (!ipfsUrl) {
      toast.error("IPFS URL not available! Please upload to IPFS first.");
      return;
    }
    try {
      setMinting(true);
      setMinted(false);
      setTxDigest(null);
      const toastId = toast.loading("Minting certificate on-chain...");
      
      const result = await mintCertificate(name, ipfsUrl);
      
      // Wait for transaction confirmation
      if (result && result.digest) {
        setMinted(true);
        setTxDigest(result.digest);
        console.log("Mint success!", result);
        toast.success("Certificate minted successfully! 🎉", {
          id: toastId,
          description: "View your NFT on SuiScan",
          action: {
            label: "View",
            onClick: () => window.open(`https://suiscan.xyz/testnet/tx/${result.digest}`, '_blank')
          }
        });
      }
    } catch (e) {
      setMinted(false);
      setTxDigest(null);
      console.error("Mint error", e);
      toast.error("Mint failed: " + (e as Error).message);
    } finally {
      setMinting(false);
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
          onGenerated={handleImageGenerated}
        />
        {imageUrl && (
          <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-[480px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                asChild
                variant="outline"
                className="bg-green-600 text-white flex-1"
              >
                <a
                  href={imageUrl}
                  download={`${name.replace(/\s+/g, "_") || "certificate"}-gdu2025.png`}
                >
                  Download PNG
                </a>
              </Button>
              {isMobile && !ipfsUrl && (
                <Button
                  onClick={handleManualUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {uploading ? "Uploading..." : "Upload to IPFS"}
                </Button>
              )}
              {!isMobile && (
                <Button
                  onClick={handleMint}
                  disabled={!name || !imageUrl || minting || !ipfsUrl}
                  className="flex-1"
                >
                  {minting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {minting ? "Minting..." : minted ? "Minted!" : "Mint Certificate"}
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {ipfsUrl && (
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View on IPFS
                  </a>
                </Button>
              )}
              {txDigest && (
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  <a href={`https://suiscan.xyz/testnet/tx/${txDigest}`} target="_blank" rel="noopener noreferrer">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    View on SuiScan
                  </a>
                </Button>
              )}
            </div>
            {isMobile && (
              <div className="flex w-full">
                <Button
                  onClick={handleMint}
                  disabled={!name || !imageUrl || minting || !ipfsUrl}
                  className="w-full"
                >
                  {minting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {minting ? "Minting..." : minted ? "Minted!" : "Mint Certificate"}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
