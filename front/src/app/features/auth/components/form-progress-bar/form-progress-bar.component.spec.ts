import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProgressBarComponent } from './form-progress-bar.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('FormProgressBarComponent', () => {
  let component: FormProgressBarComponent;
  let fixture: ComponentFixture<FormProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProgressBarComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
