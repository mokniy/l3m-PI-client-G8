/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AssistantService } from './assistant.service';

describe('Service: Assistant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssistantService]
    });
  });

  it('should ...', inject([AssistantService], (service: AssistantService) => {
    expect(service).toBeTruthy();
  }));
});
