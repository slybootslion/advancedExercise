import Button from './button/button.vue'
import ButtonGroup from './button/button-group.vue'
import Icon from './icon.vue'
import Row from './layout/row'
import Col from './layout/col'

const install = (Vue) => {
  Vue.component(Button.name, Button)
  Vue.component(ButtonGroup.name, ButtonGroup)
  Vue.component(Icon.name, Icon)
  Vue.component(Row.name, Row)
  Vue.component(Col.name, Col)
}

if (typeof window.Vue !== 'undefined') {
  // eslint-disable-next-line no-undef
  install(Vue)
}

export default {
  install
}
