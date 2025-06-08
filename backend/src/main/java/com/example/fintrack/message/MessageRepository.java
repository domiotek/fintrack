package com.example.fintrack.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> getMessagesByIdLessThanEqualAndChatId(long messageId, long chatId, Pageable pageable);

    @Query("SELECT m from Message m where m.chat.id = :chatId order by m.id DESC")
    Page<Message> getFirstMessagesByChatId(@Param("chatId")long chatId, Pageable pageable);
}
