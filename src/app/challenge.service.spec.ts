/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChallengeService } from './challenge.service';

describe('Service: Challenge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChallengeService]
    });
  });

  it('should ...', inject([ChallengeService], (service: ChallengeService) => {
    expect(service).toBeTruthy();
  }));
});
