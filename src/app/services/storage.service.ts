import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // await this.storage.defineDriver(CordovaSQLiteDriver);
    this._storage = await this.storage.create();
  }

  public async get(key: string) {
      console.log('this._storage', this._storage);
      return await this._storage?.get(key);
  }

  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public remove(key: string) {
    return this._storage?.remove(key);
  }

  public clear() {
    return this._storage?.clear();
  }

  public async keys() {
    return this._storage?.keys();
  }

}
