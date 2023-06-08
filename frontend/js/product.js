function saveDataInSession(userInfo) {
    sessionStorage.setItem("user", JSON.stringify(userInfo["user"]));
    sessionStorage.setItem("cc", JSON.stringify(userInfo["cc"]));
}

function getDataFromSession() {
    return {
        "user": JSON.parse(sessionStorage.getItem("user")),
        "cc": JSON.parse(sessionStorage.getItem("cc"))
    };
}

$(document).ready(function() {
    removeConfirmation();
    removeError();
    // --------------------------------- PRODUCT PAGE ---------------------------------
    // get the selected product ID passed through the search bar
    let urlParams = new URLSearchParams(window.location.search);
    let prod_id = urlParams.get('id');


    // load datas in the frontend: image, name, price, description, availability
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/products/product?id=" + prod_id,
        data: null,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            $(".loading-msg").addClass("none");
            $(".product-page").removeClass("none");
            // selected product
            let p = data[0];
            $(".left-col").append('<img class="product-image" src="' + p['url'] + '" alt="Product">');
            $(".name").text(p['name']);
            $("#prod-id").text(prod_id);
            $(".availability").text("Available: " + p['available']);
            $(".description").text(p['description']);
            $(".price").text("$" + p['price']);
            $(".choose-number").attr("max", p['available']);

            // suggested products
            for (let i = 1; i < data.length; i++) {
                $(".suggested").append("<div class='card' style='background-image: url(" + data[i]['url'] + ");'> <div class='card-details'> <div> <a href='./product.html?id=" + data[i]['_id'] + "' class='product-title'>" + data[i]['name'] + "</a> </div> <div class='product-price'>$" + data[i]['price'] + "</div> </div> </div>");
            }
        },
        error: function(data) {
            $(".loading-msg").addClass("none");
            addError("Failed to load the product: try again");
        }
    });


    $(".buy-btn").click(function(e) {
        // load the user data
        let user_info = getDataFromSession();
        if (user_info['user'] == null) {
            addError("You must be logged in to buy a product!");
            return;
        }
        let number = $(".choose-number").val();
        // data to send to the backend
        let purchase_json = {
            "prodId": prod_id,
            "number": number,
            "ccId": user_info['cc']['_id']
        };

        // every check on the price is done in the backend
        
        // if the user can buy it...
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/products/buy",
            data: purchase_json,
            dataType: "json",
            statusCode: {
                400: function(xhr) {
                    addError("You can't buy this product.");
                }
            },
            contentType: "application/json;charset=utf-8",
            success: function(data) {
                addConfirmation("Purchase completedy successfully!");
            },
            error: function(data) {
                console.log(data);
                addError("Error while sending data to the server: try again later.");
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

    function addConfirmation(msg) {
        $(".confirmation-msg").removeClass("none");
        $(".confirmation-msg .conf-msg").text(msg);
    }

    function removeConfirmation() {
        $(".confirmation-msg").addClass("none");
    }

    $(".close-btn").click(function(e) {
        removeError();
        removeConfirmation();
    });
});