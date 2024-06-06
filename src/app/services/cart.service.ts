import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Strings } from '../enum/strings.enum';
import { StorageService } from './storage.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cart = new BehaviorSubject<any>(null) //BehaviorSubject persiste les donnees et les tranmet a des observables

  model:any = null
  total_delivery_charge = 100 // frais de livraison total
  cartStoreName:string = Strings.CART_STORAGE
  currency:string = Strings.CURRENCY
  storageService = inject(StorageService)

  constructor(){
    this.getCart()
  }

  get cart() {
    return this._cart.asObservable()
  }

  addQuantity(item:any){

    if(this.model){

      const index = this.model.items.findIndex((data:any) => data.id === item.id) // model null => rechecher de l'item
      if(index >= 0){
        this.model.items[index].quantity += 1  // item trouvé ajout de valeur (quantite+1)

      }else{

        const items = [ { ...item, quantity: 1 } ]
        this.model.items = items.concat(this.model.items) // item non trouve => insertion de l'item dans le model avec pour quantite 1

      }
    }else{

      this.model = {
        items : [ { ...item, quantity: 1 } ] // model vide => insertion de l'item dans le model avec pour quantite 1
      }

    }

    return this.calculate() // mise a jour des calcul quantite, prix , etc...
  }

  calculate(){
    
    const items = this.model.items.filter((item:any) => item.quantity > 0 ) // les items contenus da la carte (quantite > 0)

    if(items?.lenght == 0){
      this.clearCart()
      return;
    }

    let totalItem = 0
    let totalPrice = 0

    for(const item of items){
      totalItem += item.quantity
      totalPrice += item.price * item.quantity
    }

    const totalToPay = totalPrice + this.total_delivery_charge // prix total + frais de livraison 

    this.model = {
      ...this.model,
      totalItem,
      totalPrice,
      total_delivery_charge:this.total_delivery_charge,
      totalToPay
    } // carte final

    this._cart.next(this.model) // sauvegarde de la carte dans le BehevioSubject
    this.saveCart(this.model) // sauvegarde de la carte dans la storage

  }// mise ajour des quantite ,prix, etc...

  clearCart(){
    this.storageService.removeStorage(this.cartStoreName)
    this.model=null
    this._cart.next(null)
  }// vide le stockage la carte

  saveCart(data:any){
    const model = JSON.stringify(data)
    this.storageService.setStorage(this.cartStoreName,model)
  }//sauvegarde des donnees de la carte dans la localStorage

  async getCart(){
    let data: any = this._cart.value // ou .getValue()
    if(!data) {
      data = await this.storageService.getStorage(this.cartStoreName)
      if(data?.value){
        this.model = JSON.parse(data.value)
        this._cart.next(this.model)
      }
    }
    return this.model
  }// obtention des donnees 

  removeQuantity(item:any){
    if(this.model){
      const index = this.model.items.findIndex((data:any) => item.id === data.id)

      if(index >= 0){
        if(this.model.items[index].quantity > 0){
          this.model.items[index].quantity -= 1;
        }
      }
      return this.calculate()
    }
    return null
  }// retait de quatite d'un item dans la carte d'item

}


