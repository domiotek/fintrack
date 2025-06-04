package com.example.fintrack.friend;

import com.example.fintrack.friend.dto.AcceptFriendRequest;
import com.example.fintrack.friend.dto.FriendDto;
import com.example.fintrack.friend.dto.FriendRequestDto;
import com.example.fintrack.friend.dto.SendFriendRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/requests")
    public ResponseEntity<Void> sendFriendRequest(@RequestBody SendFriendRequestDto sendFriendRequestDto) {
        friendService.sendFriendRequest(sendFriendRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequestDto>> getFriendRequests() {
        return ResponseEntity.ok().body(friendService.getFriendRequests());
    }

    @PutMapping("/requests/{friend-id}")
    public ResponseEntity<Void> acceptFriendRequest(
            @PathVariable("friend-id") long friendId,
            @RequestBody AcceptFriendRequest acceptFriendRequest
    ) {
        friendService.acceptFriendRequest(friendId, acceptFriendRequest);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FriendDto>> getFriends(@RequestParam(required = false) String search) {
        return ResponseEntity.ok().body(friendService.getFriends(search));
    }

    @DeleteMapping("/{friend-id}")
    public ResponseEntity<Void> deleteFriend(@PathVariable("friend-id") long friendId) {
        friendService.deleteFriend(friendId);

        return ResponseEntity.noContent().build();
    }
}
