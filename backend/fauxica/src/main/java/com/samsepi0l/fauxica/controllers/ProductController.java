package com.samsepi0l.fauxica.controllers;

import com.samsepi0l.fauxica.classes.Product;
import com.samsepi0l.fauxica.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// add the cross-origin permissions
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/home")
    public List<Product> getHomeProducts() {
        return productService.getHomeProducts();
    }

    @GetMapping("/allProducts")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @RequestMapping(value = "/product", method = RequestMethod.GET)
    public List<Product> getProduct(
            @RequestParam("id") String id
    ) {
        Product selected = productService.getProduct(id);
        List<Product> recommended = productService.getRecommended(id);
        recommended.add(0, selected); // The first element must be the selected item
        return recommended;
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public List<Product> search(
            @RequestParam("word") String word
    ) {
        return productService.searchProducts(word);
    }


    @RequestMapping(value = "/buy", method = RequestMethod.GET)
    public ResponseEntity<Product> buyProduct(
            @RequestParam String prodId,
            @RequestParam String number,
            @RequestParam String ccId
    ) {
        int n = Integer.parseInt(number); // cast the number from string to int
        Product p = productService.getProduct(prodId);
        int result = productService.buyProduct(prodId, n, ccId);
        HttpStatus status = (result > 0 ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(p, status);
    }

}
