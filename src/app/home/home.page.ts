import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from 'src/Services/data.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {



  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private dataSevices: DataService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
  ) {
    this.menuCtrl.enable(false);
  }

  login() {

    //this.navCtrl.('/login');
    // this.navCtrl.navigateBack('/login');
    //this.navCtrl.navigateForward('/login');

    // let value = true;
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     special: value
    //   }
    // };

    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50
    //  };
 
    // this.nativePageTransitions.slide(options);
    this.router.navigate(['login']);
    //this.navCtrl.navigateForward('/login')
    // this.router.navigateByUrl('/login');

  }
  asGuest() {
    let value = false;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: value
      }
    };
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 600
    };
    this.nativePageTransitions.flip(options);
    this.router.navigate(['menu'], navigationExtras);
    // this.dataSevices.menuChange = 'false';
    // this.navCtrl.navigateRoot(['menu']);
  }

  register() {
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 600,
    //   slowdownfactor: -1,
    //   iosdelay: 50
    //  };
 
    // this.nativePageTransitions.slide(options);
    this.router.navigateByUrl('/register');
  }

  supportForm() {
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 300,
    //   slowdownfactor: -1,
    //   iosdelay: 50
    //  };

    // this.nativePageTransitions.slide(options);
    this.router.navigateByUrl('/support-form');
  }
}
