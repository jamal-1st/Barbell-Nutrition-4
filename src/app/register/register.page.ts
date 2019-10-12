import { Component } from '@angular/core';
import { MenuController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { Router, NavigationExtras } from '@angular/router';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  public todo: FormGroup;
  public countryList: any = [];
  submitAttempt: boolean = false;
  public loading: any;
  backImage = "../assets/img/back.png";

  constructor(
    private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    public loadCtrl: LoadingController,
    public toastController: ToastController,
    private navCtrl: NavController,
    private nativePageTransitions:NativePageTransitions,
    private services: UserService,
    public router: Router,
  ) {
    this.todo = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$')]],
      first: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      second: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
    this.menuCtrl.enable(false);
  }

  //------------ Back to home page -------------//
  back() {
    console.log("back function");
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
     };
 
    this.nativePageTransitions.slide(options);
    this.navCtrl.navigateBack('/home');
  }


  // timer function

  //------------ Register page -------------//
  async register() {
    if (!this.todo.valid) {
      this.submitAttempt = true;
    }
    else {
      if (this.todo.value.password == this.todo.value.passwordConfirm) {
        const loading = await this.loadCtrl.create({
        });
        await loading.present();
        this.services.register(this.todo.value).then((Jsonresponse) => {
          loading.dismiss();
          let response = JSON.parse(Jsonresponse);
          console.log("Register response", response);
          console.log("Register response", response.data);
          if (response.status == true) {
            console.log("staus true", response.status);
            let navigationExtras: NavigationExtras = {
              queryParams: {
                customerId: response.customer_id,
                message:response.msg,
                mobileNumber:response.mobile_number,
                verificationCode:response.verification_code,
                //phoneNumber:response.data.phone,
              }
            };
            this.router.navigate(['verification-code'], navigationExtras);
          }
          else if (response.status == false) {
            console.log("staus false", response.status);
            let msg = response.msg;
            this.presentToast(msg);
          }
        }).catch(error => {
          console.log("Register Api error", error);
          loading.dismiss();
          let msg = "Server Error!!";
          this.presentToast(msg);
        });
      }
      else {
        let msg = "Password and Confirm Password do not match"
        this.presentToast(msg)
      }
    }
  }

  //--------- Toast for error -------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}