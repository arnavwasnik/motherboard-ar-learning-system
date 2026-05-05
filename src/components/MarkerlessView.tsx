import { X, Video, VideoOff } from "lucide-react";
import { useEffect } from "react";
import MotherboardViewer from "@/components/MotherboardViewer";
import RaspberryViewer from "./RaspberryViewer";
import ArduinoViewer from "./ArduinoViewer";

type Props = {
      selectedModel: string | null; // ✅ ADD THIS
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  cameraBgEnabled: boolean;
  onClose: () => void;
  toggleCameraBg: () => void;
};

const MarkerlessView = ({
      selectedModel,
  videoRef,
  stream,
  cameraBgEnabled,
  onClose,
  toggleCameraBg,
}: Props) => {

  useEffect(() => {
    if (videoRef.current && stream && cameraBgEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraBgEnabled]);

  return (
    <div className="fixed inset-0 z-[100] bg-[hsl(222,47%,8%)]">

      {/* Camera background */}
      {cameraBgEnabled && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-3 pb-3 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white">
          <X size={20} />
        </button>
        <span className="text-white text-sm">Markerless AR</span>
        <div className="w-10" />
      </div>

      {/* Viewer */}
      <div className="absolute inset-0 z-[5]">
       {selectedModel === "raspberry" && <RaspberryViewer />}
{selectedModel === "arduino" && <ArduinoViewer />}
{selectedModel === "motherboard" && <MotherboardViewer />}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 pt-4 bg-gradient-to-t from-black/60 to-transparent">
        
        <button
          onClick={toggleCameraBg}
          className="mx-auto flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white"
        >
          {cameraBgEnabled ? <VideoOff size={18} /> : <Video size={18} />}
          {cameraBgEnabled ? "Disable Camera" : "Enable Camera"}
        </button>

      </div>
    </div>
  );
};

export default MarkerlessView;