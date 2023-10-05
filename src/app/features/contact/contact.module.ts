import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactComponent } from './contact/contact.component';
import { ContactsRoutingModule } from './contact-routing.module';
@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule, ContactsRoutingModule, SharedModule],
})
export class ContactModule {}