import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cart1Page } from './cart1.page';

describe('CartPage', () => {
  let component: Cart1Page;
  let fixture: ComponentFixture<Cart1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cart1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cart1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
