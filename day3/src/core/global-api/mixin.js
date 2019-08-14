/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // mergeOptions 合并选项 如果重名的变成数组 [beforeCreater]
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
