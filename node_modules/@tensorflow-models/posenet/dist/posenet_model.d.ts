/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { BaseModel } from './base_model';
import { InputResolution, MobileNetMultiplier, Pose, PoseNetArchitecture, PosenetInput, PoseNetOutputStride, PoseNetQuantBytes } from './types';
/**
 * PoseNet model loading is configurable using the following config dictionary.
 *
 * `architecture`: PoseNetArchitecture. It determines wich PoseNet architecture
 * to load. The supported architectures are: MobileNetV1 and ResNet.
 *
 * `outputStride`: Specifies the output stride of the PoseNet model.
 * The smaller the value, the larger the output resolution, and more accurate
 * the model at the cost of speed.  Set this to a larger value to increase speed
 * at the cost of accuracy. Stride 32 is supported for ResNet and
 * stride 8,16,32 are supported for various MobileNetV1 models.
 *
 * * `inputResolution`: A number or an Object of type {width: number, height:
 * number}. Specifies the size the input image is scaled to before feeding it
 * through the PoseNet model.  The larger the value, more accurate the model at
 * the cost of speed. Set this to a smaller value to increase speed at the cost
 * of accuracy. If a number is provided, the input will be resized and padded to
 * be a square with the same width and height.  If width and height are
 * provided, the input will be resized and padded to the specified width and
 * height.
 *
 * `multiplier`: An optional number with values: 1.01, 1.0, 0.75, or
 * 0.50. The value is used only by MobileNet architecture. It is the float
 * multiplier for the depth (number of channels) for all convolution ops.
 * The larger the value, the larger the size of the layers, and more accurate
 * the model at the cost of speed. Set this to a smaller value to increase speed
 * at the cost of accuracy.
 *
 * `modelUrl`: An optional string that specifies custom url of the model. This
 * is useful for area/countries that don't have access to the model hosted on
 * GCP.
 *
 * `quantBytes`: An opional number with values: 1, 2, or 4.  This parameter
 * affects weight quantization in the models. The available options are
 * 1 byte, 2 bytes, and 4 bytes. The higher the value, the larger the model size
 * and thus the longer the loading time, the lower the value, the shorter the
 * loading time but lower the accuracy.
 */
export interface ModelConfig {
    architecture: PoseNetArchitecture;
    outputStride: PoseNetOutputStride;
    inputResolution: InputResolution;
    multiplier?: MobileNetMultiplier;
    modelUrl?: string;
    quantBytes?: PoseNetQuantBytes;
}
/**
 * PoseNet inference is configurable using the following config dictionary.
 *
 * `flipHorizontal`: If the poses should be flipped/mirrored horizontally.
 * This should be set to true for videos where the video is by default flipped
 * horizontally (i.e. a webcam), and you want the poses to be returned in the
 * proper orientation.
 *
 */
export interface InferenceConfig {
    flipHorizontal: boolean;
}
/**
 * Single Person Inference Config
 */
export interface SinglePersonInterfaceConfig extends InferenceConfig {
}
/**
 * Multiple Person Inference Config
 *
 * `maxDetections`: Maximum number of returned instance detections per image.
 *
 * `scoreThreshold`: Only return instance detections that have root part
 * score greater or equal to this value. Defaults to 0.5
 *
 * `nmsRadius`: Non-maximum suppression part distance in pixels. It needs
 * to be strictly positive. Two parts suppress each other if they are less
 * than `nmsRadius` pixels away. Defaults to 20.
 */
export interface MultiPersonInferenceConfig extends InferenceConfig {
    maxDetections?: number;
    scoreThreshold?: number;
    nmsRadius?: number;
}
export interface LegacyMultiPersonInferenceConfig extends MultiPersonInferenceConfig {
    decodingMethod: 'multi-person';
}
export interface LegacySinglePersonInferenceConfig extends SinglePersonInterfaceConfig {
    decodingMethod: 'single-person';
}
export declare const SINGLE_PERSON_INFERENCE_CONFIG: SinglePersonInterfaceConfig;
export declare const MULTI_PERSON_INFERENCE_CONFIG: MultiPersonInferenceConfig;
export declare class PoseNet {
    readonly baseModel: BaseModel;
    readonly inputResolution: [number, number];
    constructor(net: BaseModel, inputResolution: [number, number]);
    /**
     * Infer through PoseNet, and estimates multiple poses using the outputs.
     * This does standard ImageNet pre-processing before inferring through the
     * model. The image should pixels should have values [0-255]. It detects
     * multiple poses and finds their parts from part scores and displacement
     * vectors using a fast greedy decoding algorithm.  It returns up to
     * `config.maxDetections` object instance detections in decreasing root
     * score order.
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) The input
     * image to feed through the network.
     *
     * @param config MultiPoseEstimationConfig object that contains parameters
     * for the PoseNet inference using multiple pose estimation.
     *
     * @return An array of poses and their scores, each containing keypoints and
     * the corresponding keypoint scores.  The positions of the keypoints are
     * in the same scale as the original image
     */
    estimateMultiplePoses(input: PosenetInput, config?: MultiPersonInferenceConfig): Promise<Pose[]>;
    /**
     * Infer through PoseNet, and estimates a single pose using the outputs.
     * This does standard ImageNet pre-processing before inferring through the
     * model. The image should pixels should have values [0-255]. It detects
     * multiple poses and finds their parts from part scores and displacement
     * vectors using a fast greedy decoding algorithm.  It returns a single pose
     *
     * @param input
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) The input
     * image to feed through the network.
     *
     * @param config SinglePersonEstimationConfig object that contains
     * parameters for the PoseNet inference using single pose estimation.
     *
     * @return An pose and its scores, containing keypoints and
     * the corresponding keypoint scores.  The positions of the keypoints are
     * in the same scale as the original image
     */
    estimateSinglePose(input: PosenetInput, config?: SinglePersonInterfaceConfig): Promise<Pose>;
    /** Deprecated: Use either estimateSinglePose or estimateMultiplePoses */
    estimatePoses(input: PosenetInput, config: LegacySinglePersonInferenceConfig | LegacyMultiPersonInferenceConfig): Promise<Pose[]>;
    dispose(): void;
}
/**
 * Loads the PoseNet model instance from a checkpoint, with the ResNet
 * or MobileNet architecture. The model to be loaded is configurable using the
 * config dictionary ModelConfig. Please find more details in the
 * documentation of the ModelConfig.
 *
 * @param config ModelConfig dictionary that contains parameters for
 * the PoseNet loading process. Please find more details of each parameters
 * in the documentation of the ModelConfig interface. The predefined
 * `MOBILENET_V1_CONFIG` and `RESNET_CONFIG` can also be used as references
 * for defining your customized config.
 */
export declare function load(config?: ModelConfig): Promise<PoseNet>;
