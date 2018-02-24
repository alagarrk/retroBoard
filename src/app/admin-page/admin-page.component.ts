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
  projectList: any = [];
  sprintList: any = [];

  selectedProject: any = {};
  selectedSprint: any = {};

  retroLink: string;
  showRetroLink: boolean = false;

  constructor(private afs: AngularFirestore,private sharedVariable: AppSharedService) {
    this.projectList = [{ displayName: "Apex", field: "apex" }, { displayName: "PX", field: "px" }];
    this.sprintList = [{ displayName: "Sprint 1", field: "sprint1" }, { displayName: "Sprint 2", field: "sprint2" },
    { displayName: "Sprint 3", field: "sprint3" }];
    this.selectedProject = this.projectList[0];
    this.selectedSprint = this.sprintList[0];
  }

  scheduleMeeting() {
    const _this = this;
    this.sharedVariable.showLoading = true;
    // To add new comments
    this.afs.collection('meetingInfo').add(
      {
        project: this.selectedProject,
        sprint: this.selectedSprint
      })
      .then(function (docRef) {
        _this.sharedVariable.showLoading = false;
        _this.showRetroLink = true;
        _this.retroLink = `http://localhost:4200/login?${docRef.id}`;

      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  ngOnInit() {
  }

}
