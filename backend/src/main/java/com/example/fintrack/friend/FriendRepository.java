package com.example.fintrack.friend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long>, JpaSpecificationExecutor<Friend> {

    Optional<Friend> findFriendByUserIdAndFriendIdAndFriendStatus(long userId, long friendId, FriendStatus friendStatus);

    boolean existsFriendByUserIdAndChatId(long userId, long chatId);

    List<Friend> findFriendsByChatId(long chatId);

    @Query("""
    SELECT f FROM Friend f
    LEFT JOIN f.chat.messages m
    WHERE f.user.id = :userId
    AND f.chat.isStarted = TRUE
    AND (LOWER(f.friend.email) LIKE CONCAT('%', LOWER(:search), '%')
    OR LOWER(f.friend.firstName) LIKE CONCAT('%', LOWER(:search), '%')
    OR LOWER(f.friend.lastName) LIKE CONCAT('%', LOWER(:search), '%')
    OR :search IS NULL)
    GROUP BY f.id
    ORDER BY MAX(COALESCE(m.sendTime, '1970-01-01')) DESC
    """)
    Page<Friend> findFriendsByUserIdAndFriendsStatusesAndSearch(
            @Param("userId") long userId,
            @Param("search") String search,
            Pageable pageable
    );
}
