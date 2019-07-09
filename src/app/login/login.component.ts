import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppSharedService } from '../../shared.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: {
    '[class]': 'classNames'
  }
})

export class LoginComponent {
  userEmail: string;
  userName: string;
  userDisplayName: string;

  userInfo: any = {};
  roleList: any = [];
  selectedRole: any = {};

  classNames: string;
  meetingId: string;
  projectInfo: string;
  showLoginPanel: boolean;
  loginErrorMsg: boolean;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router, private appVariable: AppSharedService) {
    this.classNames = 'loginContainer';
    this.appVariable.showLoading = false;
    this.roleList = [{ name: 'team-lead', value: "Team lead", roleId: 2 }, { name: 'front-end', value: "Front end developer", roleId: 2 }, { name: 'back-end', value: "Back end developer", roleId: 2 },
    { name: 'db', value: "Database developer", roleId: 2 }, { name: 'scrum-master', value: "Scrum master", roleId: 1 }, { name: 'product-owner', value: "Product owner", roleId: 2 }, { name: 'manager', value: "Manager", roleId: 2 }];
    this.selectedRole = this.roleList[0];
    this.showLoginPanel = true;
    this.loginErrorMsg = false;
  }

  // Login feature
  loginUser() {
    const _this = this;
    if (this.userInfo.userEmail !== null && this.userInfo.userPassword !== null) {
      // To valid the user
      firebase.auth().signInWithEmailAndPassword(this.userInfo.userEmail, this.userInfo.userPassword)
        .then(function () {
          _this.getRetroUserInfo(_this.userInfo.userEmail);
        })
        .catch(function (error) {
          _this.loginErrorMsg = true;
        });
    }
  }

  // Get registered User info
  getRetroUserInfo(userId) {
    const _this = this;
    this.afs.firestore.collection('retroUserInfo').doc(userId).get()
      .then(doc => {
        if (!doc.exists) {
          console.log("User information doesn't exist!");
        } else {
          let retroUserDetails = doc.data();
          sessionStorage.setItem('adminUserInfo', JSON.stringify(retroUserDetails));
          _this.router.navigate(['/admin']);
        }
      })
      .catch(err => {
        console.log('Error getting user info', err);
      });
  }

  // Register feature
  registerUser() {
    const userList = this.afs.collection('userInfo').doc(this.meetingId);
    const currentInstance = this;
    this.appVariable.showLoading = true;
    userList.collection('userList').doc(this.userInfo.userEmail).set(
      {
        'email': this.userInfo.userEmail,
        'displayName': this.userInfo.userDisplayName,
        'role': this.selectedRole
      }).then(function () { // Success - function
        // store user Info in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUserInfo', JSON.stringify({
          'email': currentInstance.userInfo.userEmail,
          'displayName': currentInstance.userInfo.userDisplayName,
          'role': currentInstance.selectedRole,
          'meetingId': currentInstance.meetingId
        }));
        currentInstance.appVariable.showLoading = false;
        currentInstance.router.navigate(['landing']);
      })
      .catch(function (error) { // If there is any issue
        console.error("Error writing document: ", error);
      });
  }

  // Read a page's GET URL variables and return them as an associative array.
  getUrlVars() {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  /* To check meeting is exist or not. Also get meeting information */
  checkMeetingId(meetingId) {
    let meetingRef = this.afs.firestore.collection('meetingInfo').doc(meetingId);
    let getDoc = meetingRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          let projectInfo = doc.data();
          this.meetingId = meetingId;
          projectInfo['meetingId'] = meetingId;
          sessionStorage.setItem('projectInfo', JSON.stringify(projectInfo));
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  }

  ngOnInit() {
    // Check userInfo else redirect to login page
    const adminUserInfo = JSON.parse(sessionStorage.getItem('adminUserInfo'));
    if (adminUserInfo) {
      this.router.navigate(['/admin']);
    } 
  }
}
