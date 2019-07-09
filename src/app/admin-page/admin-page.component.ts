import { DatePipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppSharedService } from '../../shared.service';
import * as _ from "lodash";

import 'rxjs/add/operator/map';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CreateMeetingModalComponent } from '../components/modals/create-meeting-modal/create-meeting-modal.component';
import { ConfirmationModalComponent } from '../components/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})

@Pipe({
  name: 'dateFormat'
})
export class AdminPageComponent implements OnInit {
  userInfo: any = {};
  currentInfoUser: any = [];
  adminUserInfo: any = [];
  projectName: string;
  currentSprint: string;
  totalTeamCount: string;
  selectedTheme: any = {};
  themeOptions: any = [];

  retroList: any = [];
  retroLink: string;
  dynamicUrlInfo: string;
  showRetroLink: boolean = false;
  showLoadingBar: boolean = true;
  loggedInUserMeetingCount:number;

  constructor(private router: Router, private afs: AngularFirestore, private sharedVariable: AppSharedService, private modalService: BsModalService) {
    const isLocal = false;
    this.showLoadingBar = true;
    this.dynamicUrlInfo = isLocal ? 'localhost:4200' : 'codevaders.com/index.html#';
  }

  // Show create retrospective modal popup
  openCreateRetroModal() {
    // Show edit comments in modal popup
    const modal = this.modalService.show(CreateMeetingModalComponent, { class: 'create-meeting-style' });
    (<CreateMeetingModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        //this.getCommentList();
      }
    });
  }

  // Delete retro meeting
  deleteRetroMeeting(id) {
    // Show edit comments in modal popup
    const modal = this.modalService.show(ConfirmationModalComponent, { class: 'delete-confirmation-modal' });
    (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.afs.firestore.collection("meetingInfo").doc(id).delete();
      }
    });

  }

  // Init method - onload
  public ngOnInit(): void {
    const _this = this;
    _this.retroList = [];
    this.loggedInUserMeetingCount = 0;
    this.adminUserInfo = JSON.parse(sessionStorage.getItem('adminUserInfo'));
    if (this.adminUserInfo) {
      // Add firestore listerner to watch the collection
      this.afs.firestore.collection("meetingInfo")
        .onSnapshot(function (querySnapshot) {
          var tempList = [];
          var createdByCount = 0;
          querySnapshot.forEach(function (doc) {
            const data = doc.data();
            data.id = doc.id;
            createdByCount = (data.createdBy.email === _this.adminUserInfo.email) ? (createdByCount + 1) : createdByCount;
            tempList.push(data);
          }
        );
          _this.retroList = _.cloneDeep(tempList);
          _this.loggedInUserMeetingCount =_.cloneDeep(createdByCount); 
          _this.showLoadingBar = false;
        });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
