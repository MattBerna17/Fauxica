package com.samsepi0l.fauxica.services;

import com.samsepi0l.fauxica.UserRepository;
import com.samsepi0l.fauxica.classes.CreditCard;
import com.samsepi0l.fauxica.classes.ResponseDataClass;
import com.samsepi0l.fauxica.classes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CreditCardService creditCardService;

    // Here we write the code to connect to the database
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public ResponseDataClass findUser(String username, String password, String email) {
        List<User> users = userRepository.findByJson(username, password, email);
        if (users.size() == 0) {
            return null;
        }
        User u = users.get(0);
        return new ResponseDataClass(u, creditCardService.findBy_id(u.getCard()));
    }

    public ResponseDataClass registerUser(String username, String password, String email, String card_number, String month, String cvv) {
        if (!userRepository.findByJson(username, password, email).isEmpty()) {
            return null; // someone has the same credentials
        }
        // check if the credit card exists
        List<CreditCard> ccs = creditCardService.findCreditCard(card_number ,month, cvv);
        if (ccs.isEmpty()) {
            return null; // this means that there's no such credit card, thus error
        }
        List<User> users = this.allUsers();
        String lastId = users.get(users.size()-1).get_id();
        int number = Integer.parseInt(lastId.substring(4));
        number++;
        String nextId = "User" + number;
        User newUser = new User(nextId, username, password, email, ccs.get(0).get_id());
        userRepository.insert(newUser);
        return new ResponseDataClass(newUser, ccs.get(0));
    }

    public ResponseDataClass modifyUser(String id, String username, String password, String email, String card_number, String month, String cvv) {
        // check if the card exists
        List<CreditCard> ccs = creditCardService.findCreditCard(card_number ,month, cvv);
        if (ccs.isEmpty()) {
            return null;
        }
        if (userRepository.modifyUser(id, username, password, email, ccs.get(0).get_id()) <= 0) {
            return null;
        }
        return this.findUser(username, password, email);
    }
}
