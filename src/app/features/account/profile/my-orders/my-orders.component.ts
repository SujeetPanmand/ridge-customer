import { Component, OnInit } from '@angular/core';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { myOrderLinks } from '../profile.config';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  links: BreadCrumbLinks[] = myOrderLinks;
  constructor() {}

  ngOnInit() {}
}
