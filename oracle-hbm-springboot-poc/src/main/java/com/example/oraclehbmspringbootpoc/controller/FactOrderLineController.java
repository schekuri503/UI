package com.example.oraclehbmspringbootpoc.controller;

import com.example.oraclehbmspringbootpoc.dao.FactOrderLineDao;
import com.example.oraclehbmspringbootpoc.model.FactOrderLine;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order-lines")
public class FactOrderLineController {
    private final FactOrderLineDao factOrderLineDao;

    public FactOrderLineController(FactOrderLineDao factOrderLineDao) {
        this.factOrderLineDao = factOrderLineDao;
    }

    @GetMapping
    public List<FactOrderLine> getTopOrderLines(@RequestParam(defaultValue = "10") int limit) {
        return factOrderLineDao.findTop(limit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FactOrderLine> getOrderLineById(@PathVariable Long id) {
        FactOrderLine orderLine = factOrderLineDao.findById(id);
        if (orderLine == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderLine);
    }
}
