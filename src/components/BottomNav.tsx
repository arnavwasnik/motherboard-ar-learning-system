import { Link, useLocation } from "react-router-dom";
import { Home, Camera, Cpu, BookOpen, Users } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/ar-experience", icon: Camera, label: "AR" },
  { to: "/components", icon: Cpu, label: "Parts" },
  { to: "/research", icon: BookOpen, label: "Research" },
  { to: "/team", icon: Users, label: "Team" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/90 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
