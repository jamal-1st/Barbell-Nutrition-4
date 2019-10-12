import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController,MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage {

  public todo: FormGroup;
  submitAttempt: boolean = false;
  public loading: any;
  public customerId: any;
  backImage = "../assets/img/back.png";

  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public loadCtrl: LoadingController,
    private services: UserService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private menuCtrl:MenuController,
  ) {
    this.menuCtrl.enable(false);
    this.todo = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    });
    this.route.queryParams.subscribe(params => {
      console.log("param reviced", params.customerId);
      this.customerId = params.customerId;
    });
  }

  //---------------- Back to login  page -----------------//
  backArrow() {
    console.log("back function");
    this.navCtrl.navigateBack('/login');
  }

  //----------- Forget Api hit ---------//
  async forgetPassword() {
    if (!this.todo.valid) {
      this.submitAttempt = true;
    }
    else {
      const loading = await this.loadCtrl.create({
      });
      await loading.present();
      console.log("type of phone number ", this.todo.value);
      this.services.forgetPassword(this.todo.value).then((jsonresponse) => {
        let response = JSON.parse(jsonresponse);
        console.log("verification response!!", response);
        loading.dismiss();
        if (response.status == true) {
          loading.dismiss();
          console.log("staus true", response.status);
          this.alertForSuccess();
        }
        else if(response.status == false){
          console.log("staus false", response.status);
          let msg = response.msg;
          this.presentToast(msg);
          loading.dismiss();
        }
      }).catch(error => {
        console.log("ForgetPassword Api error", error);
        loading.dismiss();
      });
    }
  }

  /////---------- Alert for password forget----------//////
  async alertForSuccess() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Password',
      message: "New password sent to your Cell Number.",
      backdropDismiss:false,
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

  //------- This func shows err msg upon error message on forget password api status false --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }

}