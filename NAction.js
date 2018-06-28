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
		this.board.loadLinks([this.node], this.data.nodes);
		if(this.isSelected){
			this.node.select();
		}
	}
}

class ActRemoveSelectedNodes extends NAction {
	constructor(board) {
		super(board);
		this.nodes = Object.values(board.selectedNodes);
		this.data = board.saveNodes(this.nodes);
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
		this.board.loadLinks(this.nodes, this.data.nodes);
	}
}

class ActPasteClipboard extends NAction {
	constructor(board, prevSelected, pos, nodes) {
		super(board);
		// clipboard cannot be undone, so save what the clipboard was at the time instead
		this.clipboard = JSON.parse(localStorage.getItem("clipboard"));
		this.prevSelected = prevSelected;
		this.pos = pos;
		this.nodes = nodes;
	}

	redo() {
		this.nodes = this.board.pasteNodes(this.pos, this.clipboard);
		this.nodes.forEach(x=>x.select());
	}

	undo() {
		this.nodes.forEach(x=>x.remove());
		this.prevSelected.forEach(x=>x.select());
	}
}

class ActCreateLink extends NAction {
	constructor(board) {
		super(board);
	}

	redo() {}

	undo() {}
}

class ActDestroyLink extends NAction {
	constructor(board) {
		super(board);
	}

	redo() {}

	undo() {}
}