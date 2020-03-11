'use babel';

import { CompositeDisposable } from 'atom';

// Main Class for this Atom Plugin 
// This plugin overrides the builtin window:focus-pane-on-<direction> commands to make them open the dock it their direction if
// they have reached the end of the panes in that direction and that dock is closed
// It also provides a new command bg:hideActiveDock
class PaneNavAtomPlugin {
	constructor() {
		// subscriptions is a place to put things that need to be cleaned up on deativation
		this.subscriptions = new CompositeDisposable();
	}

	activate(state) {
		// bg:hideActiveDock is a new global command that looks to see if the focus is in a Dock and if so, closes that dock.
		// if the user's focus is in the WorkspaceCenter, it either does nothing or closes the focused editor tab depending on
		// the shouldHideActiveDockAlsoCloseTabs config setting
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'bg:hideActiveDock': () => {
				var shouldCloseWorkspaceCenterTabs = atom.config.get('bg-pane-navigation.shouldHideActiveDockAlsoCloseTabs');
				var activePaneContainer = atom.workspace.getActivePaneContainer();
				if (activePaneContainer && typeof activePaneContainer.hide === 'function') {
					activePaneContainer.hide()
				} else if (shouldCloseWorkspaceCenterTabs) {
					atom.commands.dispatch(atom.workspace.getActivePane().getElement(), 'core:close');
				}
			},
		}));

		// This block enhances the atom window:focus-pane-below|on-left commands so that if there is no pane to go to, and the Dock
		// in that direction is hidden, it opens the Dock and goes to the first pane in that Dock
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

	//"configSchema":
	config =  {
		"shouldHideActiveDockAlsoCloseTabs": {
			"type": "boolean",
			"default": false,
			"title": "Should the 'Hide Active Dock' command close editor tabs in Workspace Center?",
			"description": "This controls what happend when bg:hideActiveDock is executed while the usre's focus is in the WorkspaceCenter instead of one of the Docks.",
			"radio": true,
			"enum": [
				{"value": false,  "description": "False (default) means that it will do nothing when the user's focus is in the WorkspaceCenter "},
				{"value": true,   "description": "True means that it will invoke core:close which typically will close the active tab"}
			]
		}
	}
};

export default new PaneNavAtomPlugin();
