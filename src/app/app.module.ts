import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  MenuToggle
} from "ionic-angular";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { UserProvider } from "../providers/user/user";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { AccountPage } from "../pages/account/account";
import { InboxPage } from "../pages/inbox/inbox";
import { AppointmentsPage } from "../pages/appointments/appointments";
import { SystemProvider } from "../providers/system/system";
import { ChatProvider } from "../providers/chat/chat";
import { ChatPage } from "../pages/chat/chat";
import { MessageProvider } from "../providers/message/message";
import { MessageBoxComponent } from "../components/message-box/message-box";
import { SortPage } from "../pages/sort/sort";
import { FilterPage } from "../pages/filter/filter";
import { Geolocation } from "@ionic-native/geolocation";
import { ArtistProvider } from "../providers/artist/artist";
import { ArtistPage } from "../pages/artist/artist";
import { BookPage } from "../pages/book/book";
import { BookProvider } from "../providers/book/book";
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { ReviewPage } from "../pages/review/review";
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { Ionic2RatingModule } from "ionic2-rating";
import { AgmCoreModule } from "@agm/core";
import { PerformerRegisterPage } from "../pages/performer-register/performer-register";
import { PerformerAccountPage } from "../pages/performer-account/performer-account";
import { SoundCloudProvider } from "../providers/sound-cloud/sound-cloud";
import { YoutubePage } from "../pages/youtube/youtube";
import { SoundCloudPage } from "../pages/sound-cloud/sound-cloud";
import { ImagePage } from "../pages/image/image";
import { ThemeableBrowser } from "@ionic-native/themeable-browser";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AccountPage,
    InboxPage,
    AppointmentsPage,
    ChatPage,
    MessageBoxComponent,
    SortPage,
    FilterPage,
    ArtistPage,
    BookPage,
    ReviewPage,
    ChangePasswordPage,
    PerformerRegisterPage,
    PerformerAccountPage,
    YoutubePage,
    SoundCloudPage,
    ImagePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    Ionic2RatingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCnahpwY4LRTYlzEHnER3B_Y8NR1HzmrVE",
      libraries: ["places"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    AccountPage,
    InboxPage,
    AppointmentsPage,
    ChatPage,
    SortPage,
    FilterPage,
    ArtistPage,
    BookPage,
    ReviewPage,
    ChangePasswordPage,
    PerformerRegisterPage,
    PerformerAccountPage,
    YoutubePage,
    SoundCloudPage,
    ImagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MenuToggle,
    SystemProvider,
    ChatProvider,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    MessageProvider,
    ArtistProvider,
    BookProvider,
    Camera,
    File,
    SoundCloudProvider,
    ThemeableBrowser
  ]
})
export class AppModule {}
