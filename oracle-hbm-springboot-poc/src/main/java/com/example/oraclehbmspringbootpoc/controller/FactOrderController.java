package com.example.oraclehbmspringbootpoc.controller;

import com.example.oraclehbmspringbootpoc.dao.FactOrderDao;
import com.example.oraclehbmspringbootpoc.model.FactOrder;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class FactOrderController {
    private final FactOrderDao factOrderDao;

    public FactOrderController(FactOrderDao factOrderDao) {
        this.factOrderDao = factOrderDao;
    }

    @GetMapping
    public List<FactOrder> getTopOrders(@RequestParam(defaultValue = "10") int limit) {
        return factOrderDao.findTop(limit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FactOrder> getOrderById(@PathVariable Long id) {
        FactOrder order = factOrderDao.findById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }
}
