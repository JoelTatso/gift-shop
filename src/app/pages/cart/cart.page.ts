import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonCol, IonRow, IonCard, IonThumbnail, IonImg, IonHeader, IonIcon, IonTitle,
  IonToolbar, IonBackButton, IonList, IonListHeader, IonItemGroup, IonButton, IonButtons, IonText,
  IonItem, IonLabel, IonModal, IonItemDivider,IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, bagHandleOutline, remove, trashOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CouponsPage } from "./coupons.page";
import { Strings } from 'src/app/enum/strings.enum';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    IonContent, IonCol, IonRow, IonCard, IonThumbnail, IonImg, IonHeader, IonTitle, IonIcon, IonToolbar,
    IonBackButton, DecimalPipe, IonButton, IonList, IonListHeader, IonItemGroup, IonButtons, IonText, IonItem,
    IonLabel, IonModal, CouponsPage, IonItemDivider,IonFooter
  ],
  template: `
    <ion-header  mode="ios">
      <ion-toolbar>
        <ion-title color="dark">Cart</ion-title>
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="previousUrl" mode="md"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if(model){
        <ion-item lines="none" class="total-item">
          <ion-label>{{ model?.totalItem }} item(s) in Cart</ion-label>
          <ion-button 
            (click)="cartService.clearCart()" 
            fill="clear" 
            slot="end"
            size="small"
            color="danger">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>
        <!-- card content -->
        @for(item of model?.items;track item?.id){
          @if(item?.quantity > 0){
            <ion-card class="card-item" mode="ios">
            <ion-item lines="none">
              <ion-thumbnail slot="start">
                <ion-img [src]="item?.cover"></ion-img>
              </ion-thumbnail>

              <ion-label>
                <strong>{{ item?.name }}</strong>
                <p class="price">
                  <ion-text color="dark">
                    <span>{{ cartService.currency }}</span>
                    <strong>{{ item?.price }}</strong>
                  </ion-text>
                </p>
              </ion-label>

              <ion-col size="2">
                <ion-row>
                  <ion-button (click)="addQuantity(item)" color="light">
                  <ion-icon slot="icon-only" name="add" color="dark"></ion-icon>
                  </ion-button>
                </ion-row>

                <ion-row class="quantity">
                  <ion-text color="dark">
                    <strong>{{ item?.quantity }}</strong>
                  </ion-text>
                </ion-row>

                <ion-row>
                  <ion-button (click)="removeQuantity(item)" color="light">
                  <ion-icon slot="icon-only" name="remove" color="dark"></ion-icon>
                  </ion-button>
                </ion-row>
              </ion-col>
            </ion-item>
          </ion-card>
          }
        }

        <!-- apply coupon -->
        <ion-list>
          <ion-item-divider mode="md" color="light">
            <ion-label class="ion-no-margin" color="dark">
              Offers & Benefits
            </ion-label>
          </ion-item-divider>

          @if(!selectedCoupon){
            <ion-card mode="ios">
              <ion-item 
                [detail]="true" 
                class="offer"
                (click)="applyCoupon = true">
                <ion-label>Apply Coupon</ion-label>
              </ion-item>
            </ion-card>
          }@else{
            <ion-item class="offer selected_coupon">
              <ion-label color="dark">
                "{{ selectedCoupon?.code }}" applied
                <p>
                  <ion-text color="success">
                    <strong>{{ currency }}{{ selectedCoupon?.saved | number: '0.2-2'}}</strong>
                  </ion-text>
                  <ion-text color="dark"> coupon savings</ion-text>
                </p>
              </ion-label>
              <ion-button  
                fill="clear" 
                color="danger"
                strong="true"
                (click)="removeCoupon()">
                <ion-text>Remove</ion-text>
              </ion-button>
            </ion-item>
          }
        </ion-list>

        <!-- Card details -->
        <ion-list class="builling">
          <ion-list-header>
            <ion-label color="tertiary">Bill Details</ion-label>
          </ion-list-header>

          <ion-item-group>
            <ion-item lines="none">
              <ion-label color="dark">Item Total</ion-label>
              <ion-text color="dark" slot="end">
                {{ cartService.currency }}
                {{ model?.totalPrice | number:'0.2-2' }}
              </ion-text>
            </ion-item>

            @if(selectedCoupon){
              <ion-item>
                <ion-label class="dark">Item Discount</ion-label>
                <ion-text color="success" slot="end">
                   - {{ cartService.currency }}{{ selectedCoupon?.saved | number:'0.2-2'}}
                </ion-text>
              </ion-item>
            }

            <ion-item class="delivery-fee" lines="none ">
              <ion-label color="dark">Delivery fee</ion-label>
              <ion-text color="dark" slot="end">
                {{ cartService.currency }}
                {{ model?.total_delivery_charge | number:'0.2-2' }}
              </ion-text>
            </ion-item>

            @if(model?.tax && model?.tax > 0){
              <ion-item>
                <ion-label color="dark">Taxes</ion-label>
                <ion-text color="dark" slot="end">
                  {{ cartService.currency }}{{ model?.tax | number:'0.2-2'}}
                </ion-text>
              </ion-item>
            }

            <ion-item class="dashedBorderTop" lines="none ">
              <ion-label color="dark"><strong>To pay</strong></ion-label>
              <ion-text color="dark" slot="end">
                <strong>
                  {{ cartService.currency }}
                  {{ model?.totalToPay | number:'0.2-2' }}
                </strong>
              </ion-text>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <!-- coupons modal-->
        <ion-modal
          #coupon_modal
          (didDismmiss) = "applyCoupon = false"
          [isOpen]="applyCoupon">

          <ng-template>
            <app-coupons
              [orderTotal]="model?.totalPrice"
              (close)="closeCouponModal($event, coupon_modal)">
            </app-coupons>
          </ng-template>

        </ion-modal>
      }@else{
        <div class="empty-screen" align="center">
          <ion-icon name="bag-handle-outline" color="primary"></ion-icon>
          <p>No Items available</p>
        </div>
      }
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button
          mode="ios"  
          expand="block" 
          strong="true" 
          color="primary">
          <ion-text>Checkout</ion-text>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: `
      ion-content{
        ion-item.total-item{
          align-items:center;
          ion-label{
            margin:0;
            font-size:0.8rem;
            font-style:italic;
            font-weight:600;
          }
          ion-icon{
            font-size:1rem;
          }
        }
        ion-card.card-item{
        margin-top:1rem;
        margin-bottom:1rem;
        ion-item{
          --padding-start:0;
          --inner-padding-end:5px;
          ion-thumbnail{
            height:5rem;
            width:5rem;
            margin: 0 16px 0 0;
            ion-img{
              height:100%;
              width:100%;
              border-radius:8px;
            } 
          }
        }
        ion-label{
        font-size:.95rem;
        p.price{
          margin-top:10px;
          ion-text{
            font-size:1rem;
            font-weight:normal;
            span {
              font-size:.7rem;
              vertical-align:text-top;
            }
          }
        }
      }
      ion-col{
        padding:0;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        ion-row{
          ion-button{
            --padding-start:5px;
            --padding-end:5px;
            width: 1.4rem;
            min-height:1.4rem;
            ion-icon{
              font-size:1rem;
            }
          }
        }
        ion-row.quantity{
          margin:3px 0;
          font-size:.85rem
        }
      }
    }
    ion-list.builling {
      background:transparent;
      ion-list-header{
        font-size:1rem;
        margin-bottom:.5rem;
      }
      ion-item-group{
        margin-left:1rem;
        margin-right:1rem;
        border: 1px solid var(--ion-color-medium);
        border-radius:8px;
        ion-item{
          --background:transparent;
          ion-label,
          ion-text{
            font-size:.9rem;
          }
        }
      }
    }
  }
  .dashedBorderTop{
    border-top:1px dashed var(--ion-color-medium);
  }
  .empty-screen{
    margin-top:10rem;
    ion-icon{
      font-size:10rem;
    }
  }
  `
})
export class CartPage implements OnInit, OnDestroy {

  private router = inject(Router)
  public cartService = inject(CartService)
  previousUrl !: string
  cartSub !: Subscription
  model: any = null
  selectedCoupon !: any
  applyCoupon = false
  currency = Strings.CURRENCY

  ngOnInit() {
    this.urlCheck()
    addIcons({
      trashOutline,
      add,
      remove,
      bagHandleOutline
    })
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => this.model = cart
    })
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe()
  }

  urlCheck() {
    const route_url = this.router.url //get current url
    const urlParts = route_url.split('/') // remove / get table
    urlParts.pop(); // remove last table item (cart)
    this.previousUrl = urlParts.join('/') //get new url (/home/gifts/id || /home)
  }// definition de l'url de retour (defaultHref)

  addQuantity(item: any) {
    this.cartService.addQuantity(item)
  }

  removeQuantity(item: any) {
    this.cartService.removeQuantity(item)
  }

  closeCouponModal(coupon: any, couponModal: IonModal) {
    console.log('counpon data', coupon)
    if (coupon) {
      this.selectedCoupon = coupon;
      this.model.grandTotal -= this.selectedCoupon?.saved
    }
    couponModal.dismiss()
  }//applique le coupon selectionné et ferme du modal coupon

  removeCoupon(){

  }
}
