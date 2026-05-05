import { Link } from "react-router-dom";
import { ArrowRight, Eye, Cpu, Puzzle, Gamepad2 } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Eye, title: "Interactive AR", desc: "Explore motherboard components through your camera." },
  { icon: Cpu, title: "3D Visualization", desc: "See accurate models of real hardware." },
  { icon: Puzzle, title: "Component ID", desc: "Tap any part to learn what it does." },
  { icon: Gamepad2, title: "Guided Assembly", desc: "Build a motherboard step-by-step." },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="px-6 py-16 md:section-padding flex items-center min-h-[calc(100vh-var(--nav-height)-4rem)]">
      <div className="w-full max-w-2xl mx-auto md:mx-0">
        <FadeIn>
          <p className="text-primary text-xs font-medium tracking-wider uppercase mb-3">Engineering Project</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
            Learn Motherboard Architecture with{" "}
            <span className="text-gradient">Augmented Reality</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">
            An immersive AR system that makes hardware education interactive and accessible — right from your phone.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="text-base py-6 rounded-xl">
              <Link to="/ar-experience">
                Launch AR <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base py-6 rounded-xl">
              <Link to="/components">Explore Components</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>

    {/* Features */}
    <section className="px-6 py-12 md:section-padding">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-6">Key Features</h2>
        </FadeIn>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div className="glass rounded-xl p-5 text-center md:text-left">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto md:mx-0 mb-3">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* Problem / Solution */}
    <section className="px-6 py-12 md:section-padding">
      <div className="container-narrow">
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          <FadeIn>
            <div className="glass rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-2">The Problem</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Traditional hardware education relies on static diagrams and expensive equipment — making it hard to truly understand motherboard architecture.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="glass rounded-xl p-6 border-primary/20">
              <h3 className="text-base font-bold text-gradient mb-2">Our Solution</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Scan a marker to visualize a 3D motherboard, interact with components, and assemble hardware virtually — anytime, anywhere.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
