import { Storage } from '../../../services/storage';
import { Session } from '../../../services/session';

export class MessengerConversationDockpanesService {
  conversations: Array<any> = [];

  static _(session: Session) {
    return new MessengerConversationDockpanesService(new Storage(), session);
  }

  constructor(public storage: Storage, public session: Session) {
    this.session.getLoggedInUser(user => this.onLogOut(user));

    this.loadFromCache();

    setInterval(() => {
      this.syncFromCache();
    }, 1000);
  }

  open(conversation) {
    conversation.open = true;
    conversation.unread = false;
    for (let i = 0; i < this.conversations.length; i++) {
      if (this.conversations[i].guid === conversation.guid) {
        this.conversations[i] = conversation;
        return;
      }
    }
    this.conversations.unshift(conversation);
    this.saveToCache();
  }

  close(conversation, saveToCache: boolean = true) {
    for (let i = 0; i < this.conversations.length; i++) {
      if (this.conversations[i].guid === conversation.guid) {
        this.conversations.splice(i, 1);
      }
    }

    if (saveToCache) {
      this.saveToCache();
    }
  }

  toggle(conversation) {
    for (let i = 0; i < this.conversations.length; i++) {
      if (this.conversations[i].guid === conversation.guid) {
        this.conversations[i].open = !this.conversations[i].open;
      }
    }
    this.saveToCache();
  }

  closeAll() {
    this.conversations.splice(0, this.conversations.length);
    this.saveToCache();
  }

  private syncFromCache() {
    // Only sync closed conversations
    let savedConversations = JSON.parse(
        this.storage.get('messenger-dockpanes')
      ),
      conversations = this.conversations,
      savedConversationGuids = [],
      closedConversations = [];

    if (!savedConversations) {
      return;
    }

    for (let i = 0; i < savedConversations.length; i++) {
      savedConversationGuids.push(savedConversations[i].guid);
    }

    for (let i = 0; i < conversations.length; i++) {
      if (savedConversationGuids.indexOf(conversations[i].guid) === -1) {
        closedConversations.push(conversations[i]);
      }
    }

    for (let i = 0; i < closedConversations.length; i++) {
      this.close(closedConversations[i], false);
    }
  }

  private loadFromCache() {
    let conversations = JSON.parse(this.storage.get('messenger-dockpanes'));
    if (conversations) this.conversations = conversations;
  }

  private saveToCache() {
    let conversations = this.conversations;
    for (let i = 0; i < conversations.length; i++) {
      delete conversations[i].messages;
    }
    this.storage.set('messenger-dockpanes', JSON.stringify(conversations));
  }

  private onLogOut(user) {
    if (user === null) {
      this.conversations = [];
    }
  }
}
