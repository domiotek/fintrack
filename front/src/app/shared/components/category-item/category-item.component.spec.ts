import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryItemComponent } from './category-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Category } from '../../../core/models/category/category.model';
import { Currency } from '../../../core/models/currency/currency.model';

describe('CategoryItemComponent', () => {
  let component: CategoryItemComponent;
  let fixture: ComponentFixture<CategoryItemComponent>;
  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
    color: '#ff0000',
    limit: 100,
    userCosts: 75,
    isDefault: false,
  };

  const mockCurrency: Currency = {
    id: 1,
    name: 'Złoty',
    code: 'PLN',
    rate: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [CategoryItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', mockCategory);
    fixture.componentRef.setInput('currency', mockCurrency);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display category name', () => {
    const nameElement = fixture.nativeElement.querySelector('.name');
    expect(nameElement?.textContent?.trim()).toBe('Test Category');
  });

  it('should display category color as background', () => {
    const colorElement = fixture.nativeElement.querySelector('.color_label');
    expect(colorElement?.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should display user costs with limit and currency', () => {
    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');
    expect(limitInfoElement?.textContent?.trim()).toBe('75 / 100 PLN');
  });

  it('should display user costs without limit when limit is null', () => {
    const categoryWithoutLimit = { ...mockCategory, limit: null };
    fixture.componentRef.setInput('item', categoryWithoutLimit);
    fixture.detectChanges();

    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');
    expect(limitInfoElement?.textContent?.trim()).toBe('75  PLN');
  });

  it('should display user costs without limit when limit is undefined', () => {
    const categoryWithoutLimit = { ...mockCategory };
    delete categoryWithoutLimit.limit;
    fixture.componentRef.setInput('item', categoryWithoutLimit);
    fixture.detectChanges();

    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');
    expect(limitInfoElement?.textContent?.trim()).toBe('75  PLN');
  });

  it('should handle zero user costs', () => {
    const categoryWithZeroCosts = { ...mockCategory, userCosts: 0 };
    fixture.componentRef.setInput('item', categoryWithZeroCosts);
    fixture.detectChanges();

    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');
    expect(limitInfoElement?.textContent?.trim()).toBe('0 / 100 PLN');
  });
  it('should handle null currency', () => {
    fixture.componentRef.setInput('currency', null);
    fixture.detectChanges();

    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');
    expect(limitInfoElement?.textContent?.trim()).toBe('75 / 100');
  });

  it('should have proper component structure', () => {
    const leftContainer = fixture.nativeElement.querySelector('.left_container');
    const colorLabel = fixture.nativeElement.querySelector('.color_label');
    const nameElement = fixture.nativeElement.querySelector('.name');
    const limitInfo = fixture.nativeElement.querySelector('.limit_info');

    expect(leftContainer).toBeTruthy();
    expect(colorLabel).toBeTruthy();
    expect(nameElement).toBeTruthy();
    expect(limitInfo).toBeTruthy();
  });

  it('should update when category input changes', () => {
    const newCategory: Category = {
      id: 2,
      name: 'Updated Category',
      color: '#00ff00',
      limit: 200,
      userCosts: 150,
      isDefault: false,
    };

    fixture.componentRef.setInput('item', newCategory);
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('.name');
    const colorElement = fixture.nativeElement.querySelector('.color_label');
    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');

    expect(nameElement?.textContent?.trim()).toBe('Updated Category');
    expect(colorElement?.style.backgroundColor).toBe('rgb(0, 255, 0)');
    expect(limitInfoElement?.textContent?.trim()).toBe('150 / 200 PLN');
  });

  it('should handle different currency codes', () => {
    const usdCurrency: Currency = {
      id: 2,
      name: 'US Dollar',
      code: 'USD',
      rate: 4.5,
    };

    fixture.componentRef.setInput('currency', usdCurrency);
    fixture.detectChanges();

    const limitInfoElement = fixture.nativeElement.querySelector('.limit_info');
    expect(limitInfoElement?.textContent?.trim()).toBe('75 / 100 USD');
  });
});
