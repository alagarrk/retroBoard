import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AppSharedService } from '../../shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  userInfo: any = {};
  projectName: string;
  currentSprint: string;
  totalTeamCount: string;

  retroLink: string;
  showRetroLink: boolean = false;

  constructor(private afs: AngularFirestore, private sharedVariable: AppSharedService) {
    this.projectName = "test";

  }

  scheduleMeeting() {
    const _this = this;
    this.sharedVariable.showLoading = true;
    // To add new comments
    this.afs.collection('meetingInfo').add(
      {
        project: this.userInfo.projectName,
        sprint: this.userInfo.currentSprint,
        teamCount: this.userInfo.totalTeamCount
      })
      .then(function (docRef) {
        _this.sharedVariable.showLoading = false;
        _this.showRetroLink = true;
        _this.retroLink = `http://localhost:4200/login?meetingId=${docRef.id}`;
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }
  goToLogin(){
    window.location.href = this.retroLink;
  }

  ngOnInit() {
  }

}
