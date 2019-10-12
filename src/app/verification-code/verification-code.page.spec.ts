import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCodePage } from './verification-code.page';

describe('VerificationCodePage', () => {
  let component: VerificationCodePage;
  let fixture: ComponentFixture<VerificationCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
