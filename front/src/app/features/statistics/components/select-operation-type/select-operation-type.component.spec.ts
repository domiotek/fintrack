import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOperationTypeComponent } from './select-operation-type.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SelectOperationTypeComponent', () => {
  let component: SelectOperationTypeComponent;
  let fixture: ComponentFixture<SelectOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SelectOperationTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOperationTypeComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('selectedOparation', 'SUM');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
