import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
import React, { useRef } from 'react';

const URL = 'https://teachablemachine.withgoogle.com/models/HQvC3rR8v/';
// const URL = 'https://teachablemachine.withgoogle.com/models/jwj-LGant/';
let model: any, ctx: CanvasRenderingContext2D, labelContainer: HTMLElement, maxPredictions: any;

function WebcamAI () {
  const webcamRef = useRef<Webcam>(null);

  async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    window.requestAnimationFrame(loop);

    const getCanvasElementById = (id: string): HTMLCanvasElement => {
    const canvas = document.getElementById(id);
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`The element of id "${id}" is not a HTMLCanvasElement. Make sure a <canvas id="${id}""> element is present in the document.`);
    }
    return canvas;
    }

    const getCanvasRenderingContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
      const context = canvas.getContext('2d');
      if (context === null) {
        throw new Error('This browser does not support 2-dimensional canvas rendering contexts.');
      }
      return context;
    }

    const canvas: HTMLCanvasElement = getCanvasElementById("canvas")

    if (canvas) {
      canvas.width = 640;
      canvas.height = 480;
      ctx = getCanvasRenderingContext2D(canvas)!;
      labelContainer = document.getElementById('label-container')!;
      for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement('div'));
      }
    }
  }

  async function loop(timestamp: any) {
    // console.log(webcamRef);
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict() {
    if (webcamRef.current !== null) {
      // console.log(webcamRef.current.getCanvas());
      const { pose, posenetOutput } = await model.estimatePose(
        webcamRef.current.getCanvas()
      );
      const prediction = await model.predict(posenetOutput);

      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
          prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].textContent = classPrediction;
      }
      drawPose(pose);
    }
  }

  function drawPose(pose: any) {
    console.log(webcamRef);
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

  




    

  return (
    <>
      <div>Teachable Machine Pose Model</div>
      {/* <button type='button' onClick={() => init()}>
        Start
      </button> */}
      {webcamRef && (
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: -9,
            width: 640,
            height: 480,
          }}
          onUserMedia={init}
          mirrored={true}
        />
      )}

        <canvas
          id='canvas'
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>

      <div 
        id='label-container'
        style={{
          zIndex: 35,
          textAlign: 'left'
        }}
      ></div>
    </>
  );
}

export default WebcamAI;