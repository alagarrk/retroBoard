import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { SmileyRatingComponent } from '../../../components/smiley-rating/smiley-rating.component';

@Component({
  selector: 'app-happiness-score-modal',
  templateUrl: './happiness-score-modal.component.html',
  styleUrls: ['./happiness-score-modal.component.css']
})
export class HappinessScoreModalComponent implements OnInit {
  happinessScore: any = {}; // To pass values from view to component
  currentInfoUser: any = [];
  public active: boolean = false;
  public userName: string;
  public guid: string;

  public onClose: Subject<boolean>;
  @ViewChild(SmileyRatingComponent) smileyModalData;

  // Constructor
  public constructor(
    private _bsModalRef: BsModalRef, private afs: AngularFirestore
  ) {
    const userInfoFromSS = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    this.happinessScore = userInfoFromSS.happinessScore ? userInfoFromSS.happinessScore : { 'feelDescription': '', score: 0 };
  }

  // Init method - onload
  public ngOnInit(): void {
    this.onClose = new Subject();

  }
  // showAddCommentsModal method - Trigger when modal opens
  public showHappinessScoreModal(currentInfoUser): void {
    this.currentInfoUser = currentInfoUser;
    this.active = true;
  }

  // Save comments method
  public saveHappinessScore(): void {
    const currentInstance = this;
    const userList = this.afs.collection('meetingInfo').doc(this.currentInfoUser.meetingId);
    this.currentInfoUser.happinessScore = this.currentInfoUser.happinessScore ? this.currentInfoUser.happinessScore : {};
    this.currentInfoUser.happinessScore = { "feelDescription": this.happinessScore.feelDescription, score: this.smileyModalData.userHappinessScore };  
    // To update comments
    userList.collection('userList').doc(this.currentInfoUser.email).update(this.currentInfoUser)
      .then(function () {
        currentInstance.active = false;
        sessionStorage.setItem('currentUserInfo', JSON.stringify(currentInstance.currentInfoUser));
        currentInstance.onClose.next(true);
        currentInstance._bsModalRef.hide();
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  public onCancel(): void {
    this.active = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next(null);
    this._bsModalRef.hide();
  }

}
