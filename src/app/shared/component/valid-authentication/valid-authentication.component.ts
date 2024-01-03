import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-valid-authentication',
  templateUrl: './valid-authentication.component.html',
  styleUrls: ['./valid-authentication.component.scss'],
})
export class ValidAuthenticationComponent implements OnInit {
  @Input() data: any;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  passBack(value: any) {
    this.activeModal.close(value);
  }
}
