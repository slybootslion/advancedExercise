import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { initGlobalAPI } from './global-api/index'
import { compileToFunctions } from './compiler/index'
import { createEl, patch } from './vdom/patch'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

/*eg.*/
const vm = new Vue({
  data: {
    template: 'diff-temp',
  },
})

const renderFn = compileToFunctions(`<div id="a" a="1" style="color:blue">
  <p key="A">A</p>
  <p key="B">B</p>
  <p key="C">C</p>
  <p key="D">D</p>
</div>`)
const vNode = renderFn.call(vm)
console.log(vNode)
const el = createEl(vNode)
document.body.appendChild(el)

const vmC = new Vue({
  data: {
    template: 'diff-temp-change',
  },
})

const renderFnC = compileToFunctions(`<div id="a" a="1" style="color:#fff;background:red">
  <p key="A">A</p>
  <p key="B">B</p>
  <p key="C">C</p>
  <p key="D">D</p>
  <p key="E">E</p>
</div>`)
const vNodeC = renderFnC.call(vmC)
setTimeout(() => {
  patch(vNode, vNodeC)
}, 1000)
export default Vue
