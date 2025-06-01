import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageBlockComponent } from './chat-message-block.component';

describe('ChatMessageBlockComponent', () => {
  let component: ChatMessageBlockComponent;
  let fixture: ComponentFixture<ChatMessageBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
