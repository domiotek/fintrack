import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetailsComponent } from './category-details.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('CategoryDetailsComponent', () => {
  let component: CategoryDetailsComponent;
  let fixture: ComponentFixture<CategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
      ],
      imports: [CategoryDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryDetailsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('category', {
      id: 1,
      name: 'Ogólne',
      color: '#65558F',
      limit: 150,
      spendLimit: 135,
    });

    fixture.componentRef.setInput('userCurrency', {
      id: 2,
      name: 'Euro',
      code: 'EUR',
      rate: 1.1,
    });

    fixture.componentRef.setInput('isMobile', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
