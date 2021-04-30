/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AlertConComponent } from './alert-con.component';

describe('AlertConComponent', () => {
  let component: AlertConComponent;
  let fixture: ComponentFixture<AlertConComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertConComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
