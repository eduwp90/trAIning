import Webcam from "react-webcam";
import * as tmPose from "@teachablemachine/pose";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Keypoint } from "@tensorflow-models/posenet";

let model: { getTotalClasses: Function; estimatePose: Function; predict: Function },
  ctx: CanvasRenderingContext2D,
  maxPredictions: number;

let isMounted: boolean;

type WebcamAIProps = {
  incrementRepCount: Function;
  URL: MutableRefObject<string>;
};

const WebcamAI: React.FC<WebcamAIProps> = ({ incrementRepCount, URL }) => {
  let repStatus: string = "Neutral";

  const [size, setSize] = useState<number>(window.innerWidth * 0.9);
  window.onresize = (): void => {
    setSize(window.innerWidth * 0.9);
  };

  const webcamRef = useRef<Webcam>(null);

  async function init(): Promise<void> {
    const modelURL = URL.current + "model.json";
    const metadataURL = URL.current + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    window.requestAnimationFrame(loop);

    const getCanvasElementById = (id: string): HTMLCanvasElement => {
      const canvas = document.getElementById(id);
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(
          `The element of id "${id}" is not a HTMLCanvasElement. Make sure a <canvas id="${id}""> element is present in the document.`
        );
      }
      return canvas;
    };

    const getCanvasRenderingContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
      const context = canvas.getContext("2d");
      if (context === null) {
        throw new Error("This browser does not support 2-dimensional canvas rendering contexts.");
      }
      return context;
    };

    const canvas: HTMLCanvasElement = getCanvasElementById("canvas");

    if (canvas) {
      canvas.width = size;
      canvas.height = size * 0.75;
      ctx = getCanvasRenderingContext2D(canvas)!;
    }
  }

  async function loop(): Promise<void> {
    console.log("Running pose calculations...");
    if (!isMounted) return;
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict(): Promise<void> {
    if (webcamRef.current !== null && webcamRef.current.getCanvas() !== null) {
      const { pose, posenetOutput } = await model.estimatePose(webcamRef.current.getCanvas());
      const prediction = await model.predict(posenetOutput);
      for (let i = maxPredictions - 2; i > maxPredictions - 4; i--) {
        //-> looping from second-to-last to third-to-last -> shape of array: ["neutral", "position", ("position",) "invalid"]
        if (prediction[i].probability.toFixed(2) > 0.92) {
          if (prediction[i].className !== repStatus) {
            repStatus = prediction[i].className;
            incrementRepCount();
          }
        }
      }
      drawPose(pose);
    }
  }

  function drawPose(pose: { keypoints: Keypoint[]; score: number }): void {
    if (webcamRef.current !== null) {
      if (webcamRef.current.getCanvas()) {
        ctx.drawImage(webcamRef.current.getCanvas()!, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
          const minPartConfidence = 0.5;
          tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
          tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
      }
    }
  }

  useEffect(() => {
    isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {webcamRef ? (
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            right: 0,
            left: 0,
            zIndex: 9,
            width: size,
            height: size * 0.75,
            borderRadius: 5
          }}
          onUserMedia={init}
          mirrored={true}
        />
      ) : (
        <div>Teachable Machine Pose Model</div>
      )}

      <canvas
        id="canvas"
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          width: size,
          height: size * 0.75,
          borderRadius: 5
        }}></canvas>
    </>
  );
};

export default WebcamAI;
