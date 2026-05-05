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
    "Digital Pins": { name: "Digital Pins", desc: "Input/output pins." },
    Microcontroller: { name: "ATmega328P", desc: "Main processor." },
    "Power Jack": { name: "DC Barrel Jack", desc: "Power input." },
    "Reset Button": { name: "Reset Button", desc: "Restart board." },
    "ICSP Pins": { name: "ICSP Header", desc: "Programming pins." },
    "USB Port": { name: "USB Type-B", desc: "Upload code." },
  };

  const buttons = Object.keys(partInfo);

  return (
    <div className="relative w-full h-full">

      {selectedPart && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full z-50 flex gap-2">
          {selectedPart}
          <button onClick={() => setShowPopup(true)}>ⓘ</button>
        </div>
      )}

      {showPopup && selectedPart && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/60 flex items-end justify-center pb-20 z-50"
        >
          <div className="bg-black/90 text-white p-5 rounded-2xl w-[90%] max-w-sm">
            <h2>{partInfo[selectedPart].name}</h2>
            <p>{partInfo[selectedPart].desc}</p>
          </div>
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