import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
