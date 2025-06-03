package com.example.fintrack.event;

import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.event.dto.*;
import com.example.fintrack.user.User;
import com.example.fintrack.userevent.UserEvent;

import java.math.BigDecimal;
import java.util.Map;

public class EventMapper {

    public static EventDto userEventToEventDto(UserEvent userEvent) {
        return EventDto.builder()
                .id(userEvent.getEvent().getId())
                .name(userEvent.getEvent().getName())
                .status(userEvent.getEvent().getEventStatus())
                .isFounder(userEvent.getIsFounder())
                .numberOfNotifications(2)
                .currency(EventCurrencyDto.builder()
                        .id(userEvent.getEvent().getCurrency().getId())
                        .name(userEvent.getEvent().getCurrency().getName())
                        .code(userEvent.getEvent().getCurrency().getCode())
                        .build()
                )
                .users(userEvent.getEvent().getUsers().stream()
                        .map(UserEvent::getUser)
                        .map(user -> EventUserDto.builder()
                                .id(user.getId())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .build()
                        )
                        .toList()
                )
                .build();
    }

    public static SettlementDto settlementEntryToSettlementDto(
            Map.Entry<User, BigDecimal> settlementEntry, CurrencyConverter currencyConverter, Event event, User user
    ) {
        SettlementUserDto settlementUserDto = SettlementUserDto.builder()
                .id(settlementEntry.getKey().getId())
                .firstName(settlementEntry.getKey().getFirstName())
                .lastName(settlementEntry.getKey().getLastName())
                .build();

        SettlementCurrencyDto settlementCurrencyDto = SettlementCurrencyDto.builder()
                .eventCurrency(
                        currencyConverter.convertFromUSDToGivenCurrency(
                                event.getCurrency(), event.getStartDateTime().toLocalDate(), settlementEntry.getValue()
                        )
                )
                .userCurrency(
                        currencyConverter.convertFromUSDToGivenCurrency(
                                user.getCurrency(), event.getStartDateTime().toLocalDate(), settlementEntry.getValue()
                        )
                )
                .build();

        return SettlementDto.builder()
                .user(settlementUserDto)
                .settlement(settlementCurrencyDto)
                .build();
    }
}
