import LetterGlitch from "./components/LetterGlitch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <LetterGlitch glitchSpeed={50} centerVignette outerVignette={false} smooth />
      </div>

      {/* Header (Tailwind) */}
      <header className="fixed left-0 right-0 top-10 z-30 flex justify-center select-none pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-6 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-8 py-5 shadow-lg w-[min(92vw,1100px)]">
          <div className="font-semibold text-slate-100">Dolphinder</div>
          <nav className="space-x-6 text-slate-200">
            <a href="#" className="font-semibold text-slate-100 hover:text-blue-500 ">Home</a>
            <a href="https://dolphinder.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-100 hover:text-blue-500 ">Docs</a>
          </nav>
        </div>
      </header>

      {/* Hero (Tailwind) */}
      <main className="relative z-10 flex min-h-screen items-center justify-center pt-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="m-0 text-white font-extrabold leading-tight [font-size:clamp(36px,6vw,72px)]">Congratulations<br/> You are now a real builder!</h1>
          <div className="flex items-center gap-3">
            <Input placeholder="Enter your name" className="w-72 bg-black/40 border-white/20 text-slate-100 placeholder:text-white/60" />
            <Button>Mint Certificate</Button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
