package com.example.fintrack.bill;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;

    public PagedModel<EventBillDto> getEventBills(long eventId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Bill> bills = billRepository.findBillsByEventId(eventId, pageRequest);

        return new PagedModel<>(bills.map(BillMapper::billToBillDto));
    }
}
