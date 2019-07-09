import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from "lodash";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showSettingCntr: boolean;
  currentInfoUser: any = {};
  adminUserInfo: any = {};
  //projectInfo: any = {};
  isAdmin: boolean;

  @Input() projectInfo: any = {};
  @Input() userInfo: any = {};

  constructor(private router: Router, private location: Location) {
  }

  // Show/Hide setting dropdown
  toggleSettingCntr($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
    this.showSettingCntr = true;
  }

  // Logout user
  logoutUser() {
    sessionStorage.removeItem('adminUserInfo');
    sessionStorage.removeItem('projectInfo');
    this.router.navigate(['login']);
  }

  ngOnInit() {
    this.isAdmin = false;
    const _this = this;
    // To get show user info in header part - If Admin page will admin user details else test user details
    if (this.location.path() === '/admin') {
      this.isAdmin = true;
      const adminUserInfo = JSON.parse(sessionStorage.getItem('adminUserInfo'));
      if (adminUserInfo) {
        this.currentInfoUser = adminUserInfo;
      }
    } else {
      this.isAdmin = false;
      this.currentInfoUser = _.cloneDeep(this.userInfo);
    }
  }


  // Listener to find document click and close logout container
  @HostListener('document:click', ['$event']) clickedOutside($event) {
    this.showSettingCntr = false;
  }
}
