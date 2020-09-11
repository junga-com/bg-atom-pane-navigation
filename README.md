# BG Pane Navigation Package

#### 2020-09 Update
This project uses the bg-atom-utils npm package which now installs a number of extensions to the atom.* API objects. I think that they are
unlikely to cause problems, but if you experience any, please take the time to create an issue on this package to let me know. I am very interested in addressing any issues quickly.

#### Summary
The principle feature of this package is that it traps the atom window:focus-pane-* navigation commands provided by Atom core and makes them reveal (aka open) the Dock in the direction of navigation if that Dock is hidden and there is no pane in that direction to go to.

This package works to enhance those commands regardless of what keymap is assigned to them but I also suggest a keymap that I personally use that you might want to consider. I hold down the alt key and use &lt;arrows>,pgUp,pgDn to navigate to any WorkspaceItem to either use it or close with alt-w to free up more space for the WorkspaceCenter.

#### Pane and PaneItem Navigation Commands
In addition to documenting what this package provides, this table serves as a reference for the commands needed to navigate to any
WorkspaceItem (aka tab) in the workspace. The first column indicates what this packages relation is to that command.

|                        | Command                 | Default KeyMap   | My Keymap    | Description
|---                     |---                      |---               |---           |---
|modified                |`focus-pane-above`       |ctrl-k ctrl-up    | alt-up       | enhanced to open the Dock when needed
|modified                |`focus-pane-below`       |ctrl-k ctrl-down  | alt-down     | enhanced to open the Dock when needed
|modified                |`focus-pane-on-left`     |ctrl-k ctrl-left  | alt-left     | enhanced to open the Dock when needed
|modified                |`focus-pane-on-right`    |ctrl-k ctrl-right | alt-right    | enhanced to open the Dock when needed
|&lt;reference only>     |`pane:show-previous-item`|`ctrl-pageup`     |`alt-pageup`  | cycle through tabs in the current Pane
|&lt;reference only>     |`pane:show-next-item`    |`ctrl-pagedown`   |`alt-pagedown`| cycle through tabs in the current Pane
|new                     |`bg:hideActiveDock`      |none              | alt-w        | hide the dock that contains the focus
|suggested keymap change |`core:close`             |ctrl-w            | ctrl-w       | Change its behavior when a Dock has the focus

This package introduces the `bg:hideActiveDock` command which operates on the pane container that has the user's focus. It will either be the WorkspaceCenter
or one of the three (left, right, bottom) Docks that neighbor it. If the focus is one of the Docks, the command will hide that Dock. Note that the Dock can contain multiple panes, each with an active, visible tab and they will all be hidden. This is the correct behavior for my workflow.

If the user's focus is in the WorkspaceCenter, the behavior of bg:hideActiveDock is determined by the current value of a configuration
setting. If true, it will close the active workspace item (aka tab, aka editor window). If false, it will do nothing. If you want to consider bg:hideActiveDock as non-destructive (i.e. it only hides things which you can easily get back by navigating back to them) then set it to false. If you want to consider bg:hideActiveDock as a command that makes the current thing with the focus disappear, set it to true. I set mine to true.  

#### Keymaps
This package does not provide any keymap so that the user can decide how to use their keyboard. My keymap is a compromise of giving up the sub-word cursor jumping in editors and the expand all, collapse all function in the tree-view in order to have consistent pane navigation. You might like that or might come up with your own keymap that suits you better.

Here is the relevant portion of my keymap.cson that you may find useful to merge into your keymap.cson (menu:Edit->Keymap...) or use it as a starting point to modify your keymap in another way.

keymaps.cson
```
	# Global keymaps to implement navigation between Panes and Items within them using the alt- modifier
	'atom-workspace':
	  'alt-up':       'window:focus-pane-above'
	  'alt-down':     'window:focus-pane-below'
	  'alt-left':     'window:focus-pane-on-left'
	  'alt-right':    'window:focus-pane-on-right'
	  'alt-pageup':   'pane:show-previous-item'
	  'alt-pagedown': 'pane:show-next-item'
	  'alt-w':        'bg:hideActiveDock'
      'alt-\\':       'tree-view:reveal-active-file'

	# override the ctlr-w function (close doc) when the focus is in a dock instead of the WorkspaceCenter. Without this, ctrl-w
	# closes the last editor in the WorkspaceCenter that had the focus even though it no longer has the focus. That is unintuitive
	# to me. This changes that so that it hides the dock that has the focus. The result is that ctrl-w always makes the thing with
	# the focus disappear.
	'atom-dock':
	  'ctrl-w': 'bg:hideActiveDock'

	#unset use of alt-&lt;arrow keys> by tree-view and atom-text-editor so that we can use them to navigate between panes
	'.tree-view, atom-workspace atom-text-editor:not(.mini)':
	  'alt-up':    'unset!'
	  'alt-down':  'unset!'
	  'alt-left':  'unset!'
	  'alt-right': 'unset!'
```

#### Motivation for My keymap
I personally like having one consistent set of navigation keys to navigate between any WorkspaceItem (aka tab) in Atom.

