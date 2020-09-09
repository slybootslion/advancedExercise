import Button from './button/button.vue'
import ButtonGroup from './button/button-group.vue'
import Icon from './icon.vue'
import Row from './layout/row'
import Col from './layout/col'
import Aside from './container/aside'
import Container from './container/container'
import Footer from './container/footer'
import Header from './container/header'
import Main from './container/main'
import Input from './input/input'

const install = (Vue) => {
  Vue.component(Button.name, Button)
  Vue.component(ButtonGroup.name, ButtonGroup)
  Vue.component(Icon.name, Icon)
  Vue.component(Row.name, Row)
  Vue.component(Col.name, Col)

  Vue.component(Aside.name, Aside)
  Vue.component(Container.name, Container)
  Vue.component(Footer.name, Footer)
  Vue.component(Header.name, Header)
  Vue.component(Main.name, Main)

  Vue.component(Input.name, Input)
}
if (typeof window.Vue !== 'undefined') {
  // eslint-disable-next-line no-undef
  install(Vue)
}

export default {
  install
}
