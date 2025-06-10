import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroupingComponent } from './select-grouping.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SelectGroupingComponent', () => {
  let component: SelectGroupingComponent;
  let fixture: ComponentFixture<SelectGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SelectGroupingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGroupingComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('selectedGroup', 'DAY');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
