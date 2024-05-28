const NodeColor = {
    RED: 'RED',
    BLACK: 'BLACK',
}

class RBTNode {
    constructor(value, parent = null) {
        this.value = value
        this.left = null
        this.right = null
        this.parent = parent
        this.color = NodeColor.RED
    }
}

class RedBlackTree {
    constructor() {
        this.root = null
    }

    insert(value) {
        const insertHelper = (node) => {
            const currNode = node
            if (value < currNode.value) {
                if (currNode.left) {
                    insertHelper(currNode.left)
                } else {
                    currNode.left = new RBTNode(value)
                    currNode.left.parent = currNode
                    this._insertFixup(currNode.left)
                }
            } else if (value > currNode.value) {
                if (currNode.right) {
                    insertHelper(currNode.right)
                } else {
                    currNode.right = new RBTNode(value)
                    currNode.right.parent = currNode
                    this._insertFixup(currNode.right)
                }
            }
        }

        if (!this.root) {
            this.root = new RBTNode(value)
            this._insertFixup(this.root)
        } else {
            insertHelper(this.root)
        }
    }

    _insertFixup(node) {
        let currNode = node
        while (this._isRed(currNode.parent) && currNode.parent.parent) {
            const { parent } = currNode
            const grandparent = parent.parent
            if (parent === grandparent.left) {
                if (this._isRed(grandparent.right)) {
                    this._flipColor(grandparent)
                } else {
                    if (currNode === parent.right) {
                        this._leftRotation(parent)
                        currNode = parent
                    }
                    this._rightRotation(grandparent)
                }
            } else {
                if (this._isRed(grandparent.left)) {
                    this._flipColor(grandparent)
                    currNode = grandparent
                } else {
                    if (currNode === parent.left) {
                        this._rightRotation(parent)
                        currNode = parent
                    }
                    this._leftRotation(grandparent)
                }
            }
            currNode = grandparent
        }
        this.root.color = NodeColor.BLACK
    }

    delete(value, node = this.root) {
        const targetNode = this.search(value, node)
        if (!targetNode) return false
        if (!targetNode.left && !targetNode.right) {
            if (this._isRed(targetNode)) {
                this._replaceParent(targetNode, null)
            } else {
                this._deleteFixup(targetNode)
                this._replaceParent(targetNode, null)
            }
        } else if (!targetNode.left || !targetNode.right) {
            if (targetNode.left) {
                targetNode.left.color = NodeColor.BLACK
                targetNode.left.parent = targetNode.parent
                this._replaceParent(targetNode, targetNode.left)
            } else {
                targetNode.right.color = NodeColor.BLACK
                targetNode.right.parent = targetNode.parent
                this._replaceParent(targetNode, targetNode.right)
            }
        } else {
            const aux = this.findMin(targetNode.right)
            targetNode.value = aux.value
            this.delete(aux.value, targetNode.right)
        }
        return this.root
    }

    _deleteFixup(node) {
        let currNode = node
        while (currNode !== this.root && !this._isRed(currNode)) {
            const { parent } = currNode
            let sibling
            if (currNode === parent.left) {
                sibling = parent.right
                if (this._isRed(sibling)) {
                    this._leftRotation(parent)
                } else if (!this._isRed(sibling.left) && !this._isRed(sibling.right)) {
                    if (this._isRed(parent)) {
                        parent.color = NodeColor.BLACK
                        sibling.color = NodeColor.RED
                        break
                    }
                    sibling.color = NodeColor.RED
                    currNode = parent
                } else if (this._isRed(sibling.left) && !this._isRed(sibling.right)) {
                    this._rightRotation(sibling)
                } else {
                    this._leftRotation(parent)
                    parent.color = NodeColor.BLACK
                    sibling.right.color = NodeColor.BLACK
                    break
                }
            } else {
                sibling = parent.left
                if (this._isRed(sibling)) {
                    this._rightRotation(parent)
                } else if (!this._isRed(sibling.left) && !this._isRed(sibling.right)) {
                    if (this._isRed(parent)) {
                        parent.color = NodeColor.BLACK
                        sibling.color = NodeColor.RED
                        break
                    }
                    sibling.color = NodeColor.RED
                    currNode = parent
                } else if (this._isRed(sibling.right) && !this._isRed(sibling.left)) {
                    this._leftRotation(sibling)
                } else {
                    this._rightRotation(parent)
                    parent.color = NodeColor.BLACK
                    sibling.left.color = NodeColor.BLACK
                    break
                }
            }
        }
    }

    search(value, node = this.root) {
        if (!node) return false
        if (value === node.value) return node
        if (value < node.value) return this.search(value, node.left)
        return this.search(value, node.right)
    }

    _replaceParent(currNode, newNode) {
        const { parent } = currNode
        if (!parent) {
            this.root = newNode
        } else if (currNode === parent.left) {
            parent.left = newNode
        } else {
            parent.right = newNode
        }
    }

    _leftRotation(node) {
        const currNode = node.right
        node.right = currNode.left
        currNode.left = node
        currNode.color = node.color
        node.color = NodeColor.RED
        this._replaceParent(node, currNode)
        currNode.parent = node.parent
        node.parent = currNode
        if (node.right) {
            node.right.parent = node
        }
    }

    _rightRotation(node) {
        const currNode = node.left
        node.left = currNode.right
        currNode.right = node
        currNode.color = node.color
        node.color = NodeColor.RED
        this._replaceParent(node, currNode)
        currNode.parent = node.parent
        node.parent = currNode
        if (node.left) {
            node.left.parent = node
        }
    }

    _flipColor(node) {
        node.color = NodeColor.RED
        node.left.color = NodeColor.BLACK
        node.right.color = NodeColor.BLACK
    }

    _isRed(node) {
        return node ? node.color === NodeColor.RED : false
    }

    findMin(node = this.root) {
        let currentNode = node
        while (currentNode && currentNode.left) {
            currentNode = currentNode.left
        }
        return currentNode
    }


}

export default RedBlackTree
