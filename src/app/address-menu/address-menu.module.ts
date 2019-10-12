import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddressMenuPage } from './address-menu.page';
//import { AddAddressPage } from '../add-address/add-address.page';

const routes: Routes = [
  {
    path: '',
    component: AddressMenuPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // AddAddressPage,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressMenuPage]
})
export class AddressMenuPageModule {}
