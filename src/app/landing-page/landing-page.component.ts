import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import * as _ from "lodash";
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HappinessScoreModalComponent } from '../components/modals/happiness-score-modal/happiness-score-modal.component';
import { AddKudosModalComponent } from '../components/modals/add-kudos/add-kudos.component';

import { SmileyRatingComponent } from '../components/smiley-rating/smiley-rating.component';
import { ActionItemModalComponent } from '../components/modals/action-item-modal/action-item-modal.component';

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
  showMoreInfo: boolean;
  meetingId: string;
  // Id = 0; Start, Stop & Continue theme
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

  // Id = 1; Kudo card theme
  kudosTitle: string;
  kudosMessage: string;
  kudoImageType: any = [];

  addKudos: any = {};
  showAddKudoCard: boolean;
  kudoCardList: any = [];

  selectedKudoCardType: any = {};
  meetingInfo: any = [];
  listObservable: any;
  projectInfo: any = [];

  constructor(private dragula: DragulaService, private afs: AngularFirestore, private modalService: BsModalService, private router: Router) {
    this.showMoreInfo = false;
  }
  // Show Happiness score modal popup
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

  // Kudo card theme - Starts
  initKudoThemeVariable() {
    this.showAddKudoCard = false;
    this.addKudos = {
      kudosTitle: 'Keep smile',
      kudosMessage: ''
    };
    this.kudoImageType = [{ id: 0, url: 'assets/kudo-card-image/care.png', name: 'Care' }, { id: 1, url: 'assets/kudo-card-image/creative.png', name: 'Creative' }, { id: 2, url: 'assets/kudo-card-image/teacher.png', name: 'Mentoring' }, { id: 3, url: 'assets/kudo-card-image/crown.png', name: 'Crown' },
    { id: 4, url: 'assets/kudo-card-image/gift.png', name: 'Gift' }, { id: 5, url: 'assets/kudo-card-image/heart.png', name: 'Heart' }, { id: 6, url: 'assets/kudo-card-image/kiss.png', name: 'Kiss' },
    { id: 7, url: 'assets/kudo-card-image/podium.png', name: 'Podium' }, { id: 8, url: 'assets/kudo-card-image/reward.png', name: 'Reward' }, { id: 9, url: 'assets/kudo-card-image/support.png', name: 'Support' },
    { id: 10, url: 'assets/kudo-card-image/team.png', name: 'Team work' }, { id: 11, url: 'assets/kudo-card-image/trophy.png', name: 'Trophy' }, { id: 12, url: 'assets/kudo-card-image/winner.png', name: 'Winner' }
    ];
    this.selectedKudoCardType = this.kudoImageType[0];
  }

  // Show Happiness score modal popup
  openAddKudosModal() {
    // Show edit comments in modal popup
    const modal = this.modalService.show(AddKudosModalComponent, { class: 'modal-popup-style' });
    (<AddKudosModalComponent>modal.content).showAddCommentsModal(this.currentInfoUser);
    (<AddKudosModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        //this.getCommentList();
      }
    });
  }

  // Toggle add kudo card
  toggleAddKudoCard(isShow) {
    this.initKudoThemeVariable();
    this.showAddKudoCard = isShow;
  }

  // Add new kudo card into db
  addKudoCard(event) {
    let kudoMessage = this.addKudos.kudosMessage.slice(0, -1);
    if (kudoMessage !== "") {  // if comment is not null
      this.showAddKudoCard = false;
      kudoMessage =
        this.meetingInfo.collection('comments').add(
          {
            description: kudoMessage,
            likes: 0,
            kudoCardType: this.selectedKudoCardType,
            currentLikeStatus: {
              userLikesList: [], selfStatus: false
            },
            title: this.addKudos.kudosTitle,
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

  // Delete kudo card
  deleteKudoCard(cardId) {
    //this.afs.doc('comments/' + cmdId).delete();
    this.meetingInfo.collection('comments').doc(cardId).delete();
  }

  // Kudo card theme - Ends


  // Start, Stop & Continue theme - Starts
  // To initialize variables
  initSCThemeVariable() {
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

  // Toggle comment box
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

  //Delete command
  deleteComments(cmdId) {
    //this.afs.doc('comments/' + cmdId).delete();
    this.meetingInfo.collection('comments').doc(cmdId).delete();
  }

  //update likes count
  updateLikes(comment, isLike) {
    const likesCount = this.meetingInfo.collection("comments").doc(comment.id);
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
  // Start, Stop & Continue theme - Ends

  showActionItemList() {
    // Show edit comments in modal popup
    const modal = this.modalService.show(ActionItemModalComponent, { class: 'ai-modal-popup-style' });
    (<ActionItemModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        //this.getCommentList();
      }
    });
  }

  // Read a page's GET URL variables and return them as an associative array.
  getUrlVars() {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  /* To check meeting is exist or not. Also get meeting information */
  checkMeetingId(meetingId) {
    //const _this = this;
    let meetingRef = this.afs.firestore.collection('meetingInfo').doc(meetingId);
    let getDoc = meetingRef.get()
      .then(doc => {
        if (!doc.exists) {
          this.router.navigate(['/login']);
        } else {
          // To get project information and store it in sessionStorage
          let projectInfo = doc.data();
          this.meetingId = meetingId;
          projectInfo['meetingId'] = meetingId;
          sessionStorage.setItem('projectInfo', JSON.stringify(projectInfo));
          // // Id = 0; Start, Stop & Continue theme
          if (projectInfo.retroTheme.id === 0) {
            this.initSCThemeVariable();
          } else if (projectInfo.retroTheme.id === 1) {
            this.initKudoThemeVariable();
          }

          this.projectInfo = _.cloneDeep(projectInfo);
          this.meetingInfo = this.afs.collection("meetingInfo").doc(this.projectInfo.meetingId);
          // To get retro comment list
          this.getRetroCommentInfo();
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  }

  // To get retro comments list
  getRetroCommentInfo() {
    const _this = this;
    // Add firestore listerner to watch the collection
    this.afs.firestore.collection("meetingInfo").doc(this.projectInfo.meetingId).collection('comments')
      .onSnapshot(function (querySnapshot) {
        _this.wentWellList = [];
        _this.wentWrongList = [];
        _this.needToImproveList = [];
        _this.kudoCardList = [];
        querySnapshot.forEach(function (doc) {
          // Id = 0; Start, Stop & Continue theme 
          if (_this.projectInfo.retroTheme.id === 0) {
            const data = doc.data();
            data.id = doc.id;
            const isExist = _.includes(data.currentLikeStatus.userLikesList, _this.currentInfoUser.email);
            data.showActionBox = false;
            data.currentLikeStatus.selfStatus = isExist;
            _this[data['category']['name']].push(data);
          } else if (_this.projectInfo.retroTheme.id === 1) {
            const data = doc.data();
            data.id = doc.id;
            _this.kudoCardList.push(data);
          }
        });
      });
  }

  // Init function
  ngOnInit() {
    const _this = this;
    // To get meeting-id from URL
    this.meetingId = this.getUrlVars()["meetingId"];

    // If meetingId is existing then we can redirect to entry page
    if (this.meetingId !== undefined) {
      this.checkMeetingId(this.meetingId);
      const userList = this.afs.collection("meetingInfo").doc(this.meetingId);
      // To generate random users
      this.currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
      if (!this.currentInfoUser) {
        const dynamicUser = {
          'userid': `testUser_${Math.floor((1 + Math.random()) * 0x100)}`,
          'email': `testuser.${Math.floor((1 + Math.random()) * 0x100)}@retro.com`,
          'displayName': `TestUser_${Math.floor((1 + Math.random()) * 0x100)}`,
          'role': 'Team member',
          'meetingId': this.meetingId
        };
        // Insert dynamic user details in UserList Table 
        userList.collection('userList').doc(dynamicUser.email).set(
          {
            'email': dynamicUser.email,
            'displayName': dynamicUser.displayName,
            'role': dynamicUser.role
          }).then(function () { // Success - function
            // store user Info in local storage to keep user logged in between page refreshes

            sessionStorage.setItem('currentUserInfo', JSON.stringify(dynamicUser));
          })
          .catch(function (error) { // If there is any issue
            console.error("Error writing document: ", error);
          });
        _this.currentInfoUser = _.cloneDeep(dynamicUser);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}