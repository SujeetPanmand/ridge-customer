import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private commonService: CommonService) {}
  ngOnInit(): void {
    let list = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.setGlobalCartCount(list);
  }

  title = 'ng-carousel-demo';

  slides = [
    { img: 'assets/home/natural-chef-carolyn-nicholas-560118-unsplash.png' },
    { img: 'assets/home/group328.png' },
    { img: 'assets/home/foodphotograph.png' },
    { img: 'assets/home/giannatrewava.png' },
    { img: 'assets/home/group328.png' },
  ];
  // slideConfig = {"slidesToShow": 4, "slidesToScroll": 4};
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    speed: 300,
    infinite: true,
    autoplaySpeed: 5000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  setGlobalCartCount(data) {
    let count = 0;
    data.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }
}
