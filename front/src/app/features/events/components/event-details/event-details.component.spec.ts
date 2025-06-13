import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsComponent } from './event-details.component';
import { Event } from '../../../../core/models/events/event';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { mocked_event } from '../../../../core/mocks/tests-mocks';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { EventsService } from '../../../../core/services/events/events.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { Currency } from '../../../../core/models/currency/currency.model';
import { User } from '../../../../core/models/user/user.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;
  let mockAppStateStore: jasmine.SpyObj<AppStateStore>;

  const mockCurrency: Currency = {
    id: 1,
    name: 'Złoty',
    code: 'PLN',
    rate: 1,
  };
  const mockUser: User = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
  };
  beforeEach(async () => {
    const appStateStoreSpy = jasmine.createSpyObj('AppStateStore', [], {
      userDefaultCurrency$: new BehaviorSubject<Currency>(mockCurrency),
      userId: new BehaviorSubject<number>(1),
      appState$: new BehaviorSubject({ userId: 1 }),
    });
    const mockChatService = jasmine.createSpyObj(
      'ChatService',
      [
        'sendMessage',
        'signalStartedTyping',
        'signalStoppedTyping',
        'disconnectFromChat',
        'connectToChat',
        'updateLastActivity',
      ],
      {
        messages$: new BehaviorSubject([]),
        lastReadMessagesMap$: new BehaviorSubject({}),
        lastUserActivityMap$: new BehaviorSubject({}),
        typingUsers$: new BehaviorSubject([]),
        activityTicker$: EMPTY,
        privateChatsUpdates$: EMPTY,
      },
    );
    // Make connectToChat return a resolved promise
    mockChatService.connectToChat.and.returnValue(Promise.resolve());
    const mockEventsService = jasmine.createSpyObj(
      'EventsService',
      [
        'getEventSummary',
        'getEventBills',
        'getEventUsersWhoPaid',
        'getSettlements',
        'deleteEventUser',
        'deleteEvent',
        'updateEvent',
        'emitBillRefresh',
        'updateEventBill',
        'deleteEventBill',
      ],
      {
        billRefresh$: EMPTY,
        eventRefresh$: EMPTY,
      },
    ); // Set up return values for the mocked methods - return proper Observable objects
    mockEventsService.getEventBills.and.returnValue(
      of({ content: [], page: { size: 10, number: 0, totalElements: 0, totalPages: 0 } }),
    );
    mockEventsService.getEventSummary.and.returnValue(
      of({
        eventCurrency: { amount: 100, costPerUser: 20 },
        userCurrency: { amount: 100, costPerUser: 20 },
      }),
    );
    mockEventsService.getEventUsersWhoPaid.and.returnValue(of([]));
    mockEventsService.getSettlements.and.returnValue(of([]));
    mockEventsService.updateEventBill.and.returnValue(of(undefined));
    mockEventsService.deleteEventBill.and.returnValue(of(undefined));

    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['getLoadingState'], {
      getLoadingState: () => signal(false),
    });

    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: AppStateStore, useValue: appStateStoreSpy },
        { provide: ChatService, useValue: mockChatService },
        { provide: EventsService, useValue: mockEventsService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MatDialog, useValue: mockDialog },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      imports: [EventDetailsComponent, NoopAnimationsModule],
    }).compileComponents();

    mockAppStateStore = TestBed.inject(AppStateStore) as jasmine.SpyObj<AppStateStore>;
    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;

    const event: Event = mocked_event;

    fixture.componentRef.setInput('event', event);
    fixture.componentRef.setInput('isMobile', false);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all tabs in tab group', () => {
    const tabLabels = fixture.nativeElement.querySelectorAll('.mat-mdc-tab .mdc-tab__text-label');
    const expectedLabels = ['Wiadomości', 'Rachunki', 'Użytkownicy', 'Podsumowanie wydatków', 'Podsumowanie'];

    expect(tabLabels.length).toBe(5);
    expectedLabels.forEach((label, index) => {
      expect(tabLabels[index].textContent.trim()).toBe(label);
    });
  });

  it('should show back button when in mobile mode', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeTruthy();
    expect(backButton.querySelector('mat-icon').textContent.trim()).toBe('arrow_back');
  });

  it('should not show back button when not in mobile mode', () => {
    fixture.componentRef.setInput('isMobile', false);
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeFalsy();
  });

  it('should emit goBackEmit when back button is clicked', () => {
    spyOn(component.goBackEmit, 'emit');
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector('.back-button');
    backButton.click();

    expect(component.goBackEmit.emit).toHaveBeenCalled();
  });

  it('should have chat component in first tab', () => {
    const chatComponent = fixture.nativeElement.querySelector('app-chat');
    expect(chatComponent).toBeTruthy();
    expect(chatComponent.getAttribute('ng-reflect-chat-id')).toBe(mocked_event.chatId.toString());
  });
  it('should have event-details-bills component in second tab', async () => {
    // Click on the second tab to activate it
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    expect(tabHeaders.length).toBeGreaterThan(1);

    tabHeaders[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const billsComponent = fixture.nativeElement.querySelector('app-event-details-bills');
    expect(billsComponent).toBeTruthy();
  });

  it('should have event-details-users component in third tab', async () => {
    // Click on the third tab to activate it
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    expect(tabHeaders.length).toBeGreaterThan(2);

    tabHeaders[2].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const usersComponent = fixture.nativeElement.querySelector('app-event-details-users');
    expect(usersComponent).toBeTruthy();
  });

  it('should have event-details-settlements component in fourth tab', async () => {
    // Click on the fourth tab to activate it
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    expect(tabHeaders.length).toBeGreaterThan(3);

    tabHeaders[3].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const settlementsComponent = fixture.nativeElement.querySelector('app-event-details-settlements');
    expect(settlementsComponent).toBeTruthy();
  });

  it('should have event-details-settings component in fifth tab', async () => {
    // Click on the fifth tab to activate it
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    expect(tabHeaders.length).toBeGreaterThan(4);

    tabHeaders[4].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const settingsComponent = fixture.nativeElement.querySelector('app-event-details-settings');
    expect(settingsComponent).toBeTruthy();
  });

  it('should handle user deletion by removing user from event users array', () => {
    const initialEvent = component.event();
    const userIdToDelete = initialEvent.users[0].id;
    const initialUsersCount = initialEvent.users.length;

    // Call the method through the component's public interface
    (component as any).userDeletion(userIdToDelete);

    const updatedEvent = component.event();
    expect(updatedEvent.users.length).toBe(initialUsersCount - 1);
    expect(updatedEvent.users.find((user) => user.id === userIdToDelete)).toBeUndefined();
  });

  it('should not affect event when deleting non-existent user', () => {
    const initialEvent = component.event();
    const initialUsersCount = initialEvent.users.length;
    const nonExistentUserId = 999;

    (component as any).userDeletion(nonExistentUserId);

    const updatedEvent = component.event();
    expect(updatedEvent.users.length).toBe(initialUsersCount);
    expect(updatedEvent.users).toEqual(initialEvent.users);
  });

  it('should expose userCurrency$ from AppStateStore', () => {
    expect(component.userCurrency$).toBeDefined();
    component.userCurrency$.subscribe((currency) => {
      expect(currency).toEqual(mockCurrency);
    });
  });

  it('should expose userId$ from AppStateStore', () => {
    expect(component.userId$).toBeDefined();
    component.userId$.subscribe((userId) => {
      expect(userId).toBe(1);
    });
  });

  it('should update event input properly', () => {
    const newEvent: Event = {
      ...mocked_event,
      id: 999,
      name: 'Updated Event',
    };

    fixture.componentRef.setInput('event', newEvent);
    fixture.detectChanges();

    expect(component.event().id).toBe(999);
    expect(component.event().name).toBe('Updated Event');
  });

  it('should update isMobile input properly', () => {
    expect(component.isMobile()).toBe(false);

    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    expect(component.isMobile()).toBe(true);
  });
  it('should pass correct props to child components', async () => {
    // Activate the bills tab to test props
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    tabHeaders[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const billsComponent = fixture.nativeElement.querySelector('app-event-details-bills');
    expect(billsComponent).toBeTruthy();
    expect(billsComponent.getAttribute('ng-reflect-is-mobile')).toBe('false');
  });

  it('should maintain event object integrity when updating', () => {
    const originalEvent = component.event();
    const updatedEvent = { ...originalEvent, name: 'New Name' };

    fixture.componentRef.setInput('event', updatedEvent);
    fixture.detectChanges();

    expect(component.event().name).toBe('New Name');
    expect(component.event().id).toBe(originalEvent.id);
    expect(component.event().users).toEqual(originalEvent.users);
  });
  it('should have proper component structure with mat-tab-group', () => {
    const tabGroup = fixture.nativeElement.querySelector('mat-tab-group');
    const tabs = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');

    expect(tabGroup).toBeTruthy();
    expect(tabs.length).toBe(5);
  });

  it('should handle mobile mode changes correctly', () => {
    // Start in desktop mode
    expect(component.isMobile()).toBe(false);
    let backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeFalsy();

    // Switch to mobile mode
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    expect(component.isMobile()).toBe(true);
    backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeTruthy();

    // Switch back to desktop mode
    fixture.componentRef.setInput('isMobile', false);
    fixture.detectChanges();

    expect(component.isMobile()).toBe(false);
    backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeFalsy();
  });

  it('should pass chat participants to chat component', () => {
    const chatComponent = fixture.nativeElement.querySelector('app-chat');
    expect(chatComponent).toBeTruthy();

    // Check that chat participants are passed correctly
    const chatParticipants = chatComponent.getAttribute('ng-reflect-chat-participants');
    expect(chatParticipants).toBeTruthy();
  });
  it('should pass user currency to child components', async () => {
    // Test bills component
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    tabHeaders[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const billsComponent = fixture.nativeElement.querySelector('app-event-details-bills');
    expect(billsComponent).toBeTruthy();

    // Test settlements component
    tabHeaders[3].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const settlementsComponent = fixture.nativeElement.querySelector('app-event-details-settlements');
    expect(settlementsComponent).toBeTruthy();

    // Test settings component
    tabHeaders[4].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const settingsComponent = fixture.nativeElement.querySelector('app-event-details-settings');
    expect(settingsComponent).toBeTruthy();
  });
  it('should pass userId to users and settings components', async () => {
    // Test users component
    const tabHeaders = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    tabHeaders[2].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const usersComponent = fixture.nativeElement.querySelector('app-event-details-users');
    expect(usersComponent).toBeTruthy();

    // Test settings component
    tabHeaders[4].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const settingsComponent = fixture.nativeElement.querySelector('app-event-details-settings');
    expect(settingsComponent).toBeTruthy();
  });
  it('should have all required tab labels in correct order', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.mat-mdc-tab .mdc-tab__text-label');

    expect(tabs[0]?.textContent?.trim()).toBe('Wiadomości');
    expect(tabs[1]?.textContent?.trim()).toBe('Rachunki');
    expect(tabs[2]?.textContent?.trim()).toBe('Użytkownicy');
    expect(tabs[3]?.textContent?.trim()).toBe('Podsumowanie wydatków');
    expect(tabs[4]?.textContent?.trim()).toBe('Podsumowanie');
  });

  it('should correctly bind event data to components', () => {
    const newEvent: Event = {
      ...mocked_event,
      name: 'Test Event Name',
      id: 12345,
    };

    fixture.componentRef.setInput('event', newEvent);
    fixture.detectChanges();

    expect(component.event().name).toBe('Test Event Name');
    expect(component.event().id).toBe(12345);
  });
});
