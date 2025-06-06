import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewChatDialogComponent } from './create-new-chat-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { MatDialogRef } from '@angular/material/dialog';

describe('CreateNewChatDialogComponent', () => {
  let component: CreateNewChatDialogComponent;
  let fixture: ComponentFixture<CreateNewChatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewChatDialogComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FriendService,
        AppStateStore,
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewChatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
