package com.example.fintrack.user;

import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.dto.UserProfileCurrencyDto;
import com.example.fintrack.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserProvider userProvider;

    public String test(){
        User user = userProvider.getLoggedUser();
        return user.getEmail();
    }

    public UserProfileDto profile() {
        User user = userProvider.getLoggedUser();
        UserProfileCurrencyDto userProfileCurrencyDto = UserProfileCurrencyDto.builder()
                .name(user.getCurrency().getName())
                .code(user.getCurrency().getCode())
                .build();
        return UserProfileDto.builder()
                .firstName(user.getFirstName())
                .email(user.getEmail())
                .currency(userProfileCurrencyDto)
                .build();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
