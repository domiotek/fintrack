import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReadonlyMessageComponent } from './chat-readonly-message.component';

describe('ChatReadonlyMessageComponent', () => {
  let component: ChatReadonlyMessageComponent;
  let fixture: ComponentFixture<ChatReadonlyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReadonlyMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatReadonlyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
