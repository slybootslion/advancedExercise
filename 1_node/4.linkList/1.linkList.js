class Node {
  constructor (element, next) {
    this.element = element
    this.next = next
  }
}

class LinkList {
  constructor () {
    this.head = null
    this.size = 0
  }

  add (index, element) {
    if (arguments.length === 1) {
      element = index
      index = this.size
    }

    if (index < 0 || index > this.size) throw new Error('链表索引异常：越界')

    if (index === 0) {
      const head = this.head
      this.head = new Node(element, head)
    } else {
      const prevNode = this.getNode(index - 1)
      prevNode.next = new Node(element, prevNode.next)
    }

    this.size++
  }

  remove (index) {
    let oldNode = this.head

    if (index === 0) {
      this.head = oldNode && oldNode.next
    } else {
      const prevNode = this.getNode(index - 1)
      oldNode = prevNode.next
      prevNode.next = prevNode.next.next
    }
    // 返回删除元素
    this.size--
    return oldNode && oldNode.element
  }

  getNode (index) {
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }

  length () {
    return this.size
  }
}

/*const ll = new LinkList()
ll.add(0, 100)
ll.add(0, 200)
ll.add(300) // 200 -> 100 -> 300
ll.remove(1)
console.log(ll.head)
const size = ll.length()
console.log(size)*/

module.exports = {
  LinkList
}
