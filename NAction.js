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

class ActAddNode extends NAction{
	constructor(board, node) {
		super(board);
		this.node = node;
	}

	redo() {
		board.addNode(node);
	}

	undo() {
		board.destroyNode(node);
	}
}

class ActDestroyNode extends NAction{
	constructor(board, node) {
		super(board);
		this.info = node.save();
	}

	redo() {
		board.destroyNode(node);
	}

	undo() {
		board.addNode(node);
	}
}