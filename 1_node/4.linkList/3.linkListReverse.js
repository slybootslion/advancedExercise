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

  // 递归版
  reverseLinkList () {
    function revers (head) {
      if (head == null || head.next == null) return head
      const newHead = revers(head.next)
      head.next.next = head
      head.next = null
      return newHead
    }

    this.head = revers(this.head)
    return this.head
  }

  // 非递归版
  reverseLinkList2 () {
    let head = this.head
    if (head == null || head.next == null) return head
    let newHead = null
    while (head) {
      const temp = head.next
      head.next = newHead
      newHead = head
      head = temp
    }
    this.head = newHead
    return this.head
  }
}

const ll = new LinkList()
ll.add(0, 100)
ll.add(0, 200)
ll.add(300) // 200 -> 100 -> 300
const rll = ll.reverseLinkList()
console.log(rll)

const rll2 = ll.reverseLinkList2()
console.log(rll2)

