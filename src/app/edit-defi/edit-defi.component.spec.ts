/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditDefiComponent } from './edit-defi.component';

describe('EditDefiComponent', () => {
  let component: EditDefiComponent;
  let fixture: ComponentFixture<EditDefiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDefiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDefiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
