import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  addedProducts = [];
  cartValue = 0;
  isLogginShow = true;
  userId = '';
  profilePictureUrl = 'assets/em_user.png';
  constructor(private router: Router, public commonService: CommonService) {}

  ngOnInit(): void {
    this.subscribeTo();
    this.userId = localStorage.getItem('userId')
      ? localStorage.getItem('userId')
      : '';

    // this.setuserProfile();
    // this.subscribeToImage();
  }

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
    this.router.navigate(['/account/login']);
    this.commonService.getUserDetails();
  }

  subscribeTo() {
    this.commonService.cartProductValue.subscribe((val) => {
      this.cartValue = val;
    });
    this.commonService.islogginButtonShow.subscribe((val) => {
      this.isLogginShow = val;
    });
  }

  closeMobileMenu() {
    const toggleButton = document.querySelector(
      '.navbar-toggler'
    ) as HTMLElement;
    const navbarCollapse = document.querySelector(
      '.navbar-collapse'
    ) as HTMLElement;

    if (
      toggleButton &&
      navbarCollapse &&
      navbarCollapse.classList.contains('show')
    ) {
      toggleButton.click();
    }
  }
  subscribeToImage() {
    this.commonService.newProfileImageEmitter.subscribe((res) => {
      this.setuserProfile();
    });
  }

  setuserProfile() {
    let date = new Date().getTime();
    this.profilePictureUrl =
      this.userId != null && this.userId != ''
        ? environment.baseUrl + '/api/user/image/' + this.userId + '?' + date
        : 'assets/em_user.png';
    this.commonService.profilePictureUrl = this.profilePictureUrl;
  }
}
