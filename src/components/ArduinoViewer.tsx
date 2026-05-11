import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

declare global {
  interface Window {
    togglePart: (label: string) => void;
  }
}

export default function ArduinoViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<any>({});
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = null;

    /* 🔥 HDR LIGHT */
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    const loader = new GLTFLoader();
    const parts: any = {};

    loader.load("/models/arduino_uno_board.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.scale.set(5, 5, 5);

      /* CAMERA FIT */
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

      /* 🔥 MATERIAL FIX (SMART) */
      model.traverse((child: any) => {
        if (child.isMesh) {
          const mat = child.material;

          // If texture exists → FIX color space
          if (mat && mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.needsUpdate = true;
          }

          // If material broken → fallback
          if (!mat || !mat.map) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x4a90e2, // Arduino blue
              roughness: 0.7,
              metalness: 0.2,
            });
          }
        }
      });

      /* 🔥 PART DETECTION */
      model.traverse((child: any) => {
        if (!child.isMesh) return;

        const name = child.name;

        if (
          name.toLowerCase().includes("floor") ||
          name.toLowerCase().includes("plane")
        ) {
          child.visible = false;
        }

        let label: string | null = null;

        if (name.startsWith("Arduino009")) label = "Digital Pins";
        if (name.startsWith("Arduino010")) label = "Microcontroller";
        if (name.startsWith("Arduino005")) label = "Power Jack";
        if (name.startsWith("Arduino003")) label = "Reset Button";
        if (name.startsWith("Arduino001") || name.startsWith("Arduino002"))
          label = "ICSP Pins";
        if (name.startsWith("Arduino008")) label = "USB Port";

        if (label) {
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
  "Digital Pins": {
    name: "Digital Pins (D0–D13)",
    desc: `These are the digital input and output pins of the Arduino Uno.
They are used to communicate with external electronic devices.
Can send HIGH (5V) or LOW (0V) signals.
Used for LEDs, buttons, sensors, and relays.
Essential for hardware interaction.
Supports PWM on specific pins.
Connected directly to the microcontroller.
Used in robotics and automation systems.
Can function as input or output.
Supports digitalRead and digitalWrite functions.
One of the most important Arduino features.
Used in beginner and advanced projects.
Allows external component control.
Works with breadboards easily.
Used in IoT applications.
Supports real-world electronics projects.
Critical for embedded systems.
Provides GPIO functionality.
Makes Arduino highly flexible.
Core interface of the board.`,
  },

  Microcontroller: {
    name: "ATmega328P Microcontroller",
    desc: `The ATmega328P is the main processor of Arduino Uno.
Acts as the brain of the board.
Executes uploaded programs called sketches.
Based on AVR architecture.
Runs at 16 MHz clock speed.
Handles all input and output operations.
Contains flash memory and SRAM.
Processes sensor data and controls devices.
Supports serial communication.
Used in embedded systems worldwide.
Efficient and reliable processor.
Can be programmed using Arduino IDE.
Critical for board operation.
Supports interrupts and timers.
Manages digital and analog signals.
Used in automation and robotics.
Popular in education and prototyping.
Low power microcontroller.
Compact but powerful chip.
Essential component of Arduino Uno.`,
  },

  "Power Jack": {
    name: "DC Barrel Jack",
    desc: `This connector provides external power to the Arduino.
Supports wall adapters and battery packs.
Recommended input is 7V to 12V.
Connected to onboard voltage regulator.
Allows standalone operation without USB.
Important for robotics projects.
Provides stable power supply.
Common cylindrical connector design.
Used in embedded electronics.
Helps power motors and sensors.
Ensures proper board operation.
Supports portable systems.
Used in real-world deployments.
Simple but important feature.
Protects against unstable voltage.
Works with adapters easily.
Critical for power management.
Standard Arduino power interface.
Reliable and widely used connector.
Essential for external powering.`,
  },

  "Reset Button": {
    name: "Reset Button",
    desc: `The reset button restarts the Arduino program.
Immediately resets the microcontroller.
Used during debugging and testing.
Restarts code from the beginning.
Helpful while uploading sketches.
Allows quick software restart.
No need to disconnect power.
Common feature in embedded systems.
Used frequently by developers.
Connected directly to processor reset pin.
Important during troubleshooting.
Ensures clean restart process.
Simple but essential component.
Improves development workflow.
Can fix temporary software issues.
Useful in experiments and prototyping.
Found on nearly all Arduino boards.
Supports rapid testing cycles.
Easy manual control feature.
Important for system recovery.`,
  },

  "ICSP Pins": {
    name: "ICSP Header (In-Circuit Serial Programming)",
    desc: `These pins are used for low-level programming.
Allow direct programming of the microcontroller.
Used for bootloader installation.
Supports SPI communication protocol.
Includes MOSI, MISO, and SCK pins.
Important for advanced electronics users.
Used with external programmers.
Provides hardware-level chip access.
Useful in firmware development.
Supports debugging operations.
Essential for embedded programming.
Can reprogram blank chips.
Found on many Arduino boards.
Critical for production environments.
Supports direct firmware flashing.
Advanced but powerful feature.
Used in professional development.
Enhances board flexibility.
Important for electronics engineers.
Provides complete chip-level control.`,
  },

  "USB Port": {
    name: "USB Type-B Connector",
    desc: `This port connects Arduino Uno to a computer.
Used to upload code from Arduino IDE.
Also supplies power to the board.
Supports serial communication.
Common printer-style USB connector.
Plug-and-play functionality.
Essential during development.
Allows debugging through serial monitor.
Used for communication with PC.
Important for beginners and professionals.
Supports firmware uploads.
Provides stable power source.
Widely recognized connector type.
Reliable and easy to use.
Used in almost every Arduino project.
Enables testing and programming.
Simple but essential interface.
Critical for development workflow.
Used in embedded learning systems.
Main communication port of Arduino.`,
  },
};

  const buttons = Object.keys(partInfo);

  return (
    <div className="relative w-full h-full">

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
       {selectedPart}
          <button onClick={() => setShowPopup(true)}>ⓘ</button>
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
        <div className="flex gap-2 px-3 py-2 bg-black/50 backdrop-blur-xl overflow-x-auto">
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
              className={`px-3 py-2 rounded-full text-xs ${
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

      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}