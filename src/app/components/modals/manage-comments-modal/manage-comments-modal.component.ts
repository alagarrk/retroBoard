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
  selectedCommentType: any = {};
  commentType: any = [];

  public onClose: Subject<boolean>;
  public categoryList: any = [];
  public selectedComment: any = [];
  public selectedCategory: any = {};

  // Constructor
  public constructor(
    private _bsModalRef: BsModalRef, private afs: AngularFirestore
  ) {
    this.commentType = [{ id: 0, url: 'assets/comment-image/010-brain.png', name: 'Idea/Research' }, { id: 1, url: 'assets/comment-image/008-meeting.png', name: 'Meeting' }, { id: 2, url: 'assets/comment-image/018-teacher.png', name: 'Mentoring' }, { id: 3, url: 'assets/comment-image/011-document.png', name: 'Document' },
    { id: 4, url: 'assets/comment-image/009-businesswoman.png', name: 'Business women' }, { id: 5, url: 'assets/comment-image/001-boss.png', name: 'Business men' }, { id: 6, url: 'assets/comment-image/004-megaphone.png', name: 'Announcement' },
    { id: 7, url: 'assets/comment-image/007-calendar-1.png', name: 'Calendar' }, { id: 8, url: 'assets/comment-image/003-puzzle.png', name: 'Team' }, { id: 9, url: 'assets/comment-image/013-trophy.png', name: 'Appreciation' },
    { id: 10, url: 'assets/comment-image/002-bank.png', name: 'Revenue' }, { id: 11, url: 'assets/comment-image/014-target.png', name: 'Target' }, { id: 12, url: 'assets/comment-image/012-goal.png', name: 'Release' }
    ];
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
    this.selectedCommentType = this.commentType[selectedComment.commentType.id];

    this.comment.commentDescription = selectedComment.description;
    this.currentInfoUser = currentInfoUser;
    this.active = true;
    this.isEditMode = true;
  }

  // Save comments method
  public saveComments(): void {
    const currentInstance = this;
    this._bsModalRef.hide();

    // To update comments
    this.afs.collection("comments").doc(this.selectedComment.id).update({
      description: this.comment.commentDescription,
      userInfo: this.currentInfoUser,
      commentType: this.selectedCommentType
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
