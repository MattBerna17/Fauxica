package com.samsepi0l.fauxica;

import com.samsepi0l.fauxica.classes.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
/**
 * Interface to connect to the MongoDB products' collection
 */
public interface ProductRepository extends MongoRepository<Product, String> {

    @Query("{name: {$regex: ?0, $options: 'i'}}")
    List<Product> findByNameLike(String name);
    @Query("{description: {$regex: ?0, $options: 'i'}}")
    List<Product> findByWordInDescription(String word);

    Product findBy_id(String id);

    @Query("{_id: ?0}")
    @Update("{$set: {available: ?1}}")
    int buy(String prodId, int available);
}
