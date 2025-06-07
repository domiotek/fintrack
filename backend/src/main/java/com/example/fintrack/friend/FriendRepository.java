package com.example.fintrack.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long>, JpaSpecificationExecutor<Friend> {

    List<Friend> findFriendsByUserIdAndFriendStatus(long userId, FriendStatus friendStatus);

    Optional<Friend> findFriendByUserIdAndFriendIdAndFriendStatus(long userId, long friendId, FriendStatus friendStatus);

    List<Friend> findFriendsByChatId(long chatId);
  
    @Query("SELECT f FROM Friend f JOIN User u on u.id = :userId WHERE f.friendStatus = :friendStatus")
    List<Friend> findFriendsByUserAndFriendStatus(@Param("userId") long userId,
                                                  @Param("friendStatus") FriendStatus friendStatus);
}
