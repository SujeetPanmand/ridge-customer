import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  addedProducts = [];
  cartValue = 0;
  isLogginShow = true;
  constructor(private router: Router, public commonService: CommonService) {
    this.commonService.cartProductValue.subscribe((val) => {
      this.cartValue = val;
    });
    this.commonService.islogginButtonShow.subscribe((val) => {
      this.isLogginShow = val;
    });
  }
  ngOnInit(): void {}

  navigateToAbout() {
    this.router.navigate(['about']);
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
  navigateToLogin() {
    this.router.navigate(['login']);
  }
  onLogout() {
    localStorage.clear();
    this.router.navigate(['login']);
    this.commonService.getUserDetails();
  }
}
