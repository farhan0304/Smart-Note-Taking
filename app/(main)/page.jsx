import HeroCTAButton from "@/components/ui/HeroCTAButton";

export default function HomePage() {
  return (
    <div className="flex-grow flex mt-20 items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading text-text">
            NoteWise
          </h1>
          <p className="mt-4 text-2xl font-semibold text-primary">
            Take Notes Smarter, Not Harder.
          </p>
          <p className="mt-4 text-lg text-text/70 font-body">
            Effortless note-taking powered by smart organization and real-time syncing — all in one intuitive space.
          </p>
          <HeroCTAButton />
        </div>
        <div className="flex items-center justify-center mb-8 md:mb-0 p-8">
            <div className="w-full max-w-md h-80 bg-surface rounded-xl shadow-2xl p-6 border border-border transform rotate-3">
                <div className="h-4 w-1/2 bg-border/50 rounded-md"></div>
                <div className="h-2 w-full bg-border/50 rounded-md mt-4"></div>
                <div className="h-2 w-full bg-border/50 rounded-md mt-2"></div>
                <div className="h-2 w-3/4 bg-border/50 rounded-md mt-2"></div>
                <div className="absolute bottom-6 right-6 flex space-x-2">
                    <div className="w-16 h-6 bg-primary/20 rounded-full"></div>
                    <div className="w-20 h-6 bg-secondary/20 rounded-full"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}