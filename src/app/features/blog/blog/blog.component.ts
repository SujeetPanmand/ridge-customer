import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AllBlogsDetailsList,
  BlogsDetails,
} from 'src/app/shared/interfaces/blog';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  allBlogList: AllBlogsDetailsList[] = [];
  allTagsDetailsList = [];
  unFilteredBlogs: AllBlogsDetailsList[] = [];
  selectedTag = 'all';
  isLoggedIn = 0;
  isShowNoRecordText = false;
  blogPictureUrl = '';
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.commonService.getUserDetails().then((x) => {
      if (x) this.isLoggedIn = 1;
    });
    this.getAllBlogs();
    this.getAllTags();
    this.commonService.gotoTop();
  }
  
  checkLength(commentDetails:any){
    let content = commentDetails ? commentDetails.split('</div>')[0]:'';
   return content;
  }
  getAllBlogs() {
    this.apiService
      .request('GET_ALL_BLOGS', { params: {} })
      .subscribe((res: BlogsDetails) => {
        if (res) {
          console.log(res);
          this.allBlogList = res.allBlogsDetailsList;
          this.unFilteredBlogs = res.allBlogsDetailsList;
          this.isShowNoRecordText = this.unFilteredBlogs.length ? false : true;

        }
      });
  }
  navigateToBlogView(blog: AllBlogsDetailsList) {
    this.router.navigate([`/blog/blog-details/${blog.id}`]);
  }
  getAllTags() {
    this.apiService
      .request('GET_ALL_TAGS', { params: { id: '' } })
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.allTagsDetailsList = res.allTagsDetailsList;
        }
      });
  }
  onTagChange(tagName, tag?) {
    this.selectedTag = tagName;
    this.allBlogList =
      this.selectedTag !== 'all'
        ? this.unFilteredBlogs.filter((x) => x.tagId === tag.id)
        : (this.allBlogList = this.unFilteredBlogs);
  }

  setProductPic(id) {
    return id ?  environment.baseUrl +
    '/api/blog/image/' + id:'';
  }
}
