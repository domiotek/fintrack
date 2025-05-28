import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortMenuComponent } from './sort-menu.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SortMenuComponent', () => {
  let component: SortMenuComponent;
  let fixture: ComponentFixture<SortMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SortMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortMenuComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
