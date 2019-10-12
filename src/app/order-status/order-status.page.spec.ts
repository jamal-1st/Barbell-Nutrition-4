import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusPage } from './order-status.page';


describe('OrderStatusPage', () => {
  let component: OrderStatusPage;
  let fixture: ComponentFixture<OrderStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
