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
}(base_model_1.BaseModel));
exports.MobileNet = MobileNet;
//# sourceMappingURL=mobilenet.js.map