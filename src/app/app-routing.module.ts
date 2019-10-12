import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
  { path: 'aboutus', loadChildren: './aboutus/aboutus.module#AboutusPageModule' },
  { path: 'account', loadChildren: './account/account.module#AccountPageModule' },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'item-list', loadChildren: './item-list/item-list.module#ItemListPageModule' },
  { path: 'verification-code', loadChildren: './verification-code/verification-code.module#VerificationCodePageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'order-history', loadChildren: './order-history/order-history.module#OrderHistoryPageModule' },
  { path: 'address', loadChildren: './address/address.module#AddressPageModule' },
  { path: 'addressM', loadChildren: './address-menu/address-menu.module#AddressMenuPageModule' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'add-address', loadChildren: './add-address/add-address.module#AddAddressPageModule' },
  { path: 'item-detail', loadChildren: './item-detail/item-detail.module#ItemDetailPageModule' },
  { path: 'payment-method', loadChildren: './payment-method/payment-method.module#PaymentMethodPageModule' },
  { path: 'order-status', loadChildren: './order-status/order-status.module#OrderStatusPageModule' },
  { path: 'cart1', loadChildren: './cart1/cart1.module#Cart1PageModule' },
  { path: 'forget-password', loadChildren: './forget-password/forget-password.module#ForgetPasswordPageModule' },
  { path: 'force-update', loadChildren: './force-update/force-update.module#ForceUpdatePageModule' },
  { path: 're-order-modal', loadChildren: './re-order-modal/re-order-modal.module#ReOrderModalPageModule' },
  { path: 'phone-update', loadChildren: './phone-update/phone-update.module#PhoneUpdatePageModule' },
  { path: 'support-form', loadChildren: './support-form/support-form.module#SupportFormPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
