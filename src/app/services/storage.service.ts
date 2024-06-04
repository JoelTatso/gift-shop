import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setStorage(keyName:string,data:string){
    Preferences.set({key:keyName,value:data})
  }

   getStorage(keyName:string){
    return Preferences.get({key:keyName})
  }

  removeStorage(keyName:string){
    Preferences.remove({key:keyName})
  }

  clearStorage(){
    Preferences.clear()
  }
}
