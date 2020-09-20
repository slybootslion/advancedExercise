import Button from './button/button'
import ButtonGroup from './button/button-group'
import Icon from './icon/icon'
import Row from './layout/row'
import Col from './layout/col'
import Aside from './container/aside'
import Container from './container/container'
import Footer from './container/footer'
import Header from './container/header'
import Main from './container/main'
import Input from './input/input'
import Upload from './upload/upload'
import Progress from './progress/progress'
import Dialog from './dialog/dialog'

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
  Vue.component(Upload.name, Upload)
  Vue.component(Progress.name, Progress)

  Vue.component(Dialog.name, Dialog)
}
if (typeof window.Vue !== 'undefined') {
  // eslint-disable-next-line no-undef
  install(Vue)
}

export default {
  install
}
