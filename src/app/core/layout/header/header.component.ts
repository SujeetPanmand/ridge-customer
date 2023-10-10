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
  constructor(private router: Router, public commonService: CommonService) {}
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
}
