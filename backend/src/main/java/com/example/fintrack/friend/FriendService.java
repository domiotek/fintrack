package com.example.fintrack.friend;

import com.example.fintrack.friend.dto.AcceptFriendRequest;
import com.example.fintrack.friend.dto.FriendDto;
import com.example.fintrack.friend.dto.FriendRequestDto;
import com.example.fintrack.friend.dto.SendFriendRequestDto;
import com.example.fintrack.friendchatmessage.FriendChatMessage;
import com.example.fintrack.friendchatmessage.FriendChatMessageRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static com.example.fintrack.friend.FriendSpecification.*;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserProvider userProvider;
    private final UserRepository userRepository;
    private final FriendChatMessageRepository friendChatMessageRepository;

    public List<FriendRequestDto> getFriendRequests() {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserId(user.getId()).and(hasFriendStatus(FriendStatus.PENDING));

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        return friends.stream()
                .map(FriendMapper::userToFriendRequestDto)
                .toList();
    }

    public void deleteFriend(long friendId) {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserIdAndFriendId(user.getId(), friendId);

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        friendRepository.deleteAll(friends);
    }

    public void sendFriendRequest(SendFriendRequestDto sendFriendRequestDto) {
        User user = userProvider.getLoggedUser();

        Optional<User> userOptional = userRepository.findUserByEmail(sendFriendRequestDto.email());
        if (userOptional.isEmpty()) {
            return;
        }

        User friend = userOptional.get();

        Specification<Friend> friendSpecification = hasUserIdAndFriendId(user.getId(), friend.getId());

        List<Friend> friends = friendRepository.findAll(friendSpecification);
        if (!friends.isEmpty()) {
            return;
        }

        FriendChatMessage friendChatMessage = new FriendChatMessage();

        friendChatMessageRepository.save(friendChatMessage);

        Friend friend1 = new Friend();
        friend1.setUser(user);
        friend1.setFriend(friend);
        friend1.setFriendStatus(FriendStatus.REQUESTED);
        friend1.setCreatedAt(ZonedDateTime.now());
        friend1.setFriendChatMessage(friendChatMessage);

        Friend friend2 = new Friend();
        friend2.setUser(friend);
        friend2.setFriend(user);
        friend2.setFriendStatus(FriendStatus.PENDING);
        friend2.setCreatedAt(ZonedDateTime.now());
        friend2.setFriendChatMessage(friendChatMessage);

        friendRepository.saveAll(List.of(friend1, friend2));
    }

    public void acceptFriendRequest(long friendId, AcceptFriendRequest acceptFriendRequest) {
        if (!acceptFriendRequest.accept()) {
            deleteFriend(friendId);
            return;
        }

        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserIdAndFriendId(user.getId(), friendId);

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        friends.forEach(friend -> friend.setFriendStatus(FriendStatus.ACCEPTED));

        friendRepository.saveAll(friends);
    }

    public List<FriendDto> getFriends(String search) {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserId(user.getId()).and(hasFriendStatus(FriendStatus.ACCEPTED));
        if (search != null) {
            friendSpecification = friendSpecification.and(hasFriendContainingText(search));
        }

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        return friends.stream()
                .map(FriendMapper::userToFriendDto)
                .toList();
    }
}
