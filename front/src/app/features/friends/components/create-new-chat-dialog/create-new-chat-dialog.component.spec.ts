import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewChatDialogComponent } from './create-new-chat-dialog.component';

describe('CreateNewChatDialogComponent', () => {
  let component: CreateNewChatDialogComponent;
  let fixture: ComponentFixture<CreateNewChatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewChatDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewChatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
