/**
    * @license
    * Copyright 2021 Google LLC. All Rights Reserved.
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
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tensorflow/tfjs-core'), require('@tensorflow/tfjs-converter')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tensorflow/tfjs-core', '@tensorflow/tfjs-converter'], factory) :
    (factory((global.posenet = {}),global.tf,global.tf));
}(this, (function (exports,tf,tfconv) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

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
    /**
     * PoseNet supports using various convolution neural network models
     * (e.g. ResNet and MobileNetV1) as its underlying base model.
     * The following BaseModel interface defines a unified interface for
     * creating such PoseNet base models. Currently both MobileNet (in
     * ./mobilenet.ts) and ResNet (in ./resnet.ts) implements the BaseModel
     * interface. New base models that conform to the BaseModel interface can be
     * added to PoseNet.
     */
    var BaseModel = /** @class */ (function () {
        function BaseModel(model, outputStride) {
            this.model = model;
            this.outputStride = outputStride;
            var inputShape = this.model.inputs[0].shape;
            tf.util.assert((inputShape[1] === -1) && (inputShape[2] === -1), function () { return "Input shape [" + inputShape[1] + ", " + inputShape[2] + "] " +
                "must both be equal to or -1"; });
        }
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
        BaseModel.prototype.predict = function (input) {
            var _this = this;
            return tf.tidy(function () {
                var asFloat = _this.preprocessInput(tf.cast(input, 'float32'));
                var asBatch = tf.expandDims(asFloat, 0);
                var results = _this.model.predict(asBatch);
                var results3d = results.map(function (y) { return tf.squeeze(y, [0]); });
                var namedResults = _this.nameOutputResults(results3d);
                return {
                    heatmapScores: tf.sigmoid(namedResults.heatmap),
                    offsets: namedResults.offsets,
                    displacementFwd: namedResults.displacementFwd,
                    displacementBwd: namedResults.displacementBwd
                };
            });
        };
        /**
         * Releases the CPU and GPU memory allocated by the model.
         */
        BaseModel.prototype.dispose = function () {
            this.model.dispose();
        };
        return BaseModel;
    }());

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
    var MobileNet = /** @class */ (function (_super) {
        __extends(MobileNet, _super);
        function MobileNet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MobileNet.prototype.preprocessInput = function (input) {
            // Normalize the pixels [0, 255] to be between [-1, 1].
            return tf.tidy(function () { return tf.sub(tf.div(input, 127.5), 1.0); });
        };
        MobileNet.prototype.nameOutputResults = function (results) {
            var offsets = results[0], heatmap = results[1], displacementFwd = results[2], displacementBwd = results[3];
            return { offsets: offsets, heatmap: heatmap, displacementFwd: displacementFwd, displacementBwd: displacementBwd };
        };
        return MobileNet;
    }(BaseModel));

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
    // algorithm based on Coursera Lecture from Algorithms, Part 1:
    // https://www.coursera.org/learn/algorithms-part1/lecture/ZjoSM/heapsort
    function half(k) {
        return Math.floor(k / 2);
    }
    var MaxHeap = /** @class */ (function () {
        function MaxHeap(maxSize, getElementValue) {
            this.priorityQueue = new Array(maxSize);
            this.numberOfElements = -1;
            this.getElementValue = getElementValue;
        }
        MaxHeap.prototype.enqueue = function (x) {
            this.priorityQueue[++this.numberOfElements] = x;
            this.swim(this.numberOfElements);
        };
        MaxHeap.prototype.dequeue = function () {
            var max = this.priorityQueue[0];
            this.exchange(0, this.numberOfElements--);
            this.sink(0);
            this.priorityQueue[this.numberOfElements + 1] = null;
            return max;
        };
        MaxHeap.prototype.empty = function () {
            return this.numberOfElements === -1;
        };
        MaxHeap.prototype.size = function () {
            return this.numberOfElements + 1;
        };
        MaxHeap.prototype.all = function () {
            return this.priorityQueue.slice(0, this.numberOfElements + 1);
        };
        MaxHeap.prototype.max = function () {
            return this.priorityQueue[0];
        };
        MaxHeap.prototype.swim = function (k) {
            while (k > 0 && this.less(half(k), k)) {
                this.exchange(k, half(k));
                k = half(k);
            }
        };
        MaxHeap.prototype.sink = function (k) {
            while (2 * k <= this.numberOfElements) {
                var j = 2 * k;
                if (j < this.numberOfElements && this.less(j, j + 1)) {
                    j++;
                }
                if (!this.less(k, j)) {
                    break;
                }
                this.exchange(k, j);
                k = j;
            }
        };
        MaxHeap.prototype.getValueAt = function (i) {
            return this.getElementValue(this.priorityQueue[i]);
        };
        MaxHeap.prototype.less = function (i, j) {
            return this.getValueAt(i) < this.getValueAt(j);
        };
        MaxHeap.prototype.exchange = function (i, j) {
            var t = this.priorityQueue[i];
            this.priorityQueue[i] = this.priorityQueue[j];
            this.priorityQueue[j] = t;
        };
        return MaxHeap;
    }());

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
    function scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores) {
        var _a = scores.shape, height = _a[0], width = _a[1];
        var localMaximum = true;
        var yStart = Math.max(heatmapY - localMaximumRadius, 0);
        var yEnd = Math.min(heatmapY + localMaximumRadius + 1, height);
        for (var yCurrent = yStart; yCurrent < yEnd; ++yCurrent) {
            var xStart = Math.max(heatmapX - localMaximumRadius, 0);
            var xEnd = Math.min(heatmapX + localMaximumRadius + 1, width);
            for (var xCurrent = xStart; xCurrent < xEnd; ++xCurrent) {
                if (scores.get(yCurrent, xCurrent, keypointId) > score) {
                    localMaximum = false;
                    break;
                }
            }
            if (!localMaximum) {
                break;
            }
        }
        return localMaximum;
    }
    /**
     * Builds a priority queue with part candidate positions for a specific image in
     * the batch. For this we find all local maxima in the score maps with score
     * values above a threshold. We create a single priority queue across all parts.
     */
    function buildPartWithScoreQueue(scoreThreshold, localMaximumRadius, scores) {
        var _a = scores.shape, height = _a[0], width = _a[1], numKeypoints = _a[2];
        var queue = new MaxHeap(height * width * numKeypoints, function (_a) {
            var score = _a.score;
            return score;
        });
        for (var heatmapY = 0; heatmapY < height; ++heatmapY) {
            for (var heatmapX = 0; heatmapX < width; ++heatmapX) {
                for (var keypointId = 0; keypointId < numKeypoints; ++keypointId) {
                    var score = scores.get(heatmapY, heatmapX, keypointId);
                    // Only consider parts with score greater or equal to threshold as
                    // root candidates.
                    if (score < scoreThreshold) {
                        continue;
                    }
                    // Only consider keypoints whose score is maximum in a local window.
                    if (scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores)) {
                        queue.enqueue({ score: score, part: { heatmapY: heatmapY, heatmapX: heatmapX, id: keypointId } });
                    }
                }
            }
        }
        return queue;
    }

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
    var partNames = [
        'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'leftShoulder',
        'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist',
        'leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
    ];
    var NUM_KEYPOINTS = partNames.length;
    var partIds = partNames.reduce(function (result, jointName, i) {
        result[jointName] = i;
        return result;
    }, {});
    var connectedPartNames = [
        ['leftHip', 'leftShoulder'], ['leftElbow', 'leftShoulder'],
        ['leftElbow', 'leftWrist'], ['leftHip', 'leftKnee'],
        ['leftKnee', 'leftAnkle'], ['rightHip', 'rightShoulder'],
        ['rightElbow', 'rightShoulder'], ['rightElbow', 'rightWrist'],
        ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
        ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip']
    ];
    /*
     * Define the skeleton. This defines the parent->child relationships of our
     * tree. Arbitrarily this defines the nose as the root of the tree, however
     * since we will infer the displacement for both parent->child and
     * child->parent, we can define the tree root as any node.
     */
    var poseChain = [
        ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
        ['rightEye', 'rightEar'], ['nose', 'leftShoulder'],
        ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
        ['leftShoulder', 'leftHip'], ['leftHip', 'leftKnee'],
        ['leftKnee', 'leftAnkle'], ['nose', 'rightShoulder'],
        ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
        ['rightShoulder', 'rightHip'], ['rightHip', 'rightKnee'],
        ['rightKnee', 'rightAnkle']
    ];
    var connectedPartIndices = connectedPartNames.map(function (_a) {
        var jointNameA = _a[0], jointNameB = _a[1];
        return ([partIds[jointNameA], partIds[jointNameB]]);
    });
    var partChannels = [
        'left_face',
        'right_face',
        'right_upper_leg_front',
        'right_lower_leg_back',
        'right_upper_leg_back',
        'left_lower_leg_front',
        'left_upper_leg_front',
        'left_upper_leg_back',
        'left_lower_leg_back',
        'right_feet',
        'right_lower_leg_front',
        'left_feet',
        'torso_front',
        'torso_back',
        'right_upper_arm_front',
        'right_upper_arm_back',
        'right_lower_arm_back',
        'left_lower_arm_front',
        'left_upper_arm_front',
        'left_upper_arm_back',
        'left_lower_arm_back',
        'right_hand',
        'right_lower_arm_front',
        'left_hand'
    ];

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
    function getOffsetPoint(y, x, keypoint, offsets) {
        return {
            y: offsets.get(y, x, keypoint),
            x: offsets.get(y, x, keypoint + NUM_KEYPOINTS)
        };
    }
    function getImageCoords(part, outputStride, offsets) {
        var heatmapY = part.heatmapY, heatmapX = part.heatmapX, keypoint = part.id;
        var _a = getOffsetPoint(heatmapY, heatmapX, keypoint, offsets), y = _a.y, x = _a.x;
        return {
            x: part.heatmapX * outputStride + x,
            y: part.heatmapY * outputStride + y
        };
    }
    function clamp(a, min, max) {
        if (a < min) {
            return min;
        }
        if (a > max) {
            return max;
        }
        return a;
    }
    function squaredDistance(y1, x1, y2, x2) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        return dy * dy + dx * dx;
    }
    function addVectors(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    }

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
    var parentChildrenTuples = poseChain.map(function (_a) {
        var parentJoinName = _a[0], childJoinName = _a[1];
        return ([partIds[parentJoinName], partIds[childJoinName]]);
    });
    var parentToChildEdges = parentChildrenTuples.map(function (_a) {
        var childJointId = _a[1];
        return childJointId;
    });
    var childToParentEdges = parentChildrenTuples.map(function (_a) {
        var parentJointId = _a[0];
        return parentJointId;
    });
    function getDisplacement(edgeId, point, displacements) {
        var numEdges = displacements.shape[2] / 2;
        return {
            y: displacements.get(point.y, point.x, edgeId),
            x: displacements.get(point.y, point.x, numEdges + edgeId)
        };
    }
    function getStridedIndexNearPoint(point, outputStride, height, width) {
        return {
            y: clamp(Math.round(point.y / outputStride), 0, height - 1),
            x: clamp(Math.round(point.x / outputStride), 0, width - 1)
        };
    }
    /**
     * We get a new keypoint along the `edgeId` for the pose instance, assuming
     * that the position of the `idSource` part is already known. For this, we
     * follow the displacement vector from the source to target part (stored in
     * the `i`-t channel of the displacement tensor). The displaced keypoint
     * vector is refined using the offset vector by `offsetRefineStep` times.
     */
    function traverseToTargetKeypoint(edgeId, sourceKeypoint, targetKeypointId, scoresBuffer, offsets, outputStride, displacements, offsetRefineStep) {
        if (offsetRefineStep === void 0) { offsetRefineStep = 2; }
        var _a = scoresBuffer.shape, height = _a[0], width = _a[1];
        // Nearest neighbor interpolation for the source->target displacements.
        var sourceKeypointIndices = getStridedIndexNearPoint(sourceKeypoint.position, outputStride, height, width);
        var displacement = getDisplacement(edgeId, sourceKeypointIndices, displacements);
        var displacedPoint = addVectors(sourceKeypoint.position, displacement);
        var targetKeypoint = displacedPoint;
        for (var i = 0; i < offsetRefineStep; i++) {
            var targetKeypointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
            var offsetPoint = getOffsetPoint(targetKeypointIndices.y, targetKeypointIndices.x, targetKeypointId, offsets);
            targetKeypoint = addVectors({
                x: targetKeypointIndices.x * outputStride,
                y: targetKeypointIndices.y * outputStride
            }, { x: offsetPoint.x, y: offsetPoint.y });
        }
        var targetKeyPointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
        var score = scoresBuffer.get(targetKeyPointIndices.y, targetKeyPointIndices.x, targetKeypointId);
        return { position: targetKeypoint, part: partNames[targetKeypointId], score: score };
    }
    /**
     * Follows the displacement fields to decode the full pose of the object
     * instance given the position of a part that acts as root.
     *
     * @return An array of decoded keypoints and their scores for a single pose
     */
    function decodePose(root, scores, offsets, outputStride, displacementsFwd, displacementsBwd) {
        var numParts = scores.shape[2];
        var numEdges = parentToChildEdges.length;
        var instanceKeypoints = new Array(numParts);
        // Start a new detection instance at the position of the root.
        var rootPart = root.part, rootScore = root.score;
        var rootPoint = getImageCoords(rootPart, outputStride, offsets);
        instanceKeypoints[rootPart.id] = {
            score: rootScore,
            part: partNames[rootPart.id],
            position: rootPoint
        };
        // Decode the part positions upwards in the tree, following the backward
        // displacements.
        for (var edge = numEdges - 1; edge >= 0; --edge) {
            var sourceKeypointId = parentToChildEdges[edge];
            var targetKeypointId = childToParentEdges[edge];
            if (instanceKeypoints[sourceKeypointId] &&
                !instanceKeypoints[targetKeypointId]) {
                instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsBwd);
            }
        }
        // Decode the part positions downwards in the tree, following the forward
        // displacements.
        for (var edge = 0; edge < numEdges; ++edge) {
            var sourceKeypointId = childToParentEdges[edge];
            var targetKeypointId = parentToChildEdges[edge];
            if (instanceKeypoints[sourceKeypointId] &&
                !instanceKeypoints[targetKeypointId]) {
                instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsFwd);
            }
        }
        return instanceKeypoints;
    }

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
    function withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, _a, keypointId) {
        var x = _a.x, y = _a.y;
        return poses.some(function (_a) {
            var keypoints = _a.keypoints;
            var correspondingKeypoint = keypoints[keypointId].position;
            return squaredDistance(y, x, correspondingKeypoint.y, correspondingKeypoint.x) <=
                squaredNmsRadius;
        });
    }
    /* Score the newly proposed object instance without taking into account
     * the scores of the parts that overlap with any previously detected
     * instance.
     */
    function getInstanceScore(existingPoses, squaredNmsRadius, instanceKeypoints) {
        var notOverlappedKeypointScores = instanceKeypoints.reduce(function (result, _a, keypointId) {
            var position = _a.position, score = _a.score;
            if (!withinNmsRadiusOfCorrespondingPoint(existingPoses, squaredNmsRadius, position, keypointId)) {
                result += score;
            }
            return result;
        }, 0.0);
        return notOverlappedKeypointScores /= instanceKeypoints.length;
    }
    // A point (y, x) is considered as root part candidate if its score is a
    // maximum in a window |y - y'| <= kLocalMaximumRadius, |x - x'| <=
    // kLocalMaximumRadius.
    var kLocalMaximumRadius = 1;
    /**
     * Detects multiple poses and finds their parts from part scores and
     * displacement vectors. It returns up to `maxDetections` object instance
     * detections in decreasing root score order. It works as follows: We first
     * create a priority queue with local part score maxima above
     * `scoreThreshold`, considering all parts at the same time. Then we
     * iteratively pull the top  element of the queue (in decreasing score order)
     * and treat it as a root candidate for a new object instance. To avoid
     * duplicate detections, we reject the root candidate if it is within a disk
     * of `nmsRadius` pixels from the corresponding part of a previously detected
     * instance, which is a form of part-based non-maximum suppression (NMS). If
     * the root candidate passes the NMS check, we start a new object instance
     * detection, treating the corresponding part as root and finding the
     * positions of the remaining parts by following the displacement vectors
     * along the tree-structured part graph. We assign to the newly detected
     * instance a score equal to the sum of scores of its parts which have not
     * been claimed by a previous instance (i.e., those at least `nmsRadius`
     * pixels away from the corresponding part of all previously detected
     * instances), divided by the total number of parts `numParts`.
     *
     * @param heatmapScores 3-D tensor with shape `[height, width, numParts]`.
     * The value of heatmapScores[y, x, k]` is the score of placing the `k`-th
     * object part at position `(y, x)`.
     *
     * @param offsets 3-D tensor with shape `[height, width, numParts * 2]`.
     * The value of [offsets[y, x, k], offsets[y, x, k + numParts]]` is the
     * short range offset vector of the `k`-th  object part at heatmap
     * position `(y, x)`.
     *
     * @param displacementsFwd 3-D tensor of shape
     * `[height, width, 2 * num_edges]`, where `num_edges = num_parts - 1` is the
     * number of edges (parent-child pairs) in the tree. It contains the forward
     * displacements between consecutive part from the root towards the leaves.
     *
     * @param displacementsBwd 3-D tensor of shape
     * `[height, width, 2 * num_edges]`, where `num_edges = num_parts - 1` is the
     * number of edges (parent-child pairs) in the tree. It contains the backward
     * displacements between consecutive part from the root towards the leaves.
     *
     * @param outputStride The output stride that was used when feed-forwarding
     * through the PoseNet model.  Must be 32, 16, or 8.
     *
     * @param maxPoseDetections Maximum number of returned instance detections per
     * image.
     *
     * @param scoreThreshold Only return instance detections that have root part
     * score greater or equal to this value. Defaults to 0.5.
     *
     * @param nmsRadius Non-maximum suppression part distance. It needs to be
     * strictly positive. Two parts suppress each other if they are less than
     * `nmsRadius` pixels away. Defaults to 20.
     *
     * @return An array of poses and their scores, each containing keypoints and
     * the corresponding keypoint scores.
     */
    function decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, maxPoseDetections, scoreThreshold, nmsRadius) {
        if (scoreThreshold === void 0) { scoreThreshold = 0.5; }
        if (nmsRadius === void 0) { nmsRadius = 20; }
        var poses = [];
        var queue = buildPartWithScoreQueue(scoreThreshold, kLocalMaximumRadius, scoresBuffer);
        var squaredNmsRadius = nmsRadius * nmsRadius;
        // Generate at most maxDetections object instances per image in
        // decreasing root part score order.
        while (poses.length < maxPoseDetections && !queue.empty()) {
            // The top element in the queue is the next root candidate.
            var root = queue.dequeue();
            // Part-based non-maximum suppression: We reject a root candidate if it
            // is within a disk of `nmsRadius` pixels from the corresponding part of
            // a previously detected instance.
            var rootImageCoords = getImageCoords(root.part, outputStride, offsetsBuffer);
            if (withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, rootImageCoords, root.part.id)) {
                continue;
            }
            // Start a new detection instance at the position of the root.
            var keypoints = decodePose(root, scoresBuffer, offsetsBuffer, outputStride, displacementsFwdBuffer, displacementsBwdBuffer);
            var score = getInstanceScore(poses, squaredNmsRadius, keypoints);
            poses.push({ keypoints: keypoints, score: score });
        }
        return poses;
    }

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
    function mod(a, b) {
        return tf.tidy(function () {
            var floored = tf.div(a, tf.scalar(b, 'int32'));
            return tf.sub(a, tf.mul(floored, tf.scalar(b, 'int32')));
        });
    }
    function argmax2d(inputs) {
        var _a = inputs.shape, height = _a[0], width = _a[1], depth = _a[2];
        return tf.tidy(function () {
            var reshaped = tf.reshape(inputs, [height * width, depth]);
            var coords = tf.argMax(reshaped, 0);
            var yCoords = tf.expandDims(tf.div(coords, tf.scalar(width, 'int32')), 1);
            var xCoords = tf.expandDims(mod(coords, width), 1);
            return tf.concat([yCoords, xCoords], 1);
        });
    }

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
    function getPointsConfidence(heatmapScores, heatMapCoords) {
        var numKeypoints = heatMapCoords.shape[0];
        var result = new Float32Array(numKeypoints);
        for (var keypoint = 0; keypoint < numKeypoints; keypoint++) {
            var y = heatMapCoords.get(keypoint, 0);
            var x = heatMapCoords.get(keypoint, 1);
            result[keypoint] = heatmapScores.get(y, x, keypoint);
        }
        return result;
    }
    function getOffsetPoint$1(y, x, keypoint, offsetsBuffer) {
        return {
            y: offsetsBuffer.get(y, x, keypoint),
            x: offsetsBuffer.get(y, x, keypoint + NUM_KEYPOINTS)
        };
    }
    function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
        var result = [];
        for (var keypoint = 0; keypoint < NUM_KEYPOINTS; keypoint++) {
            var heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
            var heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
            var _a = getOffsetPoint$1(heatmapY, heatmapX, keypoint, offsetsBuffer), x = _a.x, y = _a.y;
            result.push(y);
            result.push(x);
        }
        return tf.tensor2d(result, [NUM_KEYPOINTS, 2]);
    }
    function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
        return tf.tidy(function () {
            var offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
            return tf.add(tf.cast(tf.mul(heatMapCoordsBuffer.toTensor(), tf.scalar(outputStride, 'int32')), 'float32'), offsetVectors);
        });
    }

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
    /**
     * Detects a single pose and finds its parts from part scores and offset
     * vectors. It returns a single pose detection. It works as follows:
     * argmax2d is done on the scores to get the y and x index in the heatmap
     * with the highest score for each part, which is essentially where the
     * part is most likely to exist. This produces a tensor of size 17x2, with
     * each row being the y and x index in the heatmap for each keypoint.
     * The offset vector for each for each part is retrieved by getting the
     * y and x from the offsets corresponding to the y and x index in the
     * heatmap for that part. This produces a tensor of size 17x2, with each
     * row being the offset vector for the corresponding keypoint.
     * To get the keypoint, each part’s heatmap y and x are multiplied
     * by the output stride then added to their corresponding offset vector,
     * which is in the same scale as the original image.
     *
     * @param heatmapScores 3-D tensor with shape `[height, width, numParts]`.
     * The value of heatmapScores[y, x, k]` is the score of placing the `k`-th
     * object part at position `(y, x)`.
     *
     * @param offsets 3-D tensor with shape `[height, width, numParts * 2]`.
     * The value of [offsets[y, x, k], offsets[y, x, k + numParts]]` is the
     * short range offset vector of the `k`-th  object part at heatmap
     * position `(y, x)`.
     *
     * @param outputStride The output stride that was used when feed-forwarding
     * through the PoseNet model.  Must be 32, 16, or 8.
     *
     * @return A promise that resolves with single pose with a confidence score,
     * which contains an array of keypoints indexed by part id, each with a score
     * and position.
     */
    function decodeSinglePose(heatmapScores, offsets, outputStride) {
        return __awaiter(this, void 0, void 0, function () {
            var totalScore, heatmapValues, allTensorBuffers, scoresBuffer, offsetsBuffer, heatmapValuesBuffer, offsetPoints, offsetPointsBuffer, keypointConfidence, keypoints;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        totalScore = 0.0;
                        heatmapValues = argmax2d(heatmapScores);
                        return [4 /*yield*/, Promise.all([heatmapScores.buffer(), offsets.buffer(), heatmapValues.buffer()])];
                    case 1:
                        allTensorBuffers = _a.sent();
                        scoresBuffer = allTensorBuffers[0];
                        offsetsBuffer = allTensorBuffers[1];
                        heatmapValuesBuffer = allTensorBuffers[2];
                        offsetPoints = getOffsetPoints(heatmapValuesBuffer, outputStride, offsetsBuffer);
                        return [4 /*yield*/, offsetPoints.buffer()];
                    case 2:
                        offsetPointsBuffer = _a.sent();
                        keypointConfidence = Array.from(getPointsConfidence(scoresBuffer, heatmapValuesBuffer));
                        keypoints = keypointConfidence.map(function (score, keypointId) {
                            totalScore += score;
                            return {
                                position: {
                                    y: offsetPointsBuffer.get(keypointId, 0),
                                    x: offsetPointsBuffer.get(keypointId, 1)
                                },
                                part: partNames[keypointId],
                                score: score
                            };
                        });
                        heatmapValues.dispose();
                        offsetPoints.dispose();
                        return [2 /*return*/, { keypoints: keypoints, score: totalScore / keypoints.length }];
                }
            });
        });
    }

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
    var MOBILENET_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/';
    var RESNET50_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/';
    // The PoseNet 2.0 ResNet50 models use the latest TensorFlow.js 1.0 model
    // format.
    function resNet50Checkpoint(stride, quantBytes) {
        var graphJson = "model-stride" + stride + ".json";
        // quantBytes=4 corresponding to the non-quantized full-precision checkpoints.
        if (quantBytes === 4) {
            return RESNET50_BASE_URL + "float/" + graphJson;
        }
        else {
            return RESNET50_BASE_URL + ("quant" + quantBytes + "/") + graphJson;
        }
    }
    // The PoseNet 2.0 MobileNetV1 models use the latest TensorFlow.js 1.0 model
    // format.
    function mobileNetCheckpoint(stride, multiplier, quantBytes) {
        var toStr = { 1.0: '100', 0.75: '075', 0.50: '050' };
        var graphJson = "model-stride" + stride + ".json";
        // quantBytes=4 corresponding to the non-quantized full-precision checkpoints.
        if (quantBytes === 4) {
            return MOBILENET_BASE_URL + ("float/" + toStr[multiplier] + "/") + graphJson;
        }
        else {
            return MOBILENET_BASE_URL + ("quant" + quantBytes + "/" + toStr[multiplier] + "/") +
                graphJson;
        }
    }

    /**
     * @license
     * Copyright 2019 Google Inc. All Rights Reserved.
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
    var imageNetMean = [-123.15, -115.90, -103.06];
    var ResNet = /** @class */ (function (_super) {
        __extends(ResNet, _super);
        function ResNet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResNet.prototype.preprocessInput = function (input) {
            return tf.add(input, imageNetMean);
        };
        ResNet.prototype.nameOutputResults = function (results) {
            var displacementFwd = results[0], displacementBwd = results[1], offsets = results[2], heatmap = results[3];
            return { offsets: offsets, heatmap: heatmap, displacementFwd: displacementFwd, displacementBwd: displacementBwd };
        };
        return ResNet;
    }(BaseModel));

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
    function eitherPointDoesntMeetConfidence(a, b, minConfidence) {
        return (a < minConfidence || b < minConfidence);
    }
    function getAdjacentKeyPoints(keypoints, minConfidence) {
        return connectedPartIndices.reduce(function (result, _a) {
            var leftJoint = _a[0], rightJoint = _a[1];
            if (eitherPointDoesntMeetConfidence(keypoints[leftJoint].score, keypoints[rightJoint].score, minConfidence)) {
                return result;
            }
            result.push([keypoints[leftJoint], keypoints[rightJoint]]);
            return result;
        }, []);
    }
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY, POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    function getBoundingBox(keypoints) {
        return keypoints.reduce(function (_a, _b) {
            var maxX = _a.maxX, maxY = _a.maxY, minX = _a.minX, minY = _a.minY;
            var _c = _b.position, x = _c.x, y = _c.y;
            return {
                maxX: Math.max(maxX, x),
                maxY: Math.max(maxY, y),
                minX: Math.min(minX, x),
                minY: Math.min(minY, y)
            };
        }, {
            maxX: NEGATIVE_INFINITY,
            maxY: NEGATIVE_INFINITY,
            minX: POSITIVE_INFINITY,
            minY: POSITIVE_INFINITY
        });
    }
    function getBoundingBoxPoints(keypoints) {
        var _a = getBoundingBox(keypoints), minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        return [
            { x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY },
            { x: minX, y: maxY }
        ];
    }
    function toTensorBuffers3D(tensors) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(tensors.map(function (tensor) { return tensor.buffer(); }))];
            });
        });
    }
    function scalePose(pose, scaleY, scaleX, offsetY, offsetX) {
        if (offsetY === void 0) { offsetY = 0; }
        if (offsetX === void 0) { offsetX = 0; }
        return {
            score: pose.score,
            keypoints: pose.keypoints.map(function (_a) {
                var score = _a.score, part = _a.part, position = _a.position;
                return ({
                    score: score,
                    part: part,
                    position: {
                        x: position.x * scaleX + offsetX,
                        y: position.y * scaleY + offsetY
                    }
                });
            })
        };
    }
    function scalePoses(poses, scaleY, scaleX, offsetY, offsetX) {
        if (offsetY === void 0) { offsetY = 0; }
        if (offsetX === void 0) { offsetX = 0; }
        if (scaleX === 1 && scaleY === 1 && offsetY === 0 && offsetX === 0) {
            return poses;
        }
        return poses.map(function (pose) { return scalePose(pose, scaleY, scaleX, offsetY, offsetX); });
    }
    function flipPoseHorizontal(pose, imageWidth) {
        return {
            score: pose.score,
            keypoints: pose.keypoints.map(function (_a) {
                var score = _a.score, part = _a.part, position = _a.position;
                return ({
                    score: score,
                    part: part,
                    position: { x: imageWidth - 1 - position.x, y: position.y }
                });
            })
        };
    }
    function flipPosesHorizontal(poses, imageWidth) {
        if (imageWidth <= 0) {
            return poses;
        }
        return poses.map(function (pose) { return flipPoseHorizontal(pose, imageWidth); });
    }
    function toValidInputResolution(inputResolution, outputStride) {
        if (isValidInputResolution(inputResolution, outputStride)) {
            return inputResolution;
        }
        return Math.floor(inputResolution / outputStride) * outputStride + 1;
    }
    function validateInputResolution(inputResolution) {
        tf.util.assert(typeof inputResolution === 'number' ||
            typeof inputResolution === 'object', function () { return "Invalid inputResolution " + inputResolution + ". " +
            "Should be a number or an object with width and height"; });
        if (typeof inputResolution === 'object') {
            tf.util.assert(typeof inputResolution.width === 'number', function () { return "inputResolution.width has a value of " + inputResolution.width + " which is invalid; it must be a number"; });
            tf.util.assert(typeof inputResolution.height === 'number', function () { return "inputResolution.height has a value of " + inputResolution.height + " which is invalid; it must be a number"; });
        }
    }
    function getValidInputResolutionDimensions(inputResolution, outputStride) {
        validateInputResolution(inputResolution);
        if (typeof inputResolution === 'object') {
            return [
                toValidInputResolution(inputResolution.height, outputStride),
                toValidInputResolution(inputResolution.width, outputStride),
            ];
        }
        else {
            return [
                toValidInputResolution(inputResolution, outputStride),
                toValidInputResolution(inputResolution, outputStride),
            ];
        }
    }
    var VALID_OUTPUT_STRIDES = [8, 16, 32];
    function assertValidOutputStride(outputStride) {
        tf.util.assert(typeof outputStride === 'number', function () { return 'outputStride is not a number'; });
        tf.util.assert(VALID_OUTPUT_STRIDES.indexOf(outputStride) >= 0, function () { return "outputStride of " + outputStride + " is invalid. " +
            "It must be either 8, 16, or 32"; });
    }
    function isValidInputResolution(resolution, outputStride) {
        return (resolution - 1) % outputStride === 0;
    }
    function assertValidResolution(resolution, outputStride) {
        tf.util.assert(typeof resolution[0] === 'number' && typeof resolution[1] === 'number', function () { return "both resolution values must be a number but had values " + resolution; });
        tf.util.assert(isValidInputResolution(resolution[0], outputStride), function () { return "height of " + resolution[0] + " is invalid for output stride " +
            (outputStride + "."); });
        tf.util.assert(isValidInputResolution(resolution[1], outputStride), function () { return "width of " + resolution[1] + " is invalid for output stride " +
            (outputStride + "."); });
    }
    function getInputTensorDimensions(input) {
        return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
            [input.height, input.width];
    }
    function toInputTensor(input) {
        return input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
    }
    function padAndResizeTo(input, _a) {
        var targetH = _a[0], targetW = _a[1];
        var _b = getInputTensorDimensions(input), height = _b[0], width = _b[1];
        var targetAspect = targetW / targetH;
        var aspect = width / height;
        var _c = [0, 0, 0, 0], padT = _c[0], padB = _c[1], padL = _c[2], padR = _c[3];
        if (aspect < targetAspect) {
            // pads the width
            padT = 0;
            padB = 0;
            padL = Math.round(0.5 * (targetAspect * height - width));
            padR = Math.round(0.5 * (targetAspect * height - width));
        }
        else {
            // pads the height
            padT = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
            padB = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
            padL = 0;
            padR = 0;
        }
        var resized = tf.tidy(function () {
            var imageTensor = toInputTensor(input);
            imageTensor = tf.pad3d(imageTensor, [[padT, padB], [padL, padR], [0, 0]]);
            return tf.image.resizeBilinear(imageTensor, [targetH, targetW]);
        });
        return { resized: resized, padding: { top: padT, left: padL, right: padR, bottom: padB } };
    }
    function scaleAndFlipPoses(poses, _a, _b, padding, flipHorizontal) {
        var height = _a[0], width = _a[1];
        var inputResolutionHeight = _b[0], inputResolutionWidth = _b[1];
        var scaleY = (height + padding.top + padding.bottom) / (inputResolutionHeight);
        var scaleX = (width + padding.left + padding.right) / (inputResolutionWidth);
        var scaledPoses = scalePoses(poses, scaleY, scaleX, -padding.top, -padding.left);
        if (flipHorizontal) {
            return flipPosesHorizontal(scaledPoses, width);
        }
        else {
            return scaledPoses;
        }
    }

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
    // The default configuration for loading MobileNetV1 based PoseNet.
    //
    // (And for references, the default configuration for loading ResNet
    // based PoseNet is also included).
    //
    // ```
    // const RESNET_CONFIG = {
    //   architecture: 'ResNet50',
    //   outputStride: 32,
    //   quantBytes: 2,
    // } as ModelConfig;
    // ```
    var MOBILENET_V1_CONFIG = {
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        inputResolution: 257,
    };
    var VALID_ARCHITECTURE = ['MobileNetV1', 'ResNet50'];
    var VALID_STRIDE = {
        'MobileNetV1': [8, 16, 32],
        'ResNet50': [32, 16]
    };
    var VALID_MULTIPLIER = {
        'MobileNetV1': [0.50, 0.75, 1.0],
        'ResNet50': [1.0]
    };
    var VALID_QUANT_BYTES = [1, 2, 4];
    function validateModelConfig(config) {
        config = config || MOBILENET_V1_CONFIG;
        if (config.architecture == null) {
            config.architecture = 'MobileNetV1';
        }
        if (VALID_ARCHITECTURE.indexOf(config.architecture) < 0) {
            throw new Error("Invalid architecture " + config.architecture + ". " +
                ("Should be one of " + VALID_ARCHITECTURE));
        }
        if (config.inputResolution == null) {
            config.inputResolution = 257;
        }
        validateInputResolution(config.inputResolution);
        if (config.outputStride == null) {
            config.outputStride = 16;
        }
        if (VALID_STRIDE[config.architecture].indexOf(config.outputStride) < 0) {
            throw new Error("Invalid outputStride " + config.outputStride + ". " +
                ("Should be one of " + VALID_STRIDE[config.architecture] + " ") +
                ("for architecture " + config.architecture + "."));
        }
        if (config.multiplier == null) {
            config.multiplier = 1.0;
        }
        if (VALID_MULTIPLIER[config.architecture].indexOf(config.multiplier) < 0) {
            throw new Error("Invalid multiplier " + config.multiplier + ". " +
                ("Should be one of " + VALID_MULTIPLIER[config.architecture] + " ") +
                ("for architecture " + config.architecture + "."));
        }
        if (config.quantBytes == null) {
            config.quantBytes = 4;
        }
        if (VALID_QUANT_BYTES.indexOf(config.quantBytes) < 0) {
            throw new Error("Invalid quantBytes " + config.quantBytes + ". " +
                ("Should be one of " + VALID_QUANT_BYTES + " ") +
                ("for architecture " + config.architecture + "."));
        }
        if (config.architecture === 'MobileNetV1' && config.outputStride === 32 &&
            config.multiplier !== 1) {
            throw new Error("When using an output stride of 32, " +
                "you must select 1 as the multiplier.");
        }
        return config;
    }
    var SINGLE_PERSON_INFERENCE_CONFIG = {
        flipHorizontal: false
    };
    var MULTI_PERSON_INFERENCE_CONFIG = {
        flipHorizontal: false,
        maxDetections: 5,
        scoreThreshold: 0.5,
        nmsRadius: 20
    };
    function validateMultiPersonInputConfig(config) {
        var maxDetections = config.maxDetections, scoreThreshold = config.scoreThreshold, nmsRadius = config.nmsRadius;
        if (maxDetections <= 0) {
            throw new Error("Invalid maxDetections " + maxDetections + ". " +
                "Should be > 0");
        }
        if (scoreThreshold < 0.0 || scoreThreshold > 1.0) {
            throw new Error("Invalid scoreThreshold " + scoreThreshold + ". " +
                "Should be in range [0.0, 1.0]");
        }
        if (nmsRadius <= 0) {
            throw new Error("Invalid nmsRadius " + nmsRadius + ".");
        }
    }
    var PoseNet = /** @class */ (function () {
        function PoseNet(net, inputResolution) {
            assertValidOutputStride(net.outputStride);
            assertValidResolution(inputResolution, net.outputStride);
            this.baseModel = net;
            this.inputResolution = inputResolution;
        }
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
        PoseNet.prototype.estimateMultiplePoses = function (input, config) {
            if (config === void 0) { config = MULTI_PERSON_INFERENCE_CONFIG; }
            return __awaiter(this, void 0, void 0, function () {
                var configWithDefaults, outputStride, inputResolution, _a, height, width, _b, resized, padding, _c, heatmapScores, offsets, displacementFwd, displacementBwd, allTensorBuffers, scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, poses, resultPoses;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            configWithDefaults = __assign({}, MULTI_PERSON_INFERENCE_CONFIG, config);
                            validateMultiPersonInputConfig(config);
                            outputStride = this.baseModel.outputStride;
                            inputResolution = this.inputResolution;
                            _a = getInputTensorDimensions(input), height = _a[0], width = _a[1];
                            _b = padAndResizeTo(input, inputResolution), resized = _b.resized, padding = _b.padding;
                            _c = this.baseModel.predict(resized), heatmapScores = _c.heatmapScores, offsets = _c.offsets, displacementFwd = _c.displacementFwd, displacementBwd = _c.displacementBwd;
                            return [4 /*yield*/, toTensorBuffers3D([heatmapScores, offsets, displacementFwd, displacementBwd])];
                        case 1:
                            allTensorBuffers = _d.sent();
                            scoresBuffer = allTensorBuffers[0];
                            offsetsBuffer = allTensorBuffers[1];
                            displacementsFwdBuffer = allTensorBuffers[2];
                            displacementsBwdBuffer = allTensorBuffers[3];
                            return [4 /*yield*/, decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, configWithDefaults.maxDetections, configWithDefaults.scoreThreshold, configWithDefaults.nmsRadius)];
                        case 2:
                            poses = _d.sent();
                            resultPoses = scaleAndFlipPoses(poses, [height, width], inputResolution, padding, configWithDefaults.flipHorizontal);
                            heatmapScores.dispose();
                            offsets.dispose();
                            displacementFwd.dispose();
                            displacementBwd.dispose();
                            resized.dispose();
                            return [2 /*return*/, resultPoses];
                    }
                });
            });
        };
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
        PoseNet.prototype.estimateSinglePose = function (input, config) {
            if (config === void 0) { config = SINGLE_PERSON_INFERENCE_CONFIG; }
            return __awaiter(this, void 0, void 0, function () {
                var configWithDefaults, outputStride, inputResolution, _a, height, width, _b, resized, padding, _c, heatmapScores, offsets, displacementFwd, displacementBwd, pose, poses, resultPoses;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            configWithDefaults = __assign({}, SINGLE_PERSON_INFERENCE_CONFIG, config);
                            outputStride = this.baseModel.outputStride;
                            inputResolution = this.inputResolution;
                            _a = getInputTensorDimensions(input), height = _a[0], width = _a[1];
                            _b = padAndResizeTo(input, inputResolution), resized = _b.resized, padding = _b.padding;
                            _c = this.baseModel.predict(resized), heatmapScores = _c.heatmapScores, offsets = _c.offsets, displacementFwd = _c.displacementFwd, displacementBwd = _c.displacementBwd;
                            return [4 /*yield*/, decodeSinglePose(heatmapScores, offsets, outputStride)];
                        case 1:
                            pose = _d.sent();
                            poses = [pose];
                            resultPoses = scaleAndFlipPoses(poses, [height, width], inputResolution, padding, configWithDefaults.flipHorizontal);
                            heatmapScores.dispose();
                            offsets.dispose();
                            displacementFwd.dispose();
                            displacementBwd.dispose();
                            resized.dispose();
                            return [2 /*return*/, resultPoses[0]];
                    }
                });
            });
        };
        /** Deprecated: Use either estimateSinglePose or estimateMultiplePoses */
        PoseNet.prototype.estimatePoses = function (input, config) {
            return __awaiter(this, void 0, void 0, function () {
                var pose;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(config.decodingMethod === 'single-person')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.estimateSinglePose(input, config)];
                        case 1:
                            pose = _a.sent();
                            return [2 /*return*/, [pose]];
                        case 2: return [2 /*return*/, this.estimateMultiplePoses(input, config)];
                    }
                });
            });
        };
        PoseNet.prototype.dispose = function () {
            this.baseModel.dispose();
        };
        return PoseNet;
    }());
    function loadMobileNet(config) {
        return __awaiter(this, void 0, void 0, function () {
            var outputStride, quantBytes, multiplier, url, graphModel, mobilenet, validInputResolution;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outputStride = config.outputStride;
                        quantBytes = config.quantBytes;
                        multiplier = config.multiplier;
                        if (tf == null) {
                            throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please " +
                                "also include @tensorflow/tfjs on the page before using this\n        model.");
                        }
                        url = mobileNetCheckpoint(outputStride, multiplier, quantBytes);
                        return [4 /*yield*/, tfconv.loadGraphModel(config.modelUrl || url)];
                    case 1:
                        graphModel = _a.sent();
                        mobilenet = new MobileNet(graphModel, outputStride);
                        validInputResolution = getValidInputResolutionDimensions(config.inputResolution, mobilenet.outputStride);
                        return [2 /*return*/, new PoseNet(mobilenet, validInputResolution)];
                }
            });
        });
    }
    function loadResNet(config) {
        return __awaiter(this, void 0, void 0, function () {
            var outputStride, quantBytes, url, graphModel, resnet, validInputResolution;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outputStride = config.outputStride;
                        quantBytes = config.quantBytes;
                        if (tf == null) {
                            throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please " +
                                "also include @tensorflow/tfjs on the page before using this\n        model.");
                        }
                        url = resNet50Checkpoint(outputStride, quantBytes);
                        return [4 /*yield*/, tfconv.loadGraphModel(config.modelUrl || url)];
                    case 1:
                        graphModel = _a.sent();
                        resnet = new ResNet(graphModel, outputStride);
                        validInputResolution = getValidInputResolutionDimensions(config.inputResolution, resnet.outputStride);
                        return [2 /*return*/, new PoseNet(resnet, validInputResolution)];
                }
            });
        });
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
    function load(config) {
        if (config === void 0) { config = MOBILENET_V1_CONFIG; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config = validateModelConfig(config);
                if (config.architecture === 'ResNet50') {
                    return [2 /*return*/, loadResNet(config)];
                }
                else if (config.architecture === 'MobileNetV1') {
                    return [2 /*return*/, loadMobileNet(config)];
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    }

    /** @license See the LICENSE file. */
    // This code is auto-generated, do not modify this file!
    var version = '2.2.2';

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

    exports.decodeMultiplePoses = decodeMultiplePoses;
    exports.decodeSinglePose = decodeSinglePose;
    exports.MobileNet = MobileNet;
    exports.partChannels = partChannels;
    exports.partIds = partIds;
    exports.partNames = partNames;
    exports.poseChain = poseChain;
    exports.load = load;
    exports.PoseNet = PoseNet;
    exports.getAdjacentKeyPoints = getAdjacentKeyPoints;
    exports.getBoundingBox = getBoundingBox;
    exports.getBoundingBoxPoints = getBoundingBoxPoints;
    exports.scaleAndFlipPoses = scaleAndFlipPoses;
    exports.scalePose = scalePose;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=posenet.js.map
