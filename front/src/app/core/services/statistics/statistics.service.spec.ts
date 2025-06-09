import { TestBed } from '@angular/core/testing';

import { StatisticsService } from './statistics.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
