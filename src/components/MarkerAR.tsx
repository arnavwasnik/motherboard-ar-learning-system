import { useEffect, useRef } from "react";

export default function MarkerAR() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const start = async () => {
      await loadScript();

      const mindarThree = new (window as any).MINDAR.IMAGE.MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/targets/marker.mind",
      });

      const { renderer, scene, camera } = mindarThree;

      const light = new (window as any).THREE.HemisphereLight(
        0xffffff,
        0xbbbbff,
        1
      );
      scene.add(light);

      const loader = new (window as any).THREE.GLTFLoader();
      const gltf = await loader.loadAsync("/models/motherboard.glb");

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(gltf.scene);

      gltf.scene.scale.set(0.15, 0.15, 0.15);
      gltf.scene.rotation.x = Math.PI / 2;

      await mindarThree.start();

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    start();
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}