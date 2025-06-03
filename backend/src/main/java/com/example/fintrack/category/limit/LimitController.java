package com.example.fintrack.category.limit;

import com.example.fintrack.category.dto.AddLimitDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/limits")
public class LimitController {

    private final LimitService limitService;

    @PostMapping
    public ResponseEntity<Void> addLimit(@RequestBody AddLimitDto addLimitDto) {
        limitService.addLimit(addLimitDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{limit-id}")
    public ResponseEntity<Void> deleteLimit(@PathVariable("limit-id")  Long id) {
        limitService.deleteLimit(id);

        return ResponseEntity.noContent().build();
    }
}
