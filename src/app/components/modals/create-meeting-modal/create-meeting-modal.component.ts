import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AppSharedService } from '../../../../shared.service';
import 'rxjs/add/operator/map';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { SmileyRatingComponent } from '../../../components/smiley-rating/smiley-rating.component';

@Component({
  selector: 'app-create-meeting-modal',
  templateUrl: './create-meeting-modal.component.html',
  styleUrls: ['./create-meeting-modal.component.css']
})
export class CreateMeetingModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  userInfo: any = {};
  projectName: string;
  currentSprint: string;

  totalTeamCount: string;
  selectedTheme: any = {};
  themeOptions: any = [];

  retroLink: string;
  dynamicUrlInfo: string;
  showRetroLink: boolean = false;
  copyButtonText: string;

  // Constructor
  public constructor(private _bsModalRef: BsModalRef, private sharedVariable: AppSharedService, private afs: AngularFirestore) {
    const isLocal = false;
    this.dynamicUrlInfo = isLocal ? 'localhost:4200' : 'codevaders.com/index.html#';
    this.themeOptions = [
      { id: 0, name: `Start,Stop & Continue format` },
      { id: 1, name: 'Appreciation - Kudo card format' }
    ];
    this.selectedTheme = this.themeOptions[0];
    this.copyButtonText = "COPY";
  }

  // Schedule meeting
  scheduleMeeting() {
    const _this = this;
    this.sharedVariable.showLoading = true;
    // To add new comments
    this.afs.collection('meetingInfo').add(
      {
        project: this.userInfo.projectName,
        sprint: this.userInfo.currentSprint,
        teamCount: this.userInfo.totalTeamCount,
        retroTheme: this.selectedTheme,
        createdDate: new Date(),
        createdBy: {
          'name': 'Alagar Raja',
          'email': 'alagar.success@gmail.com', 
          'role': 'Scrum master'
        }
      })
      .then(function (docRef) {
        _this.sharedVariable.showLoading = false;
        _this.showRetroLink = true;
        _this.retroLink = `http://${_this.dynamicUrlInfo}/landing?meetingId=${docRef.id}`;
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  // Copy text to board
  copyTextBoard() {
    /* Select the text field */
    $('#retroLink').select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    this.copyButtonText = "COPIED";
  }

  // Close modal popup
  public onCancel(): void {
    this.showRetroLink = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  // Close modal popup
  public hideConfirmationModal(): void {
    this.showRetroLink = false;
    this.onClose.next(null);
    this._bsModalRef.hide();
  }

  // Init method - onload
  public ngOnInit(): void {
    const _this = this;
    this.onClose = new Subject();
  }

}
