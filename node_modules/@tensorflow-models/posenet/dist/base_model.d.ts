/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tfconv from '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';
import { PoseNetOutputStride } from './types';
/**
 * PoseNet supports using various convolution neural network models
 * (e.g. ResNet and MobileNetV1) as its underlying base model.
 * The following BaseModel interface defines a unified interface for
 * creating such PoseNet base models. Currently both MobileNet (in
 * ./mobilenet.ts) and ResNet (in ./resnet.ts) implements the BaseModel
 * interface. New base models that conform to the BaseModel interface can be
 * added to PoseNet.
 */
export declare abstract class BaseModel {
    protected readonly model: tfconv.GraphModel;
    readonly outputStride: PoseNetOutputStride;
    constructor(model: tfconv.GraphModel, outputStride: PoseNetOutputStride);
    abstract preprocessInput(input: tf.Tensor3D): tf.Tensor3D;
    /**
     * Predicts intermediate Tensor representations.
     *
     * @param input The input RGB image of the base model.
     * A Tensor of shape: [`inputResolution`, `inputResolution`, 3].
     *
     * @return A dictionary of base model's intermediate predictions.
     * The returned dictionary should contains the following elements:
     * heatmapScores: A Tensor3D that represents the heatmapScores.
     * offsets: A Tensor3D that represents the offsets.
     * displacementFwd: A Tensor3D that represents the forward displacement.
     * displacementBwd: A Tensor3D that represents the backward displacement.
     */
    predict(input: tf.Tensor3D): {
        heatmapScores: tf.Tensor3D;
        offsets: tf.Tensor3D;
        displacementFwd: tf.Tensor3D;
        displacementBwd: tf.Tensor3D;
    };
    abstract nameOutputResults(results: tf.Tensor3D[]): {
        heatmap: tf.Tensor3D;
        offsets: tf.Tensor3D;
        displacementFwd: tf.Tensor3D;
        displacementBwd: tf.Tensor3D;
    };
    /**
     * Releases the CPU and GPU memory allocated by the model.
     */
    dispose(): void;
}
