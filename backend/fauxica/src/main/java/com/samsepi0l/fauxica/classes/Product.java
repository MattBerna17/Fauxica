package com.samsepi0l.fauxica.classes;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Products")
@Data
@AllArgsConstructor
@NoArgsConstructor
/**
 * Class to represent the Products
 */
public class Product {
    @Id
    private String _id;
    private String name;
    private float price;
    private String description;
    private int available;
    private float rating;
    private String url;
}
