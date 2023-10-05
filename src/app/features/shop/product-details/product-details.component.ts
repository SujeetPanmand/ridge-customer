import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}
  ngOnInit() {
    //this.getProductDetails();
  }
  getProductDetails() {
    this.apiService
      .request('GET_PRODUCT_DETAILS', { params: { id: '' } })
      .subscribe((res) => {
        if (res) {
          console.log(res);
        }
      });
  }
}
