
// LogOut functionality for B2E
function LogOutB2E() {

    //Check the Sessionstorage for Token, if present clear it on log out
    var i = sessionStorage.length;
    if (i > 0) {
        if (sessionStorage.getItem("RezCBTB2E")) {
            // alert(sessionStorage.getItem("RezCBTB2E"));
            sessionStorage.removeItem("RezCBTB2E");
        }
    }
    //Redirecting to Login Uri
    window.location.href = "/Login.html";
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = decodeURIComponent(window.location.href).slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function () {
    //Loading Footer
    $('#footer').load('/footer.html');

    //Floating Labels
    $('.rze-logindet .form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');
    $(document).on('click', '#lnkLogout', LogOutB2E);
});

/*Table Hover Function*/
function GetHover() {
    $('.table-action div').hide();

    $('tr.row_main').mouseenter(function () {
        $(".table-action div").hide();
        $(this).next('tr').find(".table-action div").show();

        /*initially making white bg*/
        $('tr.row_main').css('background', '#fff');
        $('tr.row_sub').css('background', '#fff');

        /*Find two row and changing background color*/
        $(this).css('background', '#ccc');
        $(this).next('tr.row_sub').css('background', '#ccc')
    });

    $('tr.row_main').mouseleave(function () {
        /*initially making white bg*/
        $(this).css('background', '#fff');
        $(this).next('tr.row_sub').css('background', '#fff')
    });

    $('tr.row_sub').mouseenter(function () {
        $('tr.row_main').css('background', '#fff')
        $(this).css('background', '#ccc');
        $(this).prev('tr.row_main').css('background', '#ccc')
    });

    $('tr.row_sub').mouseleave(function () {
        $('tr.row_main').css('background', '#fff')
        $(this).css('background', '#fff');
        $(this).prev('tr.row_main').css('background', '#fff ')
    });

    $('.table').mouseleave(function () {
        $('.table-action div').slideUp();
    });

    bsTooltip();
}

function SearchToggle(tabname) {
    $("#rze-wrap" + tabname).slideToggle();
    $("#rze-overlay" + tabname).toggleClass("overlaybox")
}
function HideSearchToggle(tabname) {
    $("#rze-wrap" + tabname).hide();
    $("#rze-overlay" + tabname).removeClass("overlaybox")
}

function bsTooltip() {
    $('[data-toggle="tooltip"]').tooltip({ placement: 'bottom' });
}

// Common alert message
function alertmsg(msg) {
    if (msg != undefined && msg != "" && msg != null) {
        bootbox.alert({
            title: "Message",
            message: msg,
            size: 'small',
        })
    }
}

