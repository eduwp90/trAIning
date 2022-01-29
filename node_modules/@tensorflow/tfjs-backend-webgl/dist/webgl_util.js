/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
import { env, util } from '@tensorflow/tfjs-core';
import { getWebGLContext } from './canvas_util';
import { getTextureConfig } from './tex_util';
export function callAndCheck(gl, func) {
    const returnValue = func();
    if (env().getBool('DEBUG')) {
        checkWebGLError(gl);
    }
    return returnValue;
}
function checkWebGLError(gl) {
    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
        throw new Error('WebGL Error: ' + getWebGLErrorMessage(gl, error));
    }
}
// https://en.wikipedia.org/wiki/Half-precision_floating-point_format
const MIN_FLOAT16 = 5.96e-8;
const MAX_FLOAT16 = 65504;
export function canBeRepresented(num) {
    if (env().getBool('WEBGL_RENDER_FLOAT32_ENABLED') || num === 0 ||
        (MIN_FLOAT16 < Math.abs(num) && Math.abs(num) < MAX_FLOAT16)) {
        return true;
    }
    return false;
}
export function getWebGLErrorMessage(gl, status) {
    switch (status) {
        case gl.NO_ERROR:
            return 'NO_ERROR';
        case gl.INVALID_ENUM:
            return 'INVALID_ENUM';
        case gl.INVALID_VALUE:
            return 'INVALID_VALUE';
        case gl.INVALID_OPERATION:
            return 'INVALID_OPERATION';
        case gl.INVALID_FRAMEBUFFER_OPERATION:
            return 'INVALID_FRAMEBUFFER_OPERATION';
        case gl.OUT_OF_MEMORY:
            return 'OUT_OF_MEMORY';
        case gl.CONTEXT_LOST_WEBGL:
            return 'CONTEXT_LOST_WEBGL';
        default:
            return `Unknown error code ${status}`;
    }
}
export function getExtensionOrThrow(gl, extensionName) {
    return throwIfNull(gl, () => gl.getExtension(extensionName), 'Extension "' + extensionName + '" not supported on this browser.');
}
export function createVertexShader(gl, vertexShaderSource) {
    const vertexShader = throwIfNull(gl, () => gl.createShader(gl.VERTEX_SHADER), 'Unable to create vertex WebGLShader.');
    callAndCheck(gl, () => gl.shaderSource(vertexShader, vertexShaderSource));
    callAndCheck(gl, () => gl.compileShader(vertexShader));
    if (gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) === false) {
        console.log(gl.getShaderInfoLog(vertexShader));
        throw new Error('Failed to compile vertex shader.');
    }
    return vertexShader;
}
export function createFragmentShader(gl, fragmentShaderSource) {
    const fragmentShader = throwIfNull(gl, () => gl.createShader(gl.FRAGMENT_SHADER), 'Unable to create fragment WebGLShader.');
    callAndCheck(gl, () => gl.shaderSource(fragmentShader, fragmentShaderSource));
    callAndCheck(gl, () => gl.compileShader(fragmentShader));
    if (gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) === false) {
        logShaderSourceAndInfoLog(fragmentShaderSource, gl.getShaderInfoLog(fragmentShader));
        throw new Error('Failed to compile fragment shader.');
    }
    return fragmentShader;
}
const lineNumberRegex = /ERROR: [0-9]+:([0-9]+):/g;
function logShaderSourceAndInfoLog(shaderSource, shaderInfoLog) {
    const lineNumberRegexResult = lineNumberRegex.exec(shaderInfoLog);
    if (lineNumberRegexResult == null) {
        console.log(`Couldn't parse line number in error: ${shaderInfoLog}`);
        console.log(shaderSource);
        return;
    }
    const lineNumber = +lineNumberRegexResult[1];
    const shaderLines = shaderSource.split('\n');
    const pad = shaderLines.length.toString().length + 2;
    const linesWithLineNumbers = shaderLines.map((line, lineNumber) => util.rightPad((lineNumber + 1).toString(), pad) + line);
    let maxLineLength = 0;
    for (let i = 0; i < linesWithLineNumbers.length; i++) {
        maxLineLength = Math.max(linesWithLineNumbers[i].length, maxLineLength);
    }
    const beforeErrorLines = linesWithLineNumbers.slice(0, lineNumber - 1);
    const errorLine = linesWithLineNumbers.slice(lineNumber - 1, lineNumber);
    const afterErrorLines = linesWithLineNumbers.slice(lineNumber);
    console.log(beforeErrorLines.join('\n'));
    console.log(shaderInfoLog.split('\n')[0]);
    console.log(`%c ${util.rightPad(errorLine[0], maxLineLength)}`, 'border:1px solid red; background-color:#e3d2d2; color:#a61717');
    console.log(afterErrorLines.join('\n'));
}
export function createProgram(gl) {
    return throwIfNull(gl, () => gl.createProgram(), 'Unable to create WebGLProgram.');
}
export function linkProgram(gl, program) {
    callAndCheck(gl, () => gl.linkProgram(program));
    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Failed to link vertex and fragment shaders.');
    }
}
export function validateProgram(gl, program) {
    callAndCheck(gl, () => gl.validateProgram(program));
    if (gl.getProgramParameter(program, gl.VALIDATE_STATUS) === false) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Shader program validation failed.');
    }
}
export function createStaticVertexBuffer(gl, data) {
    const buffer = throwIfNull(gl, () => gl.createBuffer(), 'Unable to create WebGLBuffer');
    callAndCheck(gl, () => gl.bindBuffer(gl.ARRAY_BUFFER, buffer));
    callAndCheck(gl, () => gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW));
    return buffer;
}
export function createStaticIndexBuffer(gl, data) {
    const buffer = throwIfNull(gl, () => gl.createBuffer(), 'Unable to create WebGLBuffer');
    callAndCheck(gl, () => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer));
    callAndCheck(gl, () => gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW));
    return buffer;
}
export function getNumChannels() {
    if (env().getNumber('WEBGL_VERSION') === 2) {
        return 1;
    }
    return 4;
}
export function createTexture(gl) {
    return throwIfNull(gl, () => gl.createTexture(), 'Unable to create WebGLTexture.');
}
export function validateTextureSize(width, height) {
    const maxTextureSize = env().getNumber('WEBGL_MAX_TEXTURE_SIZE');
    if ((width <= 0) || (height <= 0)) {
        const requested = `[${width}x${height}]`;
        throw new Error('Requested texture size ' + requested + ' is invalid.');
    }
    if ((width > maxTextureSize) || (height > maxTextureSize)) {
        const requested = `[${width}x${height}]`;
        const max = `[${maxTextureSize}x${maxTextureSize}]`;
        throw new Error('Requested texture size ' + requested +
            ' greater than WebGL maximum on this browser / GPU ' + max + '.');
    }
}
export function createFramebuffer(gl) {
    return throwIfNull(gl, () => gl.createFramebuffer(), 'Unable to create WebGLFramebuffer.');
}
export function bindVertexBufferToProgramAttribute(gl, program, attribute, buffer, arrayEntriesPerItem, itemStrideInBytes, itemOffsetInBytes) {
    const loc = gl.getAttribLocation(program, attribute);
    if (loc === -1) {
        // The GPU compiler decided to strip out this attribute because it's unused,
        // thus no need to bind.
        return false;
    }
    callAndCheck(gl, () => gl.bindBuffer(gl.ARRAY_BUFFER, buffer));
    callAndCheck(gl, () => gl.vertexAttribPointer(loc, arrayEntriesPerItem, gl.FLOAT, false, itemStrideInBytes, itemOffsetInBytes));
    callAndCheck(gl, () => gl.enableVertexAttribArray(loc));
    return true;
}
export function bindTextureUnit(gl, texture, textureUnit) {
    validateTextureUnit(gl, textureUnit);
    callAndCheck(gl, () => gl.activeTexture(gl.TEXTURE0 + textureUnit));
    callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, texture));
}
export function unbindTextureUnit(gl, textureUnit) {
    validateTextureUnit(gl, textureUnit);
    callAndCheck(gl, () => gl.activeTexture(gl.TEXTURE0 + textureUnit));
    callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, null));
}
export function getProgramUniformLocationOrThrow(gl, program, uniformName) {
    return throwIfNull(gl, () => gl.getUniformLocation(program, uniformName), 'uniform "' + uniformName + '" not present in program.');
}
export function getProgramUniformLocation(gl, program, uniformName) {
    return gl.getUniformLocation(program, uniformName);
}
export function bindTextureToProgramUniformSampler(gl, texture, uniformSamplerLocation, textureUnit) {
    callAndCheck(gl, () => bindTextureUnit(gl, texture, textureUnit));
    callAndCheck(gl, () => gl.uniform1i(uniformSamplerLocation, textureUnit));
}
export function bindCanvasToFramebuffer(gl) {
    callAndCheck(gl, () => gl.bindFramebuffer(gl.FRAMEBUFFER, null));
    callAndCheck(gl, () => gl.viewport(0, 0, gl.canvas.width, gl.canvas.height));
    callAndCheck(gl, () => gl.scissor(0, 0, gl.canvas.width, gl.canvas.height));
}
export function bindColorTextureToFramebuffer(gl, texture, framebuffer) {
    callAndCheck(gl, () => gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer));
    callAndCheck(gl, () => gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0));
}
export function unbindColorTextureFromFramebuffer(gl, framebuffer) {
    callAndCheck(gl, () => gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer));
    callAndCheck(gl, () => gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0));
}
export function validateFramebuffer(gl) {
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Error binding framebuffer: ' + getFramebufferErrorMessage(gl, status));
    }
}
export function getFramebufferErrorMessage(gl, status) {
    switch (status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            return 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT';
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            return 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT';
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            return 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS';
        case gl.FRAMEBUFFER_UNSUPPORTED:
            return 'FRAMEBUFFER_UNSUPPORTED';
        default:
            return `unknown error ${status}`;
    }
}
function throwIfNull(gl, returnTOrNull, failureMessage) {
    const tOrNull = callAndCheck(gl, () => returnTOrNull());
    if (tOrNull == null) {
        throw new Error(failureMessage);
    }
    return tOrNull;
}
function validateTextureUnit(gl, textureUnit) {
    const maxTextureUnit = gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1;
    const glTextureUnit = textureUnit + gl.TEXTURE0;
    if (glTextureUnit < gl.TEXTURE0 || glTextureUnit > maxTextureUnit) {
        const textureUnitRange = `[gl.TEXTURE0, gl.TEXTURE${maxTextureUnit}]`;
        throw new Error(`textureUnit must be in ${textureUnitRange}.`);
    }
}
export function getBatchDim(shape, dimsToSkip = 2) {
    return util.sizeFromShape(shape.slice(0, shape.length - dimsToSkip));
}
export function getRowsCols(shape) {
    if (shape.length === 0) {
        throw Error('Cannot get rows and columns of an empty shape array.');
    }
    return [
        shape.length > 1 ? shape[shape.length - 2] : 1, shape[shape.length - 1]
    ];
}
export function getShapeAs3D(shape) {
    let shapeAs3D = [1, 1, 1];
    const isScalar = shape.length === 0 || (shape.length === 1 && shape[0] === 1);
    if (!isScalar) {
        shapeAs3D =
            [getBatchDim(shape), ...getRowsCols(shape)];
    }
    return shapeAs3D;
}
export function getTextureShapeFromLogicalShape(logShape, isPacked = false) {
    let maxTexSize = env().getNumber('WEBGL_MAX_TEXTURE_SIZE');
    if (isPacked) {
        maxTexSize = maxTexSize * 2;
        // This logic ensures we accurately count the number of packed texels needed
        // to accommodate the tensor. We can only pack values in the same texel if
        // they are from adjacent pairs of rows/cols within the same batch. So if a
        // tensor has 3 rows, we pretend it has 4 rows in order to account for the
        // fact that the texels containing the third row are half empty.
        logShape = logShape.map((d, i) => i >= logShape.length - 2 ?
            util.nearestLargerEven(logShape[i]) :
            logShape[i]);
        // Packed texture height is at least 2 (the channel height of a single
        // texel).
        if (logShape.length === 1) {
            logShape = [2, logShape[0]];
        }
    }
    // If logical shape is 2, we don't squeeze, since we want to match physical.
    if (logShape.length !== 2) {
        const squeezeResult = util.squeezeShape(logShape);
        logShape = squeezeResult.newShape;
    }
    let size = util.sizeFromShape(logShape);
    if (logShape.length <= 1 && size <= maxTexSize) {
        return [1, size];
    }
    else if (logShape.length === 2 && logShape[0] <= maxTexSize &&
        logShape[1] <= maxTexSize) {
        return logShape;
    }
    else if (logShape.length === 3 && logShape[0] * logShape[1] <= maxTexSize &&
        logShape[2] <= maxTexSize) {
        return [logShape[0] * logShape[1], logShape[2]];
    }
    else if (logShape.length === 3 && logShape[0] <= maxTexSize &&
        logShape[1] * logShape[2] <= maxTexSize) {
        return [logShape[0], logShape[1] * logShape[2]];
    }
    else if (logShape.length === 4 &&
        logShape[0] * logShape[1] * logShape[2] <= maxTexSize &&
        logShape[3] <= maxTexSize) {
        return [logShape[0] * logShape[1] * logShape[2], logShape[3]];
    }
    else if (logShape.length === 4 && logShape[0] <= maxTexSize &&
        logShape[1] * logShape[2] * logShape[3] <= maxTexSize) {
        return [logShape[0], logShape[1] * logShape[2] * logShape[3]];
    }
    else {
        if (isPacked) {
            // For packed textures size equals the number of channels required to
            // accommodate the texture data. However in order to squarify such that
            // inner dimensions stay even, we rewrite size to equal the number of
            // texels. Then in the return statement we rehydrate the squarified
            // dimensions to channel units.
            const batchDim = getBatchDim(logShape);
            let rows = 2, cols = 2;
            if (logShape.length) {
                [rows, cols] = getRowsCols(logShape);
            }
            size = batchDim * (rows / 2) * (cols / 2);
            return util.sizeToSquarishShape(size).map(d => d * 2);
        }
        return util.sizeToSquarishShape(size);
    }
}
function isEven(n) {
    return n % 2 === 0;
}
/**
 * This determines whether reshaping a packed texture requires rearranging
 * the data within the texture, assuming 2x2 packing.
 */
