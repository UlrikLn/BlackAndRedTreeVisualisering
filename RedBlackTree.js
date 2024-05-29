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
            const currNode = node;
            if (value < currNode.value) {
                if (currNode.left) {
                    console.log(`Traversing left from node ${currNode.value}`);
                    insertHelper(currNode.left);
                } else {
                    console.log(`Inserting ${value} as the left child of ${currNode.value}`);
                    currNode.left = new RBTNode(value);
                    currNode.left.parent = currNode;
                    this._insertFixup(currNode.left);
                }
            } else if (value > currNode.value) {
                if (currNode.right) {
                    console.log(`Traversing right from node ${currNode.value}`);
                    insertHelper(currNode.right);
                } else {
                    console.log(`Inserting ${value} as the right child of ${currNode.value}`);
                    currNode.right = new RBTNode(value);
                    currNode.right.parent = currNode;
                    this._insertFixup(currNode.right);
                }
            } else {
                console.log(`Value ${value} already exists in the tree. No duplicates allowed.`);
            }
        }

        if (!this.root) {
            console.log(`Inserting ${value} as the root node.`);
            this.root = new RBTNode(value);
            this.root.color = NodeColor.BLACK; // Ensure the root is always black
        } else {
            console.log(`Starting insertion of ${value}`);
            insertHelper(this.root);
        }
    }


    _insertFixup(node) {
        let currNode = node;
        while (this._isRed(currNode.parent) && currNode.parent.parent) {
            const { parent } = currNode;
            const grandparent = parent.parent;

            console.log(`Fixing up at node ${currNode.value}, parent ${parent.value}, grandparent ${grandparent.value}`);

            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                if (this._isRed(uncle)) {
                    console.log(`Uncle ${uncle.value} is red. Flipping colors of grandparent ${grandparent.value}.`);
                    this._flipColor(grandparent);
                } else {
                    if (currNode === parent.right) {
                        console.log(`Current node ${currNode.value} is right child of its parent ${parent.value}. Performing left rotation on parent.`);
                        this._leftRotation(parent);
                        currNode = parent;
                    }
                    console.log(`Performing right rotation on grandparent ${grandparent.value}.`);
                    this._rightRotation(grandparent);
                }
            } else {
                const uncle = grandparent.left;
                if (this._isRed(uncle)) {
                    console.log(`Uncle ${uncle.value} is red. Flipping colors of grandparent ${grandparent.value}.`);
                    this._flipColor(grandparent);
                    currNode = grandparent;
                } else {
                    if (currNode === parent.left) {
                        console.log(`Current node ${currNode.value} is left child of its parent ${parent.value}. Performing right rotation on parent.`);
                        this._rightRotation(parent);
                        currNode = parent;
                    }
                    console.log(`Performing left rotation on grandparent ${grandparent.value}.`);
                    this._leftRotation(grandparent);
                }
            }
            currNode = grandparent;
        }
        console.log(`Setting root color to black.`);
        this.root.color = NodeColor.BLACK;
    }


    delete(value, node = this.root) {
        console.log(`Attempting to delete value ${value}`);
        const targetNode = this.search(value, node);
        if (!targetNode) {
            console.log(`Value ${value} not found in the tree.`);
            return false;
        }

        console.log(`Found node with value ${value}`);

        if (!targetNode.left && !targetNode.right) {
            console.log(`Node ${value} is a leaf node.`);
            if (this._isRed(targetNode)) {
                console.log(`Node ${value} is red, simply removing it.`);
                this._replaceParent(targetNode, null);
            } else {
                console.log(`Node ${value} is black, needs fixup after removal.`);
                this._deleteFixup(targetNode);
                this._replaceParent(targetNode, null);
            }
        } else if (!targetNode.left || !targetNode.right) {
            if (targetNode.left) {
                console.log(`Node ${value} has only left child.`);
                targetNode.left.color = NodeColor.BLACK;
                targetNode.left.parent = targetNode.parent;
                this._replaceParent(targetNode, targetNode.left);
            } else {
                console.log(`Node ${value} has only right child.`);
                targetNode.right.color = NodeColor.BLACK;
                targetNode.right.parent = targetNode.parent;
                this._replaceParent(targetNode, targetNode.right);
            }
        } else {
            console.log(`Node ${value} has two children, finding in-order successor.`);
            const aux = this.findMin(targetNode.right);
            console.log(`In-order successor is ${aux.value}`);
            targetNode.value = aux.value;
            this.delete(aux.value, targetNode.right);
        }

        console.log(`Deletion of value ${value} completed.`);
        return this.root;
    }


    _deleteFixup(node) {
        let currNode = node
        while (currNode !== this.root && !this._isRed(currNode)) {
            const { parent } = currNode
            let sibling
            if (currNode === parent.left) {
                sibling = parent.right
                if (this._isRed(sibling)) {
                    console.log(`Left rotation at parent ${parent.value} because sibling ${sibling.value} is red.`);
                    this._leftRotation(parent)
                } else if (!this._isRed(sibling.left) && !this._isRed(sibling.right)) {
                    if (this._isRed(parent)) {
                        console.log(`Parent ${parent.value} is red, setting parent to black and sibling ${sibling.value} to red.`);
                        parent.color = NodeColor.BLACK
                        sibling.color = NodeColor.RED
                        break
                    }
                    console.log(`Sibling ${sibling.value} and parent ${parent.value} are black, moving up the tree.`);
                    sibling.color = NodeColor.RED
                    currNode = parent
                } else if (this._isRed(sibling.left) && !this._isRed(sibling.right)) {
                    console.log(`Right rotation at sibling ${sibling.value} because left child is red.`);
                    this._rightRotation(sibling)
                } else {
                    console.log(`Left rotation at parent ${parent.value}, setting parent to black and sibling's right child to black.`);
                    this._leftRotation(parent)
                    parent.color = NodeColor.BLACK
                    sibling.right.color = NodeColor.BLACK
                    break
                }
            } else {
                sibling = parent.left
                if (this._isRed(sibling)) {
                    console.log(`Right rotation at parent ${parent.value} because sibling ${sibling.value} is red.`);
                    this._rightRotation(parent)
                } else if (!this._isRed(sibling.left) && !this._isRed(sibling.right)) {
                    if (this._isRed(parent)) {
                        console.log(`Parent ${parent.value} is red, setting parent to black and sibling ${sibling.value} to red.`);
                        parent.color = NodeColor.BLACK
                        sibling.color = NodeColor.RED
                        break
                    }
                    console.log(`Sibling ${sibling.value} and parent ${parent.value} are black, moving up the tree.`);
                    sibling.color = NodeColor.RED
                    currNode = parent
                } else if (this._isRed(sibling.right) && !this._isRed(sibling.left)) {
                    console.log(`Left rotation at sibling ${sibling.value} because right child is red.`);
                    this._leftRotation(sibling)
                } else {
                    console.log(`Right rotation at parent ${parent.value}, setting parent to black and sibling's left child to black.`);
                    this._rightRotation(parent)
                    parent.color = NodeColor.BLACK
                    sibling.left.color = NodeColor.BLACK
                    break
                }
            }
        }
        console.log(`Finishing _deleteFixup with currNode: ${currNode.value}`);
    }

    search(value, node = this.root) {
        if (!node) return false
        if (value === node.value) return node
        if (value < node.value) return this.search(value, node.left)
        return this.search(value, node.right)
    }

    _replaceParent(currNode, newNode) {
        console.log(`Replacing parent of node ${currNode.value} with node ${newNode ? newNode.value : null}.`);
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
        console.log(`Left rotation on node ${node.value}.`);
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
        console.log(`Rotating right on node ${node.value}.`);
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
        console.log(`Flipping color of node ${node.value} to red and its children to black.`);
        node.color = NodeColor.RED
        // Making the children black
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

