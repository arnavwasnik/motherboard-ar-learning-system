import { useState } from "react";
import { Cpu, MemoryStick, CircuitBoard, Zap, Battery, Microchip } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const components = [
  { icon: Cpu, name: "CPU Socket", short: "Houses the processor — the brain of the computer.", detail: "The CPU socket provides mechanical and electrical connections between the processor and motherboard. Common types include LGA, PGA, and BGA, each designed for specific processor families." },
  { icon: MemoryStick, name: "RAM Slot", short: "Holds memory modules for fast data access.", detail: "RAM slots (DIMM slots) hold the system's memory modules. Modern motherboards typically have 2–4 DDR4 or DDR5 slots, supporting dual-channel or quad-channel configurations." },
  { icon: CircuitBoard, name: "PCIe Slot", short: "Expansion slot for GPUs, SSDs, and cards.", detail: "PCIe slots provide high-speed serial connections for expansion cards. x16 slots are used for graphics cards, while x1 and x4 slots serve network adapters, sound cards, and NVMe SSDs." },
  { icon: Zap, name: "Capacitor", short: "Stores and regulates electrical energy.", detail: "Capacitors filter and stabilize power supply to components. Solid-state capacitors offer improved reliability, ensuring consistent power delivery to the CPU and memory." },
  { icon: Battery, name: "CMOS Battery", short: "Powers the BIOS clock and settings.", detail: "The CMOS battery (CR2032) powers the chip that stores BIOS settings and real-time clock when the system is off. Replacing it resets BIOS to defaults." },
  { icon: Microchip, name: "Chipset", short: "Manages data flow between components.", detail: "The chipset acts as the communication hub between processor, memory, storage, and expansion devices. It manages USB, SATA, audio, and networking interfaces." },
];

const ComponentsPage = () => {
  const [selected, setSelected] = useState<typeof components[0] | null>(null);

  return (
    <Layout>
      <section className="px-5 py-10 md:section-padding">
        <div className="container-narrow">
          <FadeIn>
            <p className="text-primary text-xs font-medium tracking-wider uppercase mb-3">Components</p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-2">
              Motherboard Parts
            </h1>
            <p className="text-muted-foreground text-sm mb-8 max-w-md">
              Tap any component to learn more about it.
            </p>
          </FadeIn>

          <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
            {components.map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.05}>
                <button
                  onClick={() => setSelected(c)}
                  className="w-full text-left glass rounded-xl p-5 hover:border-primary/30 transition-all flex items-center gap-4 md:flex-col md:items-start md:p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <c.icon size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">{c.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.short}</p>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="mx-4 sm:mx-auto sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              {selected && <selected.icon size={28} className="text-primary" />}
            </div>
            <DialogTitle className="text-foreground text-lg">
              {selected?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground leading-relaxed pt-2 text-sm">
              {selected?.detail}
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            className="w-full mt-2 py-5 rounded-xl"
            onClick={() => setSelected(null)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ComponentsPage;
