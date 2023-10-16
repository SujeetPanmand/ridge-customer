import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit {
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.gotoTop();
  }
}
