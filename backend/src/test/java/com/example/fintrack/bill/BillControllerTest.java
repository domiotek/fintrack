package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.BillDto;
import com.example.fintrack.bill.dto.UpdateBillDto;
import com.example.fintrack.category.dto.BillCategoryDto;
import com.example.fintrack.security.service.JwtService;
import com.example.fintrack.utils.enums.SortDirection;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BillController.class)
@AutoConfigureMockMvc(addFilters = false)
class BillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BillService billService;

    @Autowired
    private ObjectMapper objectMapper;

    private ZonedDateTime from;
    private ZonedDateTime to;

    @BeforeEach
    void setUp() {
        from = ZonedDateTime.now().minusDays(30);
        to = ZonedDateTime.now();
    }

    @Test
    void shouldReturnUserBills() throws Exception {
        BillDto billDto = new BillDto(1L, "cos", new BillCategoryDto(1L, "cps2", "#H23123"), ZonedDateTime.now(), BigDecimal.ONE, BigDecimal.TEN, 1L); // uzupełnij danymi, jeśli trzeba
        Page<BillDto> billPage = new PageImpl<>(List.of(billDto));

        Mockito.when(billService.getUserBills(any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(billPage);

        mockMvc.perform(get("/bills")
                        .param("from", from.toString())
                        .param("to", to.toString())
                        .param("sortDirection", SortDirection.ASC.name())
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void shouldUpdateUserBill() throws Exception {
        UpdateBillDto dto = new UpdateBillDto("Updated", ZonedDateTime.now(), BigDecimal.ONE, null);

        mockMvc.perform(put("/bills/{bill-id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNoContent());

        Mockito.verify(billService).updateUserBill(eq(1L), any(UpdateBillDto.class));
    }

    @Test
    void shouldAddUserBill() throws Exception {
        AddBillDto dto = new AddBillDto("Test", BigDecimal.TEN, 1L, 1L, ZonedDateTime.now());


        mockMvc.perform(post("/bills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        Mockito.verify(billService).addUserBill(any(AddBillDto.class));
    }

    @Test
    void shouldDeleteUserBill() throws Exception {
        mockMvc.perform(delete("/bills/{bill-id}", 1L))
                .andExpect(status().isNoContent());

        Mockito.verify(billService).deleteUserBill(1L);
    }
}
