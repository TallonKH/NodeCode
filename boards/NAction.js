class NAction {
	constructor(board) {
		this.board = board;
	}
	redo() {}
	undo() {}
}

class NMacro {
	constructor(...actions) {
		this.actions = actions;
	}

	redo() {
		for (let a of this.actions) {
			a.redo();
		}
	}
	undo() {
		for (let i = this.actions.length - 1; i >= 0; i--) {
			this.actions[i].undo();
		}
	}
}

class ActDeselectAll extends NAction {
	constructor(board) {
		super(board);
		this.prevSelected = Object.values(board.selectedNodes);
	}
	redo() {
		this.board.deselectAllNodes();
	}
	undo() {
		for (const node of this.prevSelected) {
			this.board.selectNode(node);
		}
	}
}

class ActSelectAll extends NAction {
	constructor(board) {
		super(board);
		this.prevSelected = Object.values(board.selectedNodes);
	}
	redo() {
		this.board.selectAllNodes();
	}
	undo() {
		this.board.deselectAllNodes();
		for (const node of this.prevSelected) {
			this.board.selectNode(node);
		}
	}
}

class ActSelect extends NAction {
	constructor(board, nodes) {
		super(board);
		this.nodes = nodes;
	}
	redo() {
		for (const node of this.nodes) {
			this.board.selectNode(node);
		}
	}
	undo() {
		for (const node of this.nodes) {
			this.board.deselectNode(node);
		}
	}
}

class ActDeselect extends NAction {
	constructor(board, nodes) {
		super(board);
		this.nodes = nodes;
	}
	redo() {
		for (const node of this.nodes) {
			this.board.deselectNode(node);
		}
	}
	undo() {
		for (const node of this.nodes) {
			this.board.selectNode(node);
		}
	}
}

class ActToggleSelect extends NAction {
	constructor(board, nodes) {
		super(board);
		this.nodes = nodes;
	}
	redo() {
		for (const node of this.nodes) {
			this.board.toggleSelectNode(node);
		}
	}
	undo() {
		// mirrored action
		redo();
	}
}

class ActMoveSelectedNodes extends NAction {
	constructor(board, delta) {
		super(board);
		this.delta = delta;
	}

	redo() {
		for (const nodeid in this.board.selectedNodes) {
			this.board.selectedNodes[nodeid].move(this.delta);
		}
	}

	undo() {
		const adelta = this.delta.multiply1(-1);
		for (const nodeid in this.board.selectedNodes) {
			this.board.selectedNodes[nodeid].move(adelta);
		}
	}
}

class ActMoveNodes extends NAction {
	constructor(board, delta, nodes) {
		super(board);
		this.delta = delta;
		this.nodes = nodes;
	}

	redo() {
		for (const node of this.nodes) {
			node.move(this.delta);
		}
	}

	undo() {
		const adelta = this.delta.multiply1(-1);
		for (const node of this.nodes) {
			node.move(adelta);
		}
	}
}

class ActAddNode extends NAction {
	constructor(board, node) {
		super(board);
		this.node = node;
	}

	redo() {
		this.board.addNode(this.node);
	}

	undo() {
		this.board.removeNode(this.node);
	}
}

class ActRemoveNode extends NAction {
	constructor(board, node) {
		super(board);
		this.node = node;
		this.isSelected = node.selected;
		this.data = board.saveNodes([node]);
	}

	redo() {
		this.board.removeNode(this.node);
	}

	undo() {
		this.board.addNode(this.node);
		this.board.loadLinks(this.data.nodes);
		if (this.isSelected) {
			this.node.select();
		}
	}
}

class ActRemoveSelectedNodes extends NAction {
	constructor(board) {
		super(board);
		this.nodes = Object.values(board.selectedNodes);
		this.links = board.saveNodes(this.nodes).links;
	}

	redo() {
		for (const node of this.nodes) {
			this.board.removeNode(node);
		}
	}

	undo() {
		for (const node of this.nodes) {
			this.board.addNode(node);
			node.select();
		}
		this.board.loadLinks(this.links);
	}
}

class ActPasteClipboard extends NAction {
	constructor(board, prevSelected, nodes) {
		super(board);
		// save link data for the original pasted nodes
		this.links = board.saveNodes(nodes).links;
		this.prevSelected = prevSelected;
		this.nodes = nodes;
	}

