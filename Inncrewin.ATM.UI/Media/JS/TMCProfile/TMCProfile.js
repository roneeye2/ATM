$(function () {
    try {
        $("#tmcProfile #notSavedMsg").css("display", "none");
        $("#tmcProfile #savedMsg").css("display", "none");
        $('#tmcProfileFooter').load('/footer.html');
        $("#header-tmcProfile").load('header.html', function () {
            $("#tmcProfile_headerBD").css("display", "");
            $("#tmcProfile_headerSD").css("display", "");
            GetLoggedInUserTMCName();
            if (sessionStorage.SavedTR != undefined) {
                SavedTR = $.parseJSON(sessionStorage.SavedTR);
                if (SavedTR != '') {
                    $.each(SavedTR, function (key, value) {
                        var ul = document.getElementById("myTab");
                        var li = document.createElement("li");
                        var a = document.createElement("a");
                        var ReqNo = key.split("//")[0];
                        var RequestType = key.split("//")[1];
                        li.setAttribute("id", "element_" + ReqNo + "_" + RequestType);
                        li.setAttribute("onclick", "getActiveTabDetail(this);");
                        ul.appendChild(li);
                        if (ReqNo.indexOf("NewTR") == -1)
                            document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>TR' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                        else
                            document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>' + value + '<small title="' + value + '">' + value + '</small><i onclick="closetab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';

                        if ($("#myTab").children().length > 3) {
                            $(".slider").attr("id", "slider1");
                        }
                        $('#slider1').tinycarousel();
                    });
                }
                $("#myProfile_headerSD").remove();
                $("#myProfile_headerBD").remove();
            }

        });

        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TMCProfile/TMCProfile",
        "GET",
        null,
        function (response) {
            if (response != null && response != undefined) {
                $("#tmcProfile #FirstName").val(response.FirstName);
                $("#tmcProfile #LastName").val(response.LastName);
                $("#tmcProfile #Email").val(response.EmailId);
                $("#tmcProfile #UserName").val(response.UserName);
                $("#tmcProfile #EmployeeId").val(response.EmployeeId);
                $("#tmcProfile #ContactNumber").val(response.ContactNumber);
                if (response.Roles[0] == "TMCAdmin") {
                    $("#tmcProfile #Role").val("TMC Admin")
                }
                else if (response.Roles[0] == "TMCUser") {
                    $("#tmcProfile #Role").val("TMC User")
                }
                $("#tmcProfile #userImage").attr("src", response.UserImagePath);
                $.unblockUI();
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
         "JSON", true);
    } catch (error) {
        $().Logger.error("TmcProfile.js function()-->" + error)
    }
});
function displayTMCPassword() {
    try {
        $("#tmcProfile #invalidTmcPassword").css("display", "none");
        $("#tmcProfile #newTMCPassword").val('');
        $("#tmcProfile #notSavedMsg").css("display", "none");
        $("#tmcProfile #savedMsg").css("display", "none");
        if ($('#tmcProfile #chkChangeTMCPassword').is(":checked")) {
            $("#tmcProfile #newTMCPassword").css("display", "");
            $("#tmcProfile #saveTMCProfilePassword").css("display", "");
            $("#tmcProfile #lblPassword").css("display", "");
        }
        else {
            $("#tmcProfile #newTMCPassword").css("display", "none");
            $("#tmcProfile #saveTMCProfilePassword").css("display", "none");
            $("#tmcProfile #lblPassword").css("display", "none");
        }

        $("[data-toggle=tooltip").tooltip();
    } catch (error) {
        $().Logger.error("TmcProfile.js displayTMCPassword()-->" + error)
    }
}

function changeTMCProfilePassword() {
    try {
        $("#tmcProfile #invalidTmcPassword").css("display", "none");
        $("#tmcProfile #notSavedMsg").css("display", "none");
        $("#tmcProfile #savedMsg").css("display", "none");
        $("#tmcProfile #invalidTmcPassword").css("display", "none")
        if ($("#tmcProfile #newTMCPassword").val().length < 7) {
            $("#tmcProfile #newTMCPassword").val('');
            $("#tmcProfile #newTMCPassword").focus();
            $("#tmcProfile #invalidTmcPassword").css("display", "")
            return;
        }
        else if ($("#tmcProfile #newTMCPassword").val().match(/((?=.*[A-Z])(?=.*[a-z])(.*[$|~=['!#$%^&*()~`_+@.-])(?=.*\d)).+/g) == null) {
            $("#tmcProfile #newTMCPassword").val('');
            $("#tmcProfile #newTMCPassword").focus();
            $("#tmcProfile #invalidTmcPassword").css("display", "")
            return;
        }
        else {

            var password = $("#tmcProfile #newTMCPassword").val();
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
            "TMCProfile/ChangePassword?password=" + password,
            "POST",
            null,
            function (response) {
                if (response != null && response != undefined) {
                    if (response == true) {
                        $("#tmcProfile #chkChangeTMCPassword").click();
                        $("#tmcProfile #savedMsg").css("display", "");
                        $("#myProfile_headerSD").remove();
                        $("#myProfile_headerBD").remove();
                    }
                    else {
                        $("#tmcProfile #notSavedMsg").css("display", "");
                        $("#myProfile_headerSD").remove();
                        $("#myProfile_headerBD").remove();
                    }
                }
                else {
                    $("#tmcProfile #notSavedMsg").css("display", "");
                    $("#myProfile_headerSD").remove();
                    $("#myProfile_headerBD").remove();
                }
                $.unblockUI();

            }, function (XMLHttpRequest, textStatus, errorThrown) { },
            "json", true);
        }
    } catch (error) {
        $().Logger.error("TmcProfile.js changeTMCProfilePassword()-->" + error)
    }
}

function GetLoggedInUserTMCName() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetUserInfo",
            "POST",
        null,
        function (response) {
            if (response != null) {
                $('.rze-loginname').html(response.UserName);
                $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
                $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
                $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
                if (response.Role != "TMCAdmin" && response.Role != "TMCUser") {
                    $("#tmcProfile_headerBD").remove();
                    $("#tmcProfile_headerSD").remove();
                    $("#myProfile_headerBD").css("display", "");
                    $("#myProfile_headerSD").css("display", "");
                }
                else {
                    $("#myProfile_headerBD").remove();
                    $("#myProfile_headerSD").remove();
                    $("#tmcProfile_headerBD").css("display", "");
                    $("#tmcProfile_headerSD").css("display", "");
                }
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TmcProfile.js changeTMCProfilePassword()-->" + error)
    }
}
