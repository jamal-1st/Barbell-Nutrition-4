import { Component, } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { BarbellInfoService } from 'src/Services/barbell-info.service';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage {

  latitude: any;
  longitude: any;
  mapType = 'roadmap';

  dataReceived: any;
  public venue_time: any;
  venue: any;
  zoomMap: any = 17;
  setting: any;
  today: any;
  loadUI: boolean = false;

  constructor(
    public services: BarbellInfoService,
    public loadCtrl: LoadingController,
    public toastController: ToastController
  ) {
    this.aboutUs();
  }

  async aboutUs() {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.services.aboutUs().then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);

      if (response.status == true) {
        console.log("Handshake API response!!", response.data);
        this.setting = response.data.setting;
        this.today = response.data.today;
        console.log("today", this.today);
        var lat = parseFloat(this.setting.latitude);
        this.latitude = lat;
        console.log("this.latitude", this.latitude);
        var lngt = parseFloat(this.setting.longitude);
        this.longitude = lngt;
        console.log("Handshake API response setting!!", this.setting);
        this.venue_time = response.data.setting.venue_timing;
        console.log("Handshake API response  this.venue_time !!", this.venue_time);
        this.venue = response.data.setting.pages;
        console.log("this venu", this.venue);
       this.loadUI = true;
        loading.dismiss();

      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        loading.dismiss();
        let msg = response.msg;
        this.presentToast(msg);
      }
    }).catch(err => {
      console.log("failed to retrieved then: ", err);
      loading.dismiss();
      let msg = "Server Error!";
      this.presentToast(msg);
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}
