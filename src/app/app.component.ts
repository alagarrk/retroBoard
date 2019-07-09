import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppSharedService } from '../shared.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  appTitle = "Retro board";
  route: string;
  meetingId: string;
  currentInfoUser: any = [];
  adminUserInfo: any = [];
  // constructor(private router: Router,private appVariable: AppSharedService) {
  //   this.appVariable.showLoading = false;
  // }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public appVariable: AppSharedService, private location: Location, private afs: AngularFirestore) {
    this.appVariable.showLoading = false;
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

  ngOnInit() {
    if(!this.location.path()){
      this.router.navigate(['/login']);
    }
  }
}
