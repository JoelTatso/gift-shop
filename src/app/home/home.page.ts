import { Component, OnInit, inject } from '@angular/core';
import { 
				IonHeader, IonToolbar, IonTitle, IonContent,IonRow,IonCol,IonThumbnail,IonImg,IonCard,IonLabel,
				IonText,IonIcon,IonSearchbar, SearchbarChangeEventDetail
			 } 
	from '@ionic/angular/standalone';
			 
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons'
import { IonSearchbarCustomEvent } from '@ionic/core';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		IonHeader, IonToolbar, IonTitle, IonContent,IonRow,IonCol,IonThumbnail,IonImg,IonCard,IonLabel,IonText,IonIcon,IonSearchbar
	],
	template: `
		<ion-header>
			<ion-toolbar>
				<ion-title>
					Gift Shop
				</ion-title>
			</ion-toolbar>
			<ion-toolbar>
				<ion-searchbar 
						placeholder="Search for gifts..." 
						#searchInput
						mode="ios"
						(ionChange)="onSearchChange($event)" 
						debounce="800" 
						class="searchBar"
			   ></ion-searchbar>
			</ion-toolbar>
		</ion-header>
		
		<ion-content>
			<ion-row>
			@for(item of items; track item.id){
				<ion-col sizeLg="3" sizeMd="4" sizeSm="6" sizeXl="3" sizeXs="6">
						<ion-card>
							<ion-thumbnail>
								<ion-img [src]="item?.cover"></ion-img>
							</ion-thumbnail>

							<ion-label>
								<ion-text color="dark"><strong>{{ item?.name }}</strong></ion-text>
							</ion-label>

							<ion-label>
								<p>
									<ion-text color="dark">
										<strong>{{ item?.price }}</strong>
									</ion-text>

									<ion-text class="rating">
										{{ item?.rating }}  
										<ion-icon  name="star" color="warning"></ion-icon>
									</ion-text>
								</p>
							</ion-label>
						</ion-card>
				</ion-col>
			}
			</ion-row>
		</ion-content>
	`,
	styles:`
		ion-card{
			--background: var(--ion-color-light);
			height:14rem;
			margin: 0.3rem 0;
			border-radius:8px;
			border:1px solid var(--ion-icon-light);
		}
		ion-thumbnail{
			width:100%;
			height:10rem;
			margin-bottom:10px;
			ion-img{
				height:100%;
				border-radius:8px !important;
			}
		}
		ion-label{
			font-size:0.9rem;
			padding:0 0.3rem;
		}
		ion-label,p{
			padding:0 0.3rem;
			font-size:0.85rem;
			margin-top:8px;
			font-weight:500;
			letter-spacing:0 !important;
			ion-text.rating{
				float:right;
				ion-icon{
					font-size:0.8rem;
				}
			}
		}
	`,
})
export class HomePage implements OnInit{


	constructor(){
		 addIcons({
			star
		 })
	}
	
	private api = inject(ApiService)
	items !: any[]
	searchValue !: string

	ngOnInit(): void {
		this.items = this.api.getItems()
	}

	seachItems(){
		this.items = this.api.getItems().filter((item) => 
			item.name.toLowerCase().includes(this.searchValue)
		)
	}//recherche de la valeur de l'item a partir de l'entrée

	querySearch(){
		this.items = []
		if(this.searchValue.length > 0){
			this.seachItems()
		}else{
			this.items = [...this.api.getItems()]
		}
	}// Modification des items après la recherche

	onSearchChange($event:any) {
			this.searchValue = $event.detail.value.toLowerCase()
			this.querySearch()
	}//Execution de la recherche a partie de l'input Search

}
