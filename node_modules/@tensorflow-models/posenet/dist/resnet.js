"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var base_model_1 = require("./base_model");
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
}(base_model_1.BaseModel));
exports.ResNet = ResNet;
//# sourceMappingURL=resnet.js.map