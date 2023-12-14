import { useEffect, useRef, useState } from "react";
import "./App.scss";

function App() {
  const VideoRef = useRef<HTMLVideoElement>(null);
  const [MediaRecorders, setMediaRecorders] = useState<null | MediaStream>(
    null
  );

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        setMediaRecorders(stream);
      } catch (err) {
        //
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    if (VideoRef.current) {
      VideoRef.current.srcObject = MediaRecorders;
    }
  }, [MediaRecorders]);

  return (
    <div className="App">
      <video ref={VideoRef} autoPlay></video>
    </div>
  );
}

export default App;
