import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showSettingCntr: boolean;
  currentInfoUser: any = {};
  projectInfo: any = {};
  
  constructor(private router: Router, private location: Location) { }

  // Show/Hide setting dropdown
  toggleSettingCntr($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
    this.showSettingCntr = true;
  }

  // Logout user
  logoutUser() {
    sessionStorage.removeItem('currentUserInfo');
    this.router.navigate(['login']);
  }

  ngOnInit() {
    if (this.location.path() === '/admin') {
      this.router.navigate(['/admin']);
    } else {
      this.currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
      if (this.currentInfoUser) {
        this.projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
        this.router.navigate(['landing']);
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  // Listener to find document click and close logout container
  @HostListener('document:click', ['$event']) clickedOutside($event) {
    this.showSettingCntr = false;
  }
}
