import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFriendRequestsDialogComponent } from './pending-friend-requests-dialog.component';

describe('PendingFriendRequestsDialogComponent', () => {
  let component: PendingFriendRequestsDialogComponent;
  let fixture: ComponentFixture<PendingFriendRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingFriendRequestsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingFriendRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
