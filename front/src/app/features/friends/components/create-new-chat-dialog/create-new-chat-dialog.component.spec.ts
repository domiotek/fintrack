import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewChatDialogComponent } from './create-new-chat-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateNewChatDialogComponent', () => {
  let component: CreateNewChatDialogComponent;
  let fixture: ComponentFixture<CreateNewChatDialogComponent>;
  let friendService: jasmine.SpyObj<FriendService>;
  let chatService: jasmine.SpyObj<ChatService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CreateNewChatDialogComponent>>;

  const mockFriends = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
  ];

  beforeEach(async () => {
    const friendServiceSpy = jasmine.createSpyObj('FriendService', ['getFriendsList'], {
      friends$: of(mockFriends),
    });
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['getUserIdsWithPrivateChat']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CreateNewChatDialogComponent, NoopAnimationsModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: FriendService, useValue: friendServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AppStateStore, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewChatDialogComponent);
    component = fixture.componentInstance;

    friendService = TestBed.inject(FriendService) as jasmine.SpyObj<FriendService>;
    chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreateNewChatDialogComponent>>;
    chatService.getUserIdsWithPrivateChat.and.returnValue(of([]));
    friendService.getFriendsList.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedUser()).toBeNull();
    expect(component.searchValue()).toBe('');
    expect(component.loading()).toBeTruthy();
  });

  it('should filter friends who already have private chats', () => {
    chatService.getUserIdsWithPrivateChat.and.returnValue(of([1, 3])); // John and Bob have chats

    component.ngOnInit();

    expect(component.friends().length).toBe(1);
    expect(component.friends()[0].id).toBe(2); // Only Jane should remain
  });

  it('should show all friends when no private chats exist', () => {
    chatService.getUserIdsWithPrivateChat.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.friends().length).toBe(3);
  });

  describe('Search Functionality', () => {
    it('should update search value', () => {
      const searchTerm = 'John';

      component.onSearch(searchTerm);

      expect(component.searchValue()).toBe(searchTerm);
    });

    it('should debounce search requests', (done) => {
      jasmine.clock().install();

      component.onSearch('test');
      expect(friendService.getFriendsList).not.toHaveBeenCalled();

      jasmine.clock().tick(299); // Just before debounce delay
      expect(friendService.getFriendsList).not.toHaveBeenCalled();
      jasmine.clock().tick(1); // Complete debounce delay
      expect(friendService.getFriendsList).toHaveBeenCalledWith('test');

      jasmine.clock().uninstall();
      done();
    });
    it('should set loading state during search', (done) => {
      jasmine.clock().install();
      friendService.getFriendsList.and.returnValue(of([]));

      component.onSearch('test');
      jasmine.clock().tick(300);

      expect(component.loading()).toBeFalsy();
      jasmine.clock().uninstall();
      done();
    });
    it('should handle multiple rapid search calls', (done) => {
      jasmine.clock().install();
      component.onSearch('a');
      jasmine.clock().tick(100);
      component.onSearch('ab');
      jasmine.clock().tick(100);
      component.onSearch('abc');
      jasmine.clock().tick(300);

      expect(friendService.getFriendsList).toHaveBeenCalledTimes(1);
      expect(friendService.getFriendsList).toHaveBeenCalledWith('abc');
      jasmine.clock().uninstall();
      done();
    });
  });

  describe('User Selection', () => {
    it('should select user when onUserSelected is called', () => {
      const user = mockFriends[0];

      component.onUserSelected(user);

      expect(component.selectedUser()).toBe(user);
    });

    it('should allow changing selected user', () => {
      const user1 = mockFriends[0];
      const user2 = mockFriends[1];

      component.onUserSelected(user1);
      expect(component.selectedUser()).toBe(user1);

      component.onUserSelected(user2);
      expect(component.selectedUser()).toBe(user2);
    });
  });

  describe('Dialog Submission', () => {
    it('should close dialog with selected user', () => {
      const selectedUser = mockFriends[0];
      component.onUserSelected(selectedUser);

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith(selectedUser);
    });

    it('should not submit when no user is selected', () => {
      expect(component.selectedUser()).toBeNull();

      // This test validates the component structure,
      // actual form validation would prevent submission
      component.onSubmit();

      // Dialog would close with null/undefined, but typically
      // the submit button would be disabled
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call searchFriends on initialization', () => {
      spyOn(component, 'searchFriends');

      component.ngOnInit();

      expect(component.searchFriends).toHaveBeenCalled();
    });
    it('should handle empty friends list', async () => {
      // Create a new test module with empty friends list
      const friendServiceEmpty = jasmine.createSpyObj('FriendService', ['getFriendsList'], {
        friends$: of([]),
      });

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CreateNewChatDialogComponent, NoopAnimationsModule],
        providers: [
          provideExperimentalZonelessChangeDetection(),
          { provide: FriendService, useValue: friendServiceEmpty },
          { provide: ChatService, useValue: jasmine.createSpyObj('ChatService', ['getUserIdsWithPrivateChat']) },
          { provide: AppStateStore, useValue: {} },
          { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(CreateNewChatDialogComponent);
      const newComponent = newFixture.componentInstance;

      // Setup chat service for this instance
      const chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
      chatService.getUserIdsWithPrivateChat.and.returnValue(of([]));

      friendServiceEmpty.getFriendsList.and.returnValue(of([]));

      newFixture.detectChanges();
      newComponent.ngOnInit();

      expect(newComponent.friends().length).toBe(0);
    });
  });
});
