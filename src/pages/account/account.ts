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
import { InboxPage } from "../inbox/inbox";

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-account",
  templateUrl: "account.html"
})
export class AccountPage {
  customerProfile = {} as any;
  placeholder = "assets/imgs/placeholder.png";
  loadingStatus: any;
  isLoading = false;
  profile = {} as Profile;

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
    private alertCtrl: AlertController
  ) {
    this.customerProfile = navParams.get("account");
  }

  ionViewDidLoad() {
    this.profile.avatar = this.customerProfile.attributes.avatar;
    this.profile.firstName = this.customerProfile.attributes.firstName;
    this.profile.lastName = this.customerProfile.attributes.lastName;
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
    console.log(this.profile);
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
    this.customerProfile.set("birthDate", new Date(this.profile.birthDate));
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

  private uploadPhoto(file_path): void {
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

  openChat() {
    this.navCtrl.push(InboxPage);
  }
}
