import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { 
  IonContent,IonFooter,IonButton, IonHeader, IonTitle, IonToolbar , IonButtons,
  IonBackButton,IonIcon,IonItem,IonLabel,IonText,IonBadge,IonRow,IonCol
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone'
import { ApiService } from 'src/app/services/api.service';
import { addIcons } from 'ionicons';
import { bagHandle, bagHandleOutline, star } from 'ionicons/icons';
import { UpperCasePipe,CurrencyPipe,TitleCasePipe } from '@angular/common';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,IonBackButton,IonIcon,IonItem,IonLabel,
    UpperCasePipe,CurrencyPipe,IonText,IonFooter,IonButton,TitleCasePipe,IonBadge,IonCol,IonRow
  ],
  template: `
    <ion-content fullscreen="true">
      <ion-header  slot="fixed" mode="md" class="ion-no-boder">
        <ion-toolbar>
          <ion-buttons slot="start" mode='md'>
            <ion-back-button defaultHref="/home" color="light"></ion-back-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button size="large" fill="clear" color="light">
              <ion-icon name="bag-handle"></ion-icon>
              @if(totalItemCart > 0){
                <ion-badge>
                  <ion-text>{{ totalItemCart }}</ion-text>
                </ion-badge>
              }
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div [style]="{'background-image': 'url('+ item?.cover +')'}" class="bg">
        <div class="rating" align="center">
          <ion-icon slot="start" name="star" color="warning"></ion-icon>
          {{ item.rating }}
        </div>
      </div>

      <ion-item lines="none">
        <ion-label>
          {{ item?.name | uppercase }}
          <p class="desc">{{ item?.description }}</p>
          <p>
            <ion-text color="medium">MRP</ion-text>
            <ion-text color="dark" class="price">
              <span>{{ item?.price | currency}}</span>
            </ion-text>
          </p>
        </ion-label>
      </ion-item>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button
          mode="ios" 
          size="large"
          expand="block" 
          strong="true"
          [color]="addToBag ? 'success' : 'primary'"
          (click)="addItem()">
          <ion-icon slot="start" [name]="addToBag ? 'bag-handle' :'bag-handle-outline'"></ion-icon>
          <ion-text>{{ addToBag ||'Add to Bag' }}</ion-text>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: `
    ion-header,ion-header.ios {
      background:transparent;
      box-shadow: 0 0 0 0 !important;
      border: 0px solid transparent !important;
      ion-toolbar{
        --background:transparent;
        --ion-color-base:transparent !important;
        ion-buttons{
          background:rgba(0,0,0,0.15);
          border-radius:50%;
        }
        ion-button{
          margin:8px 4px;
        }
      }
    }
    div.bg{
      width:100%;
      height:30rem;
      border-radius:0 0 20px 20px;
      background-size:cover;
      background-position:center;
      background-repeat:no-repeat;
      background-color:var(--ion-color-light)
    }
    div.rating{
      position:absolute;
      background-color:white;
      padding:5px;
      width:20%;
      border-radius:20px;
      top:0;
      right:0;
      margin: 0 10px;
      margin-top:27rem;
    }
    ion-item{
      margin-top:1.5rem;
      ion-label{
        font-size:1.1rem;
        font-weight:bold;
        p.desc{
          margin-top:10px !important;
          font-weight:500;
        }
        p{
          margin-top:15px;
          .price{
            margin-left:5px;
            font-weight:normal;
            span{
              font-size:1rem;
              font-weight:bold;
            }
          }
        }
      }
    }
    ion-footer{
      ion-button{
        ion-text{
          font-size:1.1rem;
        }
        ion-icon{
          font-size:1.5rem;
          margin-right:10px;
        }
      }
    }
  `
})
export class ItemDetailPage implements OnInit, OnDestroy {

  router  = inject(ActivatedRoute)
  navCtrl = inject(NavController)
  api = inject(ApiService)
  cartService = inject(CartService)
  item !: any
  addToBag !: string | null
  totalItemCart = 0
  cartSub !: Subscription

  constructor(){
    addIcons({
      star,
      bagHandleOutline,
      bagHandle
    })
  }

  ngOnInit() {
    this.getItem()
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart:any) => {
        this.totalItemCart = cart ? cart?.totalItem : 0
      }
    })//souscription a la carte pour recevoir le nombre d'item qu'elle contient
  }

  getItem(){
    const id = this.router.snapshot.paramMap.get('id')!
    if(!id || id === '0'){
      this.navCtrl.back()
      return;
    }
    this.item = this.api.getItem(id)
  }// recupere un item grace a son ID

  addedText(){
    this.addToBag = 'Added to Bag'
    setTimeout( () => {
      this.addToBag = null
    },1000)
  }// changment de text pour l'ajout carte

  
  addItem(){
    const result = this.cartService.addQuantity(this.item)
    this.addedText()
  }

  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe()
  }// unsuscribe à la desctruction du component
}
