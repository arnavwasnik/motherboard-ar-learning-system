import { Camera, ScanSearch, Box, Hand, GraduationCap } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";

const steps = [
  { icon: Camera, title: "Camera Input", desc: "Open the AR camera on your phone." },
  { icon: ScanSearch, title: "Marker Detection", desc: "System detects the printed marker." },
  { icon: Box, title: "3D Rendering", desc: "A 3D motherboard appears on the marker." },
  { icon: Hand, title: "Interaction", desc: "Tap components to explore details." },
  { icon: GraduationCap, title: "Learn", desc: "Get real-time explanations and guidance." },
];

const HowItWorks = () => (
  <Layout>
    <section className="px-5 py-10 md:section-padding">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-primary text-xs font-medium tracking-wider uppercase mb-3">How It Works</p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-8">
            The AR Workflow
          </h1>
        </FadeIn>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.08}>
              <div className="glass rounded-xl p-5 flex items-center gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <step.icon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default HowItWorks;
