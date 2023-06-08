package com.samsepi0l.fauxica.services;

import com.samsepi0l.fauxica.CreditCardRepository;
import com.samsepi0l.fauxica.classes.CreditCard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditCardService {
    @Autowired
    private CreditCardRepository ccRepository;

    // Here we write the code to connect to the database
    public List<CreditCard> allCreditCards() {
        return ccRepository.findAll();
    }

    public List<CreditCard> findCreditCard(String number, String month, String cvv) {
        return ccRepository.findByJson(number, month, cvv);
    }

    public CreditCard findBy_id(String id) {
        return ccRepository.findBy_id(id);
    }

    public int reduceCredit(String id, float credit) {
        return ccRepository.reduceCredit(id, credit);
    }
}
