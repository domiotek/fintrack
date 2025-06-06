import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFriendDialogComponent } from './remove-friend-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RemoveFriendDialogComponent', () => {
  let component: RemoveFriendDialogComponent;
  let fixture: ComponentFixture<RemoveFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveFriendDialogComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FriendService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
