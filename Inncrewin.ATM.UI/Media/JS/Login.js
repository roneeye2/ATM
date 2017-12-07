$(document).ready(function () {
    try
    {
        //Bootstrap Tooltip
        $('[data-toggle="tooltip"]').tooltip();

        //Loading Footer
        $('#footer').load('/footer.html');

        //Floating Labels
        $('.rze-logindet .form-control').on('focus blur', function (e) {
            $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');

        ClearSessionStorage();
        GetTenant();
        //Enter key in login page will invokes Log In Func
        $(document).on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                e.preventDefault();
                ValidateUser();
            }
        });

        //Tabs on Username TextBox
        $(document).on('keydown', '#txtUsername', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 9) {
                e.preventDefault();
                $("#txtPassword").focus();
            }
        });

        //Tabs and Shift Tabs on Password TextBox
        $(document).on('keydown', '#txtPassword', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 9) {
                e.preventDefault();
                if (e.shiftKey) {
                    $("#txtUsername").focus();
                }
                else {
                    $("#lnkLogIn").focus();
                }
            }
        });

        // Check for Remember Me option selected in last login
        setTimeout(function () {
        if (localStorage.RememberMeChkbx && localStorage.RememberMeChkbx != '') {
            $('#chkboxRememberMe').attr('checked', 'checked');
        } else {
            $('#chkboxRememberMe').removeAttr('checked');
        }
        if (localStorage.EnteredName != "" && localStorage.EnteredName !== undefined) {
            $('#txtUsername').val(localStorage.EnteredName);
            $("#txtTenantCode").parents().addClass("focused");
            $('#txtUsername').parents().addClass("focused");
            $('#txtPassword').parents().addClass("focused");
        }
        else {
            $('#txtUsername').val(null);
            $('#txtUsername').parents().removeClass("focused");
        }

        if (localStorage.EnteredPwd != "") {
            $('#txtPassword').val(localStorage.EnteredPwd);
           
        }
        else {
            $('#txtPassword').val("");
            $('#txtPassword').parents().removeClass("focused");
        } }, 100);
        
    }
    catch(error)
    {
        $().Logger.error("Login.js" + error);
    }
});

function GetTenant() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Login/GetTenantCode",
        "GET",
        null,
        function (response) {
            if (response !== null) {
                if (response.IsTenantCodeAvailable == true) {
                    if ($("#divTenantCode").length == 1) {
                        $("#divTenantCode").remove();
                    }
                }
            }
        });
    }
    catch (error) {
        $().Logger.error("Login.js ClearSessionStorage() -->" + error);
    }
}
//Check the Sessionstorage for Token, if present clear it on login page
function ClearSessionStorage() {
    try{
    if (sessionStorage.length > 0) {
        if (sessionStorage.getItem("RezCBTB2E")) {
            sessionStorage.removeItem("RezCBTB2E");
        }
        sessionStorage.removeItem("nextTab");
        sessionStorage.removeItem("prevTab");
        sessionStorage.removeItem("SavedTR");
        sessionStorage.removeItem("SavedER");
    }
    }
    catch (error) {
        $().Logger.error("Login.js ClearSessionStorage() -->" + error);
    }
}

// Validating User in Login 
function ValidateUser() {
    try {
    var userName = $("#txtUsername").val();
    var password = $("#txtPassword").val();
    var tCode = $("#txtTenantCode").val();

    if ((userName != undefined && userName.trim() === "") || (password != undefined && password.trim() === "") || (tCode != undefined && tCode.trim() === "")) {
        $("#lblValidateMsg").addClass("alert alert-danger");
        $("#lblValidateMsg").text("Please enter required fields.");
        $(window).scrollTop(0);
        return false;
    }

    // Check for Remember Me option is selected
    if ($('#chkboxRememberMe').is(':checked')) {
        // save username and password
        localStorage.EnteredName = $('#txtUsername').val();
        localStorage.EnteredPwd = $('#txtPassword').val();
        localStorage.EnteredTenantCode = $('#txtTenantCode').val();
        localStorage.RememberMeChkbx = $('#chkboxRememberMe').val();

        
    } else {      
        localStorage.EnteredName=""; 
        localStorage.EnteredPwd = "";
        localStorage.EnteredTenantCode = "";
        localStorage.RememberMeChkbx = '';
        //$('#txtUsername').val("");
        //$('#txtPassword').val("");
    }

    var LoginDetail = {
        Username: $("#txtUsername").val(),
        Password: $("#txtPassword").val(),
        TenantCode: $("#txtTenantCode").val()
    };

    floatinglbl();
    $("#lblValidateMsg").removeClass("alert alert-danger");
    $("#lblValidateMsg").text("");
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
    "Login/Login",
    "POST",
    LoginDetail,
    function (response) {
        if (response !== null) {
            if (response.IsValid == "Success") {
                if (typeof (Storage) !== "undefined") {
                    sessionStorage.RezCBTB2E = response.ValidateStr.AccessToken;
                }
                window.location.href = "/Dashboard.html"; //uncomment if commented...  commented for testing
                // $("#lblValidateMsg").text(response.IsValid); // Added for testing, removed after testing
            }
            else if (response.IsValid == 4 && response.UserName != "" && response.UserName != null && response.UserName != undefined) {
                $.get("/PasswordExpired.html", function (data) {
                    $("#footer").append(data);
                    $("#resetExpiredPassword #userId").val(response.UserName);
                    $("#resetExpiredPassword #changePassword").click();
                    $.unblockUI();
                    $("#txtUsername").val("");
                    $("#txtPassword").val("");
                    $('#resetExpiredPassword [data-toggle="tooltip"]').tooltip();
                });
            }
            else {
                $.unblockUI();
                $("#lblValidateMsg").text(response.IsValid);
                $("#lblValidateMsg").addClass("alert alert-danger");
                $("#txtClientCode").val("");
                $("#txtUsername").val("");
                $("#txtPassword").val("");
            }
        }
        $(window).scrollTop(0);
    },
    "json"
    );
}
      catch (error) {
        $().Logger.error("Login.js ClearSessionStorage() -->" + error);
    }
}

function floatinglbl() {
    

}


$(document).ready(function () { 
    //Floating Labels
    $('.rze-logindet .form-control').on('focus blur change', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur change');

    $('#txtPassword').parents().removeClass("focused");
    $('#txtUsername').parents().removeClass("focused");
});