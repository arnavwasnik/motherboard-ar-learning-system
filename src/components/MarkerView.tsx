import { X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  onClose: () => void;
};

const MarkerView = ({ videoRef, stream, onClose }: Props) => {

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-3 pb-3 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white">
          <X size={20} />
        </button>
        <span className="text-white text-sm">Marker AR</span>
        <div className="w-10" />
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 pt-6 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white text-sm text-center">
          Point your camera at the marker
        </p>
      </div>
    </div>
  );
};

export default MarkerView;