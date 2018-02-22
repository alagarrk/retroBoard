import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import * as _ from "lodash";

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddCommentsModalComponent } from '../components/modals/add-comments-modal/add-comments-modal.component';

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

  // Three categories of data
  wentWellList: any = [];
  wentWrongList: any = [];
  needToImproveList: any = [];

  listObservable: any;
  constructor(private afs: AngularFirestore, private modalService: BsModalService, private router: Router) {
  }

  addComments() {
    const modal = this.modalService.show(AddCommentsModalComponent, { class: 'modal-popup-style' });
    (<AddCommentsModalComponent>modal.content).showAddCommentsModal(this.currentInfoUser);
    (<AddCommentsModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.getCommentList();
      }
    });
  }

  //Get command list
  getCommentList() {
    const _this = this;
    this.wentWellList = [];
    this.wentWrongList = [];
    this.needToImproveList = [];
    // Get data from comments - Collections // Also we can use where condition to filter data
    this.afs.firestore.collection('comments')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          const data = doc.data();
          data.id = doc.id;
          _this[data['category']['name']].push(data);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
  //Delete command
  deleteComments(cmdId) {
    this.afs.doc('comments/' + cmdId).delete();
  }
  ngOnInit() {
    this.currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    if (this.currentInfoUser) {
      this.router.navigate(['landing']);
    } else {
      this.router.navigate(['login']);
    }
    this.getCommentList();
  }

}