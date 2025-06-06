import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendDialogComponent } from './add-friend-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';

describe('AddFriendDialogComponent', () => {
  let component: AddFriendDialogComponent;
  let fixture: ComponentFixture<AddFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFriendDialogComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FriendService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFriendDialogComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
