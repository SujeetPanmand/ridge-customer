import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AllBlogsDetailsList,
  BlogsDetails,
} from 'src/app/shared/interfaces/blog';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  allBlogList: AllBlogsDetailsList[] = [];
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllBlogs();
    this.commonService.gotoTop();
  }

  getAllBlogs() {
    this.apiService
      .request('GET_ALL_BLOGS', { params: { id: '' } })
      .subscribe((res: BlogsDetails) => {
        if (res) {
          console.log(res);
          this.allBlogList = res.allBlogsDetailsList;
        }
      });
  }
  navigateToBlogView(blog: AllBlogsDetailsList) {
    debugger;
    this.router.navigate([`/blog/blog-details/${blog.id}`]);
  }
}
