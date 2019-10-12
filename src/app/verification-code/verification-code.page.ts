import { Component } from '@angular/core';
import { MenuController, NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.page.html',
  styleUrls: ['./verification-code.page.scss'],
})

export class VerificationCodePage {

  public todo: FormGroup;
  submitAttempt: boolean = false;
  public loading: any;
  customerId: any;
  messageForVerification: any;
  phoneNumber: any;
  backImage = "../assets/img/back.png";
  verificationCode: any;
  mobileNumber: any;
  timer: any = 'ReSend Code';
  disableBtn: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    public loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private services: UserService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.todo = this.formBuilder.group({
      code: ['', [Validators.required, , Validators.maxLength(6)]]
    });
    this.route.queryParams.subscribe(params => {
      console.log("param reviced", params);
      this.customerId = params.customerId;
      this.messageForVerification = params.message;
      this.verificationCode = params.verificationCode;
      this.mobileNumber = params.mobileNumber;
      console.log('customer id ', this.customerId);

      // this.phoneNumber = params.phoneNumber;

    });
    this.menuCtrl.enable(false);

  }

  //----------Back to register page-----//
  backArrow() {
    console.log("back function");
    this.navCtrl.navigateBack('/register');
  }

  // timer function-------//
  timerFunction() {
    this.timer = 59;
    var interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.timer = 'Resend CodeNode';
        clearInterval(interval);
        this.disableBtn = false;
      }
    }, 1000);
  }


  async resendCode() {
    this.disableBtn = true;
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    console.log("type of phone number ", typeof (this.todo.value.phone));
    this.services.resendCode(this.mobileNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      console.log("verification response!!", response);
      loading.dismiss();
      if (response.status == true) {
        loading.dismiss();
        this.verificationCode = response.verification_code;
        console.log("staus true", response.status);
        this.timerFunction();

        // this.alertForSuccess()
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        let msg = response.msg;
        this.presentToast(msg);
        loading.dismiss();
        this.disableBtn = false;
        this.timer = 'Resend CodeNode';
      }
    }).catch(error => {
      console.log("Register Api error", error);
      loading.dismiss();
      let msg = "Server Error!";
      this.presentToast(msg);
      this.disableBtn = false;
      this.timer = 'Resend CodeNode';
    });

  }
  //------------ Verification code Api hit -----------//
  async verification() {
    console.log('verification code', this.verificationCode);
    if (this.verificationCode != this.todo.value.code) {
      this.presentToast('Code does not match.');

    }
    else if (this.verificationCode == this.todo.value.code) {
      const loading = await this.loadCtrl.create({
      });
      await loading.present();
      console.log("type of phone number ", typeof (this.todo.value.phone));
      this.services.verificationCode(this.todo.value, this.customerId).then((Jsonresponse) => {
        let response = JSON.parse(Jsonresponse);
        console.log("verification response!!", response);
        loading.dismiss();
        if (response.status == true) {
          loading.dismiss();
          console.log("staus true", response.status);
          this.alertForSuccess()
        }
        else if (response.status == false) {
          console.log("staus false", response.status);
          let msg = response.msg;
          this.presentToast(msg);
          loading.dismiss();
        }
      }).catch(error => {
        console.log("Register Api error", error);
        loading.dismiss();
        let msg = "Server Error!";
        this.presentToast(msg);

      });
    }
  }

  /////---------- Alert For account success ----------//////
  async alertForSuccess() {
    const alert = await this.alertCtrl.create({
      header: 'Successfull',
      message: "Your account has been created successfully.",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateRoot(['login']);
          }
        }
      ]
    });
    await alert.present();
  }

  //------- Toast for error ----//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}