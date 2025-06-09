package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.ChatStateDto;
import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.message.dto.MessageDto;
import com.example.fintrack.message.dto.SendMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chats/{chat-id}/post-message")
    public void sendMessage(Authentication principal, @DestinationVariable("chat-id") long chatId, @Payload String sendMessage) {
        chatService.sendMessage(principal, chatId, sendMessage);
    }

    @MessageMapping("/chats/{chat-id}/started-typing")
    public void startTyping(Authentication principal, @DestinationVariable("chat-id") long chatId) {
        chatService.startTyping(principal, chatId);
    }

    @MessageMapping("chats/{chat-id}/stopped-typing")
    public void stopTyping(Authentication principal, @DestinationVariable("chat-id") long chatId) {
        chatService.stopTyping(principal, chatId);
    }

    @MessageMapping("/chats/{chat-id}/report-last-activity")
    public void reportLastActivity(Authentication principal, @DestinationVariable("chat-id") long chatId) {
        chatService.reportLastActivity(principal, chatId);
    }

    @MessageMapping("/chats/{chat-id}/update-last-read-message")
    public void updateLastReadMessage(Authentication principal, @DestinationVariable("chat-id") long chatId, @Payload SendMessageDto sendMessageDto) {
        chatService.updateLastReadMessage(principal, chatId, sendMessageDto);
    }

    @GetMapping("/private")
    public ResponseEntity<Page<PrivateChatDto>> getPrivateChats(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(chatService.getPrivateChats(search, page, size));
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

    @GetMapping("/{chat-id}/state")
    public ResponseEntity<ChatStateDto> getChatState(
            @PathVariable("chat-id") long chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(chatService.getChatState(chatId, page, size));
    }

    @GetMapping("/private/{friend-id}")
    public ResponseEntity<Long> getPrivateChatId(@PathVariable("friend-id") long friendId) {
        return ResponseEntity.ok().body(chatService.getFriendChatId(friendId));
    }
}
