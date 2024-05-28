import RedBlackTree from './RedBlackTree.js';

const tree = new RedBlackTree();

window.insertNode = function insertNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        tree.insert(value);
        updateTree();
    }
};

window.deleteNode = function deleteNode() {
    const value = parseInt(document.getElementById('deleteValue').value);
    if (!isNaN(value)) {
        tree.delete(value);
        updateTree();
    }
};

function updateTree() {
    const data = treeToHierarchy(tree.root);
    drawTree(data);
}

function treeToHierarchy(node) {
    if (!node) return null;
    return {
        name: node.value,
        color: node.color,
        children: [treeToHierarchy(node.left), treeToHierarchy(node.right)].filter(child => child !== null)
    };
}

function drawTree(data) {
    d3.select("#tree").html("");

    const width = 600;
    const height = 400;
    const svg = d3.select("#tree").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,40)");

    const root = d3.hierarchy(data);

    const treeLayout = d3.tree().size([width, height - 160]);
    treeLayout(root);

    // Links
    svg.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    // Nodes
    const node = svg.selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', d => `node ${d.data.color.toLowerCase()}`)
        .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
        .attr('r', 10);

    node.append('text')
        .attr('dy', -12)
        .attr('x', d => d.children ? -12 : 12)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
}
