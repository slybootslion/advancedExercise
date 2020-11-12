const { LinkList } = require('./1.linkList')

class Queue {
  constructor () {
    this.ll = new LinkList()
  }

  // 入队
  offer (element) {
    this.ll.add(element)
  }

  // 出队
  poll () {
    return this.ll.remove(0)
  }
}

const queue = new Queue()
queue.offer(1)
queue.offer(2)
queue.offer(3)

const item = queue.poll()
console.log(item)

module.exports = {
  Queue
}
