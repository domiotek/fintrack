package com.example.fintrack.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT COUNT(f) FROM Chat c JOIN Friend f ON c.id=f.chat.id WHERE c.id = :chatId")
    public Long countUsersInChatByChatId(@Param("chatId") Long chatId);
}
