// 观察者模式
// 所有的观察者都是放到被观察者中（基于发布订阅）

class Subject {
  constructor (name) {
    this.name = name
    this.observers = []
    this.state = '玩呢'
  }

  attach (ob) {
    this.observers.push(ob)
  }

  setState (newState) {
    if (this.state !== newState) {
      this.state = newState
      this.observers.forEach(o => o.update(this))
    }
  }
}

class Observer {
  constructor (name) {
    this.name = name
  }

  update (baby) {
    console.log(`${baby.name}跟${this.name}说：${baby.state}`)
  }
}

const baby = new Subject('小宝宝')
const ob1 = new Observer('爸爸')
const ob2 = new Observer('妈妈')

baby.attach(ob1)
baby.attach(ob2)
setTimeout(() => {
  baby.setState('有人打我')
}, 1000)
