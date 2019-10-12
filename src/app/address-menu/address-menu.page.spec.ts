import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressMenuPage } from './address-menu.page';

describe('AddressPage', () => {
  let component: AddressMenuPage;
  let fixture: ComponentFixture<AddressMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressMenuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
