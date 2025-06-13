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

  it('should display placeholder text', () => {
    expect(component.placeholder()).toBe('No item selected');
  });

  it('should accept different placeholder text', () => {
    fixture.componentRef.setInput('placeholder', 'Please select an item');

    expect(component.placeholder()).toBe('Please select an item');
  });
  it('should render placeholder in template', () => {
    const componentElement = fixture.nativeElement;
    expect(componentElement.textContent).toContain('No item selected');
  });

  it('should handle empty placeholder', () => {
    fixture.componentRef.setInput('placeholder', '');

    expect(component.placeholder()).toBe('');
  });

  it('should handle undefined placeholder gracefully', () => {
    fixture.componentRef.setInput('placeholder', undefined);

    expect(component.placeholder()).toBeUndefined();
  });
});
