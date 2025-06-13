import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataComponent } from './no-data.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('NoDataComponent', () => {
  let component: NoDataComponent;
  let fixture: ComponentFixture<NoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [NoDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default no data message', () => {
    const messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement?.textContent).toBe('Brak danych do wyświetlenia');
  });

  it('should display custom no data message when provided', () => {
    const customMessage = 'No transactions found';
    fixture.componentRef.setInput('noDataMessage', customMessage);
    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement?.textContent).toBe(customMessage);
  });

  it('should update message when input changes', () => {
    const initialMessage = 'Initial message';
    const updatedMessage = 'Updated message';

    fixture.componentRef.setInput('noDataMessage', initialMessage);
    fixture.detectChanges();

    let messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement?.textContent).toBe(initialMessage);

    fixture.componentRef.setInput('noDataMessage', updatedMessage);
    fixture.detectChanges();

    messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement?.textContent).toBe(updatedMessage);
  });

  it('should have correct component input property', () => {
    expect(component.noDataMessage()).toBe('Brak danych do wyświetlenia');
  });

  it('should handle empty string message', () => {
    fixture.componentRef.setInput('noDataMessage', '');
    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement?.textContent).toBe('');
  });
});
