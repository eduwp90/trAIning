import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
import React, { useRef } from 'react';

const URL = 'https://teachablemachine.withgoogle.com/models/HQvC3rR8v/';
// const URL = 'https://teachablemachine.withgoogle.com/models/jwj-LGant/';
let model, ctx, labelContainer, maxPredictions;

function WebcamAI () {
  const webcamRef = useRef(null);

  async function init () {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    window.requestAnimationFrame(loop);

    const canvas = /** @type {HTMLCanvasElement} */ document.getElementById('canvas');
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext('2d');
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement('div'));
    }
  }

  async function loop(timestamp) {
    console.log(webcamRef);
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict() {
    console.log(webcamRef.current.getCanvas());
    const { pose, posenetOutput } = await model.estimatePose(
      webcamRef.current.getCanvas()
    );
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    drawPose(pose);
  }

  function drawPose(pose) {
    console.log(webcamRef);
    if (webcamRef.current.getCanvas()) {
      ctx.drawImage(webcamRef.current.getCanvas(), 0, 0);
      // draw the keypoints and skeleton
      if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
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
            zindex: -9,
            width: 640,
            height: 480,
          }}
          onUserMedia={init}
          mirrored={true}
        />
      )}
      <div>
        <canvas
          id='canvas'
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
      </div>
      <div id='label-container'></div>
    </>
  );
}

export default WebcamAI;