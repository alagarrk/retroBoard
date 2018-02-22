import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-add-comments-modal',
  templateUrl: './add-comments-modal.component.html',
  styleUrls: ['./add-comments-modal.component.css']
})
export class AddCommentsModalComponent implements OnInit {
  comment: any = {}; // To pass values from view to component
  currentInfoUser: any = [];
  public active: boolean = false;
  public userName: string;
  public guid: string;

  public onClose: Subject<boolean>;

  public categoryList: any = [];
  public selectedCategory: any = {};
  public constructor(
    private _bsModalRef: BsModalRef, private afs: AngularFirestore
  ) {
    this.categoryList = [{ name: 'wentWellList', value: "What went well?" }, { name: 'wentWrongList', value: "What went wrong?" }, { name: 'needToImproveList', value: "What need to improve?" }];
    this.selectedCategory = this.categoryList[0];
  }

  // Init method - onload
  public ngOnInit(): void {
    this.onClose = new Subject();

  }
  // showAddCommentsModal method - Trigger when modal opens
  public showAddCommentsModal(currentInfoUser): void {
    this.currentInfoUser = currentInfoUser;
    this.active = true;
  }

  // Save comments method
  public saveComments(): void {
    const currentInstance = this;
    this.afs.collection('comments').add(
      {
        title: this.comment.commentTitle,
        description: this.comment.commentDescription,
        likes: 0,
        category: this.selectedCategory,
        userInfo: this.currentInfoUser
      })
      .then(function () {
        currentInstance.active = false;
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
