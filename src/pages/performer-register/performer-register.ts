import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  AlertController
} from "ionic-angular";
import { Register } from "../../models/register";
import { UserProvider } from "../../providers/user/user";
import { Coordinate } from "../../models/coords";
import { Geolocation } from "@ionic-native/geolocation";
import { MapsAPILoader } from "@agm/core";
import {} from "googlemaps";

/**
 * Generated class for the PerformerRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-performer-register",
  templateUrl: "performer-register.html"
})
export class PerformerRegisterPage {
  register = {} as Register;
  coordinate = {} as Coordinate;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    private geoLocation: Geolocation,
    public events: Events,
    public mapsAPILoader: MapsAPILoader,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.mapsAPILoader.load();
  }

  ionViewWillEnter() {
    this.events.subscribe("register:failed", err => {
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: err.message,
        buttons: ["Dismiss"]
      });
      alert.present();
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe("register:failed");
  }

  doRegister() {
    this.geoLocation
      .getCurrentPosition()
      .then((resp: any) => {
        this.coordinate = resp.coords;
        this.register.latitude = this.coordinate.latitude;
        this.register.longitude = this.coordinate.longitude;
        this.getAddress(this.coordinate).then((address: any) => {
          this.register.address = address.Address;
          this.register.city = address.City;
          this.register.country = address.Country;
          this.register.state = address.State;
          if (this.register.password == this.register.confirmPassword) {
            if (this.register.password == "") {
              let alert = this.alertCtrl.create({
                title: "Warning",
                subTitle: "Password is empty!",
                buttons: ["Dismiss"]
              });
              alert.present();
              return;
            } else {
              if (this.register.serviceType.trim() === "") {
                let alert = this.alertCtrl.create({
                  title: "Warning",
                  subTitle: "You need to select correct service type!",
                  buttons: ["Dismiss"]
                });
                alert.present();
                return;
              }
              this.register.userType = "Artist";
              this.userProvider
                .registerPerformer(this.register)
                .then(result => {
                  this.navCtrl.pop();
                });
            }
          } else {
            let alert = this.alertCtrl.create({
              title: "Warning!",
              subTitle: "Password is mismatch!",
              buttons: ["Dismiss"]
            });
            alert.present();
            return;
          }
        });
      })
      .catch(error => {
        console.log(error);
        let alert = this.alertCtrl.create({
          title: "Warning!",
          subTitle: "You need to enable GPS to create account.",
          buttons: ["Dismiss"]
        });
        alert.present();
        return;
      });
  }

  getAddress(point) {
    let latlng = { lat: point.latitude, lng: point.longitude };
    let fullAddress = {
      Id: 0,
      Name: "",
      Address: "",
      City: "",
      State: "",
      Zip: "",
      Country: "",
      Latitude: 0,
      Longitude: 0
    };
    let geocoder = new google.maps.Geocoder();
    let promise = new Promise(resolve => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          var address_components = results[0].address_components;
          address_components.forEach(address => {
            if (
              address.types[0] == "administrative_area_level_1" &&
              fullAddress.State != address.short_name
            ) {
              fullAddress.State = address.short_name;
            }
            if (
              address.types[0] == "locality" &&
              fullAddress.City != address.short_name
            ) {
              fullAddress.City = address.short_name;
            }
            if (address.types[0] == "postal_code" && fullAddress.Zip == "") {
              fullAddress.Zip = address.short_name;
            }
            if (address.types[0] == "country" && fullAddress.Country == "") {
              fullAddress.Country = address.short_name;
            }
          });
          fullAddress.Latitude = lat;
          fullAddress.Longitude = lng;
          resolve(fullAddress);
        } else {
          let alert = this.alertCtrl.create({
            title: "Error",
            subTitle:
              "Geocode Error Geocode was not successful for the following reason: " +
              status,
            buttons: ["Dismiss"]
          });
          alert.present();
        }
      });
    });
    return promise;
  }
}
