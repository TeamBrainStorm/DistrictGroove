import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Events,
  AlertController
} from "ionic-angular";
import { UserProvider } from "../../providers/user/user";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-change-password",
  templateUrl: "change-password.html"
})
export class ChangePasswordPage {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private userProvider: UserProvider,
    private events: Events,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewWillEnter() {
    this.events.subscribe("login:failed", err => {
      let alert = this.alertCtrl.create({
        title: "Warning!",
        subTitle: "Please verify old password once again!",
        buttons: ["Dismiss"]
      });
      alert.present();
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe("login:failed");
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  update() {
    let this_ = this;
    if (this.oldPassword != "" && this.newPassword != "") {
      if (this.newPassword != this.confirmPassword) {
        let alert = this.alertCtrl.create({
          title: "Warning!",
          subTitle:
            "Sorry confirm new password doesn't match. Please try Again.",
          buttons: ["Dismiss"]
        });
        alert.present();
        return;
      }
      this.userProvider.checkPassword(this.oldPassword).then(user => {
        user.set("password", this.newPassword);
        user.save().then(
          function(user) {
            console.log(user);
            let alert = this.alertCtrl.create({
              title: "Password",
              subTitle: "Password successfully updated.",
              buttons: ["Dismiss"]
            });
            alert.present();
            this_.cancel();
          },
          function(error) {
            console.log(error);
          }
        );
      });
    }
  }
}
