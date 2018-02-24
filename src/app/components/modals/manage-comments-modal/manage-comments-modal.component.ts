import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-manage-comments-modal',
  templateUrl: './manage-comments-modal.component.html',
  styleUrls: ['./manage-comments-modal.component.css']
})
export class ManageCommentsModalComponent implements OnInit {
  comment: any = {}; // To pass values from view to component
  currentInfoUser: any = [];
  public active: boolean = false;
  public userName: string;
  public guid: string;
  public isEditMode: boolean = false;


  public onClose: Subject<boolean>;
  public categoryList: any = [];
  public selectedComment: any = [];
  public selectedCategory: any = {};

  // Constructor
  public constructor(
    private _bsModalRef: BsModalRef, private afs: AngularFirestore
  ) {
    this.categoryList = [{ name: 'wentWellList', value: "What went well?" }, { name: 'wentWrongList', value: "What went wrong?" }, { name: 'needToImproveList', value: "What need to improve?" }];
    this.selectedCategory = this.categoryList[0];
    this.isEditMode = false;
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

  // editCommentsModal method - Trigger when modal opens
  public editCommentsModal(currentInfoUser, selectedComment): void {
    this.selectedComment = selectedComment;
    this.comment.commentTitle = selectedComment.title;

    this.comment.commentDescription = selectedComment.description;
    this.selectedCategory = selectedComment.category;
    this.currentInfoUser = currentInfoUser;
    this.active = true;
    this.isEditMode = true;
  }

  // Save comments method
  public saveComments(): void {
    const currentInstance = this;
    this._bsModalRef.hide();
    if (!this.isEditMode) {
      // To add new comments
      this.afs.collection('comments').add(
        {
          title: this.comment.commentTitle,
          description: this.comment.commentDescription,
          likes: 0,
          currentLikeStatus: {
            userLikesList: [], selfStatus: false
          },
          category: this.selectedCategory,
          userInfo: this.currentInfoUser
        })
        .then(function () {
          currentInstance.active = false;
          currentInstance.onClose.next(true);

        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    else {
      // To update comments
      this.afs.collection("comments").doc(this.selectedComment.id).update({
        title: this.comment.commentTitle,
        description: this.comment.commentDescription,
        category: this.selectedCategory,
        userInfo: this.currentInfoUser
      })
        .then(function () {
          currentInstance.active = false;
          currentInstance.onClose.next(true);
          //currentInstance._bsModalRef.hide();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
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
