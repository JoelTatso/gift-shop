import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  IonContent, IonGrid, IonSpinner, IonHeader, IonTitle, IonButtons, IonToolbar, IonCol,
  IonRow, IonLabel, IonCard, IonItem, IonButton, IonText, IonIcon 
} from '@ionic/angular/standalone';
import { Strings } from 'src/app/enum/strings.enum';
import { ApiService } from 'src/app/services/api.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [
    IonContent, IonSpinner, IonGrid, IonHeader, IonTitle, IonButtons, IonToolbar, IonCol, 
    IonRow, IonLabel, IonCard, IonItem, IonButton, IonText, IonIcon
  ],
  template: `
    <ion-header mode="ios" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start"> 
          <ion-button fill="clear" color="dark" (click)="closeModal($event)">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>
          Apply Coupon
        </ion-title>
      </ion-toolbar>
   </ion-header>

    <ion-content fullscreen="true" color="light">

      @if(isLoading){
        <div class="ion-text-center alignSpinner">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
        </div>
      }@else {
        @for(coupon of coupons;track coupons){
          <ion-card>
            <ion-row>
              <ion-col 
                size="1" 
                class="ion-text-center offer" 
                [class]="{'amtSaved' : coupon?.saved >= 0, 'amtInsufficient' : coupon?.saved < 0}">

                <ion-label>
                  <strong>
                    {{coupon?.isPercentage ? (coupon?.discount + '% OFF') : (currency + coupon?.discount + ' OFF')}}
                  </strong>
                </ion-label>

                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>

              </ion-col>

              <ion-col size="11">

                <ion-item lines="none">
                  <ion-label>
                    {{coupon?.code}}
                    <p>
                      <ion-text [color]="coupon?.saved >= 0 ? 'success' : 'medium'">
                        {{coupon?.saved >= 0 ? ('Save ' + currency + coupon?.saved + ' on this order') : ('Add ' + currency + ((-1) * coupon?.saved) + ' more to avail this offer')}}
                      </ion-text>
                    </p>
                  </ion-label>
                  <ion-button
                    fill="clear"
                    slot="end"
                    [color]="coupon?.saved >= 0 ? 'danger' : 'medium'"
                    [strong]="true"
                    [disabled]="coupon?.saved < 0"
                    (click)="closeModal(coupon)">
                    APPLY
                  </ion-button>
                </ion-item>

                <ion-row class="ion-margin-top">
                  <ion-col size="12">
                    <div>
                      {{coupon?.description}} 
                      {{coupon?.minimumOrderAmount ? (' on orders above ' + currency + coupon?.minimumOrderAmount) : ' on all orders'}}. 
                      {{coupon?.upto_discount ? (' Maximum discount ' + currency + coupon.upto_discount) : ''}}
                    </div>
                  </ion-col>
 <!--                  <ion-col size="12">
                    <ion-button [strong]="true" fill="clear" size="small">
                      <ion-icon name="add" slot="start"></ion-icon>
                      MORE
                    </ion-button>
                  </ion-col> -->
                </ion-row>
              </ion-col>
            </ion-row>
          </ion-card>
        }@empty {
          <ion-grid class="alignCenter">
            <ion-row class="ion-text-center">
              <ion-col size="12">
                <ion-icon name="ticket-outline" color="secondary"></ion-icon>
              </ion-col>
              <ion-col size="12">
                  <ion-label>No coupons available</ion-label>
              </ion-col>
            </ion-row>
          </ion-grid>
        }
      }   
    </ion-content>

  `,
  styles: `
    ion-card {
      padding:0 !important;
      ion-row {
        .amtSaved {
          background-image: linear-gradient(to right, #de0f17, #f95b4b);
       }
        .amtInsufficient {
            background: var(--ion-color-medium);
        }
      ion-col.offer {
        display: flex;
        position: relative;
        // align-items: center;
        justify-content: center;
        ion-label {
          color: #fff;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          writing-mode: vertical-lr;
          transform: rotateZ(180deg);
        }
        .circle1, .circle2, .circle3, .circle4 {
          display: flex;
          flex-direction: column;
          background: #fff;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: absolute;
          left: -4px;
        }

        .circle1 {
            top: 20%;
            transform: translateY(-20%);
        }

        .circle2 {
            top: 40%;
            transform: translateY(-40%);
        }

        .circle3 {
            top: 60%;
            transform: translateY(-60%);
        }

        .circle4 {
            top: 80%;
            transform: translateY(-80%);
        }
      }
      ion-col {
        ion-item {
          border-bottom: 1px dashed var(--ion-color-dark);
          ion-label {
            font-weight: bold;
            font-size: 1rem;
            p {
                margin-top: 5px;
                ion-text {
                    font-size: 0.8rem;
                }
            }
          }
        }
        ion-row {
          margin-bottom:.5rem;
          ion-col {
              padding-top: 0;
              padding-bottom: 0;
              div {
                  margin-left: 10px;
                  margin-right: 10px;
                  font-size: 0.8rem;
                  font-weight: bold;
              }
              ion-button {
                  --color: dimgray;
              }
          }
        }
      }
    } 
  }
  .alignCenter{
    margin-top: 20vh;
    ion-icon{
      font-size:15vh;
    }
  }
  .alignSpinner{
    margin-top:40vh;
  }
  `,
})
export class CouponsPage implements OnInit {

  @Input() orderTotal !: number
  @Output() close: EventEmitter<any> = new EventEmitter()
  coupons: any[] = []
  isLoading: boolean = false
  currency = Strings.CURRENCY
  private apiService = inject(ApiService)

  constructor() { }

  ngOnInit(): void {
    addIcons({
      arrowBackOutline,
      ticketOutline
    })
    this.getCoupons()
  }

  closeModal(data?: any) {
    this.close.emit(data)
  }

  async getCoupons(){
    try{
      this.isLoading = true
      const coupons = await this.apiService.getCoupons()
      if(coupons.length > 0){
        coupons.map( (coupon) => {
          coupon.saved = this.getSavedAmount(coupon)
          return coupon
        })
        this.coupons = [...coupons]
      }
      this.isLoading = false
    }catch(e){
       console.log(e)
    }
  }

   //minimumOrderAmount -> montant minimum de la commande pour beneficier du coupon
   //amt -> montant de la remise
   //orderTotal ->  montant total 
   //upto_discount -> montant maximum de la remise
   //discount -> la valeur du code promo

  getSavedAmount(coupon:any){
    let amt = 0 
    if(coupon?.minimumOrderAmount){
      amt = this.orderTotal - coupon?.minimumOrderAmount
      if(amt < 0) return amt;
    }
    amt = coupon?.isPercentage
      ? this.orderTotal * (coupon?.discount / 100)
      : coupon?.discount
    if(coupon?.upto_discount){
      console.log('check amt',amt)
      amt = amt>= coupon?.upto_discount ? coupon?.upto_discount : amt
    }
    return amt
  }// calcul du montant de la reduction en fonction du coupon


}
