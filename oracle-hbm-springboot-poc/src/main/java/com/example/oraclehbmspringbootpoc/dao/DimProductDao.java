package com.example.oraclehbmspringbootpoc.dao;

import com.example.oraclehbmspringbootpoc.model.DimProduct;
import java.util.List;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DimProductDao {
    private final SessionFactory sessionFactory;

    public DimProductDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional(readOnly = true)
    public List<DimProduct> findTop(int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("from DimProduct", DimProduct.class)
                .setMaxResults(limit)
                .list();
    }

    @Transactional(readOnly = true)
    public DimProduct findById(Long id) {
        return sessionFactory.getCurrentSession().get(DimProduct.class, id);
    }
}
