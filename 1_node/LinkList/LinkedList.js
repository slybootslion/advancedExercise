class Node {
  constructor (element, next) {
    this.element = element
    this.next = next
  }
}

class LinkedList {
  constructor () {
    this.head = null
    this.size = 0
  }

  // 增加节点
  add (index, element) {
    if (arguments.length === 1) {
      element = index
      index = this.size
    }

    if (index < 0 || index > this.size) throw new Error('链表索引异常')

    if (index === 0) {
      const head = this.head
      this.head = new Node(element, head)
    } else {
      const prevNode = this.getNode(index - 1)
      prevNode.next = new Node(element, prevNode.next)
    }
    this.size++
  }

  // 删除节点
  remove (index) {
    let oldNode
    if (index === 0) {
      oldNode = this.head
      this.head = oldNode && oldNode.next
    } else {
      let prevNode = this.getNode(index - 1)
      oldNode = prevNode.next
      prevNode.next = oldNode.next
    }
    this.size--
    return oldNode && oldNode.element
  }

  // 获取节点
  getNode (index) {
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }

  // 链表的总个数
  length () {
    return this.size
  }

  // 反转链表
  reverseLinkedList () {
    let head = this.head
    // 递归版
    /*function reverse (head) {
      if (head === null || head.next === null) return head
      let newHead = reverse(head.next)
      head.next.next = head
      head.next - null
      return newHead
    }

    this.head = reverse(this.head)
    return this.head*/
    //
    if (head === null || head.next === null) return head
    let newHead = null
    while (head) {
      let temp = head.next
      head.next = newHead
      newHead = head
      head = temp
    }
    this.head = newHead
    return this.head
  }
}

// const ll = new LinkedList()
// ll.add(0, 100)
// ll.add(0, 200)
// ll.add(300)
// ll.remove(0)
// console.log(ll.head)

module.exports = LinkedList
