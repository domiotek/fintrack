import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputComponent } from './search-input.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SearchInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('placeholder', 'Search...');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
