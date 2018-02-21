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

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router) {
  }

  registerUser() {
    const docPath = `userInfo/${this.guid}`;
    const userList = this.afs.collection('userInfo');
    const currentInstance = this;

    userList.doc(this.guid).set(
      {
        'guid': this.guid,
        'displayName': this.userDisplayName,
        'projectName': 'apex'
      }).then(function () { // Success - function
        currentInstance.router.navigate(['landing']);
      })
      .catch(function (error) { // If there is any issue
        console.error("Error writing document: ", error);
      });
  }

  ngOnInit() {
  }

}
