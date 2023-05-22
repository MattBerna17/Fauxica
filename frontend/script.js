$(document).ready(function() {










    // --------------------------------- ACCOUNT ---------------------------------
    $(".save-changes-button").click(function(e) {
        // check whether every input is filled with a correct format and is not empty
        e.preventDefault();
        removeError();
        let errors = 0;
        $(".form-account *").filter(':input').each(function() {
            let errorflag = false;
            if (this.value == "") {
                $(this).addClass("error");
                if (!this.placeholder.includes("is empty!")) {
                    this.placeholder += " is empty!";
                }
                errorflag = true;
                errors++;
            }
            if (!errorflag) {
                $(this).removeClass("error");
                // remove the is empty string if there's no error
                this.placeholder = this.placeholder.split(" is empty!")[0];
            }
        });
        if (errors > 0) {
            addError(); 
            return;
        }
        var formData = $(".form-account").serialize();
        $.ajax({
            type: "POST",
            url: "",
            data: formData,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function(data) {
                // code if communication works
                console.log("Connection worked! :)");
                $(".error-msg").addClass("none");
            },
            error: function(data) {
                addError("Something went wrong while sending the data to the server, try again.");
            }
        });
    });

    $(".close-btn").click(function(e) {
        removeError();
    });

    function removeError() {
        $(".error-msg").addClass("none");
        $("main").css("margin-top", "8.2em");
    }

    function addError(msg = "An error occurred while checking the form...") {
        $("main").css("margin-top", "1em");
        $(".error-msg").removeClass("none");
        $(".error-msg .msg").text(msg);
    }
});