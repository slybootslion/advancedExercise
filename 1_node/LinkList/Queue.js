const LinkedList = require('./LinkedList')

class Queue {
  constructor () {
    this.ll = new LinkedList()
  }

  offer (element) {
    this.ll.add(element)
  }

  poll () {
    return this.ll.remove(0)
  }
}

// const queue = new Queue()
// queue.offer(100)
// queue.offer(200)
// queue.offer(300)
// queue.offer(400)
// const res = queue.poll()
// console.log(res)
// console.log(queue)

module.exports = Queue
