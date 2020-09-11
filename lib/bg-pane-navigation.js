import { BGAtomPlugin, dedent } from 'bg-atom-utils';
import { PaneNavigationTutorial } from './PaneNavigationTutorial'

// Main Class for this Atom Plugin
// This plugin overrides the builtin window:focus-pane-on-<direction> commands to make them open the dock it their direction if
// they have reached the end of the panes in that direction and that dock is closed
// It also provides a new command bg:hideActiveDock
class PaneNavAtomPlugin extends BGAtomPlugin {
	constructor(state) {
		super('bg-pane-navigation', state, __filename);

		this.addCommand('bg:hideActiveDock', ()=>{this.hideActiveDock()});
		this.addCommand('bg-pane-navigation:run-tutorial', ()=>{atom.config.set('bg-pane-navigation.showWelcomeOnActivation', true)});

		// register our methods to be called before and after the pane navigation commands
		this.watchPreCommand( /^window:focus-pane-(below|on-left|on-right|above)/, (cmdName)=>this.onBeforePaneNavigationCmd(cmdName));
		this.watchPostCommand(/^window:focus-pane-(below|on-left|on-right|above)/, (cmdName)=>this.onAfterPaneNavigationCmd(cmdName));

		PaneNavigationTutorial.configure('bg-pane-navigation.showWelcomeOnActivation');
	}


	// These two methods enhance the atom window:focus-pane-below|on-left commands so that if there is no pane to go to, and the Dock
	// in that direction is hidden, it opens the Dock and goes to the first pane in that Dock
	// The way it works is that it saves the active pane item before a navigation command is launched and then after the navigation
	// runs, if its not a different item it opens the dock in that direction and activates the active item in that Dock.
	onBeforePaneNavigationCmd(cmdName, event) {
		this.wfpbTmp = atom.workspace.getActivePaneItem()
	}
	onAfterPaneNavigationCmd(cmdName, event) {
		if (this.wfpbTmp === atom.workspace.getActivePaneItem()) {
			var dock = null;
			switch (cmdName) {
				case "window:focus-pane-on-left":  dock = atom.workspace.getLeftDock();   break;
				case "window:focus-pane-on-right": dock = atom.workspace.getRightDock();  break;
				case "window:focus-pane-below":    dock = atom.workspace.getBottomDock(); break;
				case "window:focus-pane-above":
					atom.workspace.getActivePane().activate();
					break;
			}
			if (dock) dock.activate()
		}
		this.wfpbTmp=null;
	}

	// bg:hideActiveDock is a new global command that looks to see if the focus is in a Dock and if so, closes that dock.
	// if the user's focus is in the WorkspaceCenter, it either does nothing or closes the focused editor tab depending on
	// the shouldHideActiveDockAlsoCloseTabs config setting
	hideActiveDock() {
		var shouldCloseWorkspaceCenterTabs = atom.config.get('bg-pane-navigation.shouldHideActiveDockAlsoCloseTabs');
		var activePaneContainer = atom.workspace.getActivePaneContainer();
		if (activePaneContainer && typeof activePaneContainer.hide === 'function') {
			activePaneContainer.hide()
		} else if (shouldCloseWorkspaceCenterTabs) {
			atom.commands.dispatch(atom.workspace.getActivePane().getElement(), 'core:close');
		}
	}
};

//"configSchema":
PaneNavAtomPlugin.config =  {
	"showWelcomeOnActivation": {
		"type": "boolean",
		"default": true,
		"title": "Show Welcome Tutorial",
		"description": "Checking this will activate the welcome dialog one more time"
	},
	"shouldHideActiveDockAlsoCloseTabs": {
		"type": "boolean",
		"default": false,
		"title": "Should the 'Hide Active Dock' command close editor tabs in Workspace Center?",
		"description": "This controls what happend when bg:hideActiveDock is executed while the user's focus is in the WorkspaceCenter instead of one of the Docks.",
		"radio": true,
		"enum": [
			{"value": false,  "description": "False (default) : do nothing when the user's focus is in the WorkspaceCenter "},
			{"value": true,   "description": "True : invoke core:close which typically will close the active tab"}
		]
	}
}

export default BGAtomPlugin.Export(PaneNavAtomPlugin);
