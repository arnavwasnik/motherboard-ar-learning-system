import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"; // ✅ ADDED

declare global {
  interface Window {
    togglePart: (label: string) => void;
  }
}

export default function RaspberryViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<any>({});
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = null;

    // ✅ HDR ENVIRONMENT (ONLY ADDITION)
    new RGBELoader().load("/hdr/studio.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const loader = new GLTFLoader();
    const parts: any = {};

    loader.load("/models/raspberry_pi.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.scale.set(5, 5, 5);

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let distance = maxDim / (2 * Math.tan(fov / 2));
      distance *= 1.3;

      camera.position.set(0, 0, distance);
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.update();

      const partMap: any = {
        Object_16: "Processor",
        Object_15: "USB",
        Object_7: "Ports",
        Object_5: "Ports",
        Object_12: "GPIO",
        Object_6: "Audio",
        Object_14: "Power",
      };

      model.traverse((child: any) => {
        if (child.isMesh && partMap[child.name]) {
          const label = partMap[child.name];

          if (!parts[label]) parts[label] = [];
          parts[label].push(child);
        }
      });

      Object.values(parts).forEach((group: any) => {
        group.forEach((p: any) => (p.visible = false));
      });

      function togglePart(label: string) {
        const group = parts[label];
        if (!group) return;

        const state = !group[0]?.visible;
        group.forEach((p: any) => (p.visible = state));

        showInfo(label);
      }

      window.togglePart = togglePart;
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

    window.addEventListener("resize", () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

 const partInfo: any = {
  Processor: {
    name: "Broadcom BCM2837 SoC",
    desc: `The Broadcom BCM2837 is the main processor of the Raspberry Pi.
It is a System on Chip (SoC).
Contains CPU, GPU, and memory controller in one chip.
Acts as the brain of the Raspberry Pi board.
Processes instructions and executes programs.
Based on ARM architecture.
Designed for low power consumption.
Supports multitasking and Linux operating systems.
Handles all major computations.
Used in embedded systems and IoT projects.
Provides graphics processing capability.
Essential for running applications.
Controls connected peripherals.
Communicates with RAM and storage.
Supports programming and automation projects.
Common in educational electronics.
Used in robotics and smart devices.
Efficient and compact processing unit.
Important for overall system performance.
Core component of Raspberry Pi.`,
  },

  USB: {
    name: "LAN9514 USB Ethernet Controller",
    desc: `The LAN9514 chip manages USB and Ethernet functionality.
Acts as both USB hub and Ethernet controller.
Allows multiple USB devices to connect.
Provides network communication support.
Important for internet connectivity.
Handles data transfer between devices.
Integrated controller solution.
Supports Raspberry Pi communication features.
Used for external peripherals.
Improves connectivity options.
Efficient network management chip.
Handles USB traffic routing.
Supports high-speed data transfer.
Essential for networking projects.
Used in IoT and automation systems.
Allows keyboard and mouse connection.
Provides Ethernet port functionality.
Small but powerful controller chip.
Enhances board usability.
Critical for external communication.`,
  },

  Ports: {
    name: "External I/O Ports & RJ45 Ethernet",
    desc: `These ports allow external device connectivity.
Includes USB, HDMI, Ethernet, and other interfaces.
RJ45 Ethernet port enables wired internet connection.
USB ports connect peripherals like keyboard and mouse.
HDMI port provides video output.
Important for external communication.
Used in daily Raspberry Pi operation.
Supports networking and media projects.
Allows data transfer with external devices.
Essential for usability.
Provides flexible connectivity options.
Used in embedded and IoT systems.
Supports external displays and accessories.
Handles input and output operations.
Critical for hardware interaction.
Commonly used in electronics projects.
Provides real-world interface support.
Makes Raspberry Pi more versatile.
Important for system accessibility.
Bridge between board and external hardware.`,
  },

  GPIO: {
    name: "40-Pin GPIO Header",
    desc: `GPIO stands for General Purpose Input Output.
Used for connecting sensors and external modules.
Allows Raspberry Pi to interact with electronics.
Supports digital input and output signals.
Essential for robotics and automation.
Can control LEDs, motors, and relays.
Popular in DIY electronics projects.
Supports communication protocols like I2C and SPI.
Flexible hardware interface system.
Important for embedded development.
Allows hardware programming.
Used widely in IoT applications.
Enables real-world interaction.
Critical educational feature of Raspberry Pi.
Supports custom electronics integration.
Provides direct hardware access.
Useful for prototyping systems.
Works with breadboards and modules.
One of the most powerful Raspberry Pi features.
Essential for maker projects.`,
  },

  Audio: {
    name: "3.5mm Audio & Composite Jack",
    desc: `This connector provides audio output functionality.
Supports headphones and speakers.
Also supports composite video output.
Used in multimedia projects.
Allows analog audio connection.
Important for media center applications.
Compact and simple interface.
Supports educational electronics systems.
Useful in entertainment projects.
Provides sound output from Raspberry Pi.
Can connect to external audio devices.
Used in retro gaming systems.
Supports video output for older displays.
Enhances multimedia capabilities.
Simple but important feature.
Works with external speakers.
Used in smart home projects.
Provides combined audio/video interface.
Common connector standard.
Useful for learning electronics.`,
  },

  Power: {
    name: "Power Management Capacitors",
    desc: `These capacitors regulate and stabilize power flow.
Protect Raspberry Pi from voltage fluctuations.
Store small amounts of electrical energy.
Essential for stable operation.
Help maintain smooth current delivery.
Used in power filtering circuits.
Improve reliability of the board.
Prevent sudden electrical spikes.
Important for component safety.
Used in all modern electronics.
Support processor power requirements.
Enhance electrical stability.
Tiny but very important components.
Reduce noise in power lines.
Help improve lifespan of hardware.
Maintain proper voltage levels.
Critical for efficient performance.
Used throughout the Raspberry Pi board.
Essential for safe electronics operation.
Important for system health.`,
  },
};
  const buttons = ["Processor", "USB", "Ports", "GPIO", "Audio", "Power"];

  return (
    <div className="relative w-full h-full">

      {selectedPart && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm z-50 pointer-events-auto">
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
{showPopup && selectedPart && (
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
        max-h-[80vh]
        overflow-y-auto
      "
    >
      <h2 className="text-lg font-semibold mb-3">
        {partInfo[selectedPart].name}
      </h2>

      <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
        {partInfo[selectedPart].desc}
      </p>
    </div>
  </div>
)}

{/* DESKTOP INFO PANEL */}
{selectedPart && (
  <div
    className="
      hidden sm:block
      absolute top-6 right-6
      w-[320px]
      max-h-[70vh]
      overflow-y-auto
      bg-black/60 backdrop-blur-xl
      text-white
      p-5 rounded-2xl
      z-50
    "
  >
    <h2 className="text-lg font-semibold mb-3">
      {partInfo[selectedPart].name}
    </h2>

    <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
      {partInfo[selectedPart].desc}
    </p>
  </div>
)}

      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-50">
        <div className="flex gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-xl overflow-x-auto whitespace-nowrap max-w-[95vw]">
          {buttons.map((label, i) => (
            <button
              key={i}
              onClick={() => {
                window.togglePart(label);
                setActive((prev: any) => ({
                  ...prev,
                  [label]: !prev[label],
                }));
              }}
              className={`px-3 py-2 text-xs rounded-full ${
                active[label]
                  ? "bg-white text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={mountRef} className="absolute inset-0 w-full h-full touch-none" />
    </div>
  );
}