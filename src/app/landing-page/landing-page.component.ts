import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
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
  appTitle = "Retro board";
  userName: string;
  title: string;
  comments: string;

  constructor(private afs: AngularFirestore, private modalService: BsModalService) {
  }

  addComments() {
    const modal = this.modalService.show(AddCommentsModalComponent, { class: 'modal-popup-style' });
    (<AddCommentsModalComponent>modal.content).showAddCommentsModal();

    (<AddCommentsModalComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.getCommentList();
      }
    });
  }

  //Get command list
  getCommentList() {
    this.commentsCol = this.afs.collection('comments');
    // To retrive list with id and data
    this.commentList = this.commentsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Comment;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });
  }
  //Delete command
  deleteComments(cmdId) {
    this.afs.doc('comments/' + cmdId).delete();
  }
  ngOnInit() {
    this.getCommentList()
  }

}
