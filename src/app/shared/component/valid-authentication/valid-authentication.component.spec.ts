import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidAuthenticationComponent } from './valid-authentication.component';

describe('ValidAuthenticationComponent', () => {
  let component: ValidAuthenticationComponent;
  let fixture: ComponentFixture<ValidAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidAuthenticationComponent]
    });
    fixture = TestBed.createComponent(ValidAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
