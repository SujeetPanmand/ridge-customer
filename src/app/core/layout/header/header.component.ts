import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user/user-details';
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
  isLogginShow = false;
  userId = '';
  userProfilePic = '';
  userDetails: User;
  constructor(private router: Router, public commonService: CommonService) {
    this.subscribeTo();
    this.subscribeToImage();
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.commonService.getUserDetails().then((res) => {
      if (res) {
        this.userDetails = res;
        this.userId = this.userDetails.userDetails.id;
        this.setUserProfilePic();
      }
    });
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
    this.commonService.logOut();
    this.router.navigate(['/account/login']);
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
      if (res) {
        debugger;
        this.userProfilePic = '';
        this.userProfilePic = res;
        // this.setUserProfilePic();
      }
    });
  }

  setUserProfilePic() {
    //this.commonService.profilePictureUrl = '';
    this.userProfilePic =
      environment.baseUrl + '/api/user/image/' + this.userId;
    // this.commonService.profilePictureUrl = url;
  }
}
