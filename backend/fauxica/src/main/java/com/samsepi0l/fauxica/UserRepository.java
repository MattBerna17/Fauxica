package com.samsepi0l.fauxica;

import com.samsepi0l.fauxica.classes.User;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
/**
 * User repository to connect to the MongoDB collection
 */
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findBy_id(String id);

    @Query("{username: ?0, password: ?1, email: ?2}")
    List<User> findByJson(String username, String password, String email);

    @Query("{_id: ?0}")
    @Update("{$set: {username: ?1, password: ?2, email: ?3, card: ?4}}")
    int modifyUser(String id, String username, String password, String email, String card);
}
