import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
