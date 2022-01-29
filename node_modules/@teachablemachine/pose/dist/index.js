"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var custom_posenet_1 = require("./custom-posenet");
exports.CustomPoseNet = custom_posenet_1.CustomPoseNet;
exports.load = custom_posenet_1.load;
exports.loadFromFiles = custom_posenet_1.loadFromFiles;
var teachable_posenet_1 = require("./teachable-posenet");
exports.TeachablePoseNet = teachable_posenet_1.TeachablePoseNet;
exports.createTeachable = teachable_posenet_1.createTeachable;
var webcam_1 = require("./utils/webcam");
exports.Webcam = webcam_1.Webcam;
var canvas_1 = require("./utils/canvas");
exports.createCanvas = canvas_1.createCanvas;
var pose_draw_1 = require("./utils/pose-draw");
exports.drawKeypoints = pose_draw_1.drawKeypoints;
exports.drawSkeleton = pose_draw_1.drawSkeleton;
exports.drawPoint = pose_draw_1.drawPoint;
exports.drawSegment = pose_draw_1.drawSegment;
var version_1 = require("./version");
exports.version = version_1.version;
//# sourceMappingURL=index.js.map