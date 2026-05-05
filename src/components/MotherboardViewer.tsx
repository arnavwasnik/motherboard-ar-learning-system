import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


/* ✅ FIX TYPESCRIPT ERRORS */
declare global {
  interface Window {
    toggleCPU: () => void;
    toggleRAM: () => void;
    toggleM2: () => void;
    toggleCap: () => void;
    toggleChip: () => void;
    togglePins: () => void;
    toggleIO: () => void;
    toggleHeatsink: () => void;
    toggleBattery: () => void;
  }
}

export default function MotherboardViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<any>({});
  const partInfo: any = {
  CPU: `The CPU (Central Processing Unit) is the brain of the motherboard.
It performs calculations and executes instructions from programs.
Modern CPUs contain billions of transistors inside a tiny chip.
It communicates with RAM, storage, and other components.
The CPU socket holds the processor securely in place.
Thermal paste and cooling are essential for proper functioning.
High performance CPUs improve system speed and multitasking.
Clock speed determines how fast instructions are processed.
Multi-core CPUs allow parallel processing.
Cache memory inside CPU improves efficiency.
Without CPU, the system cannot function.
It controls almost every operation in a computer.
Used in gaming, servers, and embedded systems.
Consumes significant power compared to other parts.
Requires motherboard compatibility.
Connected via chipset and bus systems.
Works with BIOS for boot operations.
Supports instructions like arithmetic and logic.
Modern CPUs include integrated graphics.
Critical component in system performance.`,

  RAM: `RAM (Random Access Memory) stores temporary data for quick access.
It is volatile memory, meaning data is lost when power is off.
Used to run applications and operating systems.
More RAM allows smoother multitasking.
Located near CPU for faster communication.
DDR variants improve speed and efficiency.
Measured in GB (Gigabytes).
Helps reduce system lag.
Works closely with CPU cache.
Essential for gaming and heavy software.
Faster RAM improves performance.
Used in all modern computers.
Supports temporary program storage.
Important for system responsiveness.
RAM slots allow upgrades.
Dual channel improves speed.
Consumes less power compared to CPU.
Short-term memory of system.
Crucial for performance optimization.
Without RAM system will crash.`,

  M2: `M.2 SSD is a high-speed storage device.
It is faster than traditional HDD and SATA SSD.
Uses NVMe interface for high bandwidth.
Installed directly on motherboard.
No cables required.
Compact and efficient design.
Used for OS and applications.
Provides fast boot time.
Improves loading speeds.
Supports modern computing needs.
Consumes less power.
Different sizes available.
Used in laptops and desktops.
Highly reliable storage.
Improves gaming performance.
Supports PCIe lanes.
Faster than older storage tech.
Key component for speed.
Reduces latency significantly.
Future of storage systems.`,

  CAP: `Capacitors store electrical energy.
They stabilize voltage on motherboard.
Prevent sudden power fluctuations.
Protect components from damage.
Used in power circuits.
Help maintain consistent current flow.
Essential for system stability.
Small cylindrical components.
Used in almost all electronics.
Improve performance reliability.
Reduce noise in circuits.
Support power delivery.
Different types available.
Critical for motherboard lifespan.
Handle voltage spikes.
Support CPU and RAM power.
Improve overall system health.
Tiny but very important.
Used in power filtering.
Without them system becomes unstable.`,

  CHIP: `Chipset controls communication between components.
Acts as traffic controller of motherboard.
Manages data flow between CPU, RAM, and devices.
Important for system compatibility.
Defines motherboard features.
Handles USB, storage, and PCIe.
Essential for hardware coordination.
Determines system capabilities.
Works with BIOS and firmware.
Improves system efficiency.
Modern chipsets are highly advanced.
Used in all computers.
Supports expansion devices.
Critical for motherboard function.
Optimizes performance pathways.
Handles input/output operations.
Enables connectivity.
Supports system architecture.
Important for hardware integration.
Core part of motherboard design.`,

  PIN: `Pins and connectors allow hardware connections.
Used for power and data transfer.
Include headers for cables and devices.
Essential for component linking.
Located across motherboard.
Support USB, fans, and more.
Provide physical connectivity.
Used for expansion cards.
Important for system assembly.
Allow modular upgrades.
Carry electrical signals.
Designed for precision.
Critical for communication.
Support external devices.
Ensure proper connections.
Used in all electronics.
Help in circuit completion.
Tiny but essential parts.
Support motherboard functionality.
Enable hardware integration.`,

  IO: `I/O Ports allow external device connection.
Include USB, HDMI, audio ports.
Used for peripherals like keyboard and mouse.
Provide communication interface.
Located on motherboard rear panel.
Support data transfer.
Essential for user interaction.
Allow display output.
Support audio systems.
Used for networking devices.
Enable external connectivity.
Handle input and output signals.
Standardized interfaces.
Critical for usability.
Allow device expansion.
Used in daily computing.
Support various protocols.
Important for system accessibility.
Enhance system functionality.
Bridge internal and external components.`,

  HEATSINK: `Heatsink removes heat from components.
Prevents overheating of CPU and SSD.
Made of metal like aluminum.
Works with airflow for cooling.
Essential for performance stability.
Reduces thermal throttling.
Improves component lifespan.
Used in gaming and high-performance PCs.
Maintains optimal temperature.
Passive cooling solution.
Works with fans sometimes.
Critical for SSD and VRM cooling.
Ensures system safety.
Improves efficiency.
Protects hardware.
Used in modern motherboards.
Supports thermal management.
Important for reliability.
Prevents hardware damage.
Key cooling component.`,

  BATTERY: `CMOS Battery powers motherboard memory.
Maintains BIOS settings.
Keeps system clock running.
Small circular battery.
Used when system is off.
Ensures boot settings are saved.
Critical for system startup.
Lasts several years.
Easy to replace.
Supports firmware memory.
Prevents reset of settings.
Used in all PCs.
Maintains configuration.
Tiny but important.
Supports motherboard functionality.
Used in embedded systems.
Essential for BIOS.
Stores system preferences.
Important for system stability.
Basic but critical component.`,
};

  const [selectedPart, setSelectedPart] = useState<string | null>(null);
