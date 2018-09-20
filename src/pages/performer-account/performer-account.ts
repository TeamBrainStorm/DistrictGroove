import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  ModalController,
  AlertController
} from "ionic-angular";
import { Profile } from "../../models/profile";
import { Camera } from "@ionic-native/camera";
import { UserProvider } from "../../providers/user/user";
import { ChangePasswordPage } from "../change-password/change-password";
import { ArtistProvider } from "../../providers/artist/artist";
import { HomePage } from "../home/home";

/**
 * Generated class for the PerformerAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-performer-account",
  templateUrl: "performer-account.html"
})
export class PerformerAccountPage {
  customerProfile = {} as any;
  placeholder = "assets/imgs/placeholder.png";
  loadingStatus: any;
  isLoading = false;
  profile = {} as Profile;
  services: any;
  artistReviews: any;
  segment = "profile";
  serviceName: string;
  description: string;
  price: string;
  duration: string;
  serviceList: any;
  priceRange = [];
  selectedImage = "";
  portfoiloDescription = "";
  youtubeLink = "";
  youtubeLinkDescription = "";
  soundcloudLink = "";
  soundcloudLinkDescription = "";
  profilePicTemp = "assets/imgs/placeholder.png";
  artistPortfolio = [];

  private galleryOption = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 200,
    targetHeight: 200,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    cameraDirection: 0,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };

  private cameraOption = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 200,
    targetHeight: 200,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    cameraDirection: 0,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private userPrivider: UserProvider,
    private modalController: ModalController,
    public artistProvider: ArtistProvider,
    private alertCtrl: AlertController
  ) {
    this.customerProfile = navParams.get("account");
    this.serviceList = [];
    this.getServices(this.customerProfile.id);
    this.getPortfolioById(this.customerProfile.id);
    this.getReviewsById(this.customerProfile.id);
    this.serviceName = "";
    this.description = "";
    this.price = "";
    this.duration = "";
  }

  ionViewDidLoad() {
    this.profile.avatar = this.customerProfile.attributes.avatar;
    this.profile.firstName = this.customerProfile.attributes.firstName;
    this.profile.lastName = this.customerProfile.attributes.lastName;
    this.profile.stageName = this.customerProfile.attributes.stageName;
    this.profile.serviceType = this.customerProfile.attributes.serviceType;
    if (this.customerProfile.attributes.birthDate != null) {
      let date = new Date(this.customerProfile.attributes.birthDate);
      this.profile.birthDate = date.toISOString();
    } else {
      this.profile.birthDate = new Date().toISOString();
    }
    this.profile.gender = this.customerProfile.attributes.gender;
    this.profile.email = this.customerProfile.attributes.email;
    this.profile.contactNumber = this.customerProfile.attributes.contactNumber;
    this.profile.address = this.customerProfile.attributes.address;
    this.profile.city = this.customerProfile.attributes.city;
    this.profile.state = this.customerProfile.attributes.state;
    this.profile.country = this.customerProfile.attributes.country;
  }

  changePassword() {
    let changePasswordPage = this.modalController.create(ChangePasswordPage);
    changePasswordPage.present();
  }

  updateProfile() {
    this.customerProfile.set("firstName", this.profile.firstName);
    this.customerProfile.set("lastName", this.profile.lastName);
    this.customerProfile.set("email", this.profile.email);
    this.customerProfile.set("gender", this.profile.gender);
    this.customerProfile.set("contactNumber", this.profile.contactNumber);
    this.customerProfile.set("address", this.profile.address);
    this.customerProfile.set("city", this.profile.city);
    this.customerProfile.set("state", this.profile.state);
    this.customerProfile.set("country", this.profile.country);
    this.customerProfile.set("birthDate", new Date(this.profile.birthDate));
    this.customerProfile.set("stageName", this.profile.stageName);
    this.customerProfile.set("serviceType", this.profile.serviceType);
    this.userPrivider.updateProfile(this.customerProfile).then(result => {
      let alert = this.alertCtrl.create({
        title: "Account",
        subTitle: "Your account profile has been successfully updated.",
        buttons: ["Dismiss"]
      });
      alert.present();
    });
  }

  showUploadOption() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "Take a picture",
          icon: "camera",
          handler: () => {
            this.takePicturefromCamera();
          }
        },
        {
          text: "From gallery",
          icon: "images",
          handler: () => {
            this.takePicture();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture() {
    this.camera
      .getPicture(this.galleryOption)
      .then(imagePath => {
        return imagePath;
      })
      .then(imageBlob => {
        return this.uploadPhoto(imageBlob);
      });
  }

  takePicturefromCamera() {
    this.camera
      .getPicture(this.cameraOption)
      .then(imagePath => {
        return imagePath;
      })
      .then(imageBlob => {
        return this.uploadPhoto(imageBlob);
      });
  }

  uploadPhoto(file_path): void {
    this.userPrivider.uploadFile(file_path).then(result => {
      this.customerProfile.set("avatar", result._url);
      this.profile.avatar = result._url;
      this.userPrivider.updateProfile(this.customerProfile).then(result => {
        let alert = this.alertCtrl.create({
          title: "Account",
          subTitle: "Your profile image has been successfully updated.",
          buttons: ["Dismiss"]
        });
        alert.present();
      });
    });
  }

  uploadImage(file_path): void {
    this.userPrivider.uploadFile(file_path).then(result => {
      this.selectedImage = result._url;
    });
  }

  openArtist() {
    this.navCtrl.push(HomePage);
  }

  getReviewsById(id) {
    this.artistProvider.getReviewsById(id).then(results => {
      this.artistReviews = results;
      console.log(this.artistReviews);
    });
  }

  getServices(id) {
    this.artistProvider.getServiceById(id).then(results => {
      this.services = [];
      this.serviceList = [];
      results.forEach(service => {
        this.services.push({
          id: service.id,
          name: service.attributes.name,
          duration: service.attributes.duration,
          ownerId: service.attributes.ownerId,
          price: service.attributes.price,
          description: service.attributes.name,
          checked: false
        });
        this.serviceList.push(service);
      });
      this.updatePriceRange();
    });
  }

  parsePriceRange(services) {
    this.priceRange = [];
    services.forEach(service => {
      this.priceRange.push(service.price);
    });
  }

  getPortfolioById(id) {
    this.artistProvider.getPortfolio(id).then(results => {
      this.artistPortfolio = results;
    });
  }

  addService() {
    if (
      this.customerProfile.id === "" ||
      this.description === "" ||
      this.serviceName === "" ||
      this.price === "" ||
      this.duration == ""
    ) {
      return;
    }
    if (parseInt(this.duration) <= 0 || parseInt(this.price) <= 0) {
      return;
    }
    this.artistProvider
      .addService(
        this.customerProfile.id,
        this.serviceName,
        this.description,
        this.price,
        this.duration
      )
      .then((result: any) => {
        this.services.push({
          id: result.id,
          name: result.attributes.name,
          duration: result.attributes.duration,
          ownerId: result.attributes.ownerId,
          price: result.attributes.price,
          description: result.attributes.name,
          checked: false
        });
        this.serviceList.push(result);
        this.updatePriceRange().then(() => {
          let alert = this.alertCtrl.create({
            title: "Service",
            subTitle: "Service is added successfully!",
            buttons: ["Dismiss"]
          });
          alert.present();
          this.description = "";
          this.serviceName = "";
          this.price = "";
          this.duration = "";
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  updatePriceRange() {
    this.parsePriceRange(this.services);
    this.customerProfile.set("priceRange", {
      low: this.findMin(this.priceRange),
      high: this.findMax(this.priceRange)
    });
    return this.userPrivider
      .updateProfile(this.customerProfile)
      .then(result => {
        console.log(result);
      });
  }

  findMin(prices) {
    if (!prices.length) {
      return 0;
    } else {
      return Math.min.apply(null, prices);
    }
  }

  findMax(prices) {
    if (!prices.length) {
      return 0;
    } else {
      return Math.max.apply(null, prices);
    }
  }

  removeService(service) {
    let alert = this.alertCtrl.create({
      title: "Service",
      message: "Are you sure you want to delete this service?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {}
        },
        {
          text: "Yes, I am sure!",
          handler: () => {
            this.serviceList.forEach((item: any) => {
              if (item.id === service.id) {
                this.artistProvider
                  .removeService(item)
                  .then(result => {
                    let alert = this.alertCtrl.create({
                      title: "Service",
                      subTitle: "Service Successfully Deleted",
                      buttons: ["Dismiss"]
                    });
                    alert.present();
                    this.getServices(this.customerProfile.id);
                  })
                  .catch(error => {
                    let alert = this.alertCtrl.create({
                      title: "Service",
                      subTitle: "Service: Delete Failed",
                      buttons: ["Dismiss"]
                    });
                    alert.present();
                  });
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  selectImage() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "Take a picture",
          icon: "camera",
          handler: () => {
            this.camera
              .getPicture(this.cameraOption)
              .then(imagePath => {
                return imagePath;
              })
              .then(imageBlob => {
                return this.uploadImage(imageBlob);
              });
          }
        },
        {
          text: "From gallery",
          icon: "images",
          handler: () => {
            this.camera
              .getPicture(this.galleryOption)
              .then(imagePath => {
                return imagePath;
              })
              .then(imageBlob => {
                return this.uploadImage(imageBlob);
              });
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeImage() {
    this.selectedImage = "";
  }

  addPortfoilo(type) {
    switch (type) {
      case 0:
        this.addPortfolio(
          this.selectedImage,
          this.portfoiloDescription,
          type,
          this.customerProfile
        );
        this.selectedImage = "";
        this.portfoiloDescription = "";
        break;
      case 1:
        this.addPortfolio(
          this.youtubeLink,
          this.youtubeLinkDescription,
          type,
          this.customerProfile
        );
        this.youtubeLink = "";
        this.youtubeLinkDescription = "";
        break;
      case 2:
        this.addPortfolio(
          this.soundcloudLink,
          this.soundcloudLinkDescription,
          type,
          this.customerProfile
        );
        this.soundcloudLink = "";
        this.soundcloudLinkDescription = "";
        break;
    }
  }

  addPortfolio(url, description, type, account) {
    if (url === "" || description === "") {
      return;
    }
    this.artistProvider
      .addPortfolio(url, description, type, account)
      .then(result => {
        let alert = this.alertCtrl.create({
          title: "Portfolio",
          subTitle: "Portfolio is added successfully.",
          buttons: ["Dismiss"]
        });
        alert.present();
        this.getPortfolioById(account.id);
      })
      .catch(error => {
        let alert = this.alertCtrl.create({
          title: "Portfolio",
          subTitle: "Portfolio is not added.",
          buttons: ["Dismiss"]
        });
        alert.present();
      });
  }

  removePortfolio(portfolio) {
    let alert = this.alertCtrl.create({
      title: "Portfolio",
      message: "Are you sure you want to delete this portfolio?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {}
        },
        {
          text: "Yes, I am sure!",
          handler: () => {
            this.artistProvider
              .removePortfolio(portfolio)
              .then(result => {
                let alert = this.alertCtrl.create({
                  title: "Portfolio",
                  subTitle: "Portfolio Successfully Deleted",
                  buttons: ["Dismiss"]
                });
                alert.present();
                this.getPortfolioById(this.customerProfile.id);
              })
              .catch(error => {
                let alert = this.alertCtrl.create({
                  title: "Portfolio",
                  subTitle: "Portfolio: Delete Failed",
                  buttons: ["Dismiss"]
                });
                alert.present();
              });
          }
        }
      ]
    });
    alert.present();
  }
}
