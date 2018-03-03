import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import * as _ from "lodash";

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
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent {
  commentsCol: AngularFirestoreCollection<Comment>;
  commentList: any;
  currentInfoUser: any = [];
  commentDescription: string;
  public categoryList: any = [];
  comment: any = {}; // To pass values from view to component

  // Three categories of data
  wentWellList: any = [];
  wentWrongList: any = [];
  needToImproveList: any = [];
  showAddCommentBox: any = {};

  listObservable: any;
  constructor(private afs: AngularFirestore, private modalService: BsModalService, private router: Router) {
    this.showAddCommentBox.wentWellList = false;
    this.comment = { "wentWellList":{ commentDescription: '' }, "wentWrongList":{ commentDescription: '' }, "needToImproveList":{ commentDescription: '' }};
    this.categoryList = [{ name: 'wentWellList', value: "What went well?" }, { name: 'wentWrongList', value: "What went wrong?" }, { name: 'needToImproveList', value: "What need to improve?" }];
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
  editComments(selectedComment) {
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
    const findUserIndex = _.indexOf(comment.currentLikeStatus.userLikesList, this.currentInfoUser.guid);
    if (findUserIndex >= 0 && comment.currentLikeStatus.selfStatus) {
      comment.currentLikeStatus.userLikesList.splice(findUserIndex, 1);
    } else {
      comment.currentLikeStatus.userLikesList.push(this.currentInfoUser.guid);
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
          const isExist = _.includes(data.currentLikeStatus.userLikesList, _this.currentInfoUser.guid);
          data.currentLikeStatus.selfStatus = isExist;
          _this[data['category']['name']].push(data);
        });
      });
  }
}