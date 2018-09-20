import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { Profile } from "../../models/profile";
import { BookProvider } from "../../providers/book/book";
import { UserProvider } from "../../providers/user/user";
import { InboxPage } from "../inbox/inbox";

/**
 * Generated class for the BookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-book",
  templateUrl: "book.html"
})
export class BookPage {
  artist: any;
  amount: any;
  datetimeValue: any;
  profile = {} as Profile;
  services: any;
  profilePicTemp = "assets/imgs/placeholder.png";
  hasLoggedIn = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bookProvider: BookProvider,
    public alertCtrl: AlertController,
    public userProvider: UserProvider
  ) {
    this.amount = navParams.get("amount");
    this.artist = navParams.get("artist");
    this.profile = navParams.get("account");
    if (this.profile == undefined) {
      this.profile = {
        id: "",
        avatar: "",
        birthDate: "",
        contactNumber: "",
        createdAt: "",
        email: "",
        firstName: "",
        lastName: "",
        updatedAt: "",
        gender: "",
        address: "",
        stageName: "",
        serviceType: "",
        city: "",
        country: "",
        state: ""
      };
    }
    this.hasLoggedIn = userProvider.hasLoggedIn();
    this.services = navParams.get("services");
    this.datetimeValue = new Date().toISOString();
  }

  ionViewDidLoad() {}

  book(datetimeValue) {
    if (
      this.profile.contactNumber == null ||
      this.profile.contactNumber == ""
    ) {
      let alert = this.alertCtrl.create({
        title: "Warning!",
        subTitle:
          "A valid contact number is required, for the artist to contact you.",
        buttons: ["Dismiss"]
      });
      alert.present();
      return;
    }
    let bookInfo = {
      totalBill: this.amount,
      artistProfile: {
        id: this.artist.id,
        firstName: this.artist.attributes.firstName,
        lastName: this.artist.attributes.lastName,
        avatar: this.artist.attributes.avatar,
        contactNumber: this.artist.attributes.contactNumber,
        email: this.artist.attributes.email
      },
      selectedService: this.services
    };
    this.bookProvider
      .book(bookInfo, this.profile, new Date(this.datetimeValue))
      .then(result => {
        console.log(result);
        this.navCtrl.pop();
        this.userProvider
          .getCurrentUser()
          .then(user => {
            this.navCtrl.pop();
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  openChat() {
    this.navCtrl.push(InboxPage);
  }
}
