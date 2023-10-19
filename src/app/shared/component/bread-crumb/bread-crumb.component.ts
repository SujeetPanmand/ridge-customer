import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss'],
})
export class BreadCrumbComponent implements OnInit {
  @Input() links;
  breadcumLink: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToPage(li) {
    this.router.navigate([li.link]);
  }
}
