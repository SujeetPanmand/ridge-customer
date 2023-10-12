import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  allBlogList = [];
  constructor(
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.getAllBlogs();
  }
  
  getAllBlogs() {
    this.apiService
      .request('GET_ALL_BLOGS', { params: { id: '' } })
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.allBlogList = res.allBlogsDetailsList;
        }
      });
  }
  myFunction(event) {
    var dots = event.target.previousElementSibling.querySelector('.dots');
    var moreText = event.target.previousElementSibling.querySelector('.more');
    var btnText = event.target;

    if (dots.style.display === 'none') {
      dots.style.display = 'inline';
      btnText.innerHTML = 'Read more';
      moreText.style.display = 'none';
    } else {
      dots.style.display = 'none';
      btnText.innerHTML = 'Read less';
      moreText.style.display = 'inline';
    }
  }
}
