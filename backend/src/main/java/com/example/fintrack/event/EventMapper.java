package com.example.fintrack.event;

import com.example.fintrack.chat.Chat;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.event.dto.*;
import com.example.fintrack.user.User;
import com.example.fintrack.userevent.UserEvent;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
                .chatId(userEvent.getEvent().getChat().getId())
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

    public static Event addEventDtoToEvent(AddEventDto addEventDto, Currency currency, Chat chat) {
        Event event = new Event();

        event.setName(addEventDto.name());
        event.setCurrency(currency);
        event.setStartDateTime(addEventDto.startDate());
        event.setEndDateTime(addEventDto.endDate());
        event.setChat(chat);

        return event;
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
                        ).setScale(2, RoundingMode.HALF_UP)
                )
                .userCurrency(
                        currencyConverter.convertFromUSDToGivenCurrency(
                                user.getCurrency(), event.getStartDateTime().toLocalDate(), settlementEntry.getValue()
                        ).setScale(2, RoundingMode.HALF_UP)
                )
                .build();

        return SettlementDto.builder()
                .user(settlementUserDto)
                .settlement(settlementCurrencyDto)
                .build();
    }
}
