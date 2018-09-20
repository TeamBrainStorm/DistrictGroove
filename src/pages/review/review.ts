import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { Review } from "../../models/review";
import { BookProvider } from "../../providers/book/book";
import { HomePage } from "../home/home";

/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-review",
  templateUrl: "review.html"
})
export class ReviewPage {
  booking: any;
  customerProfile: any;
  rating = {} as Review;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public bookingProvider: BookProvider,
    public alertCtrl: AlertController
  ) {
    this.customerProfile = navParams.get("account");
    this.booking = navParams.get("booking");
    this.rating.rate = 5;
    this.rating.review = "";
    this.rating.title = "";
  }

  ionViewDidLoad() {}

  submitReview() {
    if (
      this.rating.title == "" ||
      this.rating.review == "" ||
      this.rating.rate == 0
    ) {
      let alert = this.alertCtrl.create({
        title: "Warning!",
        subTitle: "Please fill out all review informations.",
        buttons: ["Dismiss"]
      });
      alert.present();
      return;
    }
    let reviewInfo = {
      id: this.booking.id,
      ratings: this.rating.rate,
      description: this.rating.review,
      title: this.rating.title,
      customerInfo: this.customerProfile,
      artistInfo: this.booking.attributes.artistInfo
    };
    this.bookingProvider.submitReview(reviewInfo).then(result => {
      this.booking.set("isReviewed", true);
      this.bookingProvider.updateBooking(this.booking).then(result => {
        this.navCtrl.pop();
      });
    });
  }

  openArtist() {
    this.navCtrl.push(HomePage, {
      account: this.customerProfile
    });
  }
}
