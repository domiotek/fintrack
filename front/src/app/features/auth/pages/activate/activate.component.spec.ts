import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateComponent } from './activate.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ActivateComponent', () => {
  let component: ActivateComponent;
  let fixture: ComponentFixture<ActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
