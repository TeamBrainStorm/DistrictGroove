import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parse } from "parse";

/*
  Generated class for the BookProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BookProvider {
  constructor(public http: HttpClient) {}

  book(bookInfo, customerProfile, datetimeValue) {
    var Booking = Parse.Object.extend("Booking");
    var booking = new Booking();
    booking.set("artistInfo", bookInfo.artistProfile);
    booking.set("selectedServices", bookInfo.selectedService);
    booking.set("customerInfo", customerProfile);
    booking.set("paymentMode", "cash");
    booking.set("totalBill", bookInfo.totalBill);
    booking.set("schedule", datetimeValue);
    booking.set("status", "pending");
    return booking.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  getBookingsById(id) {
    let AppointmentObject = Parse.Object.extend("Booking");
    let query = new Parse.Query(AppointmentObject);
    query.descending("updatedAt");
    if (id) {
      query.equalTo("customerInfo.id", id);
    }
    query.limit(100);

    return query.find({
      success: function(results) {
        console.log(results);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  getBookingsByPerformerId(id) {
    let AppointmentObject = Parse.Object.extend("Booking");
    let query = new Parse.Query(AppointmentObject);
    query.descending("updatedAt");
    if (id) {
      query.equalTo("artistInfo.id", id);
    }
    query.limit(100);

    return query.find({
      success: function(results) {
        console.log(results);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  submitReview(reviewInfo) {
    let Review = Parse.Object.extend("Review");
    let review = new Review();
    let customer = {
      avatar: reviewInfo.customerInfo.get("avatar"),
      firstName: reviewInfo.customerInfo.get("firstName"),
      id: reviewInfo.customerInfo.id,
      lastName: reviewInfo.customerInfo.get("lastName")
    };
    review.set("bookingId", reviewInfo.id);
    review.set("ratings", reviewInfo.ratings);
    review.set("description", reviewInfo.description);
    review.set("title", reviewInfo.title);
    review.set("customerInfo", customer);
    review.set("artistInfo", reviewInfo.artistInfo);
    return review.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  updateBooking(booking) {
    return booking.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
}
