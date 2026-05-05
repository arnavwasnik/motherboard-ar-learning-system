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
      desc: "Main processor responsible for all computations."
    },
    USB: {
      name: "USB Ethernet Controller LAN9514",
      desc: "Controls USB ports and network interface."
    },
    Ports: {
      name: "External IO & Ethernet Ports",
      desc: "Includes USB, HDMI, and Ethernet connectivity."
    },
    GPIO: {
      name: "GPIO Header 40 Pin",
      desc: "Used for connecting external hardware like sensors."
    },
    Audio: {
      name: "Audio Jack 3.5mm",
      desc: "Provides audio output."
    },
    Power: {
      name: "Power Management Components",
      desc: "Regulates voltage and power flow."
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

      {showPopup && selectedPart && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/60 flex items-end justify-center pb-20 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black/90 text-white p-5 rounded-2xl w-[90%] max-w-sm"
          >
            <h2 className="text-lg font-semibold mb-2">
              {partInfo[selectedPart].name}
            </h2>
            <p className="text-sm text-white/80">
              {partInfo[selectedPart].desc}
            </p>
          </div>
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