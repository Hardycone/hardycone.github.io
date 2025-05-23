type TopBarProps = {
  setViewMode: React.Dispatch<React.SetStateAction<"home" | "case-study">>;
};

export default function TopBar({ setViewMode }: TopBarProps) {
  return (
    <div className="fixed z-50 w-full flex justify-between items-center mb-8 bg-white">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => setViewMode("home")}
      >
        ← Logo
      </div>
      <div className="flex gap-4">
        <a href="#" className="text-sm text-gray-600 hover:underline">
          LinkedIn
        </a>
        <a href="#" className="text-sm text-gray-600 hover:underline">
          GitHub
        </a>
      </div>
    </div>
  );
}
