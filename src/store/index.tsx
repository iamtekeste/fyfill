import { makeAutoObservable } from 'mobx';
import { AsyncTrunk, ignore } from 'mobx-sync';
import React from 'react';

import MessageEmitter from '../utils/MessageEmitter';
import { AlbumItem, SpotifyUser } from '../utils/interfaces';

import Api from './api';

const STORAGE_KEY = '__figma_mobx_sync__';

interface Notification {
  title: string;
  subtitle: string;
}

class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  user: SpotifyUser = null;

  @ignore
  notification: Notification = null;

  @ignore
  searchTerm = '';

  @ignore
  searchResults: AlbumItem[] = [];

  @ignore
  libraryAlbums: AlbumItem[] = [];

  @ignore
  get api() {
    return new Api(this, (access_token) => {
      this.setUser({
        ...this.user,
        access_token,
      });
    });
  }

  get isAuthenticated() {
    return !!this.user;
  }

  setSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  setNotification(notification: Notification) {
    this.notification = notification;
  }

  setLibraryAlbums(albums: AlbumItem[]) {
    this.libraryAlbums = albums;
  }

  setSearchResults(albums: AlbumItem[]) {
    this.searchResults = albums;
  }

  setUser(data) {
    this.user = data;
  }

  logout() {
    this.user = null;
  }
}

export const rootStore = new RootStore();

export type TStore = RootStore;

const StoreContext = React.createContext<TStore | null>(null);

export const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
);

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};

export const trunk = new AsyncTrunk(rootStore, {
  storageKey: STORAGE_KEY,
  storage: {
    getItem(key: string) {
      MessageEmitter.emit('storage get item', key);
      return new Promise((resolve) =>
        MessageEmitter.once('storage get item', resolve)
      );
    },
    setItem(key: string, value: string) {
      MessageEmitter.emit('storage set item', {
        key,
        value,
      });
      return new Promise((resolve) =>
        MessageEmitter.once('storage set item', resolve)
      );
    },
    removeItem(key: string) {
      MessageEmitter.emit('storage remove item', key);
      return new Promise((resolve) =>
        MessageEmitter.once('storage remove item', resolve)
      );
    },
  },
});

export const getStoreFromMain = (): Promise<TStore | null> =>
  new Promise((resolve) => {
    MessageEmitter.emit('storage', STORAGE_KEY);
    MessageEmitter.once('storage', (store) => {
      resolve(JSON.parse(store || '{}'));
    });
  });
