package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.BillDto;
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
    public ResponseEntity<Page<BillDto>> getBills(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "ASC") SortDirection sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(billService.getBills(from, to, categoryId, sortDirection, page, size));
    }

    @PostMapping
    public ResponseEntity<Void> addBill(@RequestBody @Valid AddBillDto addBillDto) {
        billService.addBill(addBillDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{bill-id}")
    public ResponseEntity<Void> deleteBill(@PathVariable("bill-id") Long id) {
        billService.deleteBill(id);

        return ResponseEntity.noContent().build();
    }
}
