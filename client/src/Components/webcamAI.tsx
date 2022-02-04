import Webcam from "react-webcam";
import * as tmPose from "@teachablemachine/pose";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Keypoint } from "@tensorflow-models/posenet";
import "./components.less";
import WebcamOverlay from "./webcamOverlay";

let model: { getTotalClasses: Function; estimatePose: Function; predict: Function },
  ctx: CanvasRenderingContext2D,
  maxPredictions: number;

let isMounted: boolean;

type WebcamAIProps = {
  incrementRepCount: Function;
  URL: MutableRefObject<string>;
  isResting: boolean;
  isFinished: boolean;
};

const WebcamAI: React.FC<WebcamAIProps> = ({ incrementRepCount, URL, isResting, isFinished }) => {
  let repStatus: string = "Neutral";

  const localResting = useRef<boolean>(false);
  const localFinished = useRef<boolean>(false);
  const localStarted = useRef<boolean>(false);
  const [status, setStatus] = useState<string>("NOT STARTED");

  const shouldCountandRender = function (start: boolean, rest: boolean, finish: boolean): boolean {
    return start && !rest && !finish ? true : false;
  };

  const startExercise = function (): void {
    localStarted.current = true;
    setStatus("RUNNING");
  };

  const updateStatus = function (): string {
    if (!localStarted.current) {
      return "NOT STARTED";
    } else if (localResting.current) {
      return "RESTING";
    } else if (localFinished.current) {
      return "FINISHED";
    } else {
      return "RUNNING";
    }
  };

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
    if (!isMounted) return;

    console.log("Running pose calculations...");
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict(): Promise<void> {
    if (webcamRef.current !== null && webcamRef.current.getCanvas() !== null) {
      const { pose, posenetOutput } = await model.estimatePose(webcamRef.current.getCanvas());
      const prediction = await model.predict(posenetOutput);
      if (shouldCountandRender(localStarted.current, localResting.current, localFinished.current)) {
        for (let i = maxPredictions - 2; i > maxPredictions - 4; i--) {
          //-> looping from second-to-last to third-to-last -> shape of array: ["neutral", "position", ("position",) "invalid"]
          if (prediction[i].probability.toFixed(2) > 0.92) {
            if (prediction[i].className !== repStatus) {
              repStatus = prediction[i].className;
              incrementRepCount();
            }
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
        if (pose && shouldCountandRender(localStarted.current, localResting.current, localFinished.current)) {
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

  useEffect(() => {
    console.log("use effect ", isResting, isFinished);
    localResting.current = isResting;
    localFinished.current = isFinished;
    setStatus(updateStatus());
    console.log("use effect localrest ", localResting.current, localFinished.current);
  }, [isResting, isFinished, localStarted]);

  return (
    <>
      <div className="webcam-stack-container">
        <WebcamOverlay startExercise={startExercise} status={status} />
        {webcamRef && (
          <Webcam
            className="webcam-component"
            ref={webcamRef}
            style={{
              width: size,
              height: size * 0.75
            }}
            onUserMedia={init}
            mirrored={true}
          />
        )}

        <canvas
          className="webcam-canvas"
          id="canvas"
          style={{
            width: size,
            height: size * 0.75
          }}></canvas>
      </div>
    </>
  );
};

export default WebcamAI;
