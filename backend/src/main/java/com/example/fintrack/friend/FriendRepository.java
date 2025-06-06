package com.example.fintrack.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long>, JpaSpecificationExecutor<Friend> {

    List<Friend> findFriendsByUserIdAndFriendStatus(long userId, FriendStatus friendStatus);

    Optional<Friend> findFriendByUserIdAndFriendIdAndFriendStatus(long userId, long friendId, FriendStatus friendStatus);
}
