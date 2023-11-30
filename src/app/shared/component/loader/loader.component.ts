import { LoaderService } from './../../services/loader.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'partingout-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading  = true;
  constructor(private loadingService: LoaderService) { }

  ngOnInit() {
    this.isLoading = false;
    this.loadingService.loadingState.subscribe((loadingStatus) => {
      this.isLoading = loadingStatus.active;
    });
  }

}
