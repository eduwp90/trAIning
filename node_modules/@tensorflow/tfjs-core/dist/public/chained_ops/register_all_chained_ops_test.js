/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import '../../public/chained_ops/register_all_chained_ops';
import * as tf from '../../index';
import { ALL_ENVS, describeWithFlags } from '../../jasmine_util';
// Testing for presence of chained op in this file will allow us to more easily
// customize when we want this test to run. Currently it will run be default
// (And karma will always load the chain augmentor files). But this gives us
// flexibility to change in future.
const CHAINED_OPS = [
    'abs',
    'acos',
    'acosh',
    'add',
    'all',
    'any',
    'argMax',
    'argMin',
    'as1D',
    'as2D',
    'as3D',
    'as4D',
    'as5D',
    'asin',
    'asinh',
    'asScalar',
    'asType',
    'atan',
    'atan2',
    'atanh',
    'avgPool',
    'batchNorm',
    'batchToSpaceND',
    'broadcastTo',
    'cast',
    'ceil',
    'clipByValue',
    'concat',
    'conv1d',
    'conv2d',
    'conv2dTranspose',
    'cos',
    'cosh',
    'cumsum',
    'depthToSpace',
    'depthwiseConv2d',
    'dilation2d',
    'div',
    'divNoNan',
    'dot',
    'elu',
    'equal',
    'erf',
    'exp',
    'expandDims',
    'expm1',
    'fft',
    'flatten',
    'floor',
    'floorDiv',
    'gather',
    'greater',
    'greaterEqual',
    'ifft',
    'irfft',
    'isFinite',
    'isInf',
    'isNaN',
    'leakyRelu',
    'less',
    'lessEqual',
    'localResponseNormalization',
    'log',
    'log1p',
    'logicalAnd',
    'logicalNot',
    'logicalOr',
    'logicalXor',
    'logSigmoid',
    'logSoftmax',
    'logSumExp',
    'matMul',
    'max',
    'maximum',
    'maxPool',
    'mean',
    'min',
    'minimum',
    'mirrorPad',
    'mod',
    'mul',
    'neg',
    'norm',
    'notEqual',
    'oneHot',
    'onesLike',
    'pad',
    'pool',
    'pow',
    'prelu',
    'prod',
    'reciprocal',
    'relu',
    'relu6',
    'reshape',
    'reshapeAs',
    'resizeBilinear',
    'resizeNearestNeighbor',
    'reverse',
    'rfft',
    'round',
    'rsqrt',
    'selu',
    'separableConv2d',
    'sigmoid',
    'sign',
    'sin',
    'sinh',
    'slice',
    'softmax',
    'softplus',
    'spaceToBatchND',
    'split',
    'sqrt',
    'square',
    'square',
    'squeeze',
    'stack',
    'step',
    'stridedSlice',
    'sub',
    'sum',
    'tan',
    'tanh',
    'tile',
    'toBool',
    'toFloat',
    'toInt',
    'topk',
    'transpose',
    'unique',
    'unsortedSegmentSum',
    'unstack',
    'where',
    'zerosLike'
];
describeWithFlags('chained ops', ALL_ENVS, () => {
    it('all chained ops should exist on tensor ', async () => {
        const tensor = tf.tensor([1, 2, 3]);
        for (const opName of CHAINED_OPS) {
            //@ts-ignore
            expect(typeof tensor[opName])
                .toBe('function', `${opName} chained op not found`);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJfYWxsX2NoYWluZWRfb3BzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3B1YmxpYy9jaGFpbmVkX29wcy9yZWdpc3Rlcl9hbGxfY2hhaW5lZF9vcHNfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLG1EQUFtRCxDQUFDO0FBRTNELE9BQU8sS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUvRCwrRUFBK0U7QUFDL0UsNEVBQTRFO0FBQzVFLDRFQUE0RTtBQUM1RSxtQ0FBbUM7QUFFbkMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsS0FBSztJQUNMLE1BQU07SUFDTixPQUFPO0lBQ1AsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixPQUFPO0lBQ1AsVUFBVTtJQUNWLFFBQVE7SUFDUixNQUFNO0lBQ04sT0FBTztJQUNQLE9BQU87SUFDUCxTQUFTO0lBQ1QsV0FBVztJQUNYLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsTUFBTTtJQUNOLE1BQU07SUFDTixhQUFhO0lBQ2IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsaUJBQWlCO0lBQ2pCLEtBQUs7SUFDTCxNQUFNO0lBQ04sUUFBUTtJQUNSLGNBQWM7SUFDZCxpQkFBaUI7SUFDakIsWUFBWTtJQUNaLEtBQUs7SUFDTCxVQUFVO0lBQ1YsS0FBSztJQUNMLEtBQUs7SUFDTCxPQUFPO0lBQ1AsS0FBSztJQUNMLEtBQUs7SUFDTCxZQUFZO0lBQ1osT0FBTztJQUNQLEtBQUs7SUFDTCxTQUFTO0lBQ1QsT0FBTztJQUNQLFVBQVU7SUFDVixRQUFRO0lBQ1IsU0FBUztJQUNULGNBQWM7SUFDZCxNQUFNO0lBQ04sT0FBTztJQUNQLFVBQVU7SUFDVixPQUFPO0lBQ1AsT0FBTztJQUNQLFdBQVc7SUFDWCxNQUFNO0lBQ04sV0FBVztJQUNYLDRCQUE0QjtJQUM1QixLQUFLO0lBQ0wsT0FBTztJQUNQLFlBQVk7SUFDWixZQUFZO0lBQ1osV0FBVztJQUNYLFlBQVk7SUFDWixZQUFZO0lBQ1osWUFBWTtJQUNaLFdBQVc7SUFDWCxRQUFRO0lBQ1IsS0FBSztJQUNMLFNBQVM7SUFDVCxTQUFTO0lBQ1QsTUFBTTtJQUNOLEtBQUs7SUFDTCxTQUFTO0lBQ1QsV0FBVztJQUNYLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLFVBQVU7SUFDVixLQUFLO0lBQ0wsTUFBTTtJQUNOLEtBQUs7SUFDTCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFlBQVk7SUFDWixNQUFNO0lBQ04sT0FBTztJQUNQLFNBQVM7SUFDVCxXQUFXO0lBQ1gsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtJQUN2QixTQUFTO0lBQ1QsTUFBTTtJQUNOLE9BQU87SUFDUCxPQUFPO0lBQ1AsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixTQUFTO0lBQ1QsTUFBTTtJQUNOLEtBQUs7SUFDTCxNQUFNO0lBQ04sT0FBTztJQUNQLFNBQVM7SUFDVCxVQUFVO0lBQ1YsZ0JBQWdCO0lBQ2hCLE9BQU87SUFDUCxNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixTQUFTO0lBQ1QsT0FBTztJQUNQLE1BQU07SUFDTixjQUFjO0lBQ2QsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsTUFBTTtJQUNOLE1BQU07SUFDTixRQUFRO0lBQ1IsU0FBUztJQUNULE9BQU87SUFDUCxNQUFNO0lBQ04sV0FBVztJQUNYLFFBQVE7SUFDUixvQkFBb0I7SUFDcEIsU0FBUztJQUNULE9BQU87SUFDUCxXQUFXO0NBQ1osQ0FBQztBQUVGLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQzlDLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2RCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssTUFBTSxNQUFNLElBQUksV0FBVyxFQUFFO1lBQ2hDLFlBQVk7WUFDWixNQUFNLENBQUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3hCLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLHVCQUF1QixDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgJy4uLy4uL3B1YmxpYy9jaGFpbmVkX29wcy9yZWdpc3Rlcl9hbGxfY2hhaW5lZF9vcHMnO1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICcuLi8uLi9pbmRleCc7XG5pbXBvcnQge0FMTF9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnLi4vLi4vamFzbWluZV91dGlsJztcblxuLy8gVGVzdGluZyBmb3IgcHJlc2VuY2Ugb2YgY2hhaW5lZCBvcCBpbiB0aGlzIGZpbGUgd2lsbCBhbGxvdyB1cyB0byBtb3JlIGVhc2lseVxuLy8gY3VzdG9taXplIHdoZW4gd2Ugd2FudCB0aGlzIHRlc3QgdG8gcnVuLiBDdXJyZW50bHkgaXQgd2lsbCBydW4gYmUgZGVmYXVsdFxuLy8gKEFuZCBrYXJtYSB3aWxsIGFsd2F5cyBsb2FkIHRoZSBjaGFpbiBhdWdtZW50b3IgZmlsZXMpLiBCdXQgdGhpcyBnaXZlcyB1c1xuLy8gZmxleGliaWxpdHkgdG8gY2hhbmdlIGluIGZ1dHVyZS5cblxuY29uc3QgQ0hBSU5FRF9PUFMgPSBbXG4gICdhYnMnLFxuICAnYWNvcycsXG4gICdhY29zaCcsXG4gICdhZGQnLFxuICAnYWxsJyxcbiAgJ2FueScsXG4gICdhcmdNYXgnLFxuICAnYXJnTWluJyxcbiAgJ2FzMUQnLFxuICAnYXMyRCcsXG4gICdhczNEJyxcbiAgJ2FzNEQnLFxuICAnYXM1RCcsXG4gICdhc2luJyxcbiAgJ2FzaW5oJyxcbiAgJ2FzU2NhbGFyJyxcbiAgJ2FzVHlwZScsXG4gICdhdGFuJyxcbiAgJ2F0YW4yJyxcbiAgJ2F0YW5oJyxcbiAgJ2F2Z1Bvb2wnLFxuICAnYmF0Y2hOb3JtJyxcbiAgJ2JhdGNoVG9TcGFjZU5EJyxcbiAgJ2Jyb2FkY2FzdFRvJyxcbiAgJ2Nhc3QnLFxuICAnY2VpbCcsXG4gICdjbGlwQnlWYWx1ZScsXG4gICdjb25jYXQnLFxuICAnY29udjFkJyxcbiAgJ2NvbnYyZCcsXG4gICdjb252MmRUcmFuc3Bvc2UnLFxuICAnY29zJyxcbiAgJ2Nvc2gnLFxuICAnY3Vtc3VtJyxcbiAgJ2RlcHRoVG9TcGFjZScsXG4gICdkZXB0aHdpc2VDb252MmQnLFxuICAnZGlsYXRpb24yZCcsXG4gICdkaXYnLFxuICAnZGl2Tm9OYW4nLFxuICAnZG90JyxcbiAgJ2VsdScsXG4gICdlcXVhbCcsXG4gICdlcmYnLFxuICAnZXhwJyxcbiAgJ2V4cGFuZERpbXMnLFxuICAnZXhwbTEnLFxuICAnZmZ0JyxcbiAgJ2ZsYXR0ZW4nLFxuICAnZmxvb3InLFxuICAnZmxvb3JEaXYnLFxuICAnZ2F0aGVyJyxcbiAgJ2dyZWF0ZXInLFxuICAnZ3JlYXRlckVxdWFsJyxcbiAgJ2lmZnQnLFxuICAnaXJmZnQnLFxuICAnaXNGaW5pdGUnLFxuICAnaXNJbmYnLFxuICAnaXNOYU4nLFxuICAnbGVha3lSZWx1JyxcbiAgJ2xlc3MnLFxuICAnbGVzc0VxdWFsJyxcbiAgJ2xvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uJyxcbiAgJ2xvZycsXG4gICdsb2cxcCcsXG4gICdsb2dpY2FsQW5kJyxcbiAgJ2xvZ2ljYWxOb3QnLFxuICAnbG9naWNhbE9yJyxcbiAgJ2xvZ2ljYWxYb3InLFxuICAnbG9nU2lnbW9pZCcsXG4gICdsb2dTb2Z0bWF4JyxcbiAgJ2xvZ1N1bUV4cCcsXG4gICdtYXRNdWwnLFxuICAnbWF4JyxcbiAgJ21heGltdW0nLFxuICAnbWF4UG9vbCcsXG4gICdtZWFuJyxcbiAgJ21pbicsXG4gICdtaW5pbXVtJyxcbiAgJ21pcnJvclBhZCcsXG4gICdtb2QnLFxuICAnbXVsJyxcbiAgJ25lZycsXG4gICdub3JtJyxcbiAgJ25vdEVxdWFsJyxcbiAgJ29uZUhvdCcsXG4gICdvbmVzTGlrZScsXG4gICdwYWQnLFxuICAncG9vbCcsXG4gICdwb3cnLFxuICAncHJlbHUnLFxuICAncHJvZCcsXG4gICdyZWNpcHJvY2FsJyxcbiAgJ3JlbHUnLFxuICAncmVsdTYnLFxuICAncmVzaGFwZScsXG4gICdyZXNoYXBlQXMnLFxuICAncmVzaXplQmlsaW5lYXInLFxuICAncmVzaXplTmVhcmVzdE5laWdoYm9yJyxcbiAgJ3JldmVyc2UnLFxuICAncmZmdCcsXG4gICdyb3VuZCcsXG4gICdyc3FydCcsXG4gICdzZWx1JyxcbiAgJ3NlcGFyYWJsZUNvbnYyZCcsXG4gICdzaWdtb2lkJyxcbiAgJ3NpZ24nLFxuICAnc2luJyxcbiAgJ3NpbmgnLFxuICAnc2xpY2UnLFxuICAnc29mdG1heCcsXG4gICdzb2Z0cGx1cycsXG4gICdzcGFjZVRvQmF0Y2hORCcsXG4gICdzcGxpdCcsXG4gICdzcXJ0JyxcbiAgJ3NxdWFyZScsXG4gICdzcXVhcmUnLFxuICAnc3F1ZWV6ZScsXG4gICdzdGFjaycsXG4gICdzdGVwJyxcbiAgJ3N0cmlkZWRTbGljZScsXG4gICdzdWInLFxuICAnc3VtJyxcbiAgJ3RhbicsXG4gICd0YW5oJyxcbiAgJ3RpbGUnLFxuICAndG9Cb29sJyxcbiAgJ3RvRmxvYXQnLFxuICAndG9JbnQnLFxuICAndG9waycsXG4gICd0cmFuc3Bvc2UnLFxuICAndW5pcXVlJyxcbiAgJ3Vuc29ydGVkU2VnbWVudFN1bScsXG4gICd1bnN0YWNrJyxcbiAgJ3doZXJlJyxcbiAgJ3plcm9zTGlrZSdcbl07XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdjaGFpbmVkIG9wcycsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdhbGwgY2hhaW5lZCBvcHMgc2hvdWxkIGV4aXN0IG9uIHRlbnNvciAnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVuc29yID0gdGYudGVuc29yKFsxLCAyLCAzXSk7XG4gICAgZm9yIChjb25zdCBvcE5hbWUgb2YgQ0hBSU5FRF9PUFMpIHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZXhwZWN0KHR5cGVvZiB0ZW5zb3Jbb3BOYW1lXSlcbiAgICAgICAgICAudG9CZSgnZnVuY3Rpb24nLCBgJHtvcE5hbWV9IGNoYWluZWQgb3Agbm90IGZvdW5kYCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19