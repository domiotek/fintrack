import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestItemComponent } from './friend-request-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FriendRequestItemComponent', () => {
  let component: FriendRequestItemComponent;
  let fixture: ComponentFixture<FriendRequestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendRequestItemComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FriendService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendRequestItemComponent);
    fixture.componentRef.setInput('item', { id: 0, firstName: 'test', lastName: 'test', email: 'test', createdAt: '' });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
