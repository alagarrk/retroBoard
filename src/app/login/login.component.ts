import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppSharedService } from '../../shared.service';
import { Observable } from 'rxjs/Observable';
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

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router, private appVariable: AppSharedService) {
    this.classNames = 'loginContainer';
    this.appVariable.showLoading = false;
    this.roleList = [{ name: 'team-lead', value: "Team lead", roleId: 2 }, { name: 'front-end', value: "Front end developer", roleId: 2 }, { name: 'back-end', value: "Back end developer", roleId: 2 },
    { name: 'db', value: "Database developer", roleId: 2 }, { name: 'scrum-master', value: "Scrum master", roleId: 1 }, { name: 'product-owner', value: "Product owner", roleId: 2 }, { name: 'manager', value: "Manager", roleId: 2 }];
    this.selectedRole = this.roleList[0];
  }

  registerUser() {
    const docPath = `userInfo/${this.userInfo.userEmail}`;
    const userList = this.afs.collection('userInfo');
    const currentInstance = this;
    this.appVariable.showLoading = true;
    userList.doc(this.userInfo.userEmail).set(
      {
        'email': this.userInfo.userEmail,
        'displayName': this.userInfo.userDisplayName,
        'role': this.selectedRole
      }).then(function () { // Success - function
        // store user Info in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUserInfo', JSON.stringify({
          'email': currentInstance.userInfo.userEmail,
          'displayName': currentInstance.userInfo.userDisplayName,
          'role': currentInstance.selectedRole
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
          console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  }

  ngOnInit() {
    // To get meeting-id from URL
    this.meetingId = this.getUrlVars()["meetingId"];

    // If meetingId is existing then we can redirect to entry page
    if (this.meetingId !== undefined) {
      const currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
      if (currentInfoUser) {
        this.router.navigate(['landing']);
      } else {
        this.checkMeetingId(this.meetingId);
        this.router.navigate(['/login'], { queryParams: { meetingId: this.meetingId } });
      }
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
