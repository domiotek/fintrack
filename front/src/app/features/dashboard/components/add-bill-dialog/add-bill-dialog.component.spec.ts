import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillDialogComponent } from './add-bill-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { MatDialogRef } from '@angular/material/dialog';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { BillsService } from '../../../../core/services/bills/bills.service';

describe('AddBillDialogComponent', () => {
  let component: AddBillDialogComponent;
  let fixture: ComponentFixture<AddBillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBillDialogComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        BillsService,
        AppStateStore,
        { provide: MatDialogRef, useValue: {} },
        provideLuxonDateAdapter(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
