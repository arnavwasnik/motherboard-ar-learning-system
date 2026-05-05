import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, Smartphone, Hand, Layers, ScanLine, Eye, Video, VideoOff } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import MarkerView from "@/components/MarkerView";
import MarkerlessView from "@/components/MarkerlessView";
import MotherboardViewer from "@/components/MotherboardViewer";


type Mode = "marker" | "markerless" | null;

const ARExperience = () => {
  const [selectedMode, setSelectedMode] = useState<Mode>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [markerlessOpen, setMarkerlessOpen] = useState(false);
  const [cameraBgEnabled, setCameraBgEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const markerlessVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

 const requestCamera = useCallback(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });

    streamRef.current = stream;
    return true;

  } catch (err: any) {
    if (err.name === "NotAllowedError") {
      setError("Camera permission denied. Please allow camera access.");
    } else if (err.name === "NotFoundError") {
      setError("No camera found.");
    } else {
      setError("Camera error. Try again.");
    }
    return false;
  }
}, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Marker-based launch
  const launchMarker = useCallback(async () => {
    setError(null);
   const ok = await requestCamera();
    if (ok) setCameraOpen(true);
  }, [requestCamera]);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  const closeMarker = useCallback(() => {
    stopCamera();
    setCameraOpen(false);
  }, [stopCamera]);

  // Markerless launch
  const launchMarkerless = useCallback(() => {
    setError(null);
    setMarkerlessOpen(true);
  }, []);

  const closeMarkerless = useCallback(() => {
    stopCamera();
    setCameraBgEnabled(false);
    setMarkerlessOpen(false);
  }, [stopCamera]);

  const toggleCameraBg = useCallback(async () => {
    if (cameraBgEnabled) {
      stopCamera();
      setCameraBgEnabled(false);
    } else {
      setError(null);
    const ok = await requestCamera();
      if (ok) setCameraBgEnabled(true);
    }
  }, [cameraBgEnabled, stopCamera, requestCamera]);

  useEffect(() => {
    if (markerlessOpen && cameraBgEnabled && markerlessVideoRef.current && streamRef.current) {
      markerlessVideoRef.current.srcObject = streamRef.current;
    }
  }, [markerlessOpen, cameraBgEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // --- Marker-based fullscreen ---
 if (cameraOpen) {
  return (
    <MarkerView
      videoRef={videoRef}
      stream={streamRef.current}
      onClose={closeMarker}
    />
  );
}

if (markerlessOpen) {
  return (
    <MarkerlessView
      selectedModel={"motherboard"} 
      videoRef={markerlessVideoRef}
      stream={streamRef.current}
      cameraBgEnabled={cameraBgEnabled}
      onClose={closeMarkerless}
      toggleCameraBg={toggleCameraBg}
    />
  );
}
  // --- Selection page ---
  return (
    <Layout>
      <section className="px-5 py-10 md:section-padding min-h-[calc(100vh-var(--nav-height)-4rem)] flex items-center">
        <div className="w-full max-w-md mx-auto">
          <FadeIn>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera size={28} className="text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">AR Experience</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">Choose how you want to explore the motherboard.</p>
            </div>
          </FadeIn>

          {/* Mode cards */}
          <FadeIn delay={0.1}>
            <div className="space-y-3 mb-6">
              {/* Marker-based */}
              <button
                onClick={() => setSelectedMode("marker")}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  selectedMode === "marker"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ScanLine size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base mb-1">Marker-Based AR</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Scan a marker to place the motherboard in real space.</p>
                  </div>
                </div>
              </button>

              {/* Markerless */}
              <button
                onClick={() => setSelectedMode("markerless")}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  selectedMode === "markerless"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Eye size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base mb-1">Markerless AR</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">View the motherboard instantly without a marker.</p>
                  </div>
                </div>
              </button>
            </div>
          </FadeIn>

          {/* Launch button */}
          <FadeIn delay={0.15}>
            <Button
              size="lg"
              className="w-full text-base py-7 rounded-xl"
              disabled={!selectedMode}
              onClick={selectedMode === "marker" ? launchMarker : launchMarkerless}
            >
              <Camera className="mr-2" size={20} />
              {selectedMode === "marker" ? "Launch AR Camera" : selectedMode === "markerless" ? "Launch Markerless AR" : "Select a Mode"}
            </Button>
            {error && <p className="mt-3 text-sm text-destructive text-center">{error}</p>}
          </FadeIn>

          {/* Guidance */}
          <FadeIn delay={0.2}>
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-card/40">
                <ScanLine size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Marker-Based:</span> Use a printed marker to view the motherboard in real-world space.
                </p>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-card/40">
                <Eye size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Markerless:</span> Instantly explore the motherboard. Enable camera background for a real-world feel.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default ARExperience;