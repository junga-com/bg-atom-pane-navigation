'use babel';

import { PaneNavAtomPlugin }      from './bg-PaneNavAtomPlugin'

// This is a stub that passes through to the plugin class since atom cant use a real class as main
export default {
	activate(state) {this.plugin = new PaneNavAtomPlugin();},
	deactivate()    {this.plugin.deactivate()},
	serialize()     {this.plugin.serialize()},
};
