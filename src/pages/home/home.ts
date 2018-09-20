import { Component, NgZone } from "@angular/core";
import { NavController, NavParams, Events } from "ionic-angular";
import { FilterPage } from "../filter/filter";
import { SortPage } from "../sort/sort";
import { Geolocation } from "@ionic-native/geolocation";
import { Coordinate } from "../../models/coords";
import { Parse } from "parse";
import { ArtistProvider } from "../../providers/artist/artist";
import { ArtistPage } from "../artist/artist";
import { Filter } from "../../models/filter";
import { AlertController } from "ionic-angular";
import { MapsAPILoader } from "@agm/core";
import { InboxPage } from "../inbox/inbox";
import { UserProvider } from "../../providers/user/user";
import {} from "googlemaps";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  coordinate = {} as Coordinate;
  artists: any;
  originArtists: any;
  searchPlaceHolder = "Find Artists By Entering Location...";
  loadingStatus = "Finding Artists Near Your Location...";
  filter = {} as Filter;
  profilePicTemp = "assets/imgs/placeholder.png";
  distance: any;
  address: any;
  changeColor = false;
  hasLoggedIn = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geoLocation: Geolocation,
    private artistProvider: ArtistProvider,
    public events: Events,
    private alertCtrl: AlertController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userService: UserProvider
  ) {
    this.filter.Dj = true;
    this.filter.Band = true;
    this.filter.Artist = true;
    this.filter.sort = "Distance";
    this.distance = this.getAngleFromMile(50);
    this.events.subscribe("filterAndSort", result => {
      this.filter = result;
      if (this.originArtists === undefined) {
        return;
      }
      this.sortAndFilter(this.originArtists);
    });
    this.hasLoggedIn = this.userService.hasLoggedIn();
  }

  ionViewDidLoad() {
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document
        .getElementById("addressInput")
        .getElementsByTagName("input")[0];
      let autocomplete = new google.maps.places.Autocomplete(
        nativeHomeInputBox,
        {
          types: ["address"]
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          let latitude = place.geometry.location.lat();
          let longitude = place.geometry.location.lng();
          let point = new Parse.GeoPoint({
            latitude: latitude,
            longitude: longitude
          });
          this.coordinate = point;
          this.getArtist(point);
        });
      });
    });
    this.geoLocation
      .getCurrentPosition()
      .then((resp: any) => {
        this.coordinate = resp.coords;
        let point = new Parse.GeoPoint({
          latitude: this.coordinate.latitude,
          longitude: this.coordinate.longitude
        });
        this.getAddress(point);
        this.getArtist(point);
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  itemTapped(event, item) {
    this.navCtrl.push(ArtistPage, {
      artist: item
    });
  }

  moreDataCanBeLoaded() {
    return true;
  }

  findArtistsNearby() {
    let alert = this.alertCtrl.create({
      title: "Find Artists",
      message: "Find artists near to your current location?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        },
        {
          text: "OK",
          handler: () => {
            this.geoLocation
              .getCurrentPosition()
              .then((resp: any) => {
                this.coordinate = resp.coords;
                let point = new Parse.GeoPoint({
                  latitude: this.coordinate.latitude,
                  longitude: this.coordinate.longitude
                });
                this.getAddress(point);
                this.getArtist(point);
              })
              .catch(error => {
                console.log("Error getting location", error);
              });
          }
        }
      ]
    });
    alert.present();
  }

  getAddress(point) {
    let geocoder = new google.maps.Geocoder();
    let latlng = { lat: point.latitude, lng: point.longitude };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (results.length > 0) {
        this.address = results[0].formatted_address;
      }
    });
  }

  getArtist(point) {
    this.artistProvider.getArtist(point).then(results => {
      if (results == null || results == undefined || results.length == 0) {
        return;
      }
      this.originArtists = results;
      console.log(results);
      this.sortAndFilter(results);
    });
  }

  getAngleFromMile(mile) {
    return (1 * mile) / 60;
  }

  showFilters(bMode: boolean, mode: string) {
    if (bMode) {
      this.navCtrl.push(FilterPage, {
        mode: mode,
        filter: this.filter
      });
    } else {
      this.navCtrl.push(SortPage, {
        mode: mode,
        filter: this.filter
      });
    }
  }

  sortAndFilter(artists) {
    if (artists === undefined || this.coordinate === undefined) {
      return;
    }
    let point = new Parse.GeoPoint({
      latitude: this.coordinate.latitude,
      longitude: this.coordinate.longitude
    });
    let tempArtist = artists.filter((artist: any) => {
      let difference = Math.sqrt(
        (point._latitude - artist.attributes.coordinates._latitude) *
          (point._latitude - artist.attributes.coordinates._latitude) +
          (point._longitude - artist.attributes.coordinates._longitude) *
            (point._longitude - artist.attributes.coordinates._longitude)
      );
      console.log(
        difference +
          " : " +
          this.distance +
          "( " +
          artist.attributes.coordinates._latitude +
          ", " +
          artist.attributes.coordinates._longitude +
          " )"
      );
      return (
        difference < this.distance &&
        ((artist.attributes.serviceType === "DJ" && this.filter.Dj) ||
          (artist.attributes.serviceType === "Artist" && this.filter.Artist) ||
          (artist.attributes.serviceType === "Band" && this.filter.Band))
      );
    });
    console.log(tempArtist);
    let this_ = this;
    this.artists = tempArtist.sort((artist1, artist2) => {
      switch (this_.filter.sort) {
        case "Distance":
          let coord1 = artist1.attributes.coordinates;
          let coord2 = artist2.attributes.coordinates;
          let difference1 = Math.sqrt(
            (point._latitude - coord1._latitude) *
              (point._latitude - coord1._latitude) +
              (point._longitude - coord1._longitude) *
                (point._longitude - coord1._longitude)
          );
          let difference2 = Math.sqrt(
            (point._latitude - coord2._latitude) *
              (point._latitude - coord2._latitude) +
              (point._longitude - coord2._longitude) *
                (point._longitude - coord2._longitude)
          );
          if (difference1 > difference2) {
            return -1;
          } else if (difference1 == difference2) {
            return this.nameCompare(artist1, artist2);
          } else {
            return 1;
          }
        case "highToLow":
          let priceRange1 = artist1.attributes.priceRange;
          let priceRange2 = artist2.attributes.priceRange;
          if (priceRange1 === undefined || priceRange2 === undefined) {
            this.nameCompare(artist1, artist2);
          } else {
            if (priceRange1.high > priceRange2.high) {
              return -1;
            } else if (priceRange1.high < priceRange2.high) {
              return 1;
            } else {
              this.nameCompare(artist1, artist2);
            }
          }
          break;
        case "lowToHigh":
          priceRange1 = artist1.attributes.priceRange;
          priceRange2 = artist2.attributes.priceRange;
          if (priceRange1 === undefined || priceRange2 === undefined) {
            this.nameCompare(artist1, artist2);
          } else {
            if (priceRange1.high > priceRange2.high) {
              return 1;
            } else if (priceRange1.high < priceRange2.high) {
              return -1;
            } else {
              this.nameCompare(artist1, artist2);
            }
          }
          break;
        case "Rating":
          break;
        default:
          break;
      }
    });
  }

  nameCompare(artist1, artist2) {
    let stageName1: string, stageName2: string;
    if (artist1.attributes.stageName !== undefined) {
      stageName1 = artist1.attributes.stageName;
    } else {
      stageName1 = artist1.attributes.firstName + artist1.attributes.lastName;
    }
    if (artist2.attributes.stageName !== undefined) {
      stageName2 = artist2.attributes.stageName;
    } else {
      stageName2 = artist2.attributes.firstName + artist2.attributes.lastName;
    }
    stageName1 = stageName1.toLowerCase();
    stageName2 = stageName2.toLowerCase();
    if (stageName1 > stageName2) {
      return 1;
    } else if (stageName1 === stageName2) {
      return 0;
    } else {
      return -1;
    }
  }

  openChat() {
    this.navCtrl.push(InboxPage);
  }

  color() {
    console.log("Hola");
    this.changeColor = true;
  }
}
