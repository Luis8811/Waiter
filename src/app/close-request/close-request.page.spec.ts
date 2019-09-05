import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRequestPage } from './close-request.page';

describe('CloseRequestPage', () => {
  let component: CloseRequestPage;
  let fixture: ComponentFixture<CloseRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
