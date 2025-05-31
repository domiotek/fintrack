import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFriendDialogComponent } from './remove-friend-dialog.component';

describe('RemoveFriendDialogComponent', () => {
  let component: RemoveFriendDialogComponent;
  let fixture: ComponentFixture<RemoveFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveFriendDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
