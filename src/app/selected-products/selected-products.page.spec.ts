import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedProductsPage } from './selected-products.page';

describe('SelectedProductsPage', () => {
  let component: SelectedProductsPage;
  let fixture: ComponentFixture<SelectedProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
