package com.example.fintrack.lastreadmessage;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LastReadMessageRepository extends JpaRepository<LastReadMessage, Long> {

    Optional<LastReadMessage> findLastReadMessageByUserIdAndChatId(Long userId, Long chatId);
}
