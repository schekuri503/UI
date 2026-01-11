package com.example.oraclehbmspringbootpoc.controller;

import com.example.oraclehbmspringbootpoc.dao.DimProductDao;
import com.example.oraclehbmspringbootpoc.model.DimProduct;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class DimProductController {
    private final DimProductDao dimProductDao;

    public DimProductController(DimProductDao dimProductDao) {
        this.dimProductDao = dimProductDao;
    }

    @GetMapping
    public List<DimProduct> getTopProducts(@RequestParam(defaultValue = "10") int limit) {
        return dimProductDao.findTop(limit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DimProduct> getProductById(@PathVariable Long id) {
        DimProduct product = dimProductDao.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
}
