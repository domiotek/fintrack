package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.BillDto;
import com.example.fintrack.bill.dto.UpdateBillDto;
import com.example.fintrack.util.enums.SortDirection;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/bills")
@AllArgsConstructor
public class BillController {

    private BillService billService;

    @GetMapping
    public ResponseEntity<Page<BillDto>> getUserBills(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "ASC") SortDirection sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(billService.getUserBills(from, to, categoryId, sortDirection, page, size));
    }

    @PutMapping("/{bill-id}")
    public ResponseEntity<Void> updateUserBill(
            @PathVariable("bill-id") long billId,
            @RequestBody UpdateBillDto updateBillDto
    ) {
        billService.updateUserBill(billId, updateBillDto);

        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Void> addUserBill(@RequestBody @Valid AddBillDto addBillDto) {
        billService.addUserBill(addBillDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{bill-id}")
    public ResponseEntity<Void> deleteUserBill(@PathVariable("bill-id") Long id) {
        billService.deleteUserBill(id);

        return ResponseEntity.noContent().build();
    }
}
