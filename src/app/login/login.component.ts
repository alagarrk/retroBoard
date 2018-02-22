import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  guid: string;
  userName: string;
  userDisplayName: string;
  userInfo: any = {};
  roleList: any = [];
  selectedRole: any = {};

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router) {
    this.roleList = [{ name: 'team-lead', value: "Team lead" }, { name: 'front-end', value: "Front end developer" }, { name: 'back-end', value: "Back end developer" },
    { name: 'db', value: "Database developer" }, { name: 'scrum-master', value: "Scrum master" }, { name: 'product-owner', value: "Product owner" }, { name: 'manager', value: "Manager" }];
    this.selectedRole = this.roleList[0];
  }

  registerUser() {
    const docPath = `userInfo/${this.userInfo.guid}`;
    const userList = this.afs.collection('userInfo');
    const currentInstance = this;

    userList.doc(this.userInfo.guid).set(
      {
        'guid': this.userInfo.guid,
        'displayName': this.userInfo.userDisplayName,
        'role': this.selectedRole
      }).then(function () { // Success - function
        // store user Info in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUserInfo', JSON.stringify({
          'guid': currentInstance.userInfo.guid,
          'displayName': currentInstance.userInfo.userDisplayName,
          'role': currentInstance.selectedRole
        }));
        currentInstance.router.navigate(['landing']);
      })
      .catch(function (error) { // If there is any issue
        console.error("Error writing document: ", error);
      });
  }

  ngOnInit() {
    const currentInfoUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    if (currentInfoUser) {
      this.router.navigate(['landing']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
