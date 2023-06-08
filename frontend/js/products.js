$(document).ready(function() {
    $(".no-result-msg").addClass("none");
    // get all the products in the db
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/products/allProducts",
        data: null,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            // data is an array of jsons with all the products: go through it and add the html code
            data.forEach(element => {
                $(".products-grid").append("<div class='card' style='background-image: url(" + element['url'] + ");'> <div class='card-details'> <div> <a href='./product.html?id=" + element['_id'] + "' class='product-title'>" + element['name'] + "</a> </div> <div class='product-price'>$" + element['price'] + "</div> </div> </div>");
            });
        },
        error: function(data) {
            addError("Error while connecting to the server: try again.");
        }
    });


    $(".search").click(function(e) {
        // get the search bar string and send the request to the backend end-point
        $(".no-result-msg").addClass("none");
        $(".products-grid").empty();
        let searchString = $("#search").val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/products/search?word=" + searchString,
            data: null,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function(data) {
                if (data.length == 0) {
                    $(".no-result-msg").removeClass("none");
                }
                // data is an array of jsons with all the products
                data.forEach(element => {
                    $(".products-grid").append("<div class='card' style='background-image: url(" + element['url'] + ");'> <div class='card-details'> <div> <a href='./product.html?id=" + element['_id'] + "' class='product-title'>" + element['name'] + "</a> </div> <div class='product-price'>$" + element['price'] + "</div> </div> </div>");
                });
            },
            error: function(data) {
                addError("Error while connecting to the server: try again.");
            }
        });
    });

    function removeError() {
        $(".error-msg").addClass("none");
    }

    function addError(msg) {
        $(".error-msg").removeClass("none");
        $(".error-msg .err-msg").text(msg);
    }

    $(".close-btn").click(function(e) {
        removeError();
    });
})