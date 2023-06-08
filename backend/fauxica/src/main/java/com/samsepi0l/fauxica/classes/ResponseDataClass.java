package com.samsepi0l.fauxica.classes;

/**
 * Class used to send to the frontend both the user and the credit card infos
 */
public class ResponseDataClass {
    private User user;
    private CreditCard cc;


    public ResponseDataClass(User user, CreditCard cc) {
        this.user = user;
        this.cc = cc;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CreditCard getCc() {
        return cc;
    }

    public void setCc(CreditCard cc) {
        this.cc = cc;
    }
}