// Validate Date
function validateB2EDate(event, eleId) {
    $("#" + eleId).parent("div").css('border', '0px');
    event = window.event || event
    var targetId = event.targetId;
    var enteredDate = $("#" + eleId).val();
    var isValid = null;

    if (typeof (Storage) !== "undefined" && sessionStorage.CultureDateFormat != null && sessionStorage.CultureDateFormat != undefined) {
        var maskPlaceholder = (sessionStorage.CultureMaskFormat).replace(/[0-9]/g, "_")
        if (enteredDate == maskPlaceholder || enteredDate == "") {
            $("#" + eleId).parent("div").css('border', '0px');
            return;
        }

        if (enteredDate.length != 0 && enteredDate != maskPlaceholder) {
            if (enteredDate.length != 10) {
                if (event.keyCode == 9 || event.keyCode == 13) {
                    event.preventDefault();
                }
                $("#" + eleId).parent("div").css('border', '1px solid #f00');
                alertmsg("Please enter valid date in " + sessionStorage.DateFormatForMoment + " format (1900-2200).");
                $("#" + eleId).val('');
                $("#" + eleId).click();
                $("#" + eleId).focus();
                return;
            }
            else {

                var regexp = new RegExp("([^0-9])", "g");
                var separator = (regexp.exec(sessionStorage.CultureMaskFormat))[0];
                var date = enteredDate.split(separator);

                var splittedDateFormat = (sessionStorage.DateFormatForMoment).split(separator);
                var dd = 0;
                var mm = 0;
                var yy = 0;
                if (splittedDateFormat[0] == "DD") {
                    dd = parseInt(date[0], 10);
                    if (splittedDateFormat[1] == "MM") {
                        mm = parseInt(date[1], 10);
                        yy = parseInt(date[2], 10);
                    }
                    else if (splittedDateFormat[2] == "MM") {
                        mm = parseInt(date[2], 10);
                        yy = parseInt(date[1], 10);
                    }
                }
                else if (splittedDateFormat[1] == "DD") {
                    dd = parseInt(date[1], 10)
                    if (splittedDateFormat[0] == "MM") {
                        mm = parseInt(date[0], 10);
                        yy = parseInt(date[2], 10);
                    }
                    else if (splittedDateFormat[2] == "MM") {
                        mm = parseInt(date[2], 10);
                        yy = parseInt(date[0], 10);
                    }
                }
                else if (splittedDateFormat[2] == "DD") {
                    dd = parseInt(date[2], 10)
                    if (splittedDateFormat[0] == "MM") {
                        mm = parseInt(date[0], 10);
                        yy = parseInt(date[1], 10);
                    }
                    else if (splittedDateFormat[1] == "MM") {
                        mm = parseInt(date[1], 10);
                        yy = parseInt(date[0], 10);
                    }
                }
                if (dd > 31 || mm > 12 || yy < 1900 || yy > 2200 || dd == 0 || yy == 0) {
                    if (event.keyCode == 9 || event.keyCode == 13) {
                        event.preventDefault();
                    }
                    $("#" + eleId).parent("div").css('border', '1px solid #f00');
                    alertmsg("Please enter valid date in " + sessionStorage.DateFormatForMoment + " format (1900-2200).");
                    $("#" + eleId).val('');
                    $("#" + eleId).focus();
                    $("#" + eleId).click();
                    return;
                }

                var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (mm == 1 || mm > 2) {
                    if (dd > ListofDays[mm - 1]) {
                        if (event.keyCode == 9 || event.keyCode == 13) {
                            event.preventDefault();
                        }
                        $("#" + eleId).parent("div").css('border', '1px solid #f00');
                        alertmsg("Please enter valid date in " + sessionStorage.DateFormatForMoment + " format (1900-2200).");
                        $("#" + eleId).val('');
                        return;
                    }
                }
                if (mm == 2) {
                    var lyear = false;
                    if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                        lyear = true;
                    }
                    if ((lyear == false) && (dd >= 29)) {
                        if (event.keyCode == 9 || event.keyCode == 13) {
                            event.preventDefault();
                        }
                        $("#" + eleId).parent("div").css('border', '1px solid #f00');
                        alertmsg("Please enter valid date in " + sessionStorage.DateFormatForMoment + " format (1900-2200).");
                        $("#" + eleId).val('');
                        $("#" + eleId).focus();
                        $("#" + eleId).click();
                        return;
                    }
                    if ((lyear == true) && (dd > 29)) {
                        if (event.keyCode == 9 || event.keyCode == 13) {
                            event.preventDefault();
                        }
                        $("#" + eleId).parent("div").css('border', '1px solid #f00');
                        alertmsg("Please enter valid date in " + sessionStorage.DateFormatForMoment + " format (1900-2200).");
                        $("#" + eleId).val('');
                        $("#" + eleId).focus();
                        $("#" + eleId).click();
                        return;
                    }
                }
                isValid = new Date(yy, mm - 1, dd);
            }
            if (isValid == "Invalid Date") {
                if (event.keyCode == 9 || event.keyCode == 13) {
                    event.preventDefault();
                    $("#" + eleId).val('');
                    $("#" + eleId).focus();
                    $("#" + eleId).click();

                }
                $("#" + eleId).parent("div").css('border', '1px solid #f00');
                alertmsg("Please enter valid date in " + sessionStorage.DateFormatForMoment + " format (1900-2200).");
                $("#" + eleId).val('');
                $("#" + eleId).focus();
                $("#" + eleId).click();
            }
            else {
                if ($("#" + eleId).datepicker("option", "minDate") != null) {
                    if ((new Date(moment($("#" + eleId).val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"))) < (new Date(moment($("#" + eleId).datepicker("option", "minDate"), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY")))) {
                        alertDate = $("#" + eleId).datepicker("option", "minDate");
                        alertmsg("Minimum date value to select : " + alertDate);
                        $("#" + eleId).parent("div").css('border', '1px solid #f00');
                        $("#" + eleId).val('');
                        $("#" + eleId).focus();
                        $("#" + eleId).click();
                    }
                    else {
                        $("#" + eleId).parent("div").css('border', '0px');
                        if (eleId.indexOf("Start") !== -1) {
                            var endDate = eleId;
                            var endDate = endDate.replace("Start", "End");
                            if ($("#" + endDate).length == 1) {
                                $("#" + endDate).prop('disabled', false);
                                $("#" + endDate).css('background', '#fff');
                                $("#" + endDate + "Lbl .btn").css('background', '#fff');
                                $("#" + endDate).datepicker('option', 'minDate', $("#" + eleId).val());
                            }
                        }
                    }
                }
                else if ($("#" + eleId).datepicker("option", "maxDate") != null) {
                    if ((new Date(moment($("#" + eleId).val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"))) > (new Date(moment($("#" + eleId).datepicker("option", "maxDate"), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY")))) {
                        alertDate = $("#" + eleId).datepicker("option", "maxDate");
                        if (alertDate == "-18y")
                        {
                            alertDate = moment().subtract(18, 'years').format(sessionStorage.DateFormatForMoment);
                        }
                        alertmsg("Maximum date value to select : " + alertDate);
                        $("#" + eleId).parent("div").css('border', '1px solid #f00');
                        $("#" + eleId).val('');
                        $("#" + eleId).focus();
                        $("#" + eleId).click();
                    }
                    else {
                        $("#" + eleId).parent("div").css('border', '0px');
                        if (eleId.indexOf("Start") !== -1) {
                            var endDate = eleId;
                            var endDate = endDate.replace("Start", "End");
                            if ($("#" + endDate).length == 1) {
                                $("#" + endDate).prop('disabled', false);
                                $("#" + endDate).css('background', '#fff');
                                $("#" + endDate + "Lbl .btn").css('background', '#fff');
                                $("#" + endDate).datepicker('option', 'minDate', $("#" + eleId).val());
                            }
                        }
                    }
                }
                else {
                    $("#" + eleId).parent("div").css('border', '0px');
                    if (eleId.indexOf("Start") !== -1) {
                        var endDate = eleId;
                        var endDate = endDate.replace("Start", "End");
                        if ($("#" + endDate).length == 1) {
                            $("#" + endDate).prop('disabled', false);
                            $("#" + endDate).css('background', '#fff');
                            $("#" + endDate + "Lbl .btn").css('background', '#fff');
                            $("#" + endDate).datepicker('option', 'minDate', $("#" + eleId).val());
                        }
                    }
                }
            }
        }
        else if ($("#" + eleId).val() == maskPlaceholder || $("#" + eleId).val() == "" || $("#" + eleId).val() == null || $("#" + eleId).val() == undefined) {
            $("#" + eleId).val('')
            $("#" + eleId).parent("div").css('border', '0px');
        }
    }
}

$(document).bind('domChanged', function () {
    if (sessionStorage != null && sessionStorage != undefined && sessionStorage.DateFormatForMoment != null && sessionStorage.DateFormatForMoment != undefined) {
        $(".hasDatepicker").attr("placeholder", sessionStorage.DateFormatForMoment);
    }
});

$(document).trigger('domChanged');

$(window).load(function () {
    if (sessionStorage != null && sessionStorage != undefined && sessionStorage.DateFormatForMoment != null && sessionStorage.DateFormatForMoment != undefined) {
        $(".hasDatepicker").attr("placeholder", sessionStorage.DateFormatForMoment);
    }
});


function IsInvalidDateRange(startDate, endDate) {
    var newStartDate = null;
    var newEndDate = null;
    if (typeof startDate == 'string' && typeof endDate == 'string') {
        newStartDate = new Date(moment(startDate, sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
        newEndDate = new Date(moment(endDate, sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
    }
    else if (startDate instanceof Date && endDate instanceof Date) {
        newStartDate = new Date(moment(startDate).format("MM/DD/YYYY"));
        newEndDate = new Date(moment(endDate).format("MM/DD/YYYY"));
    }
    if (newStartDate != null && newStartDate != "" && newStartDate != undefined && newStartDate != "Invalid Date" && newEndDate != null && newEndDate != "" && newEndDate != undefined && newEndDate != "Invalid Date") {
        if (newStartDate > newEndDate) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return true;
    }
}








