import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSelectedComponent } from './no-selected.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('NoSelectedComponent', () => {
  let component: NoSelectedComponent;
  let fixture: ComponentFixture<NoSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [NoSelectedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoSelectedComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('placeholder', 'No item selected');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
