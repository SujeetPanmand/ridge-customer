import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-pop-up',
  templateUrl: './confirmation-pop-up.component.html',
  styleUrls: ['./confirmation-pop-up.component.scss'],
})
export class ConfirmationPopUpComponent implements OnInit {
  @Input() data: any;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  passBack(value: any) {
    this.activeModal.close(value);
  }
}
