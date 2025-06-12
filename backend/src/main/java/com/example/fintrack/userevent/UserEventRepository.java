package com.example.fintrack.userevent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface UserEventRepository extends JpaRepository<UserEvent, Long>, JpaSpecificationExecutor<UserEvent> {

    Optional<UserEvent> findUserEventByUserIdAndEventId(long userId, long eventId);

    boolean existsUserEventByUserIdAndEventId(long userId, long eventId);

    List<UserEvent> findUserEventsByEventId(long eventId);
}
