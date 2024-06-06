import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/gift-shop/items.page').then((m) => m.Items),
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage)
      },
      {
        path: 'gifts/:id',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/gift-shop/item-detail.page').then(m => m.ItemDetailPage)
          },
          {
            path: 'cart',
            loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage)
          },
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'coupons',
    loadComponent: () => import('./pages/cart/coupons.page').then(m => m.CouponsPage)
  }
];