export function isReshapeFree(shape1, shape2) {
    shape1 = shape1.slice(-2);
    shape2 = shape2.slice(-2);
    if (util.arraysEqual(shape1, shape2)) {
        return true;
    }
    if (!shape1.length || !shape2.length) { // One of the shapes is a scalar.
        return true;
    }
    if (shape1[0] === 0 || shape1[1] === 0 || shape2[0] === 0 ||
        shape2[1] === 0) {
        return true;
    }
    if (shape1.length !== shape2.length) { // One of the shapes is a vector.
        const shape1Cols = shape1.slice(-1)[0];
        const shape2Cols = shape2.slice(-1)[0];
        if (shape1Cols === shape2Cols) {
            return true;
        }
        if (isEven(shape1Cols) && isEven(shape2Cols) &&
            (shape1[0] === 1 || shape2[0] === 1)) {
            return true;
        }
    }
    return shape1[1] === shape2[1] && isEven(shape1[0]) && isEven(shape2[0]);
}
// We cache webgl params because the environment gets reset between
// unit tests and we don't want to constantly query the WebGLContext for
// MAX_TEXTURE_SIZE.
let MAX_TEXTURE_SIZE;
let MAX_TEXTURES_IN_SHADER;
export function getWebGLMaxTextureSize(webGLVersion) {
    if (MAX_TEXTURE_SIZE == null) {
        const gl = getWebGLContext(webGLVersion);
        MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
    return MAX_TEXTURE_SIZE;
}
export function resetMaxTextureSize() {
    MAX_TEXTURE_SIZE = null;
}
export function resetMaxTexturesInShader() {
    MAX_TEXTURES_IN_SHADER = null;
}
export function getMaxTexturesInShader(webGLVersion) {
    if (MAX_TEXTURES_IN_SHADER == null) {
        const gl = getWebGLContext(webGLVersion);
        MAX_TEXTURES_IN_SHADER = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    }
    // We cap at 16 to avoid spurious runtime "memory exhausted" error.
    return Math.min(16, MAX_TEXTURES_IN_SHADER);
}
export function getWebGLDisjointQueryTimerVersion(webGLVersion) {
    if (webGLVersion === 0) {
        return 0;
    }
    let queryTimerVersion;
    const gl = getWebGLContext(webGLVersion);
    if (hasExtension(gl, 'EXT_disjoint_timer_query_webgl2') &&
        webGLVersion === 2) {
        queryTimerVersion = 2;
    }
    else if (hasExtension(gl, 'EXT_disjoint_timer_query')) {
        queryTimerVersion = 1;
    }
    else {
        queryTimerVersion = 0;
    }
    return queryTimerVersion;
}
export function hasExtension(gl, extensionName) {
    const ext = gl.getExtension(extensionName);
    return ext != null;
}
export function isWebGLVersionEnabled(webGLVersion) {
    try {
        const gl = getWebGLContext(webGLVersion);
        if (gl != null) {
            return true;
        }
    }
    catch (e) {
        console.log('Error when getting WebGL context: ', e);
        return false;
    }
    return false;
}
export function isCapableOfRenderingToFloatTexture(webGLVersion) {
    if (webGLVersion === 0) {
        return false;
    }
    const gl = getWebGLContext(webGLVersion);
    if (webGLVersion === 1) {
        if (!hasExtension(gl, 'OES_texture_float')) {
            return false;
        }
    }
    else {
        if (!hasExtension(gl, 'EXT_color_buffer_float')) {
            return false;
        }
    }
    const isFrameBufferComplete = createFloatTextureAndBindToFramebuffer(gl);
    return isFrameBufferComplete;
}
/**
 * Check if we can download values from a float/half-float texture.
 *
 * Note that for performance reasons we use binding a texture to a framebuffer
 * as a proxy for ability to download float values later using readPixels. The
 * texture params of this texture will not match those in readPixels exactly
 * but if we are unable to bind some kind of float texture to the frameBuffer
 * then we definitely will not be able to read float values from it.
 */
export function isDownloadFloatTextureEnabled(webGLVersion) {
    if (webGLVersion === 0) {
        return false;
    }
    const gl = getWebGLContext(webGLVersion);
    if (webGLVersion === 1) {
        if (!hasExtension(gl, 'OES_texture_float')) {
            return false;
        }
        if (!hasExtension(gl, 'WEBGL_color_buffer_float')) {
            return false;
        }
    }
    else {
        if (hasExtension(gl, 'EXT_color_buffer_float')) {
            return createFloatTextureAndBindToFramebuffer(gl);
        }
        const COLOR_BUFFER_HALF_FLOAT = 'EXT_color_buffer_half_float';
        if (hasExtension(gl, COLOR_BUFFER_HALF_FLOAT)) {
            const textureHalfFloatExtension = gl.getExtension(COLOR_BUFFER_HALF_FLOAT);
            return createHalfFloatTextureAndBindToFramebuffer(gl, textureHalfFloatExtension);
        }
        return false;
    }
    const isFrameBufferComplete = createFloatTextureAndBindToFramebuffer(gl);
    return isFrameBufferComplete;
}
function createFloatTextureAndBindToFramebuffer(gl) {
    const texConfig = getTextureConfig(gl);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const width = 1;
    const height = 1;
    gl.texImage2D(gl.TEXTURE_2D, 0, texConfig.internalFormatFloat, width, height, 0, texConfig.textureFormatFloat, texConfig.textureTypeFloat, null);
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const isFrameBufferComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(frameBuffer);
    return isFrameBufferComplete;
}
function createHalfFloatTextureAndBindToFramebuffer(
// tslint:disable-next-line:no-any
gl, textureHalfFloatExtension) {
    const texConfig = getTextureConfig(gl, textureHalfFloatExtension);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const width = 1;
    const height = 1;
    gl.texImage2D(gl.TEXTURE_2D, 0, texConfig.internalFormatHalfFloat, width, height, 0, texConfig.textureFormatFloat, texConfig.textureTypeHalfFloat, null);
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const isFrameBufferComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(frameBuffer);
    return isFrameBufferComplete;
}
export function isWebGLFenceEnabled(webGLVersion) {
    if (webGLVersion !== 2) {
        return false;
    }
    const gl = getWebGLContext(webGLVersion);
    // tslint:disable-next-line:no-any
    const isEnabled = gl.fenceSync != null;
    return isEnabled;
}
export function assertNotComplex(tensor, opName) {
    if (!Array.isArray(tensor)) {
        tensor = [tensor];
    }
    tensor.forEach(t => {
        if (t != null) {
            util.assert(t.dtype !== 'complex64', () => `${opName} does not support complex64 tensors ` +
                'in the WebGL backend.');
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViZ2xfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvd2ViZ2xfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFjLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTVELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTVDLE1BQU0sVUFBVSxZQUFZLENBQUksRUFBeUIsRUFBRSxJQUFhO0lBQ3RFLE1BQU0sV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDO0lBQzNCLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzFCLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyQjtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxFQUF5QjtJQUNoRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDNUIsSUFBSSxLQUFLLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNwRTtBQUNILENBQUM7QUFFRCxxRUFBcUU7QUFDckUsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQzVCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQztBQUUxQixNQUFNLFVBQVUsZ0JBQWdCLENBQUMsR0FBVztJQUMxQyxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQzFELENBQUMsV0FBVyxHQUFH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Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtlbnYsIFRlbnNvckluZm8sIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Z2V0V2ViR0xDb250ZXh0fSBmcm9tICcuL2NhbnZhc191dGlsJztcbmltcG9ydCB7Z2V0VGV4dHVyZUNvbmZpZ30gZnJvbSAnLi90ZXhfdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsQW5kQ2hlY2s8VD4oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgZnVuYzogKCkgPT4gVCk6IFQge1xuICBjb25zdCByZXR1cm5WYWx1ZSA9IGZ1bmMoKTtcbiAgaWYgKGVudigpLmdldEJvb2woJ0RFQlVHJykpIHtcbiAgICBjaGVja1dlYkdMRXJyb3IoZ2wpO1xuICB9XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn1cblxuZnVuY3Rpb24gY2hlY2tXZWJHTEVycm9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpIHtcbiAgY29uc3QgZXJyb3IgPSBnbC5nZXRFcnJvcigpO1xuICBpZiAoZXJyb3IgIT09IGdsLk5PX0VSUk9SKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdXZWJHTCBFcnJvcjogJyArIGdldFdlYkdMRXJyb3JNZXNzYWdlKGdsLCBlcnJvcikpO1xuICB9XG59XG5cbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hhbGYtcHJlY2lzaW9uX2Zsb2F0aW5nLXBvaW50X2Zvcm1hdFxuY29uc3QgTUlOX0ZMT0FUMTYgPSA1Ljk2ZS04O1xuY29uc3QgTUFYX0ZMT0FUMTYgPSA2NTUwNDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbkJlUmVwcmVzZW50ZWQobnVtOiBudW1iZXIpOiBib29sZWFuIHtcbiAgaWYgKGVudigpLmdldEJvb2woJ1dFQkdMX1JFTkRFUl9GTE9BVDMyX0VOQUJMRUQnKSB8fCBudW0gPT09IDAgfHxcbiAgICAgIChNSU5fRkxPQVQxNiA8IE1hdGguYWJzKG51bSkgJiYgTWF0aC5hYnMobnVtKSA8IE1BWF9GTE9BVDE2KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlYkdMRXJyb3JNZXNzYWdlKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHN0YXR1czogbnVtYmVyKTogc3RyaW5nIHtcbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIGdsLk5PX0VSUk9SOlxuICAgICAgcmV0dXJuICdOT19FUlJPUic7XG4gICAgY2FzZSBnbC5JTlZBTElEX0VOVU06XG4gICAgICByZXR1cm4gJ0lOVkFMSURfRU5VTSc7XG4gICAgY2FzZSBnbC5JTlZBTElEX1ZBTFVFOlxuICAgICAgcmV0dXJuICdJTlZBTElEX1ZBTFVFJztcbiAgICBjYXNlIGdsLklOVkFMSURfT1BFUkFUSU9OOlxuICAgICAgcmV0dXJuICdJTlZBTElEX09QRVJBVElPTic7XG4gICAgY2FzZSBnbC5JTlZBTElEX0ZSQU1FQlVGRkVSX09QRVJBVElPTjpcbiAgICAgIHJldHVybiAnSU5WQUxJRF9GUkFNRUJVRkZFUl9PUEVSQVRJT04nO1xuICAgIGNhc2UgZ2wuT1VUX09GX01FTU9SWTpcbiAgICAgIHJldHVybiAnT1VUX09GX01FTU9SWSc7XG4gICAgY2FzZSBnbC5DT05URVhUX0xPU1RfV0VCR0w6XG4gICAgICByZXR1cm4gJ0NPTlRFWFRfTE9TVF9XRUJHTCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgVW5rbm93biBlcnJvciBjb2RlICR7c3RhdHVzfWA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbk9yVGhyb3coXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgZXh0ZW5zaW9uTmFtZTogc3RyaW5nKToge30ge1xuICByZXR1cm4gdGhyb3dJZk51bGw8e30+KFxuICAgICAgZ2wsICgpID0+IGdsLmdldEV4dGVuc2lvbihleHRlbnNpb25OYW1lKSxcbiAgICAgICdFeHRlbnNpb24gXCInICsgZXh0ZW5zaW9uTmFtZSArICdcIiBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgYnJvd3Nlci4nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZlcnRleFNoYWRlcihcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2ZXJ0ZXhTaGFkZXJTb3VyY2U6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcbiAgY29uc3QgdmVydGV4U2hhZGVyOiBXZWJHTFNoYWRlciA9IHRocm93SWZOdWxsPFdlYkdMU2hhZGVyPihcbiAgICAgIGdsLCAoKSA9PiBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUiksXG4gICAgICAnVW5hYmxlIHRvIGNyZWF0ZSB2ZXJ0ZXggV2ViR0xTaGFkZXIuJyk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlciwgdmVydGV4U2hhZGVyU291cmNlKSk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpKTtcbiAgaWYgKGdsLmdldFNoYWRlclBhcmFtZXRlcih2ZXJ0ZXhTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSA9PT0gZmFsc2UpIHtcbiAgICBjb25zb2xlLmxvZyhnbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGNvbXBpbGUgdmVydGV4IHNoYWRlci4nKTtcbiAgfVxuICByZXR1cm4gdmVydGV4U2hhZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRTaGFkZXIoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgZnJhZ21lbnRTaGFkZXJTb3VyY2U6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcbiAgY29uc3QgZnJhZ21lbnRTaGFkZXI6IFdlYkdMU2hhZGVyID0gdGhyb3dJZk51bGw8V2ViR0xTaGFkZXI+KFxuICAgICAgZ2wsICgpID0+IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpLFxuICAgICAgJ1VuYWJsZSB0byBjcmVhdGUgZnJhZ21lbnQgV2ViR0xTaGFkZXIuJyk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVyLCBmcmFnbWVudFNoYWRlclNvdXJjZSkpO1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpKTtcbiAgaWYgKGdsLmdldFNoYWRlclBhcmFtZXRlcihmcmFnbWVudFNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpID09PSBmYWxzZSkge1xuICAgIGxvZ1NoYWRlclNvdXJjZUFuZEluZm9Mb2coXG4gICAgICAgIGZyYWdtZW50U2hhZGVyU291cmNlLCBnbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gY29tcGlsZSBmcmFnbWVudCBzaGFkZXIuJyk7XG4gIH1cbiAgcmV0dXJuIGZyYWdtZW50U2hhZGVyO1xufVxuXG5jb25zdCBsaW5lTnVtYmVyUmVnZXggPSAvRVJST1I6IFswLTldKzooWzAtOV0rKTovZztcbmZ1bmN0aW9uIGxvZ1NoYWRlclNvdXJjZUFuZEluZm9Mb2coXG4gICAgc2hhZGVyU291cmNlOiBzdHJpbmcsIHNoYWRlckluZm9Mb2c6IHN0cmluZykge1xuICBjb25zdCBsaW5lTnVtYmVyUmVnZXhSZXN1bHQgPSBsaW5lTnVtYmVyUmVnZXguZXhlYyhzaGFkZXJJbmZvTG9nKTtcbiAgaWYgKGxpbmVOdW1iZXJSZWdleFJlc3VsdCA9PSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coYENvdWxkbid0IHBhcnNlIGxpbmUgbnVtYmVyIGluIGVycm9yOiAke3NoYWRlckluZm9Mb2d9YCk7XG4gICAgY29uc29sZS5sb2coc2hhZGVyU291cmNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBsaW5lTnVtYmVyID0gK2xpbmVOdW1iZXJSZWdleFJlc3VsdFsxXTtcblxuICBjb25zdCBzaGFkZXJMaW5lcyA9IHNoYWRlclNvdXJjZS5zcGxpdCgnXFxuJyk7XG4gIGNvbnN0IHBhZCA9IHNoYWRlckxpbmVzLmxlbmd0aC50b1N0cmluZygpLmxlbmd0aCArIDI7XG4gIGNvbnN0IGxpbmVzV2l0aExpbmVOdW1iZXJzID0gc2hhZGVyTGluZXMubWFwKFxuICAgICAgKGxpbmUsIGxpbmVOdW1iZXIpID0+XG4gICAgICAgICAgdXRpbC5yaWdodFBhZCgobGluZU51bWJlciArIDEpLnRvU3RyaW5nKCksIHBhZCkgKyBsaW5lKTtcbiAgbGV0IG1heExpbmVMZW5ndGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzV2l0aExpbmVOdW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWF4TGluZUxlbmd0aCA9IE1hdGgubWF4KGxpbmVzV2l0aExpbmVOdW1iZXJzW2ldLmxlbmd0aCwgbWF4TGluZUxlbmd0aCk7XG4gIH1cblxuICBjb25zdCBiZWZvcmVFcnJvckxpbmVzID0gbGluZXNXaXRoTGluZU51bWJlcnMuc2xpY2UoMCwgbGluZU51bWJlciAtIDEpO1xuICBjb25zdCBlcnJvckxpbmUgPSBsaW5lc1dpdGhMaW5lTnVtYmVycy5zbGljZShsaW5lTnVtYmVyIC0gMSwgbGluZU51bWJlcik7XG4gIGNvbnN0IGFmdGVyRXJyb3JMaW5lcyA9IGxpbmVzV2l0aExpbmVOdW1iZXJzLnNsaWNlKGxpbmVOdW1iZXIpO1xuXG4gIGNvbnNvbGUubG9nKGJlZm9yZUVycm9yTGluZXMuam9pbignXFxuJykpO1xuICBjb25zb2xlLmxvZyhzaGFkZXJJbmZvTG9nLnNwbGl0KCdcXG4nKVswXSk7XG4gIGNvbnNvbGUubG9nKFxuICAgICAgYCVjICR7dXRpbC5yaWdodFBhZChlcnJvckxpbmVbMF0sIG1heExpbmVMZW5ndGgpfWAsXG4gICAgICAnYm9yZGVyOjFweCBzb2xpZCByZWQ7IGJhY2tncm91bmQtY29sb3I6I2UzZDJkMjsgY29sb3I6I2E2MTcxNycpO1xuICBjb25zb2xlLmxvZyhhZnRlckVycm9yTGluZXMuam9pbignXFxuJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvZ3JhbShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogV2ViR0xQcm9ncmFtIHtcbiAgcmV0dXJuIHRocm93SWZOdWxsPFdlYkdMUHJvZ3JhbT4oXG4gICAgICBnbCwgKCkgPT4gZ2wuY3JlYXRlUHJvZ3JhbSgpLCAnVW5hYmxlIHRvIGNyZWF0ZSBXZWJHTFByb2dyYW0uJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5rUHJvZ3JhbShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcm9ncmFtOiBXZWJHTFByb2dyYW0pIHtcbiAgY2FsbEFuZENoZWNrKGdsLCAoKSA9PiBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKSk7XG4gIGlmIChnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSA9PT0gZmFsc2UpIHtcbiAgICBjb25zb2xlLmxvZyhnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gbGluayB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlcnMuJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUHJvZ3JhbShcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcm9ncmFtOiBXZWJHTFByb2dyYW0pIHtcbiAgY2FsbEFuZENoZWNrKGdsLCAoKSA9PiBnbC52YWxpZGF0ZVByb2dyYW0ocHJvZ3JhbSkpO1xuICBpZiAoZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5WQUxJREFURV9TVEFUVVMpID09PSBmYWxzZSkge1xuICAgIGNvbnNvbGUubG9nKGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NoYWRlciBwcm9ncmFtIHZhbGlkYXRpb24gZmFpbGVkLicpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGF0aWNWZXJ0ZXhCdWZmZXIoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgZGF0YTogRmxvYXQzMkFycmF5KTogV2ViR0xCdWZmZXIge1xuICBjb25zdCBidWZmZXI6IFdlYkdMQnVmZmVyID0gdGhyb3dJZk51bGw8V2ViR0xCdWZmZXI+KFxuICAgICAgZ2wsICgpID0+IGdsLmNyZWF0ZUJ1ZmZlcigpLCAnVW5hYmxlIHRvIGNyZWF0ZSBXZWJHTEJ1ZmZlcicpO1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpKTtcbiAgY2FsbEFuZENoZWNrKGdsLCAoKSA9PiBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgZ2wuU1RBVElDX0RSQVcpKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0YXRpY0luZGV4QnVmZmVyKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIGRhdGE6IFVpbnQxNkFycmF5KTogV2ViR0xCdWZmZXIge1xuICBjb25zdCBidWZmZXI6IFdlYkdMQnVmZmVyID0gdGhyb3dJZk51bGw8V2ViR0xCdWZmZXI+KFxuICAgICAgZ2wsICgpID0+IGdsLmNyZWF0ZUJ1ZmZlcigpLCAnVW5hYmxlIHRvIGNyZWF0ZSBXZWJHTEJ1ZmZlcicpO1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ1ZmZlcikpO1xuICBjYWxsQW5kQ2hlY2soXG4gICAgICBnbCwgKCkgPT4gZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZGF0YSwgZ2wuU1RBVElDX0RSQVcpKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE51bUNoYW5uZWxzKCk6IG51bWJlciB7XG4gIGlmIChlbnYoKS5nZXROdW1iZXIoJ1dFQkdMX1ZFUlNJT04nKSA9PT0gMikge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiA0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGV4dHVyZShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogV2ViR0xUZXh0dXJlIHtcbiAgcmV0dXJuIHRocm93SWZOdWxsPFdlYkdMVGV4dHVyZT4oXG4gICAgICBnbCwgKCkgPT4gZ2wuY3JlYXRlVGV4dHVyZSgpLCAnVW5hYmxlIHRvIGNyZWF0ZSBXZWJHTFRleHR1cmUuJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVRleHR1cmVTaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gIGNvbnN0IG1heFRleHR1cmVTaXplID0gZW52KCkuZ2V0TnVtYmVyKCdXRUJHTF9NQVhfVEVYVFVSRV9TSVpFJyk7XG4gIGlmICgod2lkdGggPD0gMCkgfHwgKGhlaWdodCA8PSAwKSkge1xuICAgIGNvbnN0IHJlcXVlc3RlZCA9IGBbJHt3aWR0aH14JHtoZWlnaHR9XWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1ZXN0ZWQgdGV4dHVyZSBzaXplICcgKyByZXF1ZXN0ZWQgKyAnIGlzIGludmFsaWQuJyk7XG4gIH1cbiAgaWYgKCh3aWR0aCA+IG1heFRleHR1cmVTaXplKSB8fCAoaGVpZ2h0ID4gbWF4VGV4dHVyZVNpemUpKSB7XG4gICAgY29uc3QgcmVxdWVzdGVkID0gYFske3dpZHRofXgke2hlaWdodH1dYDtcbiAgICBjb25zdCBtYXggPSBgWyR7bWF4VGV4dHVyZVNpemV9eCR7bWF4VGV4dHVyZVNpemV9XWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnUmVxdWVzdGVkIHRleHR1cmUgc2l6ZSAnICsgcmVxdWVzdGVkICtcbiAgICAgICAgJyBncmVhdGVyIHRoYW4gV2ViR0wgbWF4aW11bSBvbiB0aGlzIGJyb3dzZXIgLyBHUFUgJyArIG1heCArICcuJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lYnVmZmVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBXZWJHTEZyYW1lYnVmZmVyIHtcbiAgcmV0dXJuIHRocm93SWZOdWxsPFdlYkdMRnJhbWVidWZmZXI+KFxuICAgICAgZ2wsICgpID0+IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCksICdVbmFibGUgdG8gY3JlYXRlIFdlYkdMRnJhbWVidWZmZXIuJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kVmVydGV4QnVmZmVyVG9Qcm9ncmFtQXR0cmlidXRlKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW06IFdlYkdMUHJvZ3JhbSwgYXR0cmlidXRlOiBzdHJpbmcsXG4gICAgYnVmZmVyOiBXZWJHTEJ1ZmZlciwgYXJyYXlFbnRyaWVzUGVySXRlbTogbnVtYmVyLCBpdGVtU3RyaWRlSW5CeXRlczogbnVtYmVyLFxuICAgIGl0ZW1PZmZzZXRJbkJ5dGVzOiBudW1iZXIpOiBib29sZWFuIHtcbiAgY29uc3QgbG9jID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgYXR0cmlidXRlKTtcbiAgaWYgKGxvYyA9PT0gLTEpIHtcbiAgICAvLyBUaGUgR1BVIGNvbXBpbGVyIGRlY2lkZWQgdG8gc3RyaXAgb3V0IHRoaXMgYXR0cmlidXRlIGJlY2F1c2UgaXQncyB1bnVzZWQsXG4gICAgLy8gdGh1cyBubyBuZWVkIHRvIGJpbmQuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcikpO1xuICBjYWxsQW5kQ2hlY2soXG4gICAgICBnbCxcbiAgICAgICgpID0+IGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXG4gICAgICAgICAgbG9jLCBhcnJheUVudHJpZXNQZXJJdGVtLCBnbC5GTE9BVCwgZmFsc2UsIGl0ZW1TdHJpZGVJbkJ5dGVzLFxuICAgICAgICAgIGl0ZW1PZmZzZXRJbkJ5dGVzKSk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jKSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZFRleHR1cmVVbml0KFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHRleHR1cmU6IFdlYkdMVGV4dHVyZSwgdGV4dHVyZVVuaXQ6IG51bWJlcikge1xuICB2YWxpZGF0ZVRleHR1cmVVbml0KGdsLCB0ZXh0dXJlVW5pdCk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRleHR1cmVVbml0KSk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5iaW5kVGV4dHVyZVVuaXQoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdGV4dHVyZVVuaXQ6IG51bWJlcikge1xuICB2YWxpZGF0ZVRleHR1cmVVbml0KGdsLCB0ZXh0dXJlVW5pdCk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRleHR1cmVVbml0KSk7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvZ3JhbVVuaWZvcm1Mb2NhdGlvbk9yVGhyb3coXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuICAgIHVuaWZvcm1OYW1lOiBzdHJpbmcpOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB7XG4gIHJldHVybiB0aHJvd0lmTnVsbDxXZWJHTFVuaWZvcm1Mb2NhdGlvbj4oXG4gICAgICBnbCwgKCkgPT4gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIHVuaWZvcm1OYW1lKSxcbiAgICAgICd1bmlmb3JtIFwiJyArIHVuaWZvcm1OYW1lICsgJ1wiIG5vdCBwcmVzZW50IGluIHByb2dyYW0uJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9ncmFtVW5pZm9ybUxvY2F0aW9uKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcbiAgICB1bmlmb3JtTmFtZTogc3RyaW5nKTogV2ViR0xVbmlmb3JtTG9jYXRpb24ge1xuICByZXR1cm4gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIHVuaWZvcm1OYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRUZXh0dXJlVG9Qcm9ncmFtVW5pZm9ybVNhbXBsZXIoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdGV4dHVyZTogV2ViR0xUZXh0dXJlLFxuICAgIHVuaWZvcm1TYW1wbGVyTG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uLCB0ZXh0dXJlVW5pdDogbnVtYmVyKSB7XG4gIGNhbGxBbmRDaGVjayhnbCwgKCkgPT4gYmluZFRleHR1cmVVbml0KGdsLCB0ZXh0dXJlLCB0ZXh0dXJlVW5pdCkpO1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLnVuaWZvcm0xaSh1bmlmb3JtU2FtcGxlckxvY2F0aW9uLCB0ZXh0dXJlVW5pdCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbnZhc1RvRnJhbWVidWZmZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCkge1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCkpO1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCkpO1xuICBjYWxsQW5kQ2hlY2soZ2wsICgpID0+IGdsLnNjaXNzb3IoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ29sb3JUZXh0dXJlVG9GcmFtZWJ1ZmZlcihcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB0ZXh0dXJlOiBXZWJHTFRleHR1cmUsXG4gICAgZnJhbWVidWZmZXI6IFdlYkdMRnJhbWVidWZmZXIpIHtcbiAgY2FsbEFuZENoZWNrKGdsLCAoKSA9PiBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKSk7XG4gIGNhbGxBbmRDaGVjayhcbiAgICAgIGdsLFxuICAgICAgKCkgPT4gZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG4gICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmJpbmRDb2xvclRleHR1cmVGcm9tRnJhbWVidWZmZXIoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgZnJhbWVidWZmZXI6IFdlYkdMRnJhbWVidWZmZXIpIHtcbiAgY2FsbEFuZENoZWNrKGdsLCAoKSA9PiBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyKSk7XG4gIGNhbGxBbmRDaGVjayhcbiAgICAgIGdsLFxuICAgICAgKCkgPT4gZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG4gICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCBudWxsLCAwKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUZyYW1lYnVmZmVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpIHtcbiAgY29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XG4gIGlmIChzdGF0dXMgIT09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnRXJyb3IgYmluZGluZyBmcmFtZWJ1ZmZlcjogJyArIGdldEZyYW1lYnVmZmVyRXJyb3JNZXNzYWdlKGdsLCBzdGF0dXMpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnJhbWVidWZmZXJFcnJvck1lc3NhZ2UoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgc3RhdHVzOiBudW1iZXIpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHN0YXR1cykge1xuICAgIGNhc2UgZ2wuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UOlxuICAgICAgcmV0dXJuICdGUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0FUVEFDSE1FTlQnO1xuICAgIGNhc2UgZ2wuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQ6XG4gICAgICByZXR1cm4gJ0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfTUlTU0lOR19BVFRBQ0hNRU5UJztcbiAgICBjYXNlIGdsLkZSQU1FQlVGRkVSX0lOQ09NUExFVEVfRElNRU5TSU9OUzpcbiAgICAgIHJldHVybiAnRlJBTUVCVUZGRVJfSU5DT01QTEVURV9ESU1FTlNJT05TJztcbiAgICBjYXNlIGdsLkZSQU1FQlVGRkVSX1VOU1VQUE9SVEVEOlxuICAgICAgcmV0dXJuICdGUkFNRUJVRkZFUl9VTlNVUFBPUlRFRCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgdW5rbm93biBlcnJvciAke3N0YXR1c31gO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRocm93SWZOdWxsPFQ+KFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHJldHVyblRPck51bGw6ICgpID0+IFQgfCBudWxsLFxuICAgIGZhaWx1cmVNZXNzYWdlOiBzdHJpbmcpOiBUIHtcbiAgY29uc3QgdE9yTnVsbDogVHxudWxsID0gY2FsbEFuZENoZWNrKGdsLCAoKSA9PiByZXR1cm5UT3JOdWxsKCkpO1xuICBpZiAodE9yTnVsbCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZhaWx1cmVNZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gdE9yTnVsbDtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVUZXh0dXJlVW5pdChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB0ZXh0dXJlVW5pdDogbnVtYmVyKSB7XG4gIGNvbnN0IG1heFRleHR1cmVVbml0ID0gZ2wuTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMgLSAxO1xuICBjb25zdCBnbFRleHR1cmVVbml0ID0gdGV4dHVyZVVuaXQgKyBnbC5URVhUVVJFMDtcbiAgaWYgKGdsVGV4dHVyZVVuaXQgPCBnbC5URVhUVVJFMCB8fCBnbFRleHR1cmVVbml0ID4gbWF4VGV4dHVyZVVuaXQpIHtcbiAgICBjb25zdCB0ZXh0dXJlVW5pdFJhbmdlID0gYFtnbC5URVhUVVJFMCwgZ2wuVEVYVFVSRSR7bWF4VGV4dHVyZVVuaXR9XWA7XG4gICAgdGhyb3cgbmV3IEVycm9yKGB0ZXh0dXJlVW5pdCBtdXN0IGJlIGluICR7dGV4dHVyZVVuaXRSYW5nZX0uYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhdGNoRGltKHNoYXBlOiBudW1iZXJbXSwgZGltc1RvU2tpcCA9IDIpOiBudW1iZXIge1xuICByZXR1cm4gdXRpbC5zaXplRnJvbVNoYXBlKHNoYXBlLnNsaWNlKDAsIHNoYXBlLmxlbmd0aCAtIGRpbXNUb1NraXApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvd3NDb2xzKHNoYXBlOiBudW1iZXJbXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICBpZiAoc2hhcGUubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBnZXQgcm93cyBhbmQgY29sdW1ucyBvZiBhbiBlbXB0eSBzaGFwZSBhcnJheS4nKTtcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgc2hhcGUubGVuZ3RoID4gMSA/IHNoYXBlW3NoYXBlLmxlbmd0aCAtIDJdIDogMSwgc2hhcGVbc2hhcGUubGVuZ3RoIC0gMV1cbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXBlQXMzRChzaGFwZTogbnVtYmVyW10pOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xuICBsZXQgc2hhcGVBczNEOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMSwgMV07XG4gIGNvbnN0IGlzU2NhbGFyID0gc2hhcGUubGVuZ3RoID09PSAwIHx8IChzaGFwZS5sZW5ndGggPT09IDEgJiYgc2hhcGVbMF0gPT09IDEpO1xuICBpZiAoIWlzU2NhbGFyKSB7XG4gICAgc2hhcGVBczNEID1cbiAgICAgICAgW2dldEJhdGNoRGltKHNoYXBlKSwgLi4uZ2V0Um93c0NvbHMoc2hhcGUpXSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIH1cbiAgcmV0dXJuIHNoYXBlQXMzRDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRleHR1cmVTaGFwZUZyb21Mb2dpY2FsU2hhcGUoXG4gICAgbG9nU2hhcGU6IG51bWJlcltdLCBpc1BhY2tlZCA9IGZhbHNlKTogW251bWJlciwgbnVtYmVyXSB7XG4gIGxldCBtYXhUZXhTaXplID0gZW52KCkuZ2V0TnVtYmVyKCdXRUJHTF9NQVhfVEVYVFVSRV9TSVpFJyk7XG4gIGlmIChpc1BhY2tlZCkge1xuICAgIG1heFRleFNpemUgPSBtYXhUZXhTaXplICogMjtcblxuICAgIC8vIFRoaXMgbG9naWMgZW5zdXJlcyB3ZSBhY2N1cmF0ZWx5IGNvdW50IHRoZSBudW1iZXIgb2YgcGFja2VkIHRleGVscyBuZWVkZWRcbiAgICAvLyB0byBhY2NvbW1vZGF0ZSB0aGUgdGVuc29yLiBXZSBjYW4gb25seSBwYWNrIHZhbHVlcyBpbiB0aGUgc2FtZSB0ZXhlbCBpZlxuICAgIC8vIHRoZXkgYXJlIGZyb20gYWRqYWNlbnQgcGFpcnMgb2Ygcm93cy9jb2xzIHdpdGhpbiB0aGUgc2FtZSBiYXRjaC4gU28gaWYgYVxuICAgIC8vIHRlbnNvciBoYXMgMyByb3dzLCB3ZSBwcmV0ZW5kIGl0IGhhcyA0IHJvd3MgaW4gb3JkZXIgdG8gYWNjb3VudCBmb3IgdGhlXG4gICAgLy8gZmFjdCB0aGF0IHRoZSB0ZXhlbHMgY29udGFpbmluZyB0aGUgdGhpcmQgcm93IGFyZSBoYWxmIGVtcHR5LlxuICAgIGxvZ1NoYXBlID0gbG9nU2hhcGUubWFwKFxuICAgICAgICAoZCwgaSkgPT4gaSA+PSBsb2dTaGFwZS5sZW5ndGggLSAyID9cbiAgICAgICAgICAgIHV0aWwubmVhcmVzdExhcmdlckV2ZW4obG9nU2hhcGVbaV0pIDpcbiAgICAgICAgICAgIGxvZ1NoYXBlW2ldKTtcblxuICAgIC8vIFBhY2tlZCB0ZXh0dXJlIGhlaWdodCBpcyBhdCBsZWFzdCAyICh0aGUgY2hhbm5lbCBoZWlnaHQgb2YgYSBzaW5nbGVcbiAgICAvLyB0ZXhlbCkuXG4gICAgaWYgKGxvZ1NoYXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgbG9nU2hhcGUgPSBbMiwgbG9nU2hhcGVbMF1dO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIGxvZ2ljYWwgc2hhcGUgaXMgMiwgd2UgZG9uJ3Qgc3F1ZWV6ZSwgc2luY2Ugd2Ugd2FudCB0byBtYXRjaCBwaHlzaWNhbC5cbiAgaWYgKGxvZ1NoYXBlLmxlbmd0aCAhPT0gMikge1xuICAgIGNvbnN0IHNxdWVlemVSZXN1bHQgPSB1dGlsLnNxdWVlemVTaGFwZShsb2dTaGFwZSk7XG4gICAgbG9nU2hhcGUgPSBzcXVlZXplUmVzdWx0Lm5ld1NoYXBlO1xuICB9XG5cbiAgbGV0IHNpemUgPSB1dGlsLnNpemVGcm9tU2hhcGUobG9nU2hhcGUpO1xuICBpZiAobG9nU2hhcGUubGVuZ3RoIDw9IDEgJiYgc2l6ZSA8PSBtYXhUZXhTaXplKSB7XG4gICAgcmV0dXJuIFsxLCBzaXplXTtcbiAgfSBlbHNlIGlmIChcbiAgICAgIGxvZ1NoYXBlLmxlbmd0aCA9PT0gMiAmJiBsb2dTaGFwZVswXSA8PSBtYXhUZXhTaXplICYmXG4gICAgICBsb2dTaGFwZVsxXSA8PSBtYXhUZXhTaXplKSB7XG4gICAgcmV0dXJuIGxvZ1NoYXBlIGFzIFtudW1iZXIsIG51bWJlcl07XG4gIH0gZWxzZSBpZiAoXG4gICAgICBsb2dTaGFwZS5sZW5ndGggPT09IDMgJiYgbG9nU2hhcGVbMF0gKiBsb2dTaGFwZVsxXSA8PSBtYXhUZXhTaXplICYmXG4gICAgICBsb2dTaGFwZVsyXSA8PSBtYXhUZXhTaXplKSB7XG4gICAgcmV0dXJuIFtsb2dTaGFwZVswXSAqIGxvZ1NoYXBlWzFdLCBsb2dTaGFwZVsyXV07XG4gIH0gZWxzZSBpZiAoXG4gICAgICBsb2dTaGFwZS5sZW5ndGggPT09IDMgJiYgbG9nU2hhcGVbMF0gPD0gbWF4VGV4U2l6ZSAmJlxuICAgICAgbG9nU2hhcGVbMV0gKiBsb2dTaGFwZVsyXSA8PSBtYXhUZXhTaXplKSB7XG4gICAgcmV0dXJuIFtsb2dTaGFwZVswXSwgbG9nU2hhcGVbMV0gKiBsb2dTaGFwZVsyXV07XG4gIH0gZWxzZSBpZiAoXG4gICAgICBsb2dTaGFwZS5sZW5ndGggPT09IDQgJiZcbiAgICAgIGxvZ1NoYXBlWzBdICogbG9nU2hhcGVbMV0gKiBsb2dTaGFwZVsyXSA8PSBtYXhUZXhTaXplICYmXG4gICAgICBsb2dTaGFwZVszXSA8PSBtYXhUZXhTaXplKSB7XG4gICAgcmV0dXJuIFtsb2dTaGFwZVswXSAqIGxvZ1NoYXBlWzFdICogbG9nU2hhcGVbMl0sIGxvZ1NoYXBlWzNdXTtcbiAgfSBlbHNlIGlmIChcbiAgICAgIGxvZ1NoYXBlLmxlbmd0aCA9PT0gNCAmJiBsb2dTaGFwZVswXSA8PSBtYXhUZXhTaXplICYmXG4gICAgICBsb2dTaGFwZVsxXSAqIGxvZ1NoYXBlWzJdICogbG9nU2hhcGVbM10gPD0gbWF4VGV4U2l6ZSkge1xuICAgIHJldHVybiBbbG9nU2hhcGVbMF0sIGxvZ1NoYXBlWzFdICogbG9nU2hhcGVbMl0gKiBsb2dTaGFwZVszXV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzUGFja2VkKSB7XG4gICAgICAvLyBGb3IgcGFja2VkIHRleHR1cmVzIHNpemUgZXF1YWxzIHRoZSBudW1iZXIgb2YgY2hhbm5lbHMgcmVxdWlyZWQgdG9cbiAgICAgIC8vIGFjY29tbW9kYXRlIHRoZSB0ZXh0dXJlIGRhdGEuIEhvd2V2ZXIgaW4gb3JkZXIgdG8gc3F1YXJpZnkgc3VjaCB0aGF0XG4gICAgICAvLyBpbm5lciBkaW1lbnNpb25zIHN0YXkgZXZlbiwgd2UgcmV3cml0ZSBzaXplIHRvIGVxdWFsIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHRleGVscy4gVGhlbiBpbiB0aGUgcmV0dXJuIHN0YXRlbWVudCB3ZSByZWh5ZHJhdGUgdGhlIHNxdWFyaWZpZWRcbiAgICAgIC8vIGRpbWVuc2lvbnMgdG8gY2hhbm5lbCB1bml0cy5cblxuICAgICAgY29uc3QgYmF0Y2hEaW0gPSBnZXRCYXRjaERpbShsb2dTaGFwZSk7XG4gICAgICBsZXQgcm93cyA9IDIsIGNvbHMgPSAyO1xuICAgICAgaWYgKGxvZ1NoYXBlLmxlbmd0aCkge1xuICAgICAgICBbcm93cywgY29sc10gPSBnZXRSb3dzQ29scyhsb2dTaGFwZSk7XG4gICAgICB9XG4gICAgICBzaXplID0gYmF0Y2hEaW0gKiAocm93cyAvIDIpICogKGNvbHMgLyAyKTtcbiAgICAgIHJldHVybiB1dGlsLnNpemVUb1NxdWFyaXNoU2hhcGUoc2l6ZSkubWFwKGQgPT4gZCAqIDIpIGFzIFtudW1iZXIsIG51bWJlcl07XG4gICAgfVxuICAgIHJldHVybiB1dGlsLnNpemVUb1NxdWFyaXNoU2hhcGUoc2l6ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFdmVuKG46IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gbiAlIDIgPT09IDA7XG59XG5cbi8qKlxuICogVGhpcyBkZXRlcm1pbmVzIHdoZXRoZXIgcmVzaGFwaW5nIGEgcGFja2VkIHRleHR1cmUgcmVxdWlyZXMgcmVhcnJhbmdpbmdcbiAqIHRoZSBkYXRhIHdpdGhpbiB0aGUgdGV4dHVyZSwgYXNzdW1pbmcgMngyIHBhY2tpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Jlc2hhcGVGcmVlKHNoYXBlMTogbnVtYmVyW10sIHNoYXBlMjogbnVtYmVyW10pOiBib29sZWFuIHtcbiAgc2hhcGUxID0gc2hhcGUxLnNsaWNlKC0yKTtcbiAgc2hhcGUyID0gc2hhcGUyLnNsaWNlKC0yKTtcblxuICBpZiAodXRpbC5hcnJheXNFcXVhbChzaGFwZTEsIHNoYXBlMikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICghc2hhcGUxLmxlbmd0aCB8fCAhc2hhcGUyLmxlbmd0aCkgeyAgLy8gT25lIG9mIHRoZSBzaGFwZXMgaXMgYSBzY2FsYXIuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoc2hhcGUxWzBdID09PSAwIHx8IHNoYXBlMVsxXSA9PT0gMCB8fCBzaGFwZTJbMF0gPT09IDAgfHxcbiAgICAgIHNoYXBlMlsxXSA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHNoYXBlMS5sZW5ndGggIT09IHNoYXBlMi5sZW5ndGgpIHsgIC8vIE9uZSBvZiB0aGUgc2hhcGVzIGlzIGEgdmVjdG9yLlxuICAgIGNvbnN0IHNoYXBlMUNvbHMgPSBzaGFwZTEuc2xpY2UoLTEpWzBdO1xuICAgIGNvbnN0IHNoYXBlMkNvbHMgPSBzaGFwZTIuc2xpY2UoLTEpWzBdO1xuICAgIGlmIChzaGFwZTFDb2xzID09PSBzaGFwZTJDb2xzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNFdmVuKHNoYXBlMUNvbHMpICYmIGlzRXZlbihzaGFwZTJDb2xzKSAmJlxuICAgICAgICAoc2hhcGUxWzBdID09PSAxIHx8IHNoYXBlMlswXSA9PT0gMSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2hhcGUxWzFdID09PSBzaGFwZTJbMV0gJiYgaXNFdmVuKHNoYXBlMVswXSkgJiYgaXNFdmVuKHNoYXBlMlswXSk7XG59XG5cbi8vIFdlIGNhY2hlIHdlYmdsIHBhcmFtcyBiZWNhdXNlIHRoZSBlbnZpcm9ubWVudCBnZXRzIHJlc2V0IGJldHdlZW5cbi8vIHVuaXQgdGVzdHMgYW5kIHdlIGRvbid0IHdhbnQgdG8gY29uc3RhbnRseSBxdWVyeSB0aGUgV2ViR0xDb250ZXh0IGZvclxuLy8gTUFYX1RFWFRVUkVfU0laRS5cbmxldCBNQVhfVEVYVFVSRV9TSVpFOiBudW1iZXI7XG5sZXQgTUFYX1RFWFRVUkVTX0lOX1NIQURFUjogbnVtYmVyO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2ViR0xNYXhUZXh0dXJlU2l6ZSh3ZWJHTFZlcnNpb246IG51bWJlcik6IG51bWJlciB7XG4gIGlmIChNQVhfVEVYVFVSRV9TSVpFID09IG51bGwpIHtcbiAgICBjb25zdCBnbCA9IGdldFdlYkdMQ29udGV4dCh3ZWJHTFZlcnNpb24pO1xuICAgIE1BWF9URVhUVVJFX1NJWkUgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1RFWFRVUkVfU0laRSk7XG4gIH1cbiAgcmV0dXJuIE1BWF9URVhUVVJFX1NJWkU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldE1heFRleHR1cmVTaXplKCkge1xuICBNQVhfVEVYVFVSRV9TSVpFID0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXNldE1heFRleHR1cmVzSW5TaGFkZXIoKSB7XG4gIE1BWF9URVhUVVJFU19JTl9TSEFERVIgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4VGV4dHVyZXNJblNoYWRlcih3ZWJHTFZlcnNpb246IG51bWJlcik6IG51bWJlciB7XG4gIGlmIChNQVhfVEVYVFVSRVNfSU5fU0hBREVSID09IG51bGwpIHtcbiAgICBjb25zdCBnbCA9IGdldFdlYkdMQ29udGV4dCh3ZWJHTFZlcnNpb24pO1xuICAgIE1BWF9URVhUVVJFU19JTl9TSEFERVIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMpO1xuICB9XG4gIC8vIFdlIGNhcCBhdCAxNiB0byBhdm9pZCBzcHVyaW91cyBydW50aW1lIFwibWVtb3J5IGV4aGF1c3RlZFwiIGVycm9yLlxuICByZXR1cm4gTWF0aC5taW4oMTYsIE1BWF9URVhUVVJFU19JTl9TSEFERVIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2ViR0xEaXNqb2ludFF1ZXJ5VGltZXJWZXJzaW9uKHdlYkdMVmVyc2lvbjogbnVtYmVyKTpcbiAgICBudW1iZXIge1xuICBpZiAod2ViR0xWZXJzaW9uID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBsZXQgcXVlcnlUaW1lclZlcnNpb246IG51bWJlcjtcbiAgY29uc3QgZ2wgPSBnZXRXZWJHTENvbnRleHQod2ViR0xWZXJzaW9uKTtcblxuICBpZiAoaGFzRXh0ZW5zaW9uKGdsLCAnRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5X3dlYmdsMicpICYmXG4gICAgICB3ZWJHTFZlcnNpb24gPT09IDIpIHtcbiAgICBxdWVyeVRpbWVyVmVyc2lvbiA9IDI7XG4gIH0gZWxzZSBpZiAoaGFzRXh0ZW5zaW9uKGdsLCAnRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5JykpIHtcbiAgICBxdWVyeVRpbWVyVmVyc2lvbiA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcXVlcnlUaW1lclZlcnNpb24gPSAwO1xuICB9XG4gIHJldHVybiBxdWVyeVRpbWVyVmVyc2lvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0V4dGVuc2lvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBleHRlbnNpb25OYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgZXh0ID0gZ2wuZ2V0RXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWUpO1xuICByZXR1cm4gZXh0ICE9IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMVmVyc2lvbkVuYWJsZWQod2ViR0xWZXJzaW9uOiAxfDIpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBnbCA9IGdldFdlYkdMQ29udGV4dCh3ZWJHTFZlcnNpb24pO1xuICAgIGlmIChnbCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hlbiBnZXR0aW5nIFdlYkdMIGNvbnRleHQ6ICcsIGUpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NhcGFibGVPZlJlbmRlcmluZ1RvRmxvYXRUZXh0dXJlKHdlYkdMVmVyc2lvbjogbnVtYmVyKTpcbiAgICBib29sZWFuIHtcbiAgaWYgKHdlYkdMVmVyc2lvbiA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGdsID0gZ2V0V2ViR0xDb250ZXh0KHdlYkdMVmVyc2lvbik7XG5cbiAgaWYgKHdlYkdMVmVyc2lvbiA9PT0gMSkge1xuICAgIGlmICghaGFzRXh0ZW5zaW9uKGdsLCAnT0VTX3RleHR1cmVfZmxvYXQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIWhhc0V4dGVuc2lvbihnbCwgJ0VYVF9jb2xvcl9idWZmZXJfZmxvYXQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGlzRnJhbWVCdWZmZXJDb21wbGV0ZSA9IGNyZWF0ZUZsb2F0VGV4dHVyZUFuZEJpbmRUb0ZyYW1lYnVmZmVyKGdsKTtcbiAgcmV0dXJuIGlzRnJhbWVCdWZmZXJDb21wbGV0ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB3ZSBjYW4gZG93bmxvYWQgdmFsdWVzIGZyb20gYSBmbG9hdC9oYWxmLWZsb2F0IHRleHR1cmUuXG4gKlxuICogTm90ZSB0aGF0IGZvciBwZXJmb3JtYW5jZSByZWFzb25zIHdlIHVzZSBiaW5kaW5nIGEgdGV4dHVyZSB0byBhIGZyYW1lYnVmZmVyXG4gKiBhcyBhIHByb3h5IGZvciBhYmlsaXR5IHRvIGRvd25sb2FkIGZsb2F0IHZhbHVlcyBsYXRlciB1c2luZyByZWFkUGl4ZWxzLiBUaGVcbiAqIHRleHR1cmUgcGFyYW1zIG9mIHRoaXMgdGV4dHVyZSB3aWxsIG5vdCBtYXRjaCB0aG9zZSBpbiByZWFkUGl4ZWxzIGV4YWN0bHlcbiAqIGJ1dCBpZiB3ZSBhcmUgdW5hYmxlIHRvIGJpbmQgc29tZSBraW5kIG9mIGZsb2F0IHRleHR1cmUgdG8gdGhlIGZyYW1lQnVmZmVyXG4gKiB0aGVuIHdlIGRlZmluaXRlbHkgd2lsbCBub3QgYmUgYWJsZSB0byByZWFkIGZsb2F0IHZhbHVlcyBmcm9tIGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEb3dubG9hZEZsb2F0VGV4dHVyZUVuYWJsZWQod2ViR0xWZXJzaW9uOiBudW1iZXIpOiBib29sZWFuIHtcbiAgaWYgKHdlYkdMVmVyc2lvbiA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGdsID0gZ2V0V2ViR0xDb250ZXh0KHdlYkdMVmVyc2lvbik7XG5cbiAgaWYgKHdlYkdMVmVyc2lvbiA9PT0gMSkge1xuICAgIGlmICghaGFzRXh0ZW5zaW9uKGdsLCAnT0VTX3RleHR1cmVfZmxvYXQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWhhc0V4dGVuc2lvbihnbCwgJ1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChoYXNFeHRlbnNpb24oZ2wsICdFWFRfY29sb3JfYnVmZmVyX2Zsb2F0JykpIHtcbiAgICAgIHJldHVybiBjcmVhdGVGbG9hdFRleHR1cmVBbmRCaW5kVG9GcmFtZWJ1ZmZlcihnbCk7XG4gICAgfVxuXG4gICAgY29uc3QgQ09MT1JfQlVGRkVSX0hBTEZfRkxPQVQgPSAnRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0JztcbiAgICBpZiAoaGFzRXh0ZW5zaW9uKGdsLCBDT0xPUl9CVUZGRVJfSEFMRl9GTE9BVCkpIHtcbiAgICAgIGNvbnN0IHRleHR1cmVIYWxmRmxvYXRFeHRlbnNpb24gPVxuICAgICAgICAgIGdsLmdldEV4dGVuc2lvbihDT0xPUl9CVUZGRVJfSEFMRl9GTE9BVCk7XG4gICAgICByZXR1cm4gY3JlYXRlSGFsZkZsb2F0VGV4dHVyZUFuZEJpbmRUb0ZyYW1lYnVmZmVyKFxuICAgICAgICAgIGdsLCB0ZXh0dXJlSGFsZkZsb2F0RXh0ZW5zaW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBpc0ZyYW1lQnVmZmVyQ29tcGxldGUgPSBjcmVhdGVGbG9hdFRleHR1cmVBbmRCaW5kVG9GcmFtZWJ1ZmZlcihnbCk7XG4gIHJldHVybiBpc0ZyYW1lQnVmZmVyQ29tcGxldGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZsb2F0VGV4dHVyZUFuZEJpbmRUb0ZyYW1lYnVmZmVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOlxuICAgIGJvb2xlYW4ge1xuICBjb25zdCB0ZXhDb25maWcgPSBnZXRUZXh0dXJlQ29uZmlnKGdsKTtcblxuICBjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblxuICBjb25zdCB3aWR0aCA9IDE7XG4gIGNvbnN0IGhlaWdodCA9IDE7XG4gIGdsLnRleEltYWdlMkQoXG4gICAgICBnbC5URVhUVVJFXzJELCAwLCB0ZXhDb25maWcuaW50ZXJuYWxGb3JtYXRGbG9hdCwgd2lkdGgsIGhlaWdodCwgMCxcbiAgICAgIHRleENvbmZpZy50ZXh0dXJlRm9ybWF0RmxvYXQsIHRleENvbmZpZy50ZXh0dXJlVHlwZUZsb2F0LCBudWxsKTtcblxuICBjb25zdCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG4gIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xuICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgIGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cbiAgY29uc3QgaXNGcmFtZUJ1ZmZlckNvbXBsZXRlID1cbiAgICAgIGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoZ2wuRlJBTUVCVUZGRVIpID09PSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURTtcblxuICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcbiAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcbiAgZ2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcbiAgZ2wuZGVsZXRlRnJhbWVidWZmZXIoZnJhbWVCdWZmZXIpO1xuXG4gIHJldHVybiBpc0ZyYW1lQnVmZmVyQ29tcGxldGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUhhbGZGbG9hdFRleHR1cmVBbmRCaW5kVG9GcmFtZWJ1ZmZlcihcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdGV4dHVyZUhhbGZGbG9hdEV4dGVuc2lvbjogYW55KTogYm9vbGVhbiB7XG4gIGNvbnN0IHRleENvbmZpZyA9IGdldFRleHR1cmVDb25maWcoZ2wsIHRleHR1cmVIYWxmRmxvYXRFeHRlbnNpb24pO1xuICBjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblxuICBjb25zdCB3aWR0aCA9IDE7XG4gIGNvbnN0IGhlaWdodCA9IDE7XG4gIGdsLnRleEltYWdlMkQoXG4gICAgICBnbC5URVhUVVJFXzJELCAwLCB0ZXhDb25maWcuaW50ZXJuYWxGb3JtYXRIYWxmRmxvYXQsIHdpZHRoLCBoZWlnaHQsIDAsXG4gICAgICB0ZXhDb25maWcudGV4dHVyZUZvcm1hdEZsb2F0LCB0ZXhDb25maWcudGV4dHVyZVR5cGVIYWxmRmxvYXQsIG51bGwpO1xuXG4gIGNvbnN0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcbiAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XG4gIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuICAgICAgZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLCAwKTtcblxuICBjb25zdCBpc0ZyYW1lQnVmZmVyQ29tcGxldGUgPVxuICAgICAgZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUikgPT09IGdsLkZSQU1FQlVGRkVSX0NPTVBMRVRFO1xuXG4gIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuICBnbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xuICBnbC5kZWxldGVGcmFtZWJ1ZmZlcihmcmFtZUJ1ZmZlcik7XG5cbiAgcmV0dXJuIGlzRnJhbWVCdWZmZXJDb21wbGV0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2ViR0xGZW5jZUVuYWJsZWQod2ViR0xWZXJzaW9uOiBudW1iZXIpIHtcbiAgaWYgKHdlYkdMVmVyc2lvbiAhPT0gMikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBnbCA9IGdldFdlYkdMQ29udGV4dCh3ZWJHTFZlcnNpb24pO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgY29uc3QgaXNFbmFibGVkID0gKGdsIGFzIGFueSkuZmVuY2VTeW5jICE9IG51bGw7XG4gIHJldHVybiBpc0VuYWJsZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3RDb21wbGV4KFxuICAgIHRlbnNvcjogVGVuc29ySW5mb3xUZW5zb3JJbmZvW10sIG9wTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh0ZW5zb3IpKSB7XG4gICAgdGVuc29yID0gW3RlbnNvcl07XG4gIH1cbiAgdGVuc29yLmZvckVhY2godCA9PiB7XG4gICAgaWYgKHQgIT0gbnVsbCkge1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgdC5kdHlwZSAhPT0gJ2NvbXBsZXg2NCcsXG4gICAgICAgICAgKCkgPT4gYCR7b3BOYW1lfSBkb2VzIG5vdCBzdXBwb3J0IGNvbXBsZXg2NCB0ZW5zb3JzIGAgK1xuICAgICAgICAgICAgICAnaW4gdGhlIFdlYkdMIGJhY2tlbmQuJyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==