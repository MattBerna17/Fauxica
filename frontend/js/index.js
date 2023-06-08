$(document).ready(function() {
    // load the 3 images in the home page
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/products/home",
        data: null,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            removeError();
            let element = data[0];
            $(".right-col").append("<div class='card card-1' style='background-image: url(" + element['url'] + ");'> <div class='card-details'> <div> <a href='./pages/product.html?id=" + element['_id'] + "' class='product-title'>" + element['name'] + "</a> </div> <div class='product-price'>$" + element['price'] + "</div> </div> </div>");
            element = data[1];
            $(".right-col").append("<div class='card card-2' style='background-image: url(" + element['url'] + ");'> <div class='card-details'> <div> <a href='./pages/product.html?id=" + element['_id'] + "' class='product-title'>" + element['name'] + "</a> </div> <div class='product-price'>$" + element['price'] + "</div> </div> </div>");
            element = data[2];
            $(".right-col").append("<div class='card card-3' style='background-image: url(" + element['url'] + ");'> <div class='card-details'> <div> <a href='./pages/product.html?id=" + element['_id'] + "' class='product-title'>" + element['name'] + "</a> </div> <div class='product-price'>$" + element['price'] + "</div> </div> </div>");
        },
        error: function(data) {
            addError("Error while connecting to the server: try again.");
        }
    });

    function removeError() {
        $(".error-msg").addClass("none");
    }

    function removeConfirmation() {
        $(".confirmation-msg").addClass("none");
    }

    function addError(msg = "An error occurred while checking the form...") {
        $(".error-msg").removeClass("none");
        $(".error-msg .err-msg").text(msg);
    }
})