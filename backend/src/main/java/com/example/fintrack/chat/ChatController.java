package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.PrivateChatDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/private")
    private ResponseEntity<List<PrivateChatDto>> getPrivateChats() {
        return ResponseEntity.ok().body(chatService.getPrivateChats());
    }

    @GetMapping("/private/friends-ids")
    private ResponseEntity<List<Long>> getFriendsIdsWithPrivateChats() {
        return ResponseEntity.ok().body(chatService.getFriendsIdsWithPrivateChats());
    }

    @GetMapping("/private/{friend-id}")
    public ResponseEntity<Long> getPrivateChatId(@PathVariable("friend-id") long friendId) {
        return ResponseEntity.ok().body(chatService.getFriendChatId(friendId));
    }
}
