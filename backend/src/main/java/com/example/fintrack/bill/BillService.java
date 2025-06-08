package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.*;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.event.Event;
import com.example.fintrack.event.EventRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.utils.enums.SortDirection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

import static com.example.fintrack.bill.BillSpecification.*;
import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final CurrencyRepository currencyRepository;
    private final CurrencyConverter currencyConverter;
    private final UserProvider userProvider;

    public Page<EventBillDto> getEventBills(long eventId, int page, int size) {
        User user = userProvider.getLoggedUser();

        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Bill> bills = billRepository.findBillsByEventId(eventId, pageRequest);

        return bills.map(bill -> BillMapper.billToEventBillDto(bill, currencyConverter, user));
    }

    public void addBillToEvent(AddBillEventDto addBillEventDto, long eventId) {
        User user = userProvider.getLoggedUser();

        List<Category> categories = categoryRepository.findCategoryByUserIdAndIsDefault(user.getId(), true);

        if (categories.size() != 2) {
            throw CATEGORY_DOES_NOT_EXIST.getError();
        }

        Category defaultCategory = categories.getLast();

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
        bill.setCategory(defaultCategory);
        bill.setPaidBy(user);

        billRepository.save(bill);
    }

    public void updateUserBill(long billId, UpdateBillDto updateBillDto) {
        User user = userProvider.getLoggedUser();

        Bill bill = billRepository.findBillByIdAndUserId(billId, user.getId())
                .orElseThrow(BILL_DOES_NOT_EXIST::getError);

        if (updateBillDto.name() != null) {
            bill.setName(updateBillDto.name());
        }
        if (updateBillDto.date() != null) {
            bill.setDate(updateBillDto.date());
        }
        if (updateBillDto.amount() != null) {
            bill.setAmount(updateBillDto.amount());
        }
        if (updateBillDto.categoryId() != null) {
            Category category = categoryRepository.findById(updateBillDto.categoryId())
                    .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

            bill.setCategory(category);
        }

        billRepository.save(bill);
    }

    public void updateBillInEvent(long eventId, long billId, UpdateBillEventDto updateBillEventDto) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);

        Bill bill = billRepository.findBillByIdAndEventId(billId, eventId)
                .orElseThrow(BILL_DOES_NOT_EXIST::getError);

        if (updateBillEventDto.name() != null) {
            bill.setName(updateBillEventDto.name());
        }
        if (updateBillEventDto.date() != null) {
            bill.setDate(updateBillEventDto.date());
        }
        if (updateBillEventDto.amount() != null) {
            BigDecimal amount = currencyConverter
                    .convertFromGivenCurrencyToUSD(event.getCurrency(), updateBillEventDto.amount());

            bill.setAmount(amount);
        }

        billRepository.save(bill);
    }

    public void deleteBillFromEvent(long eventId, long billId) {
        Bill bill = billRepository.findBillByIdAndEventId(billId, eventId)
                .orElseThrow(BILL_DOES_NOT_EXIST::getError);

        billRepository.delete(bill);
    }

    public Page<BillDto> getUserBills(
            ZonedDateTime from, ZonedDateTime to, Long categoryId, SortDirection sortDirection, int page, int size
    ) {
        User user = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from, to));
        if(categoryId != null) {
            billSpecification = billSpecification.and(hasCategoryId(categoryId));
        }

        Sort.Direction sortDirectionSpringEnum = sortDirection.toSortDirection();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirectionSpringEnum, "category"));

        Page<Bill> bills = billRepository.findAll(billSpecification, pageRequest);

        return bills.map(bill -> BillMapper.billToBillDto(bill, currencyConverter, user));
    }

    public void addUserBill(AddBillDto addBillDto) {
        User user = userProvider.getLoggedUser();

        Category category = categoryRepository.findCategoryByIdAndUserId(addBillDto.categoryId(), user.getId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        Currency currency = currencyRepository.findById(addBillDto.currencyId())
                .orElseThrow(CURRENCY_DOES_NOT_EXIST::getError);

        Bill bill = BillMapper.addBillDtoToBill(addBillDto, category, currency, user);

        billRepository.save(bill);
    }

    public void deleteUserBill(long billId) {
        User user = userProvider.getLoggedUser();

        Bill bill = billRepository.findBillByIdAndUserId(billId, user.getId())
                .orElseThrow(BILL_DOES_NOT_EXIST::getError);

        billRepository.delete(bill);
    }
}
