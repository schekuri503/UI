package com.example.oraclehbmspringbootpoc.dao;

import com.example.oraclehbmspringbootpoc.model.DimCustomer;
import java.util.List;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class DimCustomerDao {
    private final SessionFactory sessionFactory;

    public DimCustomerDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional(readOnly = true)
    public List<DimCustomer> findTop(int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("from DimCustomer", DimCustomer.class)
                .setMaxResults(limit)
                .list();
    }

    @Transactional(readOnly = true)
    public DimCustomer findById(Long id) {
        return sessionFactory.getCurrentSession().get(DimCustomer.class, id);
    }
}
