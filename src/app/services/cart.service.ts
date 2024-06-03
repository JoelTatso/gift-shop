import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cart = new BehaviorSubject<any>(null) //BehaviorSubject persiste les donnees et les tranmet a des observables

  get cart() {
    return this._cart.asObservable()
  }

  addQuantity(item:any){
      const data = this._cart.value
      const totalItem = (data?.totalItem || 0) + 1 //mis à jour du nombre d'élément de la carte
      this._cart.next({totalItem})// update de la carte avec le nouveau nombre d'element
  }
}
