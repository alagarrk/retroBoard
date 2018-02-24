import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from './app.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import * as _ from "lodash";

import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ManageCommentsModalComponent } from './components/modals/manage-comments-modal/manage-comments-modal.component';

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
  { path: 'landing', component: LandingPageComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    ManageCommentsModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes),
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ManageCommentsModalComponent
  ]
})
export class AppModule { }
