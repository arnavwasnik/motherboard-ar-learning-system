import { ReactNode } from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-[var(--nav-height)] pb-16 md:pb-0">{children}</main>
    <div className="hidden md:block">
      <Footer />
    </div>
    <BottomNav />
  </div>
);

export default Layout;
