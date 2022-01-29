/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { OneHot } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Creates a one-hot `tf.Tensor`. The locations represented by `indices` take
 * value `onValue` (defaults to 1), while all other locations take value
 * `offValue` (defaults to 0). If `indices` is rank `R`, the output has rank
 * `R+1` with the last axis of size `depth`.
 *
 * ```js
 * tf.oneHot(tf.tensor1d([0, 1], 'int32'), 3).print();
 * ```
 *
 * @param indices `tf.Tensor` of indices with dtype `int32`.
 * @param depth The depth of the one hot dimension.
 * @param onValue A number used to fill in the output when the index matches
 * the location.
 * @param offValue A number used to fill in the output when the index does
 *     not match the location.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function oneHot_(indices, depth, onValue = 1, offValue = 0) {
    if (depth < 2) {
        throw new Error(`Error in oneHot: depth must be >=2, but it is ${depth}`);
    }
    const $indices = convertToTensor(indices, 'indices', 'oneHot', 'int32');
    const inputs = { indices: $indices };
    const attrs = { depth, onValue, offValue };
    return ENGINE.runKernel(OneHot, inputs, attrs);
}
export const oneHot = op({ oneHot_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25lX2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL29uZV9ob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsTUFBTSxFQUE0QixNQUFNLGlCQUFpQixDQUFDO0FBSWxFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxTQUFTLE9BQU8sQ0FDWixPQUEwQixFQUFFLEtBQWEsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUN0RCxRQUFRLEdBQUcsQ0FBQztJQUNkLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELEtBQUssRUFBRSxDQUFDLENBQUM7S0FDM0U7SUFDRCxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFeEUsTUFBTSxNQUFNLEdBQWlCLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBQ2pELE1BQU0sS0FBSyxHQUFnQixFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFDLENBQUM7SUFFdEQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixNQUFNLEVBQUUsTUFBbUMsRUFDM0MsS0FBZ0MsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge09uZUhvdCwgT25lSG90QXR0cnMsIE9uZUhvdElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBvbmUtaG90IGB0Zi5UZW5zb3JgLiBUaGUgbG9jYXRpb25zIHJlcHJlc2VudGVkIGJ5IGBpbmRpY2VzYCB0YWtlXG4gKiB2YWx1ZSBgb25WYWx1ZWAgKGRlZmF1bHRzIHRvIDEpLCB3aGlsZSBhbGwgb3RoZXIgbG9jYXRpb25zIHRha2UgdmFsdWVcbiAqIGBvZmZWYWx1ZWAgKGRlZmF1bHRzIHRvIDApLiBJZiBgaW5kaWNlc2AgaXMgcmFuayBgUmAsIHRoZSBvdXRwdXQgaGFzIHJhbmtcbiAqIGBSKzFgIHdpdGggdGhlIGxhc3QgYXhpcyBvZiBzaXplIGBkZXB0aGAuXG4gKlxuICogYGBganNcbiAqIHRmLm9uZUhvdCh0Zi50ZW5zb3IxZChbMCwgMV0sICdpbnQzMicpLCAzKS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGluZGljZXMgYHRmLlRlbnNvcmAgb2YgaW5kaWNlcyB3aXRoIGR0eXBlIGBpbnQzMmAuXG4gKiBAcGFyYW0gZGVwdGggVGhlIGRlcHRoIG9mIHRoZSBvbmUgaG90IGRpbWVuc2lvbi5cbiAqIEBwYXJhbSBvblZhbHVlIEEgbnVtYmVyIHVzZWQgdG8gZmlsbCBpbiB0aGUgb3V0cHV0IHdoZW4gdGhlIGluZGV4IG1hdGNoZXNcbiAqIHRoZSBsb2NhdGlvbi5cbiAqIEBwYXJhbSBvZmZWYWx1ZSBBIG51bWJlciB1c2VkIHRvIGZpbGwgaW4gdGhlIG91dHB1dCB3aGVuIHRoZSBpbmRleCBkb2VzXG4gKiAgICAgbm90IG1hdGNoIHRoZSBsb2NhdGlvbi5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDcmVhdGlvbid9XG4gKi9cbmZ1bmN0aW9uIG9uZUhvdF8oXG4gICAgaW5kaWNlczogVGVuc29yfFRlbnNvckxpa2UsIGRlcHRoOiBudW1iZXIsIG9uVmFsdWUgPSAxLFxuICAgIG9mZlZhbHVlID0gMCk6IFRlbnNvciB7XG4gIGlmIChkZXB0aCA8IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluIG9uZUhvdDogZGVwdGggbXVzdCBiZSA+PTIsIGJ1dCBpdCBpcyAke2RlcHRofWApO1xuICB9XG4gIGNvbnN0ICRpbmRpY2VzID0gY29udmVydFRvVGVuc29yKGluZGljZXMsICdpbmRpY2VzJywgJ29uZUhvdCcsICdpbnQzMicpO1xuXG4gIGNvbnN0IGlucHV0czogT25lSG90SW5wdXRzID0ge2luZGljZXM6ICRpbmRpY2VzfTtcbiAgY29uc3QgYXR0cnM6IE9uZUhvdEF0dHJzID0ge2RlcHRoLCBvblZhbHVlLCBvZmZWYWx1ZX07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBPbmVIb3QsIGlucHV0cyBhcyB1bmtub3duIGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgYXR0cnMgYXMgdW5rbm93biBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3Qgb25lSG90ID0gb3Aoe29uZUhvdF99KTtcbiJdfQ==