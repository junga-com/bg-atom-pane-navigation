'use babel';

import { CompositeDisposable } from 'atom';


// Main Atom Plugin Class
export class PaneNavAtomPlugin {
	constructor() {
		// subscriptions is a place to put things that need to be cleaned up on deativation
		this.subscriptions = new CompositeDisposable();

		// Register global commands
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'bg:hideActiveDock': () => {
				var activeDoc = atom.workspace.getActivePaneContainer();
				console.log(activeDoc);
				if (activeDoc && typeof activeDoc.hide === 'function') {
					console.log('hiding it');
					activeDoc.hide()
				}
			},
		}));

		// This block enhances the atom window:focus-pane-below|on-left commands so that if there is no pane to go to, and the Dock
		// in that direction is hidden, it opens the Dock and goes to interval
		// The way it works is that it saves the active pane item in onWillDispatch and if in onDidDispatch its not a different item
		// it opens the dock in that direction and activates the active item in that Dock.
		this.subscriptions.add(atom.commands.onWillDispatch((e)=> {
			if (e.type.match(/^window:focus-pane-(below|on-left|on-right)/)) {
				this.wfpbTmp = atom.workspace.getActivePaneItem()
			}
		}));
		this.subscriptions.add(atom.commands.onDidDispatch((e)=> {
			if (e.type.match(/^window:focus-pane-(below|on-left|on-right)/)) {
				if (this.wfpbTmp === atom.workspace.getActivePaneItem()) {
					var dock = null;
					switch (e.type) {
						case "window:focus-pane-on-left":  dock = atom.workspace.getLeftDock(); break;
						case "window:focus-pane-on-right": dock = atom.workspace.getRightDock(); break;
						case "window:focus-pane-below":    dock = atom.workspace.getBottomDock(); break;
					}
					dock.activate()
				}
				this.wfpbTmp=null;
			}
		}));
	}

	deactivate() {
		this.subscriptions.dispose();
	}

	serialize() {
		return ;
	}
};
