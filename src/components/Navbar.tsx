import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/ar-experience", label: "AR Experience" },
  { to: "/components", label: "Components" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/research", label: "Research" },
  { to: "/team", label: "Team" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-[var(--nav-height)] hidden md:block">
      <div className="container h-full flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-foreground tracking-tight">
          Motherboard<span className="text-gradient"> AR</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                location.pathname === l.to
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
