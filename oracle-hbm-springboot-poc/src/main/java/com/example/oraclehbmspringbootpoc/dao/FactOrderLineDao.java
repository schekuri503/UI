package com.example.oraclehbmspringbootpoc.dao;

import com.example.oraclehbmspringbootpoc.model.FactOrderLine;
import java.util.List;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class FactOrderLineDao {
    private final SessionFactory sessionFactory;

    public FactOrderLineDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional(readOnly = true)
    public List<FactOrderLine> findTop(int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("from FactOrderLine", FactOrderLine.class)
                .setMaxResults(limit)
                .list();
    }

    @Transactional(readOnly = true)
    public FactOrderLine findById(Long id) {
        return sessionFactory.getCurrentSession().get(FactOrderLine.class, id);
    }
}