	redo() {
		this.board.deselectAllNodes();
		// instead of pasting (creating new nodes), re-add the initially pasted nodes
		for (const node of this.nodes) {
			this.board.addNode(node);
			node.select();
		}
		this.board.loadLinks(this.links);
	}

	undo() {
		this.nodes.forEach(x => x.remove());
		this.prevSelected.forEach(x => x.select());
	}
}

class ActDuplicateNode extends NAction {
	constructor(board, newNode) {
		super(board);
		this.newNode = newNode;
		this.selected = Object.values(board.selectedNodes);
	}

	redo() {
		this.board.deselectAllNodes();
		this.board.addNode(this.newNode);
		this.newNode.select();
	}

	undo() {
		this.board.removeNode(this.newNode);
		this.selected.forEach(x => x.select());
	}
}

class ActDuplicateNodes extends NAction {
	constructor(board, newNodes) {
		super(board);
		this.newNodes = newNodes;
		this.linkData = board.saveNodes(newNodes).nodes;
		this.selected = Object.values(board.selectedNodes);
	}

	redo() {
		this.board.deselectAllNodes();
		for (const node of this.newNodes) {
			this.board.addNode(node);
			node.select();
		}
		this.board.loadLinks(this.linkData);
	}

	undo() {
		this.newNodes.forEach(x => x.remove());
		this.selected.forEach(x => x.select());
	}
}

class ActCreateLink extends NAction {
	constructor(board, pin1, pin2) {
		super(board);
		this.prevP1Link = pin1.multiConnective && pin1.linkNum ? null : Object.values(pin1.links)[0];
		this.prevP2Link = pin2.multiConnective && pin2.linkNum ? null : Object.values(pin2.links)[0];
		this.pinid1 = pin1.pinid;
		this.pinid2 = pin2.pinid;
	}

	redo() {
		this.board.pins[this.pinid1].linkTo(this.board.pins[this.pinid2]);
	}

	undo() {
		const p1 = this.board.pins[this.pinid1];
		const p2 = this.board.pins[this.pinid2];
		p1.unlink(p2);
		if (this.prevP1Link) {
			p1.linkTo(this.prevP1Link);
		}
		if (this.prevP2Link) {
			p2.linkTo(this.prevP2Link);
		}
	}
}

class ActRemoveLink extends NAction {
	constructor(board, pin1, pin2) {
		super(board);
		this.pinid1 = pin1.pinid;
		this.pinid2 = pin2.pinid;
	}

	redo() {
		this.board.pins[this.pinid1].unlink(this.board.pins[this.pinid2]);
	}

	undo() {
		this.board.pins[this.pinid1].linkTo(this.board.pins[this.pinid2]);
	}
}

class ActRemoveLinks extends NAction {
	constructor(board, links) {
		super(board);
		this.links = links;
	}

	redo() {
		this.links.forEach(l => this.board.pins[l[0]].unlink(this.board.pins[l[1]]));
	}

	undo() {
		this.links.forEach(l => this.board.pins[l[0]].linkTo(this.board.pins[l[1]]));
	}
}

class ActUnlinkPin extends NAction {
	constructor(board, pin) {
		super(board);
		this.pinid = pin.pinid;
		this.links = Object.keys(pin.links);
	}

	redo() {
		this.board.pins[this.pinid].unlinkAll();
	}

	undo() {
		const pin = this.board.pins[this.pinid];
		this.links.forEach(id => pin.linkTo(this.board.pins[id]));
	}
}

class ActUnlinkPins extends NAction {
	constructor(board, pins) {
		super(board);
		this.links = {};
		for (const pin of pins) {
			this.links[pin.pinid] = Object.keys(pin.links);
		}
	}

	redo() {
		for (const pinid in this.links) {
			this.board.pins[pinid].unlinkAll();
		}
	}

	undo() {
		for (const pinid in this.links) {
			const pin = this.board.pins[pinid];
			this.links[pinid].forEach(pinid2 => pin.linkTo(this.board.pins[pinid2]));
		}
	}
}

class ActAddPin extends NAction {
	constructor(board, pin) {
		super(board);
		this.links = {};
		for (const pin of pins) {
			this.links[pin.pinid] = Object.keys(pin.links);
		}
	}

	redo() {
		for (const pinid in this.links) {
			this.board.pins[pinid].unlinkAll();
		}
	}

	undo() {
		for (const pinid in this.links) {
			const pin = this.board.pins[pinid];
			this.links[pinid].forEach(pinid2 => pin.linkTo(this.board.pins[pinid2]));
		}
	}
}