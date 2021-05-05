/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageAssistantComponent } from './page-assistant.component';

describe('PageAssistantComponent', () => {
  let component: PageAssistantComponent;
  let fixture: ComponentFixture<PageAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
