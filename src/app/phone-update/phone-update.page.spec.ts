import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneUpdatePage } from './phone-update.page';

describe('PhoneUpdatePage', () => {
  let component: PhoneUpdatePage;
  let fixture: ComponentFixture<PhoneUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneUpdatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
