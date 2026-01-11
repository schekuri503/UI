package com.example.oraclehbmspringbootpoc.controller;

import com.example.oraclehbmspringbootpoc.dao.DimCustomerDao;
import com.example.oraclehbmspringbootpoc.model.DimCustomer;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class DimCustomerController {
    private final DimCustomerDao dimCustomerDao;

    public DimCustomerController(DimCustomerDao dimCustomerDao) {
        this.dimCustomerDao = dimCustomerDao;
    }

    @GetMapping
    public List<DimCustomer> getTopCustomers(@RequestParam(defaultValue = "10") int limit) {
        return dimCustomerDao.findTop(limit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DimCustomer> getCustomerById(@PathVariable Long id) {
        DimCustomer customer = dimCustomerDao.findById(id);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }
}
