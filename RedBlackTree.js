// enums for node farve
const NodeColor = {
    RED: 'RED',
    BLACK: 'BLACK',
}


// Klasse for at repræsentere en rød-sort knude
class RBTNode {
    constructor(value, parent = null) {
        this.value = value
        this.left = null
        this.right = null
        this.parent = parent
        this.color = NodeColor.RED // Nye noder er altid røde
    }
}

class RedBlackTree {
    constructor() {
        this.root = null
    }

    insert(value) {
        // Hælperfunktion til rekursiv indsættelse
        // Hvis der ikk er nogen rod, indsættes den nye knude som rod og laves sort
        // Ellers indsættes knuden som et barn til en eksisterende knude det rigtige sted
        // Efter kaldes insertFixup for at sikre at træet overholder rød-sort egenskaberne
        const insertHelper = (node) => {
            const currNode = node;
            if (value < currNode.value) {
                // Hvis current node har en venstre knude, gå til venstre
                if (currNode.left) {
                    console.log(`Traversing left from node ${currNode.value}`);
                    // Rekursivt kald til venstre barn, kør igen med venstre barn som ny current node
                    insertHelper(currNode.left);
                // Hvis current node ikke har en venstre knude, indsæt den nye knude som venstre barn
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
                // Håndtering af duplikater
            } else {
                console.log(`Value ${value} already exists in the tree. No duplicates allowed.`);
            }
        }

        if (!this.root) {
            console.log(`Inserting ${value} as the root node.`);
            this.root = new RBTNode(value);
            this.root.color = NodeColor.BLACK; // Sørge for at roden altid er sort
        } else {
            console.log(`Starting insertion of ${value}`);
            insertHelper(this.root);
        }
    }


    // Fixup funktion for at sikre at rød-sort egenskaberne overholdes efter en indsættelse
    _insertFixup(node) {
        let currNode = node;
        // Mens forældre til current node er rød og ikke null. Sikre at vi stopper når vi når roden eller når faren ikke længere er rød
        while (this._isRed(currNode.parent) && currNode.parent.parent) {
            const { parent } = currNode;
            const grandparent = parent.parent;

            console.log(`Fixing up at node ${currNode.value}, parent ${parent.value}, grandparent ${grandparent.value}`);

            // Hvis forældrenode er venstre barn af bedsteforældrenode
            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                // Hvis onkel er rød, flip farverne op bedsteforældrene
                if (this._isRed(uncle)) {
                    console.log(`Uncle ${uncle.value} is red. Flipping colors of grandparent ${grandparent.value}.`);
                    this._flipColor(grandparent);
                } else {
                    // Hvis current node er højre barn af forældrenode, roter til venstre om forældrenode
                    if (currNode === parent.right) {
                        console.log(`Current node ${currNode.value} is right child of its parent ${parent.value}. Performing left rotation on parent.`);
                        this._leftRotation(parent);
                        currNode = parent;
                    }
                    // Roter til højre om bedsteforældrenode
                    console.log(`Performing right rotation on grandparent ${grandparent.value}.`);
                    this._rightRotation(grandparent);
                }
            } else {
                // Hvis forældrenode er højre barn af bedsteforældrenode
                const uncle = grandparent.left;
                // Hvis onkel er rød, flip farven
                if (this._isRed(uncle)) {
                    console.log(`Uncle ${uncle.value} is red. Flipping colors of grandparent ${grandparent.value}.`);
                    this._flipColor(grandparent);
                    currNode = grandparent;
                } else {
                    // Hvis current node er venstre barn af forældrenode, roter til højre om forældrenode
                    if (currNode === parent.left) {
                        console.log(`Current node ${currNode.value} is left child of its parent ${parent.value}. Performing right rotation on parent.`);
                        this._rightRotation(parent);
                        currNode = parent;
                    }
                    // Roter til venstre om bedsteforældrenode
                    console.log(`Performing left rotation on grandparent ${grandparent.value}.`);
                    this._leftRotation(grandparent);
                }
            }
            // Opdater current node til bedsteforældrenode, for at forsætte op i træet og fikse ydeligere problemer
            currNode = grandparent;
        }
        // Til sidst Sørg for, at roden altid er sort
        console.log(`Setting root color to black.`);
        this.root.color = NodeColor.BLACK;
    }

    // Denne funktion sletter en værdi fra træet. Den håndterer tilfælde, hvor den slettede knude er en leafnode, har et enkelt barn, eller har to børn.
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
            // Find in-order successor og erstat den slettede node med den
            const aux = this.findMin(targetNode.right);
            console.log(`In-order successor is ${aux.value}`);
            targetNode.value = aux.value;
            this.delete(aux.value, targetNode.right);
        }

        console.log(`Deletion of value ${value} completed.`);
        return this.root;
    }

    // Fixup funktion for at sikre at rød-sort egenskaberne overholdes efter en sletning
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

    // Søgefunktion for at finde en værdi i træet
    search(value, node = this.root) {
        if (!node) return false
        if (value === node.value) return node
        if (value < node.value) return this.search(value, node.left)
        return this.search(value, node.right)
    }

    // Hjælpefunktion til at erstatte en knude med en anden
    // Bliver brugt i sletning
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

    // Udfører rotationer for at opretholde rød-sort egenskaberne
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

    // Hjælpefunktion til at flippe farver på en node og dens børn
    _flipColor(node) {
        console.log(`Flipping color of node ${node.value} to red and its children to black.`);
        node.color = NodeColor.RED
        // Making the children black
        node.left.color = NodeColor.BLACK
        node.right.color = NodeColor.BLACK
    }

    // Hjælpefunktion til at tjekke om en node er rød
    _isRed(node) {
        return node ? node.color === NodeColor.RED : false
    }

    // Finder minimumsværdien i et subtræ
    // bliver brugt i delete
    findMin(node = this.root) {
        let currentNode = node
        while (currentNode && currentNode.left) {
            currentNode = currentNode.left
        }
        return currentNode
    }


}

export default RedBlackTree

