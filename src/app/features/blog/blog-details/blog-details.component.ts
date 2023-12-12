import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  allArticles: any = [];
  isLoading = false;
  isLoggedIn = 0;
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscribeToUrlChange();
  }

  ngOnInit() {
    this.commonService.getUserDetails().then((x) => {
      if (x) this.isLoggedIn = 1;
    });
    this.getAllBlogs();
    this.getBlogById();
    this.commonService.gotoTop();
    this.getAllComment();
  }

  subscribeToUrlChange() {
    //navigate to same page won't call following changes;
    // On subscribing activated route will update data when params or query params get changed
    this.route.params.subscribe((val) => {
      this.commonService.getUserDetails().then((x) => {
        if (x) this.isLoggedIn = 1;
      });
      this.getAllBlogs();
      this.getBlogById();
      this.commonService.gotoTop();
      this.getAllComment();
    });
  }

  navigateToBlogView(blog: AllBlogsDetailsList) {
    this.router.navigate([`/blog/blog-details/${blog.id}`]);
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
    this.allArticles = this.allBlogList
      .filter((x) => x.id !== this.route.snapshot.params['blogId'])
      .map((y) => {
        return {
          title: y.title,
          id: y.id,
        };
      });

    this.allArticles = this.allArticles.slice(0, 3);
    // this.allBlogList.forEach((element) => {
    //   var obj = {
    //     title: element.title,
    //     id: element.id,
    //     commentCount: element.commentDetails,
    //   };
    //   this.allComments.push(obj);
    // });
    // this.allComments.forEach((element) => {
    //   element.commentCount = element.commentCount.length;
    // });
    // this.allComments
    //   .sort((a, b) => {
    //     if (a.commentCount !== b.commentCount) {
    //       return a.commentCount - b.commentCount;
    //     } else {
    //       return b.commentCount.localeCompare(a.commentCount);
    //     }
    //   })
    //   .reverse();
    // this.allComments = this.allComments.slice(0, 3);
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
  setBlogDetailsPicture() {
    return this.route.snapshot.params['blogId']
      ? environment.baseUrl +
          '/api/blog/image/' +
          this.route.snapshot.params['blogId']
      : '';
  }

  setTopArticalPic(id) {
    return id ? environment.baseUrl + '/api/blog/image/' + id : '';
  }

  setProfilePic(userId) {
    return userId ? environment.baseUrl + '/api/user/image/' + userId : '';
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
