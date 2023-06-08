/**
 * Function to save the current session infos about the user
 * @param {json} userInfo json containing user infos
 */
function saveDataInSession(userInfo) {
    sessionStorage.setItem("user", JSON.stringify(userInfo["user"]));
    sessionStorage.setItem("cc", JSON.stringify(userInfo["cc"]));
}

/**
 * Function to retrieve data saved in the current session
 * @returns json containing user infos saved for this session
 */
function getDataFromSession() {
    return {
        "user": JSON.parse(sessionStorage.getItem("user")),
        "cc": JSON.parse(sessionStorage.getItem("cc"))
    };
}

/**
 * Function to fill the input fields with user infos
 * @param {string} formname name of the target form
 */
function insertData(formname) {
    let userdata = getDataFromSession();
    let user = userdata['user'];
    let cc = userdata['cc'];

    $("." + formname + "-screen #username").val(user['username']);
    $("." + formname + "-screen #password").val(user['password']);
    $("." + formname + "-screen #email").val(user['email']);
    if (formname != "login") {
        $("." + formname + "-screen #card_number").val(cc['number']);
        $("." + formname + "-screen #month").val(cc['month']);
        $("." + formname + "-screen #cvv").val(cc['cvv']);
    }
}

/**
 * Function to remove every string present in the input fields of the selected form
 * @param {string} formname name of the target form
 */
function emptyData(formname) {
    $("." + formname + "-screen #username").val("");
    $("." + formname + "-screen #password").val("");
    $("." + formname + "-screen #email").val("");
    if (formname != "login") {
        $("." + formname + "-screen #card_number").val("");
        $("." + formname + "-screen #month").val("");
        $("." + formname + "-screen #cvv").val("");
    }
}

$(document).ready(function() {
    // if there's no user data, then the user did not login/register: must do it
    if (getDataFromSession()['user'] != null) {
        // i can modify the profile
        $("#modify-li").removeClass("not-available");
    }

    // --------------------------------- ACCOUNT PAGE ---------------------------------
    // when the user changes page, show only the selected page's elements
    $("#login-li").click(function(e) {
        $(".modify-screen").addClass("none");
        $(".register-screen").addClass("none");
        $(".save-changes-button").addClass("none");
        $(".register-button").addClass("none");
        $(".login-button").removeClass("none");
        $(".login-screen").removeClass("none");
        $("#login-li").addClass("active");
        $("#register-li").removeClass("active");
        $("#modify-li").removeClass("active");
        removeError();
        removeConfirmation();
        emptyData("login");
    });

    $("#register-li").click(function(e) {
        $(".modify-screen").addClass("none");
        $(".login-screen").addClass("none");
        $(".save-changes-button").addClass("none");
        $(".login-button").addClass("none");
        $(".register-button").removeClass("none");
        $(".register-screen").removeClass("none");
        $("#register-li").addClass("active");
        $("#login-li").removeClass("active");
        $("#modify-li").removeClass("active");
        removeError();
        removeConfirmation();
        emptyData("register")
    });

    $("#modify-li").click(function(e) {
        // you can click on it only if you have logged in
        if ($("#modify-li").hasClass("not-available")) {
            return;
        }
        $(".modify-screen").removeClass("none");
        $(".login-screen").addClass("none");
        $(".save-changes-button").removeClass("none");
        $(".login-button").addClass("none");
        $(".register-button").addClass("none");
        $(".register-screen").addClass("none");
        $("#register-li").removeClass("active");
        $("#login-li").removeClass("active");
        $("#modify-li").addClass("active");
        removeError();
        removeConfirmation();
        insertData("modify");
    });
    
    
    $(".save-changes-button").click(function(e) {
        checkAndSendData("modify-form", e);
    });

    $(".login-button").click(function(e) {
        checkAndSendData("login-form", e);
    });

    $(".register-button").click(function(e) {
        checkAndSendData("register-form", e);
    })

    $(".close-btn").click(function(e) {
        removeError();
        removeConfirmation();
    });

    /**
     * Function to check if any input field in the selected form is empty, in that case returns an error. Otherwise, send the data to the correct backend end-point (and handle the errors in case they occure), and save the session data 
     * @param {string} formname name of the selected form
     * @param {Event} e 
     * @returns none
     */
    function checkAndSendData(formname, e) {
        // check whether every input is filled with a correct format and is not empty
        e.preventDefault();
        removeConfirmation();
        removeError();
        let errors = 0;
        $("#" + formname +  " *").filter(':input').each(function() {
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
        var formData = $("#" + formname).serializeArray();
        var json = {};
        if (formname.includes("modify")) {
            json['_id'] = getDataFromSession()['user']['_id'];
        }
        $.each(formData, function() {
            json[this.name] = this.value;
        });

        
        
        let apiUrl = "http://localhost:8080/api/users/";
        if (formname.includes("login")) {
            apiUrl += "login";
        } else if (formname.includes("register")) {
            apiUrl += "register";
        } else if (formname.includes("modify")) {
            apiUrl += "modify";
        }
        $.ajax({
            type: "GET",
            url: apiUrl,
            data: json,
            dataType: "json",
            statusCode: {
                // debug the error code in case
                406: function(xhr) {
                    if (formname.includes("login")) {
                        addError("Failed to login, check again the credentials.");
                    } else if (formname.includes("modify")) {
                        addError("You should change the values to modify the profile.");
                    } else {
                        addError("An error occurred: check again the data and try later.");
                    }
                },
                400: function(xhr) {
                    addError("You are alredy registered.");
                }
            },
            contentType: "application/json;charset=utf-8",
            success: function(data) {
                saveDataInSession(data);
                $("#modify-li").removeClass("not-available");
                $(".confirmation-msg").removeClass("none");
                if (formname.includes("login")) {
                    $(".confirmation-msg .conf-msg").text("Logged in successfully");
                } else if (formname.includes("register")) {
                    $(".confirmation-msg .conf-msg").text("Registered successfully");
                } else if (formname.includes("modify")) {
                    $(".confirmation-msg .conf-msg").text("Modified successfully the account informations");
                } else {
                    $(".confirmation-msg .conf-msg").text("Action successfully completed");
                }
            },
            error: function(data) {
                addError("Something went wrong while sending the data to the server, try again.");
            }
        });
    }

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
});