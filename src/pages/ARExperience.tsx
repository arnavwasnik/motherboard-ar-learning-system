import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, Smartphone, Hand, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";

const instructions = [
  { icon: Smartphone, text: "Point camera at motherboard marker" },
  { icon: Hand, text: "Tap components to learn about them" },
  { icon: Layers, text: "Assemble motherboard step-by-step" },
];

const ARExperience = () => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Unable to access camera. Please try again.");
      }
    }
  }, []);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  if (cameraOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        {/* Camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,12px)] pb-3 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={stopCamera}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>
          <span className="text-white/90 text-sm font-medium tracking-wide">AR Mode</span>
          <div className="w-10" />
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-[env(safe-area-inset-bottom,24px)] pt-6 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white/80 text-sm text-center">
            Point your camera at the motherboard marker
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <section className="px-6 py-12 md:section-padding min-h-[calc(100vh-var(--nav-height)-4rem)] flex items-center">
        <div className="w-full max-w-md mx-auto text-center">
          <FadeIn>
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Camera size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3">
              AR Experience
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
              Scan a motherboard marker to start learning interactively.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Button
              size="lg"
              className="w-full text-base py-7 rounded-xl"
              onClick={startCamera}
            >
              <Camera className="mr-2" size={20} /> Launch AR Camera
            </Button>
            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10 space-y-3">
              {instructions.map((inst, i) => (
                <div key={i} className="flex items-center gap-4 text-left px-4 py-3 rounded-xl bg-card/40">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <inst.icon size={18} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{inst.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default ARExperience;
