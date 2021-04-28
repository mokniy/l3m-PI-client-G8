/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestProfilComponent } from './gest-profil.component';

describe('GestProfilComponent', () => {
  let component: GestProfilComponent;
  let fixture: ComponentFixture<GestProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
