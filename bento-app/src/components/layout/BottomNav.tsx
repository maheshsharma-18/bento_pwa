import { useLocation, Link } from "react-router-dom";
import { House, Search, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    {
      label: "Início",
      path: "/home", // <--- CHANGED: Was "/" before, now "/home"
      icon: House
    },
    {
      label: "Buscar",
      path: "/search",
      icon: Search
    },
    {
      label: "Programação",
      path: "/schedule",
      icon: Calendar
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-6 z-50 rounded-t-2xl shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="flex flex-col items-center gap-1 min-w-[64px]"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "text-primary" : "text-gray-400"
              )}>
                {/* Icon size matches design */}
                <item.icon 
                    className={cn("w-6 h-6", isActive && "fill-current")} 
                    strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-wide",
                isActive ? "text-primary" : "text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  );
}
