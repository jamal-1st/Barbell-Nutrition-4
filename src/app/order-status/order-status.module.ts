import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { IonicModule } from '@ionic/angular';

import { OrderStatusPage } from './order-status.page';

const routes: Routes = [
  {
    path: '',
    component: OrderStatusPage
  }
];

@NgModule({
  imports: [
    CommonModule,
   
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderStatusPage]
})
export class OrderStatusPageModule {}
