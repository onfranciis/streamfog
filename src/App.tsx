import "./styles/App.scss";
import "@tensorflow/tfjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLogic } from "./utils/logic";
import * as bodyPix from "@tensorflow-models/body-pix";
import { IAvailableWebcam, IColors } from "./types";
import ColorPalette from "./components/ColorPalette";
import CanvasParent from "./components/CanvasParent";
import Top from "./components/Top";
import { webcams } from "./utils/webcams";

function App() {
  const [color, setColor] = useState([255, 255, 255, 0]);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [webcamSources, setWebcamSources] = useState<IAvailableWebcam[]>([]);
  const [selectedWebcamSource, setSelectedWebcamSource] = useState<
    string | null
  >(null);
  const { detectBodySegments } = useLogic();
  const VideoRef = useRef<HTMLVideoElement>(null);
  const CanvasRef = useRef<HTMLCanvasElement>(null);
  const [MediaRecorders, setMediaRecorders] = useState<null | MediaStream>(
    null
  );

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedWebcamSource ? { deviceId: selectedWebcamSource } : true,
        audio: false,
      });

      setMediaRecorders(stream);

      const devices = await navigator.mediaDevices.enumerateDevices();
      setWebcamSources(() => webcams(devices));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    startCamera();
  }, [selectedWebcamSource]);

  useEffect(() => {
    if (VideoRef.current && CanvasRef.current && MediaRecorders) {
      VideoRef.current.srcObject = MediaRecorders;

      bodyPix.load().then((network) => {
        detectBodySegments(network, CanvasRef, VideoRef, MediaRecorders);
      });
    }
  }, [MediaRecorders]);

  const handleClick = async (color: IColors) => {
    setColor(() => color.rgb);
    setImageSrc(null);

    const stream = await navigator.mediaDevices.enumerateDevices();

    console.log(webcams(stream));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e?.target?.files;
      if (file) {
        const src = URL.createObjectURL(file[0]);
        setImageSrc(src);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleWebcamSources = (detail: ChangeEvent<HTMLSelectElement>) => {
    const targetDeviceId = detail.currentTarget.value;
    setSelectedWebcamSource(targetDeviceId);
  };

  return (
    <div className="App">
      <Top />

      <CanvasParent color={color} imageSrc={imageSrc}>
        <canvas ref={CanvasRef}></canvas>
      </CanvasParent>

      <video ref={VideoRef} autoPlay width="640" height="500"></video>

      <div className="inputParent">
        <p>Add your image</p>
        <input type="file" onChange={handleInput} accept="image/*" />
      </div>

      <ColorPalette handleClick={handleClick} />

      <select name="Camera" onChange={handleWebcamSources}>
        {webcamSources.map((webcam) => (
          <option key={webcam.deviceId} value={webcam.deviceId}>
            {webcam.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
