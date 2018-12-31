import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import * as _ from "lodash";
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HappinessScoreModalComponent } from '../components/modals/happiness-score-modal/happiness-score-modal.component';

import { SmileyRatingComponent } from '../components/smiley-rating/smiley-rating.component';

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
  editCommentInfo: any = [];
  showActionBox: boolean;
  isEditComment: boolean;
  meetingInfo: any = [];
  listObservable: any;
  constructor(private dragula: DragulaService, private afs: AngularFirestore, private modalService: BsModalService, private router: Router) {
    this.showAddCommentBox.wentWellList = false;
    this.comment = { "wentWellList": { commentDescription: '' }, "wentWrongList": { commentDescription: '' }, "needToImproveList": { commentDescription: '' } };
    this.categoryList = [{ name: 'wentWellList', value: "What went well?" }, { name: 'wentWrongList', value: "What went wrong?" }, { name: 'needToImproveList', value: "What need to improve?" }];
    this.commentType = [{ id: 0, url: 'assets/comment-image/010-brain.png', name: 'Idea/Research' }, { id: 1, url: 'assets/comment-image/008-meeting.png', name: 'Meeting' }, { id: 2, url: 'assets/comment-image/018-teacher.png', name: 'Mentoring' }, { id: 3, url: 'assets/comment-image/011-document.png', name: 'Document' },
    { id: 4, url: 'assets/comment-image/009-businesswoman.png', name: 'Business women' }, { id: 5, url: 'assets/comment-image/001-boss.png', name: 'Business men' }, { id: 6, url: 'assets/comment-image/004-megaphone.png', name: 'Announcement' },
    { id: 7, url: 'assets/comment-image/007-calendar-1.png', name: 'Calendar' }, { id: 8, url: 'assets/comment-image/003-puzzle.png', name: 'Team' }, { id: 9, url: 'assets/comment-image/013-trophy.png', name: 'Appreciation' },
    { id: 10, url: 'assets/comment-image/002-bank.png', name: 'Revenue' }, { id: 11, url: 'assets/comment-image/014-target.png', name: 'Target' }, { id: 12, url: 'assets/comment-image/012-goal.png', name: 'Release' }
    ];
    this.selectedCommentType = this.commentType[9];
    this.isEditComment = false;

  }

  toggleCommentTxtbx(categoryId, isEditComment) {
    this.comment[this.categoryList[categoryId].name].commentDescription = '';
    this.showAddCommentBox[this.categoryList[categoryId].name] = !this.showAddCommentBox[this.categoryList[categoryId].name];
    this.isEditComment = isEditComment;
  }

  // Show add comment modal popup
  addComments(event, categoryId) {
    let commentDesc = this.comment[this.categoryList[categoryId].name].commentDescription;
    if (commentDesc !== '') {  // if comment is not null
      this.showAddCommentBox[this.categoryList[categoryId].name] = false;
      commentDesc = commentDesc.slice(0, -1);
      console.log(`After trim${commentDesc}`);
      this.meetingInfo.collection('comments').add(
        {
          description: commentDesc,
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

  // Update existing comments with new values
  updateComments(event, categoryId) {
    let commentDesc = this.comment[this.categoryList[categoryId].name].commentDescription;
    if (commentDesc !== '') {  // if comment is not null
      this.showAddCommentBox[this.categoryList[categoryId].name] = false;
      commentDesc = commentDesc.slice(0, -1);
      // To update comments
      this.meetingInfo.collection("comments").doc(this.editCommentInfo.id).update({
        description: commentDesc,
        userInfo: this.currentInfoUser,
        commentType: this.selectedCommentType
      })
        .then(function () {
          event.stopImmediatePropagation();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  }

  //Edit commands - Event will trigger when clicks on edit icon
  editComments(categoryId, selectedComment) {
    this.toggleCommentTxtbx(categoryId, true);
    this.editCommentInfo = _.cloneDeep(selectedComment);
    this.selectedCommentType = this.commentType[selectedComment.commentType.id];
    this.comment[this.categoryList[categoryId].name].commentDescription = selectedComment.description;
  }

  openHappinessScoreModal() {
    // Show edit comments in modal popup
    const modal = this.modalService.show(HappinessScoreModalComponent, { class: 'modal-popup-style' });
    (<HappinessScoreModalComponent>modal.content).showHappinessScoreModal(this.currentInfoUser);
    (<HappinessScoreModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        //this.getCommentList();
      }
    });
  }

  //Delete command
  deleteComments(cmdId) {
    //this.afs.doc('comments/' + cmdId).delete();
    this.meetingInfo.collection('comments').doc(cmdId).delete();
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

    const projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
    this.meetingInfo = this.afs.collection("meetingInfo").doc(projectInfo.meetingId);

    // Add firestore listerner to watch the collection
    this.afs.firestore.collection("meetingInfo").doc(projectInfo.meetingId).collection('comments')
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