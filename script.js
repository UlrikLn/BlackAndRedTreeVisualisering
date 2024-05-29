import RedBlackTree from './RedBlackTree.js';

const tree = new RedBlackTree();

// Function to log messages to the message div
function logMessage(message) {
    const messageDiv = document.getElementById('message');
    const p = document.createElement('p');
    p.textContent = message;
    messageDiv.appendChild(p);
    messageDiv.scrollTop = messageDiv.scrollHeight; // Scroll to the bottom
}

// Override the console.log method
(function() {
    const originalLog = console.log;
    console.log = function(message) {
        logMessage(message);
        originalLog.apply(console, arguments);
    };
})();

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
        .attr("transform", "translate(0,40)");  // Adjust translate values to center the tree

    const root = d3.hierarchy(data);

    const treeLayout = d3.tree().size([width, height - 160]);
    treeLayout(root);

    // Define gradient
    const defs = svg.append("defs");

    const gradient = defs.append("linearGradient")
        .attr("id", "link-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", height);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#6FDCE3"); // Green color

    gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#5C88C4"); // Yellow color

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#5C2FC2"); // Red color

    // Links
    const link = svg.selectAll('.link')
        .data(root.links(), d => d.target.data.name);

    link.enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        )
        .attr('stroke-opacity', 0)
        .transition()
        .duration(750)
        .attr('stroke-opacity', 1);

    link.transition()
        .duration(750)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    link.exit().transition()
        .duration(750)
        .attr('stroke-opacity', 0)
        .remove();

    // Nodes
    const node = svg.selectAll('.node')
        .data(root.descendants(), d => d.data.name);

    const nodeEnter = node.enter().append('g')
        .attr('class', d => `node ${d.data.color.toLowerCase()}`)
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('opacity', 0);

    nodeEnter.append('circle')
        .attr('r', 10);

    nodeEnter.append('text')
        .attr('dy', -12)
        .attr('x', d => d.children ? -12 : 12)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);

    nodeEnter.transition()
        .duration(750)
        .attr('opacity', 1);

    const nodeUpdate = node.transition()
        .duration(750)
        .attr('transform', d => `translate(${d.x},${d.y})`);

    nodeUpdate.select('circle')
        .attr('r', 10);

    node.exit().transition()
        .duration(750)
        .attr('opacity', 0)
        .remove();
}


