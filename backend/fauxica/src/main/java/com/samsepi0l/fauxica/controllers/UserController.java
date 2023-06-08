package com.samsepi0l.fauxica.controllers;

import com.samsepi0l.fauxica.classes.ResponseDataClass;
import com.samsepi0l.fauxica.classes.User;
import com.samsepi0l.fauxica.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// add cross-origin permissions
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;


    @RequestMapping(value = "/login", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ResponseDataClass> findUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email
    ) {
        ResponseDataClass data = userService.findUser(username, password, email);
        HttpStatus response = (data == null ? HttpStatus.NOT_ACCEPTABLE : HttpStatus.OK);
        return new ResponseEntity<>(data, response);
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ResponseDataClass> registerUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("number") String number,
            @RequestParam("month") String month,
            @RequestParam("cvv") String cvv
    ) {
        ResponseDataClass data = userService.registerUser(username, password, email, number, month, cvv);
        HttpStatus response = (data == null ? HttpStatus.NOT_ACCEPTABLE : HttpStatus.OK);
        return new ResponseEntity<>(data, response);
    }

    @RequestMapping(value = "/modify", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ResponseDataClass> modifyUser(
            @RequestParam("_id") String id,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("card_number") String card_number,
            @RequestParam("month") String month,
            @RequestParam("cvv") String cvv
    ) {
        ResponseDataClass data = userService.modifyUser(id, username, password, email, card_number, month, cvv);
        HttpStatus status = (data == null ? HttpStatus.NOT_ACCEPTABLE : HttpStatus.OK);
        return new ResponseEntity<>(data, status);
    }
}
