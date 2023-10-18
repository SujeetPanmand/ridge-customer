import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  date;
  year;
  ngOnInit(): void {
    this.date = new Date();
    this.year = this.date.getFullYear();
    console.log(this.year);
  }
}
