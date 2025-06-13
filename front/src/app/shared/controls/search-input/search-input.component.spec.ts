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

  it('should have placeholder input', () => {
    expect(component.placeholder()).toBe('Search...');
  });

  it('should initialize with empty value', () => {
    expect(component.value()).toBe('');
  });

  it('should initialize as not disabled', () => {
    expect(component.disabled()).toBeFalsy();
  });

  it('should emit search event when onSearch is called', () => {
    spyOn(component.emitSearch, 'emit');
    component.value.set('test search');

    component.onSearch();

    expect(component.emitSearch.emit).toHaveBeenCalledWith('test search');
  });

  it('should call onChange when writeValue is called', () => {
    spyOn(component, 'onChange');

    component.writeValue('test value');

    expect(component.onChange).toHaveBeenCalledWith('test value');
  });

  it('should register onChange function', () => {
    const mockOnChange = jasmine.createSpy('onChange');

    component.registerOnChange(mockOnChange);

    expect(component.onChange).toBe(mockOnChange);
  });

  it('should register onTouched function', () => {
    const mockOnTouched = jasmine.createSpy('onTouched');

    component.registerOnTouched(mockOnTouched);

    expect(component.onTouched).toBe(mockOnTouched);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);

    expect(component.disabled()).toBeTruthy();

    component.setDisabledState(false);

    expect(component.disabled()).toBeFalsy();
  });

  it('should display placeholder in template', () => {
    const inputElement = fixture.nativeElement.querySelector('input');

    expect(inputElement?.placeholder).toBe('Search...');
  });

  it('should show search icon', () => {
    const iconElement = fixture.nativeElement.querySelector('mat-icon');

    expect(iconElement).toBeTruthy();
  });
});
