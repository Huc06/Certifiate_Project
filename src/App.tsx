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
      <header className="fixed left-0 right-0 top-4 sm:top-6 md:top-10 z-30 flex justify-center select-none pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-4 md:gap-6 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3 md:px-8 md:py-5 shadow-lg w-full max-w-[1100px] mx-4 md:mx-8">
          <div className="font-semibold text-slate-100">Dolphinder</div>
          <nav className="space-x-3 md:space-x-6 text-slate-200 text-sm md:text-base">
            <a href="#" className="font-semibold text-slate-100 hover:text-blue-500 ">Home</a>
            <a href="https://dolphinder.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-100 hover:text-blue-500 ">Docs</a>
          </nav>
        </div>
      </header>

      {/* Hero (Tailwind) */}
      <main className="relative z-10 flex min-h-screen items-center justify-center pt-28 md:pt-40 px-4">
        <div className="flex flex-col items-center gap-3 text-center w-full max-w-3xl">
          <h1 className="m-0 text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl">Congratulations<br/> You are now a real builder!</h1>
          <div className="flex w-full flex-col md:flex-row items-stretch md:items-center gap-3 md:justify-center">
            <Input placeholder="Enter your name" className="w-full md:w-72 bg-black/40 border-white/20 text-slate-100 placeholder:text-white/60" />
            <Button className="w-full md:w-auto">Mint Certificate</Button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
