import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(private commonService: CommonService) {}
  ngOnInit(): void {
    this.commonService.gotoTop();
  }
}
