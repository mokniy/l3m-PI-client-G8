/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageCommunauteComponent } from './page-communaute.component';

describe('PageCommunauteComponent', () => {
  let component: PageCommunauteComponent;
  let fixture: ComponentFixture<PageCommunauteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCommunauteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCommunauteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
