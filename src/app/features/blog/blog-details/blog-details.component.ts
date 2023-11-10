import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SingleBlogDetails } from 'src/app/shared/interfaces/blog';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit {
  blogDetails: SingleBlogDetails;
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getBlogById();
    this.commonService.gotoTop();
  }

  getBlogById() {
    this.apiService
      .request('GET_BLOG_DETAILS_BY_ID', {
        params: { id: this.route.snapshot.params['blogId'] },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.blogDetails = res;
        }
      });
  }
}
