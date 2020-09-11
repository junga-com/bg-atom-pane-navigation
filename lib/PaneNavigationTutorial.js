import { Tutorial,dedent } from 'bg-atom-utils';
import { DispatchCommand } from 'bg-atom-utils';

export class PaneNavigationTutorial extends Tutorial {
	static configure(configKey) {
		PaneNavigationTutorial.configKey = configKey;
		atom.config.addDep(PaneNavigationTutorial.configKey, PaneNavigationTutorial)

		PaneNavigationTutorial.onConfigChanged({});
	}

	static onConfigChanged({key, newValue}) {
		if (!newValue) newValue=atom.config.get(PaneNavigationTutorial.configKey);
		if (newValue || Tutorial.resumeStateExists()) {
			if (newValue) atom.config.set(PaneNavigationTutorial.configKey, false);
			if (!PaneNavigationTutorial.instance)
				PaneNavigationTutorial.instance = new PaneNavigationTutorial();
		}
	}

	constructor() {
		super('bg-ui-font-resizer');
		if (!this.doResumeState())
			this.pageStart();
	}

	pageStart() {
		if (this.dialog) this.dialog.dismiss();
		this.dialog = atom.notifications.addInfo(dedent`
			<h3>(1/4) Thank you for installing bg-pane-navigation.</h3>
			<p>The builtin pane navigation commands will now open docks when you navigate in the direction of a closed dock. This is particularly useful when you map keys to them.</p>
			`, {
			dismissable: true,
			buttons: [
				{text: 'Next',          onDidClick: ()=>{this.page1_1()}},
				{text: 'Ok, got it',    onDidClick: ()=>{this.end()}}
			]
		})
	}

	page1_1() {
		if (this.dialog) this.dialog.dismiss();
		this.dialog = atom.notifications.addInfo(dedent`
			<h3>(2/4) About Keymaps</h3>
			<p>Typically, the packages I write do not install any global keymaps since there is no universal way that people use the keyboard</p>
			<p>The settings page for this package has suggestions for modifying your keymap file to use the alt-&lt;arrow&gt; keys to navigate between atom panes.</p>
			<p>Click the button below to be guided through setting up your keymap file</p>

			`, {
			dismissable: true,
			buttons: [
				{text: 'Help config keymaps', onDidClick: ()=>{this.openSettingsAndKeymaps()}},
				{text: 'Back',          onDidClick: ()=>{this.pageStart()}},
				{text: 'Next',          onDidClick: ()=>{this.page2()}},
				{text: 'Ok, got it',    onDidClick: ()=>{this.end()}}
			]
		})
	}

	page2() {
		if (this.dialog) this.dialog.dismiss();
		this.dialog = atom.notifications.addInfo(dedent`
			<h3>(3/4) Closing Things 1</h3>
			<p>Since the pane navigation commands will now open a Dock when needed, it makes sense that there is an easy way to undo
			   that and close the Dock again. The \`bg:hideActiveDock\` command is context sensitive and will close the doc that has
			   your focus. I use \`alt-w\` for that.</p>
			<p>If your focus is in the WorkspaceCenter, a configuration setting determines whether \`bg:hideActiveDock\` closes the
			  active editor or does nothing.
			`, {
			dismissable: true,
			buttons: [
				{text: 'Back',          onDidClick: ()=>{this.page1_1()}},
				{text: 'Next',          onDidClick: ()=>{this.page2_5()}},
				{text: 'Ok, got it',    onDidClick: ()=>{this.end()}}
			]
		})
	}

	page2_5() {
		if (this.dialog) this.dialog.dismiss();
		this.dialog = atom.notifications.addInfo(dedent`
			<h3>(4/4) Closing Things 2</h3>
			<p>\`cntr-w\` is a common key to close the focused part of an app. In Atom it closes the active editor even if the focus is
			  not in the WorkspaceCenter.</p>
			<p>My keymap changes that so that \`cntr-w\` will invoke \`bg:hideActiveDock\` when your focus is in a Dock. This makes
			  \`cntr-w\` and \`alt-w\` do the same.</p>
			`, {
			dismissable: true,
			buttons: [
				{text: 'Back',          onDidClick: ()=>{this.page2()}},
				{text: 'Close',         onDidClick: ()=>{this.end()}}
			]
		})
	}

	end() {
		if (this.dialog) this.dialog.dismiss();
		PaneNavigationTutorial.instance = null;
		this.dialog = atom.notifications.addInfo(dedent`
			<h3>Press &lt;esc&gt; to get back to work..</h3>
			<p>If you have any questions or comments, please click on the \`Report Issues\` button near the top of the settings page.</p>
			<p>To run this tutorial again, enable its checkbox on the bg-tree-view-toolbar settings page or look for the tutorial command in the tool pallette.</p>
			<p>The readme file (settings page) goes into more detail about the motivations for this package and the suggested keymap.</p>
			`, {
			dismissable: true
		})
	}


	async openSettingsAndKeymaps() {
		await atom.workspace.open('atom://config/packages/bg-pane-navigation/');
		setTimeout(()=>{
			var settingsView = atom.workspace.getItemByURI('atom://config');
			var editEl = settingsView && settingsView.element.querySelector('#keymaps');
			editEl && editEl.scrollIntoView(true);
		}, 500);
		atom.workspace.open(atom.keymaps.getUserKeymapPath(),{split:'right'});
		if (this.dialog) this.dialog.dismiss();
		this.dialog = atom.notifications.addInfo(dedent`
			<h3>Merge keymaps into your keymap file</h3>
			<p>The left pane should be open to the Keymaps seciont of the settings page and the right pane should be open to your keymap file</p>
			<p>You can copy/paste some or all of the suggested keymaps into your keymap.cson file.</p>
			<p>Note that you might be able to simply copy all the lines from the keymap section to the bottom of your keymap file.
			   However, if your keymap file already has a section with the same selectors, you must merge the new keymap lines to that existing section.
			</p>
			<p>If you want to use different keys, change the key names after you copy them. Open the keybinding resolver tool to see the key names when you press them</p>
			`, {
				dismissable: true,
				buttons: [
					{text: 'Back',          onDidClick: ()=>{this.page1_1()}},
					{text: 'Next',          onDidClick: ()=>{this.page2()}},
					{text: 'Ok, got it',    onDidClick: ()=>{this.end()}}
				]
			})
	}

}
