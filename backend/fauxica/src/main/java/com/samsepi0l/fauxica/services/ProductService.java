package com.samsepi0l.fauxica.services;

import com.samsepi0l.fauxica.ProductRepository;
import com.samsepi0l.fauxica.classes.CreditCard;
import com.samsepi0l.fauxica.classes.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CreditCardService creditCardService;


    public List<Product> getHomeProducts() {
        // returns the top 3 highest-rated products in the DB
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "rating")).subList(0, 3);
    }

    public List<Product> getAllProducts() { return productRepository.findAll(); }

    public Product getProduct(String id) { return productRepository.findBy_id(id); }

    /**
     * Function to execute the Python Machine Learning script and get the 5 most similar (description content based) suggestions
     * @param id Id of the selected product
     * @return List of recommended products
     */
    public List<Product> getRecommended(String id) {
        List<Product> recommended;
        // call python machine learning script to get recommended products and send them to the controller
        try {
            Process p = Runtime.getRuntime().exec("python3 ../recommend.py " + id);
            String s;
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            List<String> recommendedIds = new ArrayList<>();
            while ((s = stdInput.readLine()) != null) {
                recommendedIds.add(s);
            }
            recommended = new ArrayList<>();
            for(int i = 0; i < recommendedIds.size(); i++) {
                recommended.add(productRepository.findBy_id(recommendedIds.get(i)));
            }
        } catch (IOException e) {
            return Collections.emptyList();
        }

        return recommended;
    }

    public List<Product> searchProducts(String word) {
        List<Product> results = productRepository.findByNameLike(word);
        results.addAll(productRepository.findByWordInDescription(word));
        results = results.stream().distinct().toList(); // remove duplicates
        return results;
    }

    public int buyProduct(String prodId, int number, String ccId) {
        Product product = productRepository.findBy_id(prodId);
        int availability = product.getAvailable();
        // check if the selected number is bigger than the available
        if (availability <= 0) {
            return -1;
        }
        if (availability < number) {
            return -1;
        }
        float cost = number * product.getPrice();
        CreditCard cc = creditCardService.findBy_id(ccId);
        // check if the user can buy the selected item for the selected number of products
        if (cost > cc.getCredit()) {
            return -1;
        }

        if (creditCardService.reduceCredit(ccId, cc.getCredit()-cost) <= 0) {
            return -1;
        }

        return productRepository.buy(prodId, availability-number);
    }

}
