package com.example.oraclehbmspringbootpoc.dao;

import com.example.oraclehbmspringbootpoc.model.FactOrder;
import java.util.List;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class FactOrderDao {
    private final SessionFactory sessionFactory;

    public FactOrderDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional(readOnly = true)
    public List<FactOrder> findTop(int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("from FactOrder order by orderId", FactOrder.class)
                .setMaxResults(limit)
                .list();
    }

    @Transactional(readOnly = true)
    public FactOrder findById(Long id) {
        return sessionFactory.getCurrentSession().get(FactOrder.class, id);
    }
}
