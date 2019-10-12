import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReOrderModalPage } from './re-order-modal.page';

describe('ReOrderModalPage', () => {
  let component: ReOrderModalPage;
  let fixture: ComponentFixture<ReOrderModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReOrderModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReOrderModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
