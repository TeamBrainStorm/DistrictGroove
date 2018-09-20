import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parse } from "parse";
import { Events } from "ionic-angular";
import { Crendential } from "../../models/credential";
import { Register } from "../../models/register";
import { Customer } from "../../models/customer";
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  customer = {} as Customer;

  constructor(public http: HttpClient, public events: Events) {}

  login(crendential: Crendential) {
    let _this = this;
    return Parse.User.logIn(crendential.userName, crendential.password, {
      success: function(user) {
        _this.getProfile(Parse.User.current().get("profileId"), true);
      },
      error: function(user, error) {
        _this.events.publish("login:failed", error);
      }
    });
  }

  registerPerformer(register: Register) {
    let _this = this;
    let Artist = Parse.Object.extend("Artist");
    let artist = new Artist();
    artist.set("firstName", register.firstName);
    artist.set("lastName", register.lastName);
    artist.set("contactNumber", register.contactNumber);
    artist.set("email", register.email);
    artist.set("serviceType", register.serviceType);
    artist.set("address", register.address);
    artist.set("stageName", register.stageName);
    artist.set("city", register.city);
    artist.set("country", register.country);
    artist.set("state", register.state);
    let point = new Parse.GeoPoint({
      latitude: register.latitude,
      longitude: register.longitude
    });
    artist.set("coordinates", point);
    artist.set("currentCoordinates", {
      lat: register.latitude,
      lng: register.longitude
    });
    return artist.save(null, {
      success: function(result) {
        let user = new Parse.User();
        user.set("username", register.email);
        user.set("password", register.password);
        user.set("profileId", result.id);
        user.set("userType", register.userType);
        user.set("serviceType", register.serviceType);
        user.set("address", register.address);
        user.set("stageName", register.stageName);
        user.set("city", register.city);
        user.set("country", register.country);
        user.set("state", register.state);
        user.set("coordinates", point);
        user.set("currentCoordinates", {
          lat: register.latitude,
          lng: register.longitude
        });
        user.signUp(null, () => {
          _this.getProfile(Parse.User.current().get("profileId"), false);
        });
      },
      error: function(user, error) {
        _this.events.publish("register:failed", error);
      }
    });
  }

  register(register: Register) {
    let _this = this;
    let Customer = Parse.Object.extend("Customer");
    let customer = new Customer();
    customer.set("firstName", register.firstName);
    customer.set("lastName", register.lastName);
    customer.set("contactNumber", register.contactNumber);
    customer.set("email", register.email);
    return customer.save(null, {
      success: function(result) {
        let user = new Parse.User();
        user.set("username", register.email);
        user.set("password", register.password);
        user.set("profileId", result.id);
        user.set("userType", register.userType);

        user.signUp(null, () => {
          _this.getProfile(Parse.User.current().get("profileId"), false);
        });
      },
      error: function(user, error) {
        _this.events.publish("register:failed", error);
      }
    });
  }

  logout() {
    let _this = this;
    Parse.User.logOut().then(function() {
      _this.events.publish("logout");
    });
  }

  getProfile(profileId: string, type: boolean) {
    let _this = this;
    let user = Parse.User.current();
    let userObject = Parse.Object.extend(
      this.capitalize(user.attributes.userType)
    );
    let query = new Parse.Query(userObject);
    if (profileId) {
      query.equalTo("objectId", profileId);
    }
    query.find({
      success: function(results) {
        _this.customer = results[0];
        if (type) {
          _this.events.publish("login:success", _this.customer);
        } else {
          _this.events.publish("register:success", _this.customer);
        }
      },
      error: function(error) {
        if (type) {
          _this.events.publish("login:failed", error);
        } else {
          _this.events.publish("register:failed", error);
        }
      }
    });
  }

  hasLoggedIn() {
    return Parse.User.current() != null;
  }

  checkLogin() {
    let _this = this;
    let user = Parse.User.current();
    let profileId = Parse.User.current().get("profileId");
    let customerObject = Parse.Object.extend(
      this.capitalize(user.attributes.userType)
    );
    let query = new Parse.Query(customerObject);
    if (profileId) {
      query.equalTo("objectId", profileId);
    }
    return query.find({
      success: function(results) {
        _this.customer = results[0];
        _this.events.publish("login:success", _this.customer);
      },
      error: function(error) {
        _this.events.publish("login:failed", error);
      }
    });
  }

  getCurrentUser() {
    let user = Parse.User.current();
    let profileId = Parse.User.current().get("profileId");
    let customerObject = Parse.Object.extend(
      this.capitalize(user.attributes.userType)
    );
    let query = new Parse.Query(customerObject);
    if (profileId) {
      query.equalTo("objectId", profileId);
    }
    let promise = new Promise((resolve, reject) => {
      query.find({
        success: function(results) {
          resolve(results[0]);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
    return promise;
  }

  uploadFile(url) {
    let uploadFile = new Parse.File("image.jpg", { base64: url });
    return uploadFile.save();
  }

  updateProfile(profile) {
    return profile.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  forgotPassword(email) {
    return Parse.Cloud.run(
      "request-reset",
      { email },
      {
        success: function(secretString) {
          console.log(secretString);
        },
        error: function(error) {
          console.log(error);
          let alert = this.alertCtrl.create({
            title: "Error",
            subTitle: "Sorry, the email address you entered is not registered.",
            buttons: ["Dismiss"]
          });
          alert.present();
        }
      }
    );
  }

  checkPassword(password) {
    let user = Parse.User.current();
    let email = user.get("username");
    let credential = {} as Crendential;
    credential.userName = email;
    credential.password = password;
    return this.login(credential);
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}
