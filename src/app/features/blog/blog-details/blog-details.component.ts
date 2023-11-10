import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AllBlogsDetailsList,
  Comment,
  CommentList,
} from 'src/app/shared/interfaces/blog';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit {
  blogDetails: AllBlogsDetailsList;
  blogPictureUrl = '';
  comments: CommentList[] = [];
  comment = '';
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getBlogById();
    this.commonService.gotoTop();
    this.getAllComment();
  }

  getBlogById() {
    this.apiService
      .request('GET_BLOG_DETAILS_BY_ID', {
        params: { id: this.route.snapshot.params['blogId'] },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.blogDetails = res.blogDetails;
        }
      });
  }
  setProductPic() {
    let date = new Date().getTime();
    this.blogPictureUrl =
      environment.baseUrl +
      '/api/blog/image/' +
      this.route.snapshot.params['blogId'] +
      '?' +
      date;
    return this.blogPictureUrl;
  }

  setProfilePic(userId) {
    let date = new Date().getTime();
    this.blogPictureUrl = '';
    let url = environment.baseUrl + '/api/user/image/' + userId + '?' + date;
    return url;
  }

  getAllComment() {
    this.apiService
      .request('GET_ALL_COMMENT', {
        params: { id: this.route.snapshot.params['blogId'] },
      })
      .subscribe((res: Comment) => {
        if (res && res.statusCode == 200) {
          this.comments = this.formatRecords(res.commentList);
        }
      });
  }

  formatRecords(res) {
    return res.map((x) => {
      return {
        ...x,
      };
    });
  }

  addComment() {
    const apiRequest = {
      data: {
        message: this.comment,
        blogId: this.route.snapshot.params['blogId'],
      },
    };
    this.apiService.request('ADD_COMMENT', apiRequest).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.comment = '';
        this.getAllComment();
      }
    });
  }
}
