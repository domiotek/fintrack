package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillEventDto;
import com.example.fintrack.bill.dto.EventBillDto;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.event.Event;
import com.example.fintrack.event.EventRepository;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CurrencyConverter currencyConverter;

    public PagedModel<EventBillDto> getEventBills(long eventId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Bill> bills = billRepository.findBillsByEventId(eventId, pageRequest);

        return new PagedModel<>(bills.map(BillMapper::billToEventBillDto));
    }

    public void addBillToEvent(AddBillEventDto addBillEventDto, long eventId) {
        User user = userRepository.findById(addBillEventDto.paidById()).orElseThrow(USER_DOES_NOT_EXIST::getError);
        Category category = categoryRepository.findById(addBillEventDto.categoryId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);
        Currency currency = event.getCurrency();

        BigDecimal amountInEventCurrency = addBillEventDto.amount();
        BigDecimal amountInUSD = currencyConverter
                .convertFromGivenCurrencyToUSD(event.getCurrency(), amountInEventCurrency);

        Bill bill = new Bill();
        bill.setName(addBillEventDto.name());
        bill.setDate(addBillEventDto.date());
        bill.setAmount(amountInUSD);
        bill.setEvent(event);
        bill.setCurrency(currency);
        bill.setCategory(category);
        bill.setPaidBy(user);

        billRepository.save(bill);
    }
}
