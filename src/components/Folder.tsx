import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface FolderProps {
  color: string;
  label: string;
  to: string;
}

export default function Folder({ color, label, to }: FolderProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        to={to}
        className="flex flex-col items-center gap-3 group cursor-none"
      >
        <div className="relative w-24 h-20 md:w-32 md:h-28 flex flex-col pt-2">
          {/* Folder Tab */}
          <div 
            className="w-10 h-3 md:w-14 md:h-4 ml-2 rounded-t-lg bg-white/40 backdrop-blur-md shadow-sm border-t border-x border-white/30"
            style={{ backgroundColor: `${color}44` }} // Semi-transparent tab
          />
          {/* Folder Body (Glassy) */}
          <div 
            className="flex-1 rounded-xl rounded-tl-none relative overflow-hidden backdrop-blur-xl border border-white/40 shadow-xl"
            style={{ 
              backgroundColor: `${color}66`, // More transparent
            }}
          >
            {/* Liquid highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
            
            {/* Folder Content Line (Visual hint) */}
            <div className="mt-4 mx-3 h-0.5 bg-black/5 rounded-full" />
            <div className="mt-2 mx-3 h-0.5 w-1/2 bg-black/5 rounded-full" />
          </div>
        </div>
        <span className="text-[13px] md:text-sm font-semibold text-[#1A1A1A]/70 tracking-tight group-hover:text-black transition-colors px-2 py-0.5 rounded-lg group-hover:bg-white/50 font-mono">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}
