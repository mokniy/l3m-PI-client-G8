/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FicheDefiPortableComponent } from './fiche-defi-portable.component';

describe('FicheDefiPortableComponent', () => {
  let component: FicheDefiPortableComponent;
  let fixture: ComponentFixture<FicheDefiPortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheDefiPortableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheDefiPortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
