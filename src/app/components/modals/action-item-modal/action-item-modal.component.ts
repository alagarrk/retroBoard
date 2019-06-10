import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { SmileyRatingComponent } from '../../../components/smiley-rating/smiley-rating.component';

@Component({
  selector: 'app-action-item-modal',
  templateUrl: './action-item-modal.component.html',
  styleUrls: ['./action-item-modal.component.css']
})
export class ActionItemModalComponent implements OnInit {
  happinessScore: any = {}; // To pass values from view to component
  currentInfoUser: any = [];
  public active: boolean = false;
  public isHighlightComment: boolean = false;
  
  public showNewActionItem: boolean = false;
  public userName: string;
  public guid: string;
  public retroHistory: any = [];

  public selectedRetroHistory: any = [];
  public projectInfo: any = [];
  public actionItemList: any = [];

  public newActionItem: any = [];
  public meetingInfo: any = [];

  public commentList: any = [];
  public usersList: any = [];
  public priorityList: any = [];
  public statusList: any = [];

  public selectedComment: any = {};
  public selectedUser: any = {};
  public selectedPriority: any = {};
  public selectedStatus: any = {};

  public newDate = new Date();
  public onClose: Subject<boolean>;
  @ViewChild(SmileyRatingComponent) smileyModalData;

  // Constructor
  public constructor(
    private _bsModalRef: BsModalRef, private afs: AngularFirestore
  ) {
    const userInfoFromSS = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    this.happinessScore = userInfoFromSS.happinessScore ? userInfoFromSS.happinessScore : { feelDescription: '', score: 3, name: '' };
    // Display - Current sprint -- Temp solution
    this.projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
    this.retroHistory = [{ id: 0, name: `${this.projectInfo.project} -  Sprint ${this.projectInfo.sprint}` }];
    this.selectedRetroHistory = this.retroHistory[0];

    // Action Item list
    this.priorityList = [{ id: 0, name: "Low", priority: 1 }, { id: 1, name: "Medium", priority: 2 }, { id: 2, name: "High", priority: 3 }];
    this.statusList = [{ id: 0, name: "Assigned" }, { id: 1, name: "Inprogress" }, { id: 2, name: "Completed" }, { id: 3, name: "Blocked" }];
  }

  // showAddCommentsModal method - Trigger when modal opens
  public showHappinessScoreModal(currentInfoUser): void {
    this.currentInfoUser = currentInfoUser;
    this.active = true;
  }

  // Add new action item
  public toggleNewItem(isShow): void {
    // To reset edit mode
    this.actionItemList.forEach((el) => { el.isEditMode = false; });
    this.isHighlightComment = false;
    this.resetActionItemValues();
    this.showNewActionItem = isShow;
  }

  // Reset action item values
  public resetActionItemValues(): void {
    this.newActionItem = { actionItem: '', createdDate: '', owner: '', priority: '' };
    // Set default selected values for dropdowns
    this.selectedComment = this.commentList.length > 0 ? this.commentList[0] : {};
    this.selectedUser = this.usersList.length > 0 ? this.usersList[0] : {};
    this.selectedPriority = this.priorityList[0];
    this.selectedStatus = this.statusList[0];
  }

  // Save - New action item
  public addActionItem(): void {
    const _this = this;
    // Add new items
    _this.actionItemList = [];
    // To reset edit mode
    this.actionItemList.forEach((el) => { el.isEditMode = false; });

    if (Object.keys(this.selectedComment).length > 0) {
      _this.showNewActionItem = false;
      this.meetingInfo.collection('actionItems').add(
        {
          comment: this.selectedComment,
          owner: this.selectedUser,
          priority: this.selectedPriority,
          createdDate: new Date(),
          status: this.selectedStatus
        })
        .then(function () {
          event.stopImmediatePropagation();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else{
      this.isHighlightComment = true;
    }
  }

  // Update - Existing action item
  updateActionItem(event, actionItem) {
    const _this = this;
    // Add new items
    _this.actionItemList = [];
    _this.showNewActionItem = false;
    // To reset edit mode
    this.actionItemList.forEach((el) => { el.isEditMode = false; });
    this.meetingInfo.collection("actionItems").doc(actionItem.id).update({
      comment: this.selectedComment,
      owner: this.selectedUser,
      priority: this.selectedPriority,
      createdDate: new Date(),
      status: this.selectedStatus
    }).then(function () {
      event.stopImmediatePropagation();
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }


  // To delete action item
  deleteActionItem(itemId) {
    this.meetingInfo.collection('actionItems').doc(itemId).delete();
  }

  // Get comments list - To list in dropdown
  public getCommentsList(): void {
    const _this = this;
    // Add firestore listerner to watch the collection
    this.afs.firestore.collection("meetingInfo").doc(this.projectInfo.meetingId).collection('comments')
      .onSnapshot(function (querySnapshot) {
        _this.commentList = [];
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.id = doc.id;
          _this.commentList.push(data);
        });
      });
  }

  // Get users list - To list in dropdown
  public getUsersList(): void {
    const _this = this;

    // Add firestore listerner to watch the collection
    this.afs.firestore.collection("meetingInfo").doc(this.projectInfo.meetingId).collection('userList')
      .onSnapshot(function (querySnapshot) {
        _this.usersList = [];
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.id = doc.id;
          _this.usersList.push(data);
        });
      });
  }

  // Close modal popup
  public onCancel(): void {
    this.active = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  // Close modal popup
  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next(null);
    this._bsModalRef.hide();
  }

  // Edit action item in the list
  public editActionItem(actionItem): void {
    this.showNewActionItem = false;
    this.actionItemList.forEach((el) => { el.isEditMode = false; });
    // Set default selected values for dropdowns
    this.selectedComment = actionItem.comment;
    this.selectedUser = actionItem.owner;
    this.selectedStatus = actionItem.status;
    this.selectedPriority = actionItem.priority;

    // Get - Add Comment/User/ActionItem list
    this.getCommentsList();
    this.getUsersList();
    setTimeout(function () {
      actionItem.isEditMode = !actionItem.isEditMode;
    }, 100);
  }

  // To set default value for dropdown list
  compareFn(a, b) {
    return a && b && a.id == b.id;
  }

  // Init method - onload
  public ngOnInit(): void {
    const _this = this;
    this.onClose = new Subject();
    this.meetingInfo = this.afs.collection("meetingInfo").doc(this.projectInfo.meetingId);
    // Add firestore listerner to watch the collection
    this.afs.firestore.collection("meetingInfo").doc(this.projectInfo.meetingId).collection('actionItems')
      .onSnapshot(function (querySnapshot) {
        _this.actionItemList = [];
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.id = doc.id;
          _this.actionItemList.push(data);
        });
      });

    // Get - Add Comment/User/ActionItem list
    this.getCommentsList();
    this.getUsersList();
    this.resetActionItemValues();
  }

}