I press and hold alt to enter a sort of pane navigation mode.
* up,down.left,right navigates to any pane
* pageUp,pageDown navigates withing a pane to select the active WorkspaceItem (aka tab)
* w will make the currently focused thing go away by either hiding a Dock or closing a WorkspaceItem in the Center

Not only does this allow me to get to any item, but also I can quickly tidy up give more space to the workspaceCenter by doing left,w, right,w, down,w.

I override the default use of alt-&lt;arrow> keys in the tree-view and text-editor. This replaces expandAll/collapseAll in the tree view and Sub-word boundary cursor jumping in the text editor.  I would rather have consistent pane navigation that those functions but YMMV.

I use alt even though ctrl-pageUp/Dn and ctrl-w are ubiquitous for tab navigation and closing tabs because ctrl-[arrows] is also
ubiquitous for text navigation within the editor view so ctrl-&lt;arrow> can not be used for pane navigation.

My alt-pageUp/Dn are aliases for ctrl-pageUp/Down. I still use the ctrl variants since browsers and other applications make that second
nature but the alt variants make it so that while I am navigating to a pane, I dont have to change the modifier key to select the
WorkspaceItem (aka tab) that I want to get to.

The idea of my alt-w is that similar to ctrl-w, it makes the thing you are looking at go away. It generally closes the active dock so that when you come back to that dock, the item (like the tree-view) is still there. However, the WorkspaceCenter does not have a concept of closing. I gave you an option in the package settings to choose whether it closes the active item in workspaceCenter (same as ctrl-w) or whether it does nothing.  



#### Motivation for this Package

The idea is that you no longer need to use a variety of different keymaps to reveal and hide the views that you commonly place in the left, right, and bottom docks because you can use pane navigation keymaps to do that.

For example, people often keep the tree-view in the left dock and use dedicated keymaps to 1) show the tree-view and 2) hide the tree-view.

Each new tool that you add to your workspace would need two more keymaps to show and hide. This eats through keymaps so you end up having to use the command pallete to navigate to them.

Instead, you can configure your workplace by placing the tools you need in the the docks you want. Then you can can navigate to any tool or open editor using one set of pane navigation keymaps. You can close docks to recover screen real estate by navigating to a dock and closing it.

The result is that the four directional pane navigation commands will get you to any Pane in the WorkplaceCenter or surrounding Docks and then once in the right Pane, PaneItem navigation will get you to the WorkspaceItem (aka tab) that you want to be at.

## Lets get on the same Page (or should I say 'Pane')
I found the difference between Pane,Tab,Panel,Dock, and WorkplaceCenter difficult to figure out when I started using Atom so here
is a brief explanation to get us on the same page.

Pretty much everything you see in Atom is either a WorkplaceItem (aka tab) or a panel. Not everyone uses tabs so its better to talk
about WorkspaceItems. (Instead of tabs, I think that they typically use an info bar that tells them which WorkspaceItem they are
currently looking at and use keybinding to switch to other WorkplaceItems.)

Panels are typically things like the status bar and search dialog. They are single things that can be visible or not and are always
at the same location determined by the developer. The location of a Panel can be header (full width above )

WorspaceItems are documents but can also be single things like the tree-view. The important thing about WorkspaceItems is that they
live in a Pane (typically as tabs).

Panes are containers for WorkspaceItems. Each Pane is a rectangular area that shows only the active WorkspaceItems within it. The
other WorkspaceItems are hiddem. There is typically some decoration on the Pane like a tab bar or a info bar that identifies which
WorkspaceItem is visible and may provide a way to activate one of the other WorkspaceItems in that Pane.

Pane Containers. There are four fixed elements that contain one pane at first but can be split into multiple panes. They are
WorkplaceCenter, LeftDock, RightDock, BottomDock. WorkplaceCenter is the main area of Atom where documents open. The Docks are
areas next to the WorkplaceCenter. Panels can appear in between the WorkplaceCener and a Dock. Panels are not in a Dock. Header, footer,
and top Panels are not even next to a Dock but when a panel is next to a Dock (like the search dialog is next to the BottomDock)
its visibility is sometimes linked to the Dock. For example, canceling the search dialog seems to hide the bottom dock. That seems
curious to me.

#### Hacking Tip

If you want to play around with this package in ways that are not exposed through the commands, open devtools console (window:toggle-dev-tools) and explore the bg... global variable. Start typing the `bg...` to see what mechanisms are available to explore.

  * bg.BGAtomPlugins.logStatus() : list the packages that use the BGPlugin style
  * bg.BGAtomPlugins.get(pkgName) : get a reference to a package plugin instance to explore
  * bg.PolyfillObjectMixin.logStatus() : list the Atom polyfills that are installed (these add features to Atom API)

When you complete a command that returns an object, it will be logged in the console where you can expand it to explore its current state. You can autocomplete further to navigate to the sub-objects and if you assign an object to a variable in the console, you can invoke its methods and see what they do.
```javascript
> pkg = bg.BGAtomPlugin.get('<packageName>')
> pkg.addCommand(...)
```
