package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.message.dto.SendMessageDto;
import com.example.fintrack.message.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chats/{chat-id}/post-message")
    public void sendMessage(@DestinationVariable("chat-id") long chatId, @Payload SendMessageDto sendMessageDto) {
        chatService.sendMessage(chatId, sendMessageDto);
    }

    @GetMapping("/private")
    public ResponseEntity<List<PrivateChatDto>> getPrivateChats() {
        return ResponseEntity.ok().body(chatService.getPrivateChats());
    }

    @GetMapping("/private/friends-ids")
    public ResponseEntity<List<Long>> getFriendsIdsWithPrivateChats() {
        return ResponseEntity.ok().body(chatService.getFriendsIdsWithPrivateChats());
    }

    @GetMapping("/{chat-id}/messages")
    public ResponseEntity<Page<MessageDto>> getChatMessages(
            @PathVariable("chat-id") long chatId,
            @RequestParam long messageId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(chatService.getChatMessages(messageId, chatId, page, size));
    }

    @GetMapping("/private/{friend-id}")
    public ResponseEntity<Long> getPrivateChatId(@PathVariable("friend-id") long friendId) {
        return ResponseEntity.ok().body(chatService.getFriendChatId(friendId));
    }
}
