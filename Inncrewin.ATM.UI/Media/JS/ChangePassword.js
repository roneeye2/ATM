function changeUserPassword() {
    $("#savedSuccessfully").css("display", "none");
    $("#passwordMismatch").css("display", "none");
    $("#invalidPassword").css("display", "none");
    $("#samePassword").css("display", "none");
    $("#invalidCredential").css("display", "none");
    $("#retry").css("display", "none");

    if ($("#oldPassword").val().length < 7 || $("#newPassword").val().length < 7 || $("#verifyNewPassword").val().length < 7) {
        $("#oldPassword").val('')
        $("#oldPassword").focus();
        $("#newPassword").val('');
        $("#verifyNewPassword").val('');
        $("#invalidPassword").css("display", "");
        return
    }

    if ($("#userId").val() == "" || $("#userId").val() == null) {
        return;
    }

    if ($("#oldPassword").val().match(/((?=.*[A-Z])(?=.*[a-z])(.*[$|~=['!#$%^&*()~`_+@.-])(?=.*\d)).+/g) == null) {
        $("#oldPassword").val('')
        $("#oldPassword").focus();
        $("#newPassword").val('');
        $("#verifyNewPassword").val('');
        $("#invalidPassword").css("display", "");
        return;
    }
    if ($("#newPassword").val().match(/((?=.*[A-Z])(?=.*[a-z])(.*[$|~=['!#$%^&*()~`_+@.-])(?=.*\d)).+/g) == null || $("#verifyNewPassword").val().match(/((?=.*[A-Z])(?=.*[a-z])(.*[$|~=['!#$%^&*()~`_+@.-])(?=.*\d)).+/g) == null) {
        $("#invalidPassword").css("display", "");
        $("#oldPassword").val('')
        $("#oldPassword").focus();
        $("#newPassword").val('');
        $("#verifyNewPassword").val('');
        return;
    }
    else if ($("#newPassword").val() != $("#verifyNewPassword").val()) {
        $("#passwordMismatch").css("display", "");
        $("#oldPassword").val('')
        $("#oldPassword").focus();
        $("#newPassword").val('');
        $("#verifyNewPassword").val('');
        return;
    }
    else if ($("#newPassword").val() == $("#oldPassword").val()) {
        $("#samePassword").css("display", "");
        $("#oldPassword").val('')
        $("#oldPassword").focus();
        $("#newPassword").val('');
        $("#verifyNewPassword").val('');
        return;
    }
    else {
        var data = {
            Username: $("#userId").val(),
            OldPassword: $("#oldPassword").val(),
            NewPassword: $("#newPassword").val(),
            VerifyNewPassword: $("#verifyNewPassword").val()
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Login/ChangePassword",
        "POST",
        data,
    function (response) {
        if (response != null && response != "") {
            switch (response) {
                case 0:
                    $("#retry").css("display", "");
                    $("#resetExpiredPassword #oldPassword").val('')
                    $("#resetExpiredPassword #oldPassword").focus();
                    $("#resetExpiredPassword #newPassword").val('');
                    $("#resetExpiredPassword #verifyNewPassword").val('');
                    break;
                case 1:
                    $("#resetExpiredPassword #savedSuccessfully").css("display", "");
                    $.unblockUI();
                    $(".removeDiv").remove();
                    setTimeout(function () {
                        $("#myModal").css("display", "")
                        $("#resetPasswordClose").click();
                        $("#LoginForm #divErrorMsg").remove();
                    }, 5000);
                    break;
                case 2:
                    $("#resetExpiredPassword #retry").css("display", "");
                    $("#resetExpiredPassword #oldPassword").val('')
                    $("#resetExpiredPassword #oldPassword").focus();
                    $("#resetExpiredPassword #newPassword").val('');
                    $("#resetExpiredPassword #verifyNewPassword").val('');
                    break;
                case 3:
                    $("#resetExpiredPassword #invalidCredential").css("display", "");
                    $("#resetExpiredPassword #oldPassword").val('')
                    $("#resetExpiredPassword #oldPassword").focus();
                    $("#resetExpiredPassword #newPassword").val('');
                    $("#resetExpiredPassword #verifyNewPassword").val('');
                    break;
                default:
                    break;
            }

        }
    }, function (XMLHttpRequest, textStatus, errorThrown) { },
     "JSON", true);

    }
}
