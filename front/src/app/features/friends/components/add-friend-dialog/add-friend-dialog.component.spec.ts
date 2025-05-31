import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendDialogComponent } from './add-friend-dialog.component';

describe('AddFriendDialogComponent', () => {
  let component: AddFriendDialogComponent;
  let fixture: ComponentFixture<AddFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFriendDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
