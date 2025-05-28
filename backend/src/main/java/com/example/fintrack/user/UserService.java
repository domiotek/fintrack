package com.example.fintrack.user;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.event.Event;
import com.example.fintrack.event.EventRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.dto.UserProfileDto;
import com.example.fintrack.userevent.UserEvent;
import com.example.fintrack.userevent.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserEventRepository userEventRepository;
    private final EventRepository eventRepository;
    private final UserProvider userProvider;

    public UserProfileDto profile() {
        User user = userProvider.getLoggedUser();

        return UserMapper.userToUserProfileDto(user);
    }

    public void addUserToEvent(long eventId, long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);
        User user = userRepository.findById(userId).orElseThrow(USER_DOES_NOT_EXIST::getError);

        Set<UserEvent> userEvents = event.getUsers();
        List<User> users = userEvents.stream()
                .map(UserEvent::getUser)
                .toList();

        if (users.contains(user)) {
            throw EVENT_ALREADY_CONTAINS_USER.getError();
        }

        UserEvent userEvent = new UserEvent();
        userEvent.setEvent(event);
        userEvent.setUser(user);
        userEvent.setIsFounder(false);

        userEventRepository.save(userEvent);
    }

    public void deleteUserFromEvent(long eventId, long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);

        Set<UserEvent> userEvents = event.getUsers();
        UserEvent userEvent = userEvents.stream()
                .filter(ue -> ue.getUser().getId() == userId)
                .findFirst()
                .orElseThrow(USER_DOES_NOT_EXIST::getError);

        if (userEvent.getIsFounder()) {
            throw USER_IS_FOUNDER.getError();
        }

        User user = userEvent.getUser();

        List<User> usersWhoPaidForBills = event.getBills().stream()
                .map(Bill::getPaidBy)
                .distinct()
                .toList();

        if (usersWhoPaidForBills.contains(user)) {
            throw USER_ALREADY_PAID.getError();
        }

        userEventRepository.delete(userEvent);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
