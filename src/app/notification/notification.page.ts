import { Component, ViewChild } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { BarbellInfoService } from 'src/Services/barbell-info.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  emptyNotification: any = '../assets/img/notificationP.png';
  dataSkelton = false;
  notificationArray: any;
  noNotification = false;
  pageNumber = 0;

  constructor(private services: BarbellInfoService,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toastController: ToastController
  ) {
    this.notification();
  }

  //-------- delete  notification ------//
  async deleteNotification(notificationId: any) {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.dataSkelton = false;
    this.services.deleteNotification(notificationId).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        loading.dismiss();
        console.log("staus true", response.status);
        console.log("Response Get order data", response.data);
        this.notification();
      }
      else {
        loading.dismiss();
        console.log("staus false", response.status);
        console.log("staus false", response);
        let msg = response.error;
        this.presentToast(msg);
      }
    }).catch(error => {
      console.log("Register Api error", error);
      loading.dismiss();
    });
  }

  //----------------- infinite scroll...pagenation..-----------------//
  loadData(event) {
    console.log('loadDatat function');
    this.pageNumber++;
    console.log('loadDatat this page number', this.pageNumber);
    this.services.notification(this.pageNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        this.dataSkelton = true;
        console.log("staus true", response.status);
        response.data.forEach(element => {
          this.notificationArray.push(element)
        });
        event.target.complete();
        console.log("staus true", response.status);
        console.log("Response Get order data", response.data);
      }
      else{
        console.log("staus false", response.status);
        console.log("staus false", response);
        event.target.complete();
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        this.presentToast(response.msg);
      }

    }).catch(error => {
      console.log("Register Api error", error);
      this.dataSkelton = true;
      this.noNotification = true;
      event.target.complete();
      this.presentToast('Server Error');
    });
  }

  /// -----------get all notification -------------//
  async notification() {
    this.services.notification(this.pageNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        this.dataSkelton = true;
        this.notificationArray = response.data;
        console.log("staus true", response.status);
        console.log("Response Get order data", response.data);
      }
      else {
        console.log("staus false", response.status);
        console.log("staus false", response);
        this.dataSkelton = true;
        this.noNotification = true;
        let msg = response.error;
        if (msg != null) {
          this.presentToast(msg);
        }
      }
    }).catch(error => {
      console.log("Register Api error", error);
      this.dataSkelton = true;
      this.noNotification = true;
    });
  }

  /////---------- Alert for delete notification ----------//////
  async alertDelteForItem(id: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: "Are you sure to delete this Notification",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.deleteNotification(id);
          }
        }
      ]
    });
    await alert.present();
  }

  //---------- Error mesage  on API response --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}