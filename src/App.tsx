import "./styles/App.scss";
import "@tensorflow/tfjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLogic } from "./utils/logic";
import * as bodyPix from "@tensorflow-models/body-pix";
import { IColors } from "./types";
import ColorPalette from "./components/ColorPalette";
import CanvasParent from "./components/CanvasParent";
import Top from "./components/Top";

function App() {
  const [color, setColor] = useState([255, 255, 255, 0]);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const { detectBodySegments } = useLogic();
  const VideoRef = useRef<HTMLVideoElement>(null);
  const CanvasRef = useRef<HTMLCanvasElement>(null);
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
        console.log(err);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    if (VideoRef.current && CanvasRef.current && MediaRecorders) {
      VideoRef.current.srcObject = MediaRecorders;

      bodyPix.load().then((network) => {
        detectBodySegments(network, CanvasRef, VideoRef, MediaRecorders);
      });
    }
  }, [MediaRecorders]);

  const handleClick = (color: IColors) => {
    setColor(() => color.rgb);
    setImageSrc(null);
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
    </div>
  );
}

export default App;
