// 二叉搜索树的实现 树的遍历
class BinarySearchTree {
  constructor () {
    this.root = null
    this.size = 0
  }

  add (num) {
    if (this.root == null) {
      this.root = new Node(num)
      this.size++
      return
    }

    // 根据条件，查找到空值为止，将值保存到相应的节点。查找的过程中记录需要保存的值（parent等）
    let currentNode = this.root
    let compare = null
    let parent = null
    while (currentNode) {
      compare = num - currentNode.element
      parent = currentNode
      if (compare > 0) {
        currentNode = currentNode.right
      } else if (compare < 0) {
        currentNode = currentNode.left
      }
    }
    let node = new Node(num, parent)
    if (compare > 0) {
      parent.right = node
    } else if (compare < 0) {
      parent.left = node
    }
    this.size++
  }

  // 先序遍历
  preOrderTraversal (vistor) {
    const traversal = (node) => {
      if (node == null) return
      vistor.visit(node)
      traversal(node.left)
      traversal(node.right)
    }
    traversal(this.root)
  }

  // 中序遍历
  inOrderTraversal (vistor) {
    const traversal = (node) => {
      if (node == null) return
      traversal(node.left)
      vistor.visit(node)
      traversal(node.right)
    }
    traversal(this.root)
  }

  // 后序遍历
  postOrderTraversal (vistor) {
    const traversal = (node) => {
      if (node == null) return
      traversal(node.left)
      traversal(node.right)
      vistor.visit(node)
    }
    traversal(this.root)
  }

  // 层序遍历
  levelOrderTraversal (vistor) {
    if (this.root == null) return
    const stack = [this.root]
    let i = 0
    let node = null
    while (node = stack[i++]) {
      vistor.visit(node)
      if (node.left) stack.push(node.left)
      if (node.right) stack.push(node.right)
    }
  }

  // 反转二叉树
  invertTree () {
    if (this.root == null) return
    const stack = [this.root]
    let i = 0
    let node = null
    while (node = stack[i++]) {
      let temp = node.left
      node.left = node.right
      node.right = temp
      if (node.left) stack.push(node.left)
      if (node.right) stack.push(node.right)
    }
  }
}

class Node {
  constructor (element, parent = null) {
    this.element = element
    this.parent = parent
    this.left = null
    this.right = null
  }
}

const bst = new BinarySearchTree()

const arr = [10, 8, 19, 6, 15, 22, 20]
arr.forEach(item => bst.add(item))
// console.dir(bst)

// 访问者模式
function visit (node) {
  console.log(node.element)
}

bst.preOrderTraversal({ visit })
console.log('--------------')
bst.inOrderTraversal({ visit })
console.log('--------------')
bst.postOrderTraversal({ visit })
console.log('--------------')
bst.levelOrderTraversal({ visit })

// 反转二叉树
console.log('--------------')
bst.invertTree()
console.log(bst.root)
