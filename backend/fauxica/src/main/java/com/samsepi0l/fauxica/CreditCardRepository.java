package com.samsepi0l.fauxica;

import com.samsepi0l.fauxica.classes.CreditCard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;

/**
 * Interface to connect to the cc's collection in the MongoDB server
 */
public interface CreditCardRepository extends MongoRepository<CreditCard, String> {
    CreditCard findBy_id(String id);

    @Query("{number: ?0, month: ?1, cvv: ?2}")
    List<CreditCard> findByJson(String number, String month, String cvv);

    @Query("{_id: ?0}")
    @Update("{$set: {credit: ?1}}")
    int reduceCredit(String id, float credit);
}
