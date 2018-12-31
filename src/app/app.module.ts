import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AngularFirestoreModule } from 'angularfire2/firestore';


import { AppComponent } from './app.component';
import { AppSharedService } from '../shared.service';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import * as _ from "lodash";

import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HappinessScoreModalComponent } from './components/modals/happiness-score-modal/happiness-score-modal.component';
import { ConfirmationModalComponent } from './components/modals/confirmation-modal/confirmation-modal.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgEnterDirective } from './components/directives/ng-enter.directive';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SmileyRatingComponent } from './components/smiley-rating/smiley-rating.component';

// Firebase credentials - Setup
var firebaseConfig = {
  apiKey: "AIzaSyDWybIpYwgtCtP3O-HUf0OJKJt4xOy_qx8",
  authDomain: "retroboard-app.firebaseapp.com",
  databaseURL: "https://retroboard-app.firebaseio.com",
  projectId: "retroboard-app",
  storageBucket: "retroboard-app.appspot.com",
  messagingSenderId: "552084718022"
};

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'admin', component: AdminPageComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    HappinessScoreModalComponent,
    ConfirmationModalComponent,
    AdminPageComponent,
    HeaderComponent,
    FooterComponent,
    NgEnterDirective,
    SideBarComponent,SmileyRatingComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule, HttpModule, 
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes),
    DragulaModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [AppSharedService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  entryComponents: [
    HappinessScoreModalComponent
  ]
})
export class AppModule { }
