package com.example.fintrack.userevent;

import com.example.fintrack.event.enums.EventStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class UserEventSpecification {

    public static Specification<UserEvent> hasUserId(long id) {
        return (root, query, builder) -> builder.equal(root.get("user").get("id"), id);
    }

    public static Specification<UserEvent> hasEventName(String name) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("event").get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<UserEvent> hasEventStatus(EventStatus eventStatus) {
        LocalDateTime now = LocalDateTime.now();

        return switch (eventStatus) {
            case UPCOMING -> (root, query, builder) -> builder
                    .greaterThan(root.get("event").get("startDateTime"), now);
            case ONGOING -> (root, query, builder) -> builder.or(
                    builder.isNull(root.get("event").get("endDateTime")),
                    builder.greaterThan(root.get("event").get("endDateTime"), now)
            );
            case FINISHED -> (root, query, builder) -> builder
                    .lessThan(root.get("event").get("endDateTime"), now);
        };
    }

    public static Specification<UserEvent> hasEventStartedAfter(LocalDateTime date) {
        return (root, query, builder) -> builder.greaterThanOrEqualTo(root.get("event").get("startDateTime"), date);
    }

    public static Specification<UserEvent> hasEventStartedBefore(LocalDateTime date) {
        return (root, query, builder) -> builder.lessThanOrEqualTo(root.get("event").get("startDateTime"), date);
    }
}