const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = null;
    /* ✅ HDR ENVIRONMENT (REALISTIC LIGHTING) */
new RGBELoader()
  .setPath("/hdr/") // your folder
  .load("studio.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    // optional: if you want background also
    // scene.background = texture;
  });

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 10, 5);
    scene.add(light);

    const loader = new GLTFLoader();

    let cpu: any, m2: any;
    let ramParts: any[] = [];
    let capacitors: any[] = [];
    let chips: any[] = [];
    let pins: any[] = [];
    let ioPorts: any[] = [];
    let m2HeatsinkParts: any[] = [];
    let battery: any;

    loader.load("/models/motherboard.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.scale.set(5, 5, 5);

      /* ✅ AUTO CAMERA FIT (FIX ZOOM FOR ALL DEVICES) */
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      model.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);

      let distance = maxDim / (2 * Math.tan(fov / 2));
      distance *= 1.3;

      camera.position.set(0, 0, distance);
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.minDistance = distance * 0.6;
      controls.maxDistance = distance * 3;
      controls.update();

      cpu = model.getObjectByName("CPU");
      m2 = model.getObjectByName("M2");

      model.traverse((child: any) => {
        const name = child.name.toLowerCase();

        if (name.includes("ram")) ramParts.push(child);
        if (name.includes("capacitor")) capacitors.push(child);
        if (name.includes("chip")) chips.push(child);
        if (name.includes("pins")) pins.push(child);

        if (
          name.includes("usb") ||
          name.includes("audio") ||
          name.includes("port")
        ) {
          ioPorts.push(child);
        }

        if (
          name.includes("pcube304") ||
          name.includes("pcube305") ||
          name.includes("pcube315")
        ) {
          m2HeatsinkParts.push(child);
        }

        if (name.includes("battery")) {
          battery = child;
        }
      });

      [
        cpu,
        m2,
        battery,
        ...ramParts,
        ...capacitors,
        ...chips,
        ...pins,
        ...ioPorts,
        ...m2HeatsinkParts,
      ].forEach((p) => {
        if (p) p.visible = false;
      });

      /* ✅ YOUR ORIGINAL TOGGLES (UNCHANGED) */
      window.toggleCPU = () => {
        cpu.visible = !cpu.visible;
        showInfo("CPU");
      };

      window.toggleRAM = () => {
        const state = !ramParts[0]?.visible;
        ramParts.forEach((r) => (r.visible = state));
        showInfo("RAM");
      };

      window.toggleM2 = () => {
        m2.visible = !m2.visible;
        showInfo("M2");
      };

      window.toggleCap = () => {
        const state = !capacitors[0]?.visible;
        capacitors.forEach((c) => (c.visible = state));
        showInfo("CAP");
      };

      window.toggleChip = () => {
        const state = !chips[0]?.visible;
        chips.forEach((c) => (c.visible = state));
        showInfo("CHIP");
      };

      window.togglePins = () => {
        const state = !pins[0]?.visible;
        pins.forEach((p) => (p.visible = state));
        showInfo("PIN");
      };

      window.toggleIO = () => {
        const state = !ioPorts[0]?.visible;
        ioPorts.forEach((p) => (p.visible = state));
        showInfo("IO");
      };

      window.toggleHeatsink = () => {
        const state = !m2HeatsinkParts[0]?.visible;
        m2HeatsinkParts.forEach((p) => (p.visible = state));
        showInfo("HEATSINK");
      };

      window.toggleBattery = () => {
        if (!battery) return;
        battery.visible = !battery.visible;
        showInfo("BATTERY");
      };
    });

    function showInfo(part: string) {
  setSelectedPart(part);
  setShowPopup(false);
}

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  //adding new info popup state and function
  

  const buttons = [
    ["CPU", "toggleCPU"],
    ["RAM", "toggleRAM"],
    ["SSD", "toggleM2"],
    ["Cap", "toggleCap"],
    ["Chip", "toggleChip"],
    ["Pins", "togglePins"],
    ["Ports", "toggleIO"],
    ["Heat", "toggleHeatsink"],
    ["Battery", "toggleBattery"],
  ];

  return (
    <div className="relative w-full h-full">

      {/* INFO PANEL */}
      {/* MOBILE TOP INFO BAR */}
    {selectedPart && (
      <div className="
  absolute top-14 left-1/2 -translate-x-1/2
  bg-black/50 backdrop-blur-md
  text-white px-4 py-2 rounded-full
  flex items-center gap-2
  text-sm
  sm:hidden
  z-50
  pointer-events-auto
">
        <span>{selectedPart}</span>

        <button
          onClick={() => setShowPopup(true)}
          className="text-white/80 text-lg"
        >
          ⓘ
        </button>
      </div>
    )}

    {/* POPUP */}
    {showPopup && (
      <div
        onClick={() => setShowPopup(false)}
        className="
          fixed inset-0
          bg-black/60
          flex items-center justify-center
          z-50
        "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            bg-black/90 text-white
            p-5 rounded-2xl
            w-[90%] max-w-sm
          "
        >
          <h2 className="text-lg font-semibold mb-2">{selectedPart}</h2>
          <p className="text-sm text-white/80 whitespace-pre-line">
  {partInfo[selectedPart] || "No data available"}
</p>
        </div>
      </div>
    )}

{/* DESKTOP INFO PANEL */}
{selectedPart && (
  <div className="
    hidden sm:block
    absolute top-6 right-6
    w-[320px]
    max-h-[70vh]
    overflow-y-auto
    bg-black/60 backdrop-blur-xl
    text-white
    p-5 rounded-2xl
    z-50
  ">
    <h2 className="text-lg font-semibold mb-3">
      {selectedPart}
    </h2>

    <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
      {partInfo[selectedPart] || "No data available"}
    </p>
  </div>
)}

      {/* BUTTON BAR FIXED */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-50 pointer-events-auto">
       <div className="
  flex gap-2 px-3 py-2
  rounded-full
  bg-black/50 backdrop-blur-xl border border-white/10
  overflow-x-auto
  whitespace-nowrap
  max-w-[95vw]
  scrollbar-hide
">
          {buttons.map(([label, fn], i) => (
            <button
              key={i}
              onClick={() => {
                window[fn] && window[fn]();
                setActive((prev: any) => ({
                  ...prev,
                  [fn]: !prev[fn],
                }));
              }}
              style={{ touchAction: "manipulation" }}
              className={`px-4 py-3 rounded-full text-sm transition ${
                active[fn]
                  ? "bg-white text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CANVAS */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full touch-none"
      />
    </div>
  );
}