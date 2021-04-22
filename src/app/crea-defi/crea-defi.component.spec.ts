/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreaDefiComponent } from './crea-defi.component';

describe('CreaDefiComponent', () => {
  let component: CreaDefiComponent;
  let fixture: ComponentFixture<CreaDefiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreaDefiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaDefiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
