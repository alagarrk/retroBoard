import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import * as _ from "lodash";
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageCommentsModalComponent } from '../components/modals/manage-comments-modal/manage-comments-modal.component';

interface Comment {
  userName: string;
  title: string;
  comments: string;
}
interface cmdId extends Comment {
  id: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent {
  commentsCol: AngularFirestoreCollection<Comment>;
  commentList: any;
  currentInfoUser: any = [];
  commentType: any = [];

  commentDescription: string;
  public categoryList: any = [];
  comment: any = {}; // To pass values from view to component

  // Three categories of data
  wentWellList: any = [];
  wentWrongList: any = [];
  needToImproveList: any = [];
  showAddCommentBox: any = {};
  selectedCommentType: any = {};
  showActionBox: boolean;
 
  listObservable: any;
 
   
 
  constructor(private dragula: DragulaService, private afs: AngularFirestore, private modalService: BsModalService, private router: Router) {
    this.showAddCommentBox.wentWellList = false;
    this.comment = { "wentWellList": { commentDescription: '' }, "wentWrongList": { commentDescription: '' }, "needToImproveList": { commentDescription: '' } };
    this.categoryList = [{ name: 'wentWellList', value: "What went well?" }, { name: 'wentWrongList', value: "What went wrong?" }, { name: 'needToImproveList', value: "What need to improve?" }];
    this.commentType = [{ id: 0, url: 'assets/comment-image/010-brain.png', name: 'Idea/Research' }, { id: 1, url: 'assets/comment-image/008-meeting.png', name: 'Meeting' }, { id: 2, url: 'assets/comment-image/018-teacher.png', name: 'Mentoring' },{ id: 3, url: 'assets/comment-image/011-document.png', name: 'Document' },
    { id: 4, url: 'assets/comment-image/009-businesswoman.png', name: 'Business women' }, { id: 5, url: 'assets/comment-image/001-boss.png', name: 'Business men' }, { id: 6, url: 'assets/comment-image/004-megaphone.png', name: 'Announcement' },
    { id: 7, url: 'assets/comment-image/007-calendar-1.png', name: 'Calendar' }, { id: 8, url: 'assets/comment-image/003-puzzle.png', name: 'Team' }, { id: 9, url: 'assets/comment-image/013-trophy.png', name: 'Appreciation' },
    { id: 10, url: 'assets/comment-image/002-bank.png', name: 'Revenue' }, { id: 11, url: 'assets/comment-image/014-target.png', name: 'Target' }, { id: 12, url: 'assets/comment-image/012-goal.png', name: 'Release' }
    ];
    this.selectedCommentType = this.commentType[9];
   
  }

  toggleCommentTxtbx(categoryId) {
    this.comment[this.categoryList[categoryId].name].commentDescription = '';
    this.showAddCommentBox[this.categoryList[categoryId].name] = !this.showAddCommentBox[this.categoryList[categoryId].name];
  }

  // Show add comment modal popup
  addComments(event, categoryId) {
    const _this = this;
    if (this.comment[this.categoryList[categoryId].name].commentDescription !== '') {  // if comment is not null
      this.showAddCommentBox[this.categoryList[categoryId].name] = false;
      this.afs.collection('comments').add(
        {
          description: this.comment[this.categoryList[categoryId].name].commentDescription,
          likes: 0,
          commentType: this.selectedCommentType,
          currentLikeStatus: {
            userLikesList: [], selfStatus: false
          },
          category: this.categoryList[categoryId],
          userInfo: this.currentInfoUser
        })
        .then(function () {
          event.stopImmediatePropagation();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  }

  //Edit commands
  editComments(categoryId, selectedComment) {
    const modal = this.modalService.show(ManageCommentsModalComponent, { class: 'modal-popup-style' });
    (<ManageCommentsModalComponent>modal.content).editCommentsModal(this.currentInfoUser, selectedComment);
    (<ManageCommentsModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        //this.getCommentList();
      }
    });
  }
  //Delete command
  deleteComments(cmdId) {
    this.afs.doc('comments/' + cmdId).delete();
  }

  //update likes count
  updateLikes(comment, isLike) {
    const likesCount = this.afs.collection("comments").doc(comment.id);
    const _this = this;
    // To userLikesList - check user exist or not and update the values
    const findUserIndex = _.indexOf(comment.currentLikeStatus.userLikesList, this.currentInfoUser.email);
    if (findUserIndex >= 0 && comment.currentLikeStatus.selfStatus) {
      comment.currentLikeStatus.userLikesList.splice(findUserIndex, 1);
    } else {
      comment.currentLikeStatus.userLikesList.push(this.currentInfoUser.email);
    }
    comment.currentLikeStatus.selfStatus = isLike;
    comment.likes = isLike ? comment.likes + 1 : comment.likes - 1;

    // Update "likes" field value
    return likesCount.update(comment)
      .then(function () {
        //_this.getCommentList();
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  // Init function
  ngOnInit() {
    const _this = this;
    this.currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    if (this.currentInfoUser) {
      this.router.navigate(['landing']);
    } else {
      this.router.navigate(['login']);
    }

    // Add firestore listerner to watch the collection
    this.afs.firestore.collection('comments')
      .onSnapshot(function (querySnapshot) {
        _this.wentWellList = [];
        _this.wentWrongList = [];
        _this.needToImproveList = [];
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          data.id = doc.id;
          const isExist = _.includes(data.currentLikeStatus.userLikesList, _this.currentInfoUser.email);
          data.showActionBox = false;
          data.currentLikeStatus.selfStatus = isExist;
          _this[data['category']['name']].push(data);
        });
      });
  }
}