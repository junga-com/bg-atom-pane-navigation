# BG Pane Navigation Package

The principle feature is that it traps the atom window:focus-pane-* navigation commands provided by Atom core and makes them reveal
(aka open) the Dock in the direction of navigation if that Dock is hidden and there is no pane in that direction to go to.

This package works to enhance the default keymap but I also suggest below a keymap that I personally use for good, consistent pane navigation.

#### Pane and PaneItem Navigation Commands
In addition to documenting what this package provides, this table serves as a reference for the commands needed to navigate to any
WorkspaceItem (aka tab) in the workspace.

|    | Command | Default KeyMap | My Keymap | Description
|--- |---      |---             |---        |---
|changed by this pkg |`focus-pane-above`       |ctrl-k ctrl-up    | alt-up    | enhanced to open the Dock when needed
|changed by this pkg |`focus-pane-below`       |ctrl-k ctrl-down  | alt-down  | enhanced to open the Dock when needed
|changed by this pkg |`focus-pane-on-left`     |ctrl-k ctrl-left  | alt-left  | enhanced to open the Dock when needed
|changed by this pkg |`focus-pane-on-right`    |ctrl-k ctrl-right | alt-right | enhanced to open the Dock when needed
|<reference>         |`pane:show-previous-item`|`ctrl-pageup`  |`alt-pageup`  | cycle through tabs in the current Pane
|<reference>         |`pane:show-next-item`    |`ctrl-pagedown`|`alt-pagedown`| cycle through tabs in the current Pane
|provided by this pkg|`bg:hideActiveDock`      |none              | alt-w     | hide the dock that contains the focus
|suggested keymap change |`core:close`         |ctrl-w            | ctrl-w    | Change its behavior when a Dock has the focus

The new `bg:hideActiveDock` command looks to see which pane container has the user's focus. It will either be the WorkspaceCenter
or one of the three (left, right, bottom) Docks that neighbor it. If the focus is one of the Docks, the command will hide that Dock.
Note that the Dock can contain multiple panes, each with an active, visible tab and they will all be hidden. This is the correct
behavior for my workflow.

If the user's focus is in the WorkspaceCenter, the behavior of bg:hideActiveDock is determined by the current value of the configuration
setting. If true, it will close the active pane. If false, it will do nothing.

#### keymaps
This package does not provide any keymap so that the user can decide how to use their keyboard.

Here is the relevant portion of my keymap.cson that you may find useful to merge into your keymap.cson (menu:Edit->Keymap...) or it
might inspire you to modify your keymap in another way.

To use the alt-[arrows,pageUp/Down,w] keys globally, I had to unset the use of some keys in the tree-view and text-editor. I don't
use those functions but they might be important to you so YMMV.

	# Global keymaps to implement navigation between Panes and Items within them using the alt- modifier
	'.platform-linux atom-workspace':
	  'alt-up':       'window:focus-pane-above'
	  'alt-down':     'window:focus-pane-below'
	  'alt-left':     'window:focus-pane-on-left'
	  'alt-right':    'window:focus-pane-on-right'
	  'alt-pageup':   'pane:show-previous-item'
	  'alt-pagedown': 'pane:show-next-item'
	  'alt-w':        'bg:hideActiveDock'
	  
	# override the ctlr-w function (close doc) when the focus is in a dock instead of the WorkspaceCenter. Without this, ctrl-w
	# closes the last editor in the WorkspaceCenter that had the focus even though it no longer has the focus. That is unintuitive
	# to me. This changes that so that it hides the dock that has the focus. The result is that ctrl-w always makes the thing with
	# the focus disappear.
	'.platform-linux atom-dock':
	  'ctrl-w': 'bg:hideActiveDock'
	    
	#unset use of alt-<arrow keys> by tree-view and atom-text-editor so that we can use them to navigate between panes
	'.platform-linux .tree-view, .platform-linux atom-workspace atom-text-editor:not(.mini)':
	  'alt-up':    'unset!'
	  'alt-down':  'unset!'
	  'alt-left':  'unset!'
	  'alt-right': 'unset!'


#### Motivation for My keymap
I personally like having one consistent set of navigation keys to navigate between any WorkspaceItem (aka tab) in Atom. I use the
alt-[arrows,pageUp/Down,w] to do this so that I can hold down alt to enter a sort of navigation mode to get around the workspace and
tidy up Docks to give WorkspaceCenter more room when needed. 

Using the alt-<arrow> keys conflicts with the tree-view and atom-text-editor use of those keys but I prefer the consistent pane navigation
over those functions.

I use alt even though ctrl-pageUp/Dn and ctrl-w are ubiquitous for tab navigation and closing tabs because ctrl-[arrows] is also
ubiquitous for text navigation within the editor view. 

My alt-pageUp/Dn are aliases for ctrl-pageUp/Down. I still use the ctrl variants since browsers and other applications make that second
nature but the alt variants make it so that while I am navigating to a pane, I dont have to change the modifier key to select the
WorkspaceItem (aka tab) that I want to get to. 

My alt-w is similar to ctrl-w (close tab). When the focus is in a Dock, my keymap makes both of these hide the dock with bg:hideActiveDock.
When the focus is in the WorkspaceCenter, ctrl-w closes the focused item but alt-w does nothing. The result is that they are both used
to make the currently focused thing go away but alt-w is a little more conservative in that it only hides things and wont close documents.  



#### Motivation for this Package

The idea is that you no longer need to use a variety of different keymaps to reveal and hide the views that you commonly place in the left,
right, and bottom docks because you can use pane navigation keymaps to do that. 

For example, people often keep the tree-view in the left dock. When the left dock is hidden, you can repeatedly issue the window:focus-pane-on-left
command until the left doc is open. If the tree-view is not the active tab, you issue pane:show-next-item until it is. When you want more
horizontal space for your editor, you can navigate to the tree-view (or which ever item is active in the left dock) and issue bg:hideActiveDock.

The result is that the four directional pane navigation commands will get you to any Pane in the WorkplaceCenter or surrounding
Docks and then once in the right Pane, PaneItem navigation will get you to the WorkspaceItem (aka tab) that you want to be at.



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
