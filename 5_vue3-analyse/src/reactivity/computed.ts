import { isFunction } from '../utils'
import { effect, track, trigger } from './effect'

class ComputedRefImpl {
  private effect
  private __v_isReadonly = true
  private __v_isRef = true
  private _dirty = true
  private _value

  get value() {
    this._value = this.effect()
    track(this, 'value')
    return this._value
  }

  set value(val) {
    this.setter(val)
  }

  constructor(getter, public setter) {
    this.effect = effect(getter, {
      lazy: true,
      scheduler: effect => {
        trigger(this, 'set', 'value')
      },
    })
  }
}

function computed(getterOrOptions) {
  let getter
  let setter

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => console.log('computed not set value')
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}

export { computed }
