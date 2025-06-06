import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFriendRequestsDialogComponent } from './pending-friend-requests-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PendingFriendRequestsDialogComponent', () => {
  let component: PendingFriendRequestsDialogComponent;
  let fixture: ComponentFixture<PendingFriendRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingFriendRequestsDialogComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FriendService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingFriendRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
