package com.example.fintrack.userevent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserEventRepository extends JpaRepository<UserEvent, Long>, JpaSpecificationExecutor<UserEvent> {
}
