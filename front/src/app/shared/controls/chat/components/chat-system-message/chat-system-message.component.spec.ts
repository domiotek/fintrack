import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSystemMessageComponent } from './chat-system-message.component';

describe('ChatSystemMessageComponent', () => {
  let component: ChatSystemMessageComponent;
  let fixture: ComponentFixture<ChatSystemMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSystemMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSystemMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
