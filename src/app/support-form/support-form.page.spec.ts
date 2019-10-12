import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportFormPage } from './support-form.page';

describe('SupportFormPage', () => {
  let component: SupportFormPage;
  let fixture: ComponentFixture<SupportFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
