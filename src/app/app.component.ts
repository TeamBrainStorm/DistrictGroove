import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, MenuToggle, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { Customer } from "../models/customer";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { Parse } from "parse";
import { UserProvider } from "../providers/user/user";
import { AccountPage } from "../pages/account/account";
import { AppointmentsPage } from "../pages/appointments/appointments";
import { PerformerAccountPage } from "../pages/performer-account/performer-account";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string; component: any; icon: any }>;

  loggedInPages: Array<{ title: string; component: any; icon: any }>;

  currentUser = {} as Customer;

  hasLoggedIn = false;

  profilePicTemp = "assets/imgs/placeholder.png";

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuToggle: MenuToggle,
    public events: Events,
    public userService: UserProvider
  ) {
    this.initializeApp();
    this.listenToLoginEvents();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: HomePage, icon: "ios-home-outline" }
    ];
    this.loggedInPages = [
      { title: "Home", component: HomePage, icon: "ios-home-outline" },
      {
        title: "Appointments",
        component: AppointmentsPage,
        icon: "ios-book-outline"
      }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    Parse.initialize("myAppId", "myJavascriptKey");
    //    Parse.serverURL = 'https://districtgroove-api.herokuapp.com/parse';
    Parse.serverURL = "https://districtgrooveapi.herokuapp.com/parse";
  }

  listenToLoginEvents() {
    if (this.userService.hasLoggedIn()) {
      this.userService.checkLogin();
    }
    this.events.subscribe("login:success", user => {
      console.log(user);
      this.currentUser = user;
      this.hasLoggedIn = true;
    });
    this.events.subscribe("register:success", user => {
      this.currentUser = user;
      this.hasLoggedIn = true;
    });

    this.events.subscribe("logout", () => {
      this.hasLoggedIn = false;
      this.currentUser = null;
      this.nav.setRoot(HomePage);
      localStorage["user"] = null;
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component, {
      account: this.currentUser
    });
  }

  hideMenu() {
    if (!this.menuToggle.isHidden) {
      this.menuToggle.toggle();
    }
  }

  showMenu() {
    if (this.menuToggle.isHidden) {
      this.menuToggle.toggle();
    }
  }

  viewProfile() {
    if (this.hasLoggedIn) {
      this.hideMenu();
      if (this.currentUser.className === "Customer") {
        this.nav.push(AccountPage, {
          account: this.currentUser
        });
      } else if (this.currentUser.className === "Artist") {
        this.nav.push(PerformerAccountPage, {
          account: this.currentUser
        });
      }
    }
  }

  login() {
    this.hideMenu();
    this.nav.push(LoginPage);
  }

  doLogout() {
    this.hideMenu();
    this.userService.logout();
  }

  showRegisterForm() {
    this.hideMenu();
    this.nav.push(RegisterPage);
  }
}
