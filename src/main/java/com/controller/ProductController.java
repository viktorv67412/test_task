package com.controller;


import com.entity.Product;
import com.repository.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.List;

@Controller
@RequestMapping("/rest/products")
public class ProductController {
    @Inject
    protected ProductRepository productRepository;

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.GET)
    public
    @ResponseBody
    boolean deleteProduct(@PathVariable("id") Integer id) {
        productRepository.delete(id);
        return true;
    }

    public static void main(String[] args) {
        System.out.println(System.getProperty("java.library.path"));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public
    @ResponseBody
    Product delete(@PathVariable("id") Integer id) {
        productRepository.delete(id);
        productRepository.flush();
        return new Product();
    }


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Product> findAll() {
        List<Product> products = productRepository.findAll();
        return products;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public
    @ResponseBody
    Product findById(@PathVariable("id") Integer id) {
        Product product = productRepository.findOne(id);
        return product;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public
    @ResponseBody
    Product create(@RequestBody Product product) {
        productRepository.saveAndFlush(product);
        return product;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public
    @ResponseBody
    Product update(@RequestBody Product product) {
        productRepository.saveAndFlush(product);
        return product;
    }

}
