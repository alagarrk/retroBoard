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
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  guid: string;
  userName: string;
  userDisplayName: string;
  userInfo: any = {};
  roleList: any = [];
  selectedRole: any = {};

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router,private appVariable: AppSharedService) {
    this.appVariable.showLoading = false;
    this.roleList = [{ name: 'team-lead', value: "Team lead", roleId: 2 }, { name: 'front-end', value: "Front end developer", roleId: 2 }, { name: 'back-end', value: "Back end developer", roleId: 2 },
    { name: 'db', value: "Database developer", roleId: 2 }, { name: 'scrum-master', value: "Scrum master", roleId: 1 }, { name: 'product-owner', value: "Product owner", roleId: 2 }, { name: 'manager', value: "Manager", roleId: 2 }];
    this.selectedRole = this.roleList[0];
  }

  registerUser() {
    const docPath = `userInfo/${this.userInfo.guid}`;
    const userList = this.afs.collection('userInfo');
    const currentInstance = this;
    this.appVariable.showLoading = true;
    userList.doc(this.userInfo.guid).set(
      {
        'guid': this.userInfo.guid,
        'displayName': this.userInfo.userDisplayName,
        'role': this.selectedRole
      }).then(function () { // Success - function
        // store user Info in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUserInfo', JSON.stringify({
          'guid': currentInstance.userInfo.guid,
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

  ngOnInit() {
    const currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    if (currentInfoUser) {
      this.router.navigate(['landing']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
