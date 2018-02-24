import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  // constructor(private router: Router,private appVariable: AppSharedService) {
  //   this.appVariable.showLoading = false;
  // }

  constructor(private router: Router, private appVariable: AppSharedService, private location: Location) {
    this.appVariable.showLoading = false;
  }


  ngOnInit() {
      if (this.location.path() === '/admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/login']);
      }
  }
}
