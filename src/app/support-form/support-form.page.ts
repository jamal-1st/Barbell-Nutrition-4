import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, LoadingController, ToastController, AlertController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-support-form',
  templateUrl: './support-form.page.html',
  styleUrls: ['./support-form.page.scss'],
})
export class SupportFormPage implements OnInit {

  public todo: FormGroup;
  formGroup: FormGroup
  submitAttempt: boolean = false;
  platformGet: any;
  message: any;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private services: UserService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private menuCtrl: MenuController,
    private platform: Platform,

  ) {
    this.todo = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
       message: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$')]],
      phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      subject: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],

    });
    this.menuCtrl.enable(false);
    // ---- Selecting platform ------//

    if (this.platform.is('android')) {
      this.platformGet = 'android'
    } else if (this.platform.is('ios')) {
      this.platformGet = 'ios';
      console.log("IOS", this.platformGet);
    }
    else {
      this.platformGet = 'desktop'
    }
  }

  ngOnInit() {
  }

  backArrow() {
    console.log("back function");
    this.navCtrl.navigateBack('/home');
  }


  async supportFrom() {
    if (!this.todo.valid) {
      this.submitAttempt = true;
    }
    else {
      const loading = await this.loadCtrl.create({
      });
      await loading.present();
      this.services.supportForm(this.todo.value, this.message, this.platformGet).then((Jsonresponse) => {
        loading.dismiss();
        let response = JSON.parse(Jsonresponse);
        console.log("Register response", response);
        console.log("Register response", response.data);
        if (response.status == true) {
          console.log("staus true", response.status);
          this.navCtrl.navigateRoot('home');

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
