'use babel';

import BgNavDocksView from './bg-nav-docks-view';
import { CompositeDisposable } from 'atom';

export default {

  bgNavDocksView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.bgNavDocksView = new BgNavDocksView(state.bgNavDocksViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.bgNavDocksView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bg-nav-docks:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.bgNavDocksView.destroy();
  },

  serialize() {
    return {
      bgNavDocksViewState: this.bgNavDocksView.serialize()
    };
  },

  toggle() {
    console.log('BgNavDocks was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
