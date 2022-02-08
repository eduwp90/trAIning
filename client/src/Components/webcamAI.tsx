import Webcam from "react-webcam";
import * as tmPose from "@teachablemachine/pose";
import { useEffect, useRef, useState } from "react";
import { Keypoint } from "@tensorflow-models/posenet";
import "./components.less";
import WebcamOverlay from "./webcamOverlay";

let model: { getTotalClasses: Function; estimatePose: Function; predict: Function }, ctx: CanvasRenderingContext2D;

let isMounted: boolean;

type WebcamAIProps = {
  incrementRepCount: Function;
  URL: string;
  isResting: boolean;
  isFinished: boolean;
};

const WebcamAI: React.FC<WebcamAIProps> = ({ incrementRepCount, URL, isResting, isFinished }) => {
  const localResting = useRef<boolean>(false);
  const localFinished = useRef<boolean>(false);
  const localStarted = useRef<boolean>(false);
  const [status, setStatus] = useState<string>("NOT STARTED");
  const [stop, setStop] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  let cycleRep = false;

  const shouldCountandRender = function (start: boolean, rest: boolean, finish: boolean): boolean {
    return start && !rest && !finish ? true : false;
  };

  const startExercise = function (): void {
    if (!initialized) init();
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

  async function loadModel() {
    console.log("loading model ", URL);
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);

    return model;
  }

  async function init(): Promise<void> {
    setInitialized(true);
    model = await loadModel();

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
    // console.log("eval,in");
    if (!isMounted || stop) {
      // console.log("eval,out");
      setInitialized(false);
      return;
    }

    // console.log("Running pose calculations...");
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict(): Promise<void> {
    console.log("eval, ", webcamRef.current !== null && webcamRef.current.getCanvas() !== null);
    if (webcamRef.current !== null && webcamRef.current.getCanvas() !== null) {
      const { pose, posenetOutput } = await model.estimatePose(webcamRef.current.getCanvas());
      const prediction = await model.predict(posenetOutput);
      if (shouldCountandRender(localStarted.current, localResting.current, localFinished.current)) {
        if (!cycleRep && prediction[1].probability.toFixed(2) > 0.92) {
          cycleRep = true;
          incrementRepCount();
        }
        if (cycleRep && prediction[1].probability.toFixed(2) < 0.3) {
          cycleRep = false;
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
    // console.log("use effect ", isResting, isFinished);
    localResting.current = isResting;
    localFinished.current = isFinished;
    setStatus(updateStatus());
    // console.log("use effect localrest ", localResting.current, localFinished.current);
  }, [isResting, isFinished, localStarted]);

  useEffect(() => {
    async function reload() {
      model = await loadModel();
    }
    setStop(true);
    reload();
    setTimeout(() => setStop(false), 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [URL]);

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
            onUserMediaError={() => console.log("camera error")}
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
