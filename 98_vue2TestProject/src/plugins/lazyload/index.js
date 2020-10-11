const Lazy = (Vue) => {
  class ReactiveListener {
    constructor (opts) {
      const { el, src, options, elRender } = opts
      this.el = el
      this.src = src
      this.options = options
      this.state = { loading: false }
      this.elRender = elRender
    }

    // 检测图片是否在可视区域
    checkInView () {
      const { top } = this.el.getBoundingClientRect()
      return top < window.innerHeight * (this.options.preLoad || 1.3)
    }

    load () {
      // 图片显示前先加载loading
      this.elRender(this, 'loading')
      // 根据图片加载 显示图片或显示失败的图片
      loadImageAsync(this.src, () => {
        this.state.loading = true
        this.elRender(this, 'finish')
      }, () => {
        this.elRender(this, 'error')
      })
    }
  }

  return class LazyClass {
    constructor (options) {
      this.options = options
      this.bindHandler = false
      this.listenerQueue = []
    }

    add (el, bindings, vnode) {
      Vue.nextTick(() => {
        const scrollParent = getScrollParent(el)
        if (scrollParent && !this.bindHandler) {
          this.bindHandler = true
          scrollParent.addEventListener('scroll', this.handlerLazyLoad.bind(this))

          const rl = new ReactiveListener({
            el,
            src: bindings.value,
            options: this.options,
            elRender: this.elRender.bind(this)
          })

          this.listenerQueue.push(rl)
        }
      })
    }

    elRender (rl, state) {
      const el = rl.el
      let src = ''
      switch (state) {
        case 'loading':
          src = rl.options.loading || ''
          break
        case 'error':
          src = rl.options.error || ''
          break
        default:
          src = rl.src
      }
      el.setAttribute('src', src)
    }

    // 判断是否显示图片
    handlerLazyLoad () {
      // 计算当前图片的位置
      this.listenerQueue.forEach(rl => {
        if (!rl.state.loading) {
          const catIn = rl.checkInView()
          catIn && rl.load()
        }
      })
    }
  }
}

function getScrollParent (el) {
  let parent = el.parentNode
  while (parent) {
    if (/(scroll)|(auto)/.test(getComputedStyle(parent).overflow)) return parent
    parent = parent.parentNode
  }
  return parent
}

function loadImageAsync (src, resolve, reject) {
  const image = new Image()
  image.src = src
  image.onload = resolve
  image.onerror = reject
}

const VueLazyload = {
  install (Vue, options) {
    const LazyClass = Lazy(Vue)
    const lazy = new LazyClass(options)
    Vue.directive('lazy', {
      bind: lazy.add.bind(lazy)
    })
  }
}

export default VueLazyload
