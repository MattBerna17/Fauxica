package com.samsepi0l.fauxica.classes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "CreditCards")
@Data
@AllArgsConstructor
@NoArgsConstructor
/**
 * Class to define the Credit Card objects
 */
public class CreditCard {
    @Id
    private String _id;
    private String number;
    private String month;
    private String cvv;
    private float credit;
}
