import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Model({ controls }: any) {
  const { scene } = useGLTF("/models/motherboard.glb");
  const ref = useRef<THREE.Group>(null);
 const { camera } = useThree() as { camera: THREE.PerspectiveCamera };

const fov = camera.fov * (Math.PI / 180);
  useEffect(() => {
    if (!ref.current || !controls.current) return;

    const box = new THREE.Box3().setFromObject(ref.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // CENTER MODEL
    ref.current.position.sub(center);

    // AUTO FIT CAMERA
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let distance = maxDim / (2 * Math.tan(fov / 2));

    distance *= 1.5; // padding

    camera.position.set(0, 0, distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    // 🔥 SYNC CONTROLS (MOST IMPORTANT)
    controls.current.target.set(0, 0, 0);
    controls.current.minDistance = distance * 0.6;
    controls.current.maxDistance = distance * 3;
    controls.current.update();

  }, [scene, camera, controls]);

  return <primitive ref={ref} object={scene} />;
}

export default function MotherboardModel() {
  const controls = useRef<any>();

  return (
    <Canvas>
      {/* LIGHT */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <Model controls={controls} />

      <OrbitControls
        ref={controls}
        enableZoom
        enablePan={false}

        enableDamping
        dampingFactor={0.08}

        rotateSpeed={0.6}
        zoomSpeed={1}

        // REMOVE STATIC DISTANCES (handled dynamically)
      />
    </Canvas>
  );
}