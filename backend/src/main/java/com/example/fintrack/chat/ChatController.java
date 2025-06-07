package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.ChatStateDto;
import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.message.dto.MessageTypingDto;
import com.example.fintrack.message.dto.SendMessageDto;
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

    @MessageMapping("/chats/{chat-id}/started-typing")
    public void startTyping(@DestinationVariable("chat-id") long chatId) {
        chatService.startTyping(chatId);
    }

    @MessageMapping("chats/{chat-id}/stopped-typing")
    public void stopTyping(@DestinationVariable("chat-id") long chatId) {
        chatService.stopTyping(chatId);
    }

    @MessageMapping("/chats/{chat-id}/report-last-activity")
    public void reportLastActivity(@DestinationVariable("chat-id") long chatId) {
        chatService.reportLastActivity(chatId);
    }

    @MessageMapping("/chats/{chat-id}/update-last-read-message")
    public void updateLastReadMessage(@DestinationVariable("chat-id") long chatId, @Payload SendMessageDto sendMessageDto) {
        chatService.updateLastReadMessage(chatId, sendMessageDto);
    }

    @GetMapping("/private")
    public ResponseEntity<Page<PrivateChatDto>> getPrivateChats(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue ="10") int size,
                                                                @RequestParam(required = false) String search) {
        return ResponseEntity.ok().body(chatService.getPrivateChats(page, size, search));
    }

    @GetMapping("/private/user-ids")
    public ResponseEntity<List<Long>> getFriendsIdsWithPrivateChats() {
        return ResponseEntity.ok().body(chatService.getFriendsIdsWithPrivateChats());
    }

    @GetMapping("/{chat-id}/state")
    public ResponseEntity<ChatStateDto> getChatMessages(
            @PathVariable("chat-id") long chatId,
            @RequestParam long messageId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(chatService.getChatMessages(messageId, chatId, page, size));
    }

    @GetMapping("/private/{user-id}")
    public ResponseEntity<Long> getPrivateChatId(@PathVariable("user-id") long friendId) {
        return ResponseEntity.ok().body(chatService.getFriendChatId(friendId));
    }
}
