import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AllBlogsDetailsList,
  BlogsDetails,
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
  allBlogList: AllBlogsDetailsList[] = [];
  allComments: any = [];
  isLoading = false;
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAllBlogs();
    this.getBlogById();
    this.commonService.gotoTop();
    this.getAllComment();
  }

  getAllBlogs() {
    this.apiService
      .request('GET_ALL_BLOGS', { params: {} })
      .subscribe((res: BlogsDetails) => {
        if (res) {
          console.log(res);
          this.allBlogList = res.allBlogsDetailsList;
          this.sortTopArticals();
        }
      });
  }

  sortTopArticals() {
    this.allBlogList.forEach((element) => {
      var obj = {
        title: element.title,
        id: element.id,
        commentCount: element.commentDetails,
      };
      this.allComments.push(obj);
    });
    this.allComments.forEach((element) => {
      element.commentCount = element.commentCount.length;
    });
    this.allComments
      .sort((a, b) => {
        if (a.commentCount !== b.commentCount) {
          return a.commentCount - b.commentCount;
        } else {
          return b.commentCount.localeCompare(a.commentCount);
        }
      })
      .reverse();
    this.allComments = this.allComments.slice(0, 3);
    console.log(this.allComments);
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

  setTopArticalPic(id) {
    this.blogPictureUrl = environment.baseUrl + '/api/blog/image/' + id;
    return this.blogPictureUrl;
  }

  setProfilePic(userId) {
    let date = new Date().getTime();
    this.blogPictureUrl = '';
    let url = environment.baseUrl + '/api/user/image/' + userId + '?' + date;
    return url;
  }

  getAllComment() {
    this.isLoading = true;
    this.apiService
      .request('GET_ALL_COMMENT', {
        params: { id: this.route.snapshot.params['blogId'] },
      })
      .subscribe((res: Comment) => {
        console.log('Comment', res);
        this.isLoading = false;
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
    if (!this.comment) {
      return;
    }
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
