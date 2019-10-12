import { Component } from '@angular/core';
import { MenuController, NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { DataService } from 'src/Services/data.service';
import { Router, NavigationExtras } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public todo: FormGroup;
  submitAttempt: boolean = false;
  public loadingCtrl: any;
  backImage = "../assets/img/back.png";
  uniqueDId: any;
  pltForm: any;
  tokenFirebase: any;
  special: boolean = true;


  constructor(private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    //private firbaseServices: FirebaseServicesService,
    private toastController: ToastController,
    private router: Router,
    private platform: Platform,
    public loadCtrl: LoadingController,
    private uniqueDeviceID: UniqueDeviceID,
    private nativePageTransitions:NativePageTransitions,
    private dataServuce: DataService,
    private fcm: FCM,
    private services: UserService,
    private navCtrl: NavController) {
    this.todo = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
    this.menuCtrl.enable(false);
    localStorage.removeItem('profile');
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uniqueDId = uuid;
        console.log(uuid)
      })
      .catch((error: any) => console.log(error));

    if (this.platform.is('android')) {
      this.pltForm = 'Android';
    }
    else if (this.platform.is('ios')) {
      this.pltForm = 'ios';
    }
    else {
      this.pltForm = 'window'
    }
  }

  //--------------- Get token fron firbase Services -----------//
  async getTokenForFirebase() {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    console.log("firebase token", this.tokenFirebase);
    this.fcm.getToken().then(token => {
      console.log("firbase token", token);
      this.tokenFirebase = token;
      this.login(this.tokenFirebase, loading)
    }).catch(error => {
      loading.dismiss();
      console.log("error for firebase toekn", error);
      let msg = "Token not found! "
      this.presentToast(msg);

    });

  }

  //--------------- For get password-----------//
  forgotPassword() {
    this.router.navigate(['forget-password']);
  }

  // ------------- Back to home page -------------//
  back() {
    console.log("back function");
    // let options: NativeTransitionOptions = {
    //   direction: 'right',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50
    //  };
 
    // this.nativePageTransitions.slide(options);
    this.navCtrl.navigateBack('/home');
  }

  //------------- login------------------//
  async login(firebaseToken: any, loading: any) {
    if (!this.todo.valid) {
      this.submitAttempt = true;
    }
    else {
      this.services.login(this.todo.value, firebaseToken, this.pltForm, this.uniqueDId).then((jsonResponse) => {
        loading.dismiss();
        let response = JSON.parse(jsonResponse);
        if (response.status == true) {
          console.log("staus true", response.status);
          console.log("login response data", response.data);
          var loginSucessResponse = JSON.stringify(response.data)
          this.dataServuce.customerId = response.data.customer_id;
          localStorage.setItem('profile', loginSucessResponse);
          console.log("login storage data", loginSucessResponse);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              special: true
            }
          };
          let options: NativeTransitionOptions = {
            direction: 'down',
            duration: 400,
            // slowdownfactor: -1,
            iosdelay: 50
           };
          this.nativePageTransitions.flip(options);
          this.router.navigate(['menu'], navigationExtras);

        }
        else if (response.status == false) {
          console.log("staus false", response.status);
          loading.dismiss();
          let msg = response.msg;
          this.presentToast(msg);
        }
      }).catch(error => {
        console.log("Login Api error", error);
        loading.dismiss();
        let msg = "Server Error!!";
        this.presentToast(msg);
      });
    }
  }

  //------- This func shows err msg upon wrong credentials on Login --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      translucent: true,
    });
    toast.present();
  }
}
