import { Github } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12 px-5">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">
            Motherboard<span className="text-gradient"> AR</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An AR-based interactive learning system for engineering labs, enabling students to explore motherboard architecture through augmented reality.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/ar-experience" className="hover:text-foreground transition-colors">AR Experience</a></li>
            <li><a href="/components" className="hover:text-foreground transition-colors">Components</a></li>
            <li><a href="/research" className="hover:text-foreground transition-colors">Research</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Project</h4>
          <p className="text-sm text-muted-foreground mb-3">Department of Computer Engineering</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={16} /> GitHub Repository
          </a>
        </div>
      </div>
     
<div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground space-y-3">

  <p>© {new Date().getFullYear()} Motherboard AR</p>

  <p className="text-muted-foreground/80">
    Developed by Final Year Engineering Students
  </p>

  {/* Team Inline Structured */}
  <div className="max-w-xl mx-auto text-[11px] sm:text-xs leading-relaxed text-muted-foreground/90">
    <p>
      <span className="text-foreground font-medium">Arnav Wasnik</span> — Lead, Frontend & AR &nbsp;|&nbsp;
      <span className="text-foreground font-medium">Aniket Thaokar</span> — AR Dev
    </p>
    <p>
      <span className="text-foreground font-medium">Bhushan Kawale</span> — AR Dev &nbsp;|&nbsp;
      <span className="text-foreground font-medium">Aditya Jamunpane</span> — Testing & Docs
    </p>
    <p>
      <span className="text-foreground font-medium">Aditya Meshram</span> — Testing & Support
    </p>
  </div>

  {/* Department */}
  <p className="text-muted-foreground/60">
    Department of Artificial Intelligence · G H Raisoni College of Engineering and Management, Nagpur
  </p>

</div>
    </div>
  </footer>
);

export default Footer;
