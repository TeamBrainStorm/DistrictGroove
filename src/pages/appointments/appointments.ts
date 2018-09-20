import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { BookProvider } from "../../providers/book/book";
import { ReviewPage } from "../review/review";
import { InboxPage } from "../inbox/inbox";
import { HomePage } from "../home/home";

/**
 * Generated class for the AppointmentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-appointments",
  templateUrl: "appointments.html"
})
export class AppointmentsPage {
  customerProfile: any;
  bookings: any;
  totalBookings: any;
  statusButton = {
    pending: "",
    accepted: "",
    completed: ""
  };
  profilePicTemp = "assets/imgs/placeholder.png";
  userRole: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bookProvider: BookProvider,
    public alertCtrl: AlertController
  ) {
    this.customerProfile = navParams.get("account");
    this.userRole = this.customerProfile.className;
  }

  ionViewDidLoad() {
    this.getBookings();
  }

  getBookings() {
    if (this.userRole === "Customer") {
      this.bookProvider
        .getBookingsById(this.customerProfile.id)
        .then(results => {
          this.bookings = results;
          this.totalBookings = results;
        });
    } else if (this.userRole === "Artist") {
      this.bookProvider
        .getBookingsByPerformerId(this.customerProfile.id)
        .then(results => {
          this.bookings = results;
          this.totalBookings = results;
        });
    }
  }

  openArtist() {
    this.navCtrl.push(HomePage);
  }

  changeStatusView(status) {
    if (status === "pending") {
      if (this.statusButton.pending === "button-outline") {
        this.statusButton.pending = "";
      } else {
        this.statusButton.pending = "button-outline";
      }
    } else if (status === "accepted") {
      if (this.statusButton.accepted === "button-outline") {
        this.statusButton.accepted = "";
      } else {
        this.statusButton.accepted = "button-outline";
      }
    } else {
      if (this.statusButton.completed === "button-outline") {
        this.statusButton.completed = "";
      } else {
        this.statusButton.completed = "button-outline";
      }
    }
    this.filter();
  }

  filter() {
    if (this.totalBookings === undefined) {
      return;
    }
    this.bookings = this.totalBookings.filter(booking => {
      return this.filterBooking(booking);
    });
  }

  openReviewModal(bookings) {
    console.log(bookings);
    this.navCtrl.push(ReviewPage, {
      account: this.customerProfile,
      booking: bookings
    });
  }

  filterBooking(booking) {
    let response;

    if (
      !this.statusButton.pending &&
      this.statusButton.accepted &&
      this.statusButton.completed
    ) {
      response = booking.get("status") === "pending";
    } else if (
      this.statusButton.pending &&
      !this.statusButton.accepted &&
      this.statusButton.completed
    ) {
      response = booking.get("status") === "accepted";
    } else if (
      this.statusButton.pending &&
      this.statusButton.accepted &&
      !this.statusButton.completed
    ) {
      response = booking.get("status") === "completed";
    } else if (
      !this.statusButton.pending &&
      this.statusButton.accepted &&
      !this.statusButton.completed
    ) {
      response =
        booking.get("status") === "completed" ||
        booking.get("status") === "pending";
    } else if (
      this.statusButton.pending &&
      !this.statusButton.accepted &&
      !this.statusButton.completed
    ) {
      response =
        booking.get("status") === "completed" ||
        booking.get("status") === "accepted";
    } else if (
      !this.statusButton.pending &&
      !this.statusButton.accepted &&
      this.statusButton.completed
    ) {
      response =
        booking.get("status") === "pending" ||
        booking.get("status") === "accepted";
    } else if (
      this.statusButton.pending &&
      this.statusButton.accepted &&
      this.statusButton.completed
    ) {
      response = false;
    } else {
      response =
        booking.get("status") === "pending" ||
        booking.get("status") === "accepted" ||
        booking.get("status") === "completed";
    }

    return response;
  }

  completeBooking(booking: any) {
    if (
      this.userRole === "Artist" &&
      booking.attributes.status !== "completed"
    ) {
      let alert = this.alertCtrl.create({
        title: "Booking",
        message: "Are you sure you want to complete this service?",
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {}
          },
          {
            text: "Yes, I am sure!",
            handler: () => {
              booking.set("isCompleted", true);
              booking.set("status", "completed");
              this.bookProvider.updateBooking(booking).then(results => {
                let alert = this.alertCtrl.create({
                  title: "Booking",
                  subTitle: "Booking Successfully Completed",
                  buttons: ["Dismiss"]
                });
                alert.present();
                this.getBookings();
              });
            }
          }
        ]
      });
      alert.present();
    }
  }

  acceptBooking(booking: any) {
    if (
      this.userRole === "Artist" &&
      booking.attributes.status !== "completed"
    ) {
      let alert = this.alertCtrl.create({
        title: "Booking",
        message: "Are you sure you want to accept this service?",
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {}
          },
          {
            text: "Yes, I am sure!",
            handler: () => {
              booking.set("status", "accepted");
              this.bookProvider.updateBooking(booking).then(results => {
                let alert = this.alertCtrl.create({
                  title: "Booking",
                  subTitle: "Booking Successfully Accepted",
                  buttons: ["Dismiss"]
                });
                alert.present();
                this.getBookings();
              });
            }
          }
        ]
      });
      alert.present();
    }
  }

  openChat() {
    this.navCtrl.push(InboxPage);
  }
}
