import * as bodyPix from "@tensorflow-models/body-pix";
import { RefObject, useState } from "react";

const tempCanvas = document.createElement("canvas");
const tempCanvasCtx = tempCanvas.getContext("2d", {
  willReadFrequently: true,
})!;

export const useLogic = () => {
  const [previousSegmentationComplete, setPreviousSegmentationComplete] =
    useState(true);

  const processSegmentation = (
    segmentation: bodyPix.SemanticPersonSegmentation,
    ctx: CanvasRenderingContext2D
  ) => {
    try {
      const imgData = tempCanvasCtx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      //Loop through the pixels in the image
      for (let i = 0; i < imgData.data.length; i += 4) {
        const pixelIndex = i / 4;
        //Make the pixel transparent if it does not belong to a person using the body-pix
        //model's output data array. This removes all pixels corresponding to the
        //background.
        if (segmentation.data[pixelIndex] == 0) {
          imgData.data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (err) {
      console.log(err);
    }
  };

  const detectBodySegments = async (
    network: bodyPix.BodyPix,
    CanvasRef: RefObject<HTMLCanvasElement>,
    VideoRef: RefObject<HTMLVideoElement>,
    Webcam: MediaStream
  ) => {
    try {
      const track = Webcam.getTracks()[0];

      if (CanvasRef.current && VideoRef.current && Webcam) {
        const ctx = CanvasRef.current.getContext("2d", {
          willReadFrequently: true,
        });
        const { width, height } = track.getSettings();
        const video = VideoRef.current;
        const videoWidth = width ?? 10;
        const videoHeight = height ?? 10;

        CanvasRef.current.width = videoWidth;
        CanvasRef.current.height = videoHeight;
        tempCanvasCtx.canvas.width = videoWidth;
        tempCanvasCtx.canvas.height = videoHeight;

        const update = async () => {
          if (previousSegmentationComplete) {
            setPreviousSegmentationComplete(() => false);

            tempCanvasCtx.drawImage(video, 0, 0);
            const body = await network.segmentPerson(tempCanvas, {
              internalResolution: "high", // The resolution for internal processing (options: 'low', 'medium', 'high')
              segmentationThreshold: 0.7, // Segmentation confidence threshold (0.0 - 1.0)
              maxDetections: 10, // Maximum number of detections to return
              scoreThreshold: 0.8, // Confidence score threshold for detections (0.0 - 1.0)
              nmsRadius: 20, // Non-Maximum Suppression (NMS) radius for de-duplication
            });

            if (ctx) {
              processSegmentation(body, ctx);
              setPreviousSegmentationComplete(() => true);
              requestAnimationFrame(update);
            }
          }
        };

        update();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { detectBodySegments };
};
