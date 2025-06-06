package com.example.fintrack.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> getMessagesByIdLessThanEqualAndChatId(long messageId, long chatId, Pageable pageable);
}
