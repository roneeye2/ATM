var MaxPrice = 0;
var MinPrice = 0;
var minOnwardDepartureTime = 0;
var maxOnwardDepartureTime = 0;
var minReturnDepartureTime = 0;
var maxReturnDepartureTime = 0;
var minOnwardTotalDuration;
var maxOnwardTotalDuration;
var minReturnTotalDuration;
var maxReturnTotalDuration;
var Flights = "";
var isFlightNameFilter = false;
var isSortByPrice = false;
var pageIndex = 1;
var CurrentpageCount;
var TotalPageCount;
var flightIncrement = 0;
var IsUpgraded = false;
var ShowCount;
var pageIndexWithFilter = 1;
var isLoadingData;

$(document).ready(function () {
    $('#header').load('/header.html');
    $('#footer').load('/footer.html');
    $('#divMain').hide();
});

$(window).scroll(function () {
    try {
        if ($('#FlightTab').hasClass('active')) {
            if ($(window).scrollTop() == $(document).height() - $(window).height() && !isLoadingData) {
                if ($("#resultCount").is(':visible')) {
                    isLoadingData = true;
                    //LoadNextSetOfFlights();            
                    CurrentpageCount = parseInt($("#hdnResultsCount").val());
                    TotalPageCount = parseInt($("#hdnTotalResultsCount").val());
                    $("#hdnShowCount").val(CurrentpageCount);
                    var showCount = parseInt($("#hdnShowCount").val());
                    if (showCount >= TotalPageCount) {
                        pageIndex = 1; //del
                        return false;
                    }
                    $("#hdnIsPagination").val("true");
                    pageIndex++;
                    var Filtered = $("#hdnIsFilterApplied").val();
                    if (Filtered == "true") {
                        GetFlightFilteredResults(false);
                    }
                    else {
                        SearchRequest(pageIndex, IsUpgraded);
                    }
                }
            }
            //  }
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js EmpAgeValidation() -->" + error);
    }
});

function ValidateRequest() {
    try {
        if ($.trim($("#txtFlightFrom").val()) == "" || !($.trim($("#txtFlightFrom").val()).indexOf("(", 2) >= 0) || $("#txtFlightFrom").val() == 'Please enter valid leaving from.') {
            var watermark = 'Please enter valid leaving from.';
            $('#txtFlightFrom').val(watermark).addClass('watermark');
            $('#txtFlightFrom').css("color", "red");
            return false;
        }
        if ($.trim($("#txtFlightTo").val()) == "" || !($.trim($("#txtFlightTo").val()).indexOf("(", 2) >= 0) || $("#txtFlightTo").val() == 'Please enter valid leaving to.') {
            var watermark = 'Please enter valid leaving to.';
            $('#txtFlightTo').val(watermark).addClass('watermark');
            $('#txtFlightTo').css("color", "red");
            return false;
        }
        if ($("#txtFlightDepartDate").val() == "" || $("#txtFlightDepartDate").val() == 'Please select valid departure date.') {
            $("#txtFlightDepartDate").val("");
            $("#txtFlightDepartDate").parent("div").css('border', '1px solid #f00');
            return false;
        }
        if ((typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined')) {
            if ($("#txtFlightReturnDate").val() == "" || $("#txtFlightReturnDate").val() == 'Please select valid arrival date.') {
                $("#txtFlightReturnDate").val("");
                $("#txtFlightReturnDate").parent("div").css('border', '1px solid #f00');
                return false;
            }
        }
        var flightDepartDate = new Date(moment($("#txtFlightDepartDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
        if (flightDepartDate == null || flightDepartDate == "" || flightDepartDate == undefined || flightDepartDate == "Invalid Date") {
            $("#txtFlightDepartDate").val("");
            $("#txtFlightDepartDate").parent("div").css('border', '1px solid #f00');
            return false;
        }
        if ((typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined')) {
            var flightReturnDate = new Date(moment($("#txtFlightReturnDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
            if (flightReturnDate == null || flightReturnDate == "" || flightReturnDate == undefined || flightReturnDate == "Invalid Date") {
                $("#txtFlightReturnDate").val("");
                $("#txtFlightReturnDate").parent("div").css('border', '1px solid #f00');
                return false;
            }
            if (IsInvalidDateRange($("#txtFlightDepartDate").val(), $("#txtFlightReturnDate").val())) {
                alertmsg("Departure date is greater than return date.")
                return false;
            }
        }
        return true;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js ValidateRequest() -->" + error);
    }
}

function ClearDataTxtFlightFrom() {
    try {
        if ($("#txtFlightFrom").val() == 'Please enter valid leaving from.') {
            $('#txtFlightFrom').val('').removeClass('watermark');
            $('#txtFlightFrom').css("color", "#696969");
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js ClearDataTxtFlightFrom() -->" + error);
    }
}

function ClearDataTxtFlightTo() {
    try {
        if ($("#txtFlightTo").val() == 'Please enter valid leaving to.') {
            $('#txtFlightTo').val('').removeClass('watermark');
            $('#txtFlightTo').css("color", "#696969");
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js ClearDataTxtFlightTo() -->" + error);
    }
}

//function ClearDataTxtFlightDepartDate() {
//    try {
//        if ($("#txtFlightDepartDate").val() == 'Please select valid departure date.' || $("#txtFlightDepartDate").val() == '__/__/____') {
//            $('#txtFlightDepartDate').val('').removeClass('watermark');
//            $('#txtFlightDepartDate').css("color", "#696969");
//        }
//    }
//    catch (error) {
//        $().Logger.error("FlightSearch.js ClearDataTxtFlightDepartDate() -->" + error);
//    }
//}

//function ClearDataTxtFlightReturnDate() {
//    try {
//        if ($("#txtFlightReturnDate").val() == 'Please select valid arrival date.' || $("#txtFlightReturnDate").val() == '__/__/____') {
//            $('#txtFlightReturnDate').val('').removeClass('watermark');
//            $('#txtFlightReturnDate').css("color", "#696969");
//        }
//    }
//    catch (error) {
//        $().Logger.error("FlightSearch.js ClearDataTxtFlightReturnDate() -->" + error);
//    }
//}

function getUrlVars() {
    var vars = [], hash;
    var removeHash;
    if (window.location.href.indexOf("#") > -1)
        removeHash = window.location.href.slice(0, -1);
    else
        removeHash = window.location.href;
    var hashes = removeHash.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//This is to toggle the filter div
function FilterSlide() {
    $("#divPreferredAirlines").slideToggle();
}

function GetFlightFilters(Direction, Flights, isApplyFilter) {
    try {
        GetOnwardFlightDepartureFilter();
        GetFlightTotalOnwardTravelDuration();
        if (Direction != 1) {
            GetFlightTotalReturnTravelDuration();
            GetReturnFlightDepartureFilter();
        }
        LoadFlightName(Flights, isApplyFilter);
        GetFlightFare();
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetFlightFilters() -->" + error);
    }
}

function GetOnwardFlightDepartureFilter() {
    try {

        var onwardDepartureTimeSliderDiv = $('#onwardDepartureTimeSlider');
        onwardDepartureTimeSliderDiv.slider({
            range: true,
            min: 0,
            max: 1439,
            step: 1,
            values: [0, 1439],
            slide: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';

                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }

                $('#minOnwardDepartureTime').val(hours1 + ":" + minutes1);
                $('#maxOnwardDepartureTime').val(hours2 + ":" + minutes2);
            },
            stop: function (event, ui) {
                var hours1 = Math.floor(ui.values[0] / 60);
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';

                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }

                $('#minOnwardDepartureTime').val(hours1 + ":" + minutes1);
                $('#maxOnwardDepartureTime').val(hours2 + ":" + minutes2);
                GetFlightFilteredResults(true);
            }
        });
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetOnwardFlightDepartureFilter() -->" + error);
    }
}

function GetReturnFlightDepartureFilter() {
    try {
        var returnDepartureTimeSliderDiv = $('#returnDepartureTimeSlider');
        returnDepartureTimeSliderDiv.slider({
            range: true,
            min: 0,
            max: 1439,
            step: 1,
            values: [0, 1439],
            slide: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';

                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }

                $('#minReturnDepartureTime').val(hours1 + ":" + minutes1);
                $('#maxReturnDepartureTime').val(hours2 + ":" + minutes2);

            },
            stop: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';

                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }
                $('#minReturnDepartureTime').val(hours1 + ":" + minutes1);
                $('#maxReturnDepartureTime').val(hours2 + ":" + minutes2);
                GetFlightFilteredResults(true);
            }
        });
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetReturnFlightDepartureFilter() -->" + error);
    }
}

function SetMaxFlightOnwardDuration() {
    try {
        MaxOnwardDurationvalue = maxOnwardTotalDuration.split(/[ .:]+/);
        if (MaxOnwardDurationvalue.length > 3) {
            var Max = (((+MaxOnwardDurationvalue[0] * 24) + (+MaxOnwardDurationvalue[1])) * 60) + (+MaxOnwardDurationvalue[2]);
        }
        else {
            var Max = (+MaxOnwardDurationvalue[0] * 60) + (+MaxOnwardDurationvalue[1]);
        }

        var hours2 = parseInt(Math.floor(Max / 60));
        var minutes2 = parseInt(Max - (hours2 * 60));

        if (hours2.length < 10) hours2 = '0' + hours;
        if (minutes2.length < 10) minutes2 = '0' + minutes;

        if (minutes2 == 0) minutes2 = '00';
        if (hours2.toString().length == 1) {
            hours2 = "0" + hours2;
        }
        if (minutes2.toString().length == 1) {
            minutes2 = "0" + minutes2;
        }
        $('#maxOnwardTotalDuration').val(Math.floor(Max / 24 / 60) + "." + Math.floor(Max / 60 % 24) + ':' + Max % 60);
        $('#maxOnwardTotalDurationView').val(hours2 + "h" + minutes2 + "m");
        return Max;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js SetMaxFlightOnwardDuration() -->" + error);
    }
}

function GetFlightTotalOnwardTravelDuration() {
    try {
        var Max = SetMaxFlightOnwardDuration();
        var totalOnwardTravelDurationSliderDiv = $('#totalOnwardTravelDurationSlider');
        totalOnwardTravelDurationSliderDiv.slider({
            range: true,
            min: 0,
            max: Max,
            step: 1,
            values: [0, Max],
            slide: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';
                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }
                if (Math.floor(ui.values[0] / 60) > 23) {
                    $('#minOnwardTotalDuration').val(Math.floor(ui.values[0] / 24 / 60) + "." + Math.floor(ui.values[0] / 60 % 24) + ':' + ui.values[0] % 60);
                    $('#minOnwardTotalDurationView').val(hours1 + "h" + minutes1 + "m");
                }
                else {
                    $('#minOnwardTotalDuration').val(hours1 + ":" + minutes1);
                    $('#minOnwardTotalDurationView').val(hours1 + "h" + minutes1 + "m");
                }
                $('#maxOnwardTotalDuration').val(Math.floor(ui.values[1] / 24 / 60) + "." + Math.floor(ui.values[1] / 60 % 24) + ':' + ui.values[1] % 60);
                $('#maxOnwardTotalDurationView').val(hours2 + "h" + minutes2 + "m");
            },
            stop: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';

                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }

                if (Math.floor(ui.values[0] / 60) > 23) {
                    $('#minOnwardTotalDuration').val(Math.floor(ui.values[0] / 24 / 60) + "." + Math.floor(ui.values[0] / 60 % 24) + ':' + ui.values[0] % 60);
                }
                else {
                    $('#minOnwardTotalDuration').val(hours1 + ":" + minutes1);
                }
                $('#maxOnwardTotalDuration').val(Math.floor(ui.values[1] / 24 / 60) + "." + Math.floor(ui.values[1] / 60 % 24) + ':' + ui.values[1] % 60);
                GetFlightFilteredResults(true);
            }
        });
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetFlightTotalOnwardTravelDuration() -->" + error);
    }
}

function SetMaxFlightReturnDuration() {
    try {
        MaxOnwardDurationvalue = maxReturnTotalDuration.split(/[ .:]+/);
        if (MaxOnwardDurationvalue.length > 3) {
            var Max = (((+MaxOnwardDurationvalue[0] * 24) + (+MaxOnwardDurationvalue[1])) * 60) + (+MaxOnwardDurationvalue[2]);
        }
        else {
            var Max = (+MaxOnwardDurationvalue[0] * 60) + (+MaxOnwardDurationvalue[1]);
        }

        var hours2 = parseInt(Math.floor(Max / 60));
        var minutes2 = parseInt(Max - (hours2 * 60));

        if (hours2.length < 10) hours2 = '0' + hours;
        if (minutes2.length < 10) minutes2 = '0' + minutes;

        if (minutes2 == 0) minutes2 = '00';
        if (hours2.toString().length == 1) {
            hours2 = "0" + hours2;
        }
        if (minutes2.toString().length == 1) {
            minutes2 = "0" + minutes2;
        }
        $('#maxReturnTotalDuration').val(Math.floor(Max / 24 / 60) + "." + Math.floor(Max / 60 % 24) + ':' + Max % 60);
        $('#maxReturnTotalDurationView').val(hours2 + "h" + minutes2 + "m");
        return Max;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js SetMaxFlightReturnDuration() -->" + error);
    }
}

function GetFlightTotalReturnTravelDuration() {
    try {
        var Max = SetMaxFlightReturnDuration();
        var totalReturnTravelDurationSliderDiv = $('#totalReturnTravelDurationSlider');
        totalReturnTravelDurationSliderDiv.slider({
            range: true,
            min: 0,
            max: Max,
            step: 1,
            values: [0, Max],
            slide: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';
                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }
                if (Math.floor(ui.values[0] / 60) > 23) {
                    $('#minReturnTotalDuration').val(Math.floor(ui.values[0] / 24 / 60) + "." + Math.floor(ui.values[0] / 60 % 24) + ':' + ui.values[0] % 60);
                    $('#minReturnTotalDurationView').val(hours1 + "h" + minutes1 + "m");
                }
                else {
                    $('#minReturnTotalDuration').val(hours1 + ":" + minutes1);
                    $('#minReturnTotalDurationView').val(hours1 + "h" + minutes1 + "m");
                }
                $('#maxReturnTotalDuration').val(Math.floor(ui.values[1] / 24 / 60) + "." + Math.floor(ui.values[1] / 60 % 24) + ':' + ui.values[1] % 60);
                $('#maxReturnTotalDurationView').val(hours2 + "h" + minutes2 + "m");
            },
            stop: function (event, ui) {
                var hours1 = parseInt(Math.floor(ui.values[0] / 60));
                var minutes1 = parseInt(ui.values[0] - (hours1 * 60));

                if (hours1.length < 10) hours1 = '0' + hours;
                if (minutes1.length < 10) minutes1 = '0' + minutes;

                if (minutes1 == 0) minutes1 = '00';

                var hours2 = parseInt(Math.floor(ui.values[1] / 60));
                var minutes2 = parseInt(ui.values[1] - (hours2 * 60));

                if (hours2.length < 10) hours2 = '0' + hours;
                if (minutes2.length < 10) minutes2 = '0' + minutes;

                if (minutes2 == 0) minutes2 = '00';
                if (hours1.toString().length == 1) {
                    hours1 = "0" + hours1;
                }
                if (hours2.toString().length == 1) {
                    hours2 = "0" + hours2;
                }
                if (minutes1.toString().length == 1) {
                    minutes1 = "0" + minutes1;
                }
                if (minutes2.toString().length == 1) {
                    minutes2 = "0" + minutes2;
                }

                if (Math.floor(ui.values[0] / 60) > 23) {
                    $('#minReturnTotalDuration').val(Math.floor(ui.values[0] / 24 / 60) + "." + Math.floor(ui.values[0] / 60 % 24) + ':' + ui.values[0] % 60);
                }
                else {
                    $('#minReturnTotalDuration').val(hours1 + ":" + minutes1);
                }
                $('#maxReturnTotalDuration').val(Math.floor(ui.values[1] / 24 / 60) + "." + Math.floor(ui.values[1] / 60 % 24) + ':' + ui.values[1] % 60);
                GetFlightFilteredResults(true);
            }
        });
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetFlightTotalReturnTravelDuration() -->" + error);
    }
}

function GetFlightFare() {
    try {
        var flightFareSliderDiv = $('#flightFareSlider');
        flightFareSliderDiv.slider({
            range: true,
            min: MinPrice,
            max: MaxPrice,
            step: 1,
            values: [MinPrice, MaxPrice],
            slide: function (event, ui) {
                $('#minFlightFare').val(ui.values[0]);
                $('#maxFlightFare').val(ui.values[1]);
            },
            stop: function (event, ui) {
                $('#minFlightFare').val(ui.values[0]);
                $('#maxFlightFare').val(ui.values[1]);
                GetFlightFilteredResults(true);
            }
        });
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetFlightFare() -->" + error);
    }
}

function LoadFlightName(Flights, isApplyfilter) {
    try {
        if (!isFlightNameFilter) {
            $("#Flights").empty();
            var x = document.createElement("SELECT");
            x.setAttribute("id", "mySelect1");
            x.setAttribute("multiple", "multiple");
            document.body.appendChild(x);
            $.each(Flights, function (key, value) {
                var z = document.createElement("option");
                z.setAttribute("value", value);
                var t = document.createTextNode(value);
                z.appendChild(t);
                document.getElementById("mySelect1").appendChild(z);
            });
            document.getElementById("Flights").appendChild(x);
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js LoadFlightName() -->" + error);
    }
}

function LoadFlightFilters(response) {
    try {

        if (response != null) {
            $('#minFlightFare').val(response.Filter.Price.MinValue);
            $('#maxFlightFare').val(response.Filter.Price.MaxValue);
            MaxPrice = response.Filter.Price.MaxValue
            MinPrice = response.Filter.Price.MinValue;
            $('#maxOnwardTotalDuration').val(response.Filter.OnwardTotalDuration.MaxTime);
            maxOnwardTotalDuration = response.Filter.OnwardTotalDuration.MaxTime
            if (response.Flight[0].DirectionInd != 1) {
                $('#maxReturnTotalDuration').val(response.Filter.ReturnTotalDuration.MaxTime);
                maxReturnTotalDuration = response.Filter.ReturnTotalDuration.MaxTime;
            }
            Flights = response.Filter.AirlineNames;
            GetFlightFilters(response.Flight[0].DirectionInd, Flights, true);
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js LoadFlightFilters() -->" + error);
    }
}

function sortByPrice() {
    try {

        //isSortByPrice = true;
        var sort = $('#btnSort').attr("class");
        if (sort == "fa fa-sort-amount-asc") {
            $("#btnSort").removeClass("fa fa-sort-amount-asc");
            $("#btnSort").addClass("fa fa-sort-amount-desc");
            isSortByPrice = true;
        }
        else {
            $("#btnSort").removeClass("fa fa-sort-amount-desc");
            $("#btnSort").addClass("fa fa-sort-amount-asc");
            isSortByPrice = false;
        }
        GetFlightFilteredResults(true);
        return false;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js sortByPrice() -->" + error);
    }
}

function ProceedToHotelBooking() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        setTimeout(function () {
            var travelRequestId = $("#FFTravelRequestNo").html();
            $('#IsProceedToHotel').val(true);
            if (AddToItinerary(true) == true) {
                $('#FlightTab').removeAttr('href');
                $('#FlightTab').attr('onclick', 'popUpDialog(' + travelRequestId + ');');
                if (!$('#HotelSection').hasClass('active')) {
                    $.get("/b2e-hotel.html", function (data) {
                        $('#HotelSection').html(data);
                        $('#FlightTab').removeClass('active');
                        $('#HotelTab').addClass('active');
                        $('#FlightSection').removeClass('tab-pane fade in active').addClass('tab-pane fade');
                        $('#HotelSection').removeClass('tab-pane fade').addClass('tab-pane fade in active');
                    });
                }
                $.unblockUI();
            }
        }, 1000);
    }
    catch (error) {
        $().Logger.error("FlightSearch.js ProceedToHotelBooking() -->" + error);
        $.unblockUI();
    }
}

function ResetFlight() {
    try {
        $("#divMain").empty();
        $("#txtFlightDepartDate").val("");
        $("#txtFlightReturnDate").val("");
        $("#txtFlightFrom").val("");
        $("#txtFlightTo").val("");
        $("#txtAdultCount").val("1");
        $("#resultCount").empty();
        $("#Flightfilters").hide();
        $("#divBookingClassUpgrade").hide();
        FilterSlide();
        IsUpgraded = false;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js ResetFlight() -->" + error);
    }
}

function ResetFilter() {
    try {
        SearchRequest(1);
        $("#divPreferredAirlines").slideUp();
    }
    catch (error) {
        $().Logger.error("FlightSearch.js ResetFilter() -->" + error);
    }
};

function UpgradeSearchRequest() {
    try {
        $("#hdnFlightBookingClass").val("");
        IsUpgraded = true;
        isLoadingData = true;
        SearchRequest(1, IsUpgraded);
    }
    catch (error) {
        $().Logger.error("FlightSearch.js UpgradeSearchRequest() -->" + error);
    }
}

function DefaultSearchRequest() {
    try {
        $("#divMain").show();
        $("#hdnFlightBookingClass").val("");
        IsUpgraded = false;
        isLoadingData = true;
        SearchRequest(1, IsUpgraded);
    }
    catch (error) {
        $().Logger.error("FlightSearch.js DefaultSearchRequest() -->" + error);
    }
}

function SearchRequest(Page, IsUpgraded) {
    if (!ValidateRequest()) {
        return false;
    }
    $.blockUI({ message: '<h1><i class="fa fa-cog fa-spin"></i> ' + "Just a moment" + '</h1>', showOverlay: true });
    var isWithTR = false;
    var roundTrip = 0;
    var searchRequest = new Object();

    // Pagination .
    if (pageIndex == 1 || pageIndex == undefined || Page == 1) {
        var paginationCriteria = {
            PageIndex: 1,
            PageSize: parseInt($("#hdnDefaultPageSize").val()),
            TotalNoOfPages: 0
        };
        $("#divMain").empty();
        CurrentpageCount = 0;
        $("#hdnShowCount").val("0");
        $('#resultCount').html("");
        //   $("#resultCount").empty();
        pageIndex = 1;
    }
    else {
        var paginationCriteria = {
            PageIndex: pageIndex,
            PageSize: parseInt($("#hdnDefaultPageSize").val()),
            TotalNoOfPages: 0
        };
    }

    //Sorting.
    var sortCriteria = {
        Type: 1,
        Order: 1
    };

    //Filters.
    isFlightNameFilter = false;
    var filterCriteria = new Object();

    // Search Request.
    var searchCriteria = new Object();
    $("#hdnPolicyMessage").remove();
    $("#hdnOptedToUpgrade").remove();
    if (IsUpgraded) {

        if ($("#hdnbookingClassToUpgrade").val() != undefined) {
            $("#hdnFlightBookingClass").val($("#hdnbookingClassToUpgrade").val());
            searchCriteria.TicketClass = $("#hdnbookingClassToUpgrade").val();
        }
        else if ($("#hdnFlightBookingClass").val() != "") {
            searchCriteria.TicketClass = $("#hdnFlightBookingClass").val();
        }

        var $optedToUpgrade = $('<input/>', { type: 'hidden', id: 'hdnOptedToUpgrade', value: true });
        $optedToUpgrade.appendTo("#FlightSection");
    }
    else {
        searchCriteria.TicketClass = $("#drpTicketClass").val();
    }
    if (typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined') {
        roundTrip = 2;
        searchCriteria.AirTripType = roundTrip;
    }
    searchCriteria.NoOfPassengers = $("#txtAdultCount").val();
    searchCriteria.Criteria = SearchRequestCriteria();

    searchRequest.RequestNo = getUrlVars()["RequestNo"];
    if (searchRequest.RequestNo != undefined) {
        isWithTR = true;
        $('#hdnIsWithTR').val(isWithTR);
        //  if (getUrlVars()["Count"] != undefined && getUrlVars()["Count"] > 0)
        // filterCriteria.HasFlights = true;
    }

    searchRequest.Search = searchCriteria;
    searchRequest.Pagination = paginationCriteria;
    searchRequest.Sort = sortCriteria;
    searchRequest.Filter = filterCriteria;
    searchRequest.FlightItineraryCount = getUrlVars()["Count"];
    $("#Flightfilters").hide();
    $("#Flights").empty();
    $("#divFlightShowAddItinenary").hide();
    if (pageIndex == 1) { $("#divMain").empty(); }
    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
        "Flight/Search",
        "POST",
       searchRequest,
        function (response) {
            if (response != null) {
                FlightSearchResults(response, false, isWithTR);
                isLoadingData = false;
            }
            else {
                $("#divMain").append('<h4 class="error-msg">No Flight found for given search criteria.</label>');
                isLoadingData = false;
                return false;
            }
            $.unblockUI();
        },
        function (error) {
        },
        "JSON");
}

function SearchRequestCriteria() {
    try {
        var criteria = new Object();
        criteria.OriginLocationCode = "";
        criteria.DestinationLocationCode = "";
        //taking the Airport Code
        var depature = $("#txtFlightFrom").val();
        var start = depature.indexOf("(", 2);
        criteria.OriginLocationCode = depature.substring(start + 1, start + 4);
        //taking the Airport Code
        var arrival = $("#txtFlightTo").val();
        var start = arrival.indexOf("(", 2);
        criteria.DestinationLocationCode = arrival.substring(start + 1, start + 4);
        criteria.OriginDateTime = $("#txtFlightDepartDate").val();
        if (typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined') {
            criteria.DestinationDateTime = $("#txtFlightReturnDate").val();
        }
        return criteria;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js SearchRequestCriteria() -->" + error);
    }
}

function FlightSearchResults(response, isApplyFilter, isWithTR) {
    try {
        // Allowing the employee to select only one, if employee belongs to grade approval exceptions.
        var isExc = getUrlVars()["IsExc"];
        $("#divBookingClassUpgrade").hide();
        if (isApplyFilter && pageIndex == 1) {
            pageIndex = 1;
            CurrentpageCount = 0;
            $("#hdnShowCount").val("0")
        }
        $("#hdnIsFilterApplied").val(isApplyFilter);
        var isPagination = $('#hdnIsPagination').val();
        var DisplayCount = $("#hdnShowCount").val();
        var DefaultPageSize = parseInt($("#hdnDefaultPageSize").val());
        if (response != null) {
            if (response.Error != null) {
                if (response.Error.ErrorMessage != null && response.Error.ErrorCode == 1001) {
                    $("#divMain").append('<h4 class="error-msg">' + response.Error.ErrorMessage + '</h4>');
                    return false;
                }
                $("#divMain").append('<h4 class="error-msg">' + response.Error.ErrorMessage + '</h4>');
                $("#hdnResultsCount").val("0")
                $("#hdnTotalResultsCount").val("0")
                return false;
            }

            // For Re-submit itinerary.
            if ($('#HotelTab').hasClass('disabled'))
                $('#anchorProceedToHotel').hide();


            var originCity = $("#txtFlightFrom").val().split(',');
            var destinationCity = $("#txtFlightTo").val().split(',');

            //Assign Booking Class.
            var bookClass = "";

            if (IsUpgraded) {
                bookClass = $("#hdnFlightBookingClass").val();
            }
            else {
                bookClass = $("#drpTicketClass").val();
            }

            if (bookClass == "E") {
                bookClass = "Economy";
            }
            else if (bookClass == "B") {
                bookClass = "Business";
            }
            else if (bookClass == "F") {
                bookClass = "First Class";
            }
            else {
                bookClass = "";
            }

            if (isWithTR) {
                // Show Filter and Add Itinerary fields when Flight search with Travel Request.
                $("#Flightfilters").show();
                $("#divFlightShowAddItinenary").show();
            }
            else {
                $("#Flightfilters").show();
                $("#divFlightShowAddItinenary").hide();
            }

            var isFirstFlight = true;
            if (!isApplyFilter) {
                if (response.Flight.length > 1) {
                    $("#dvSort").removeClass('hide');
                    $("#btnFilterSlide").removeClass('hidden');
                    LoadFlightFilters(response);
                }
                else {
                    $("#dvSort").addClass('hide');
                    $("#btnFilterSlide").addClass('hidden');
                }
            }
            ////else { $("#divMain").empty();}
            if (pageIndex == 1) { $("#divMain").empty(); }

            $(function () {
                $('#mySelect1').fSelect();
            });

            var policyText = '';
            $("div #divOOP").hide();
            //Policy section starts
            if (response.Poilcy != null && response.Poilcy.PolicyApplied != null && response.Poilcy.PolicyApplied.length > 0) {
                var $hasBookingClassPolicyViolated = $('<input/>', { type: 'hidden', id: 'hdnHasBookingClassPolicyViolated', value: response.Poilcy.IsBookingClassOutOfPolicy });
                $hasBookingClassPolicyViolated.appendTo("#FlightSection");

                if (!$("#hdnOptedToUpgrade").val() && response.Poilcy != null && response.Poilcy.PolicyApplied != null && response.Poilcy.PolicyApplied.length > 0) {
                    $("div #divOOP").show();
                    $.each(response.Poilcy.PolicyApplied, function (key, policyTextForOnHover) {
                        policyText += policyTextForOnHover;
                        policyText += "<br/>";
                    });

                    var $PolicyMessage = $('<input/>', { type: 'hidden', id: 'hdnPolicyMessage', value: policyText });
                    $PolicyMessage.appendTo("#FlightSection");
                }
                else
                    if ($("#hdnPolicyMessage").val() !== undefined && $("#hdnPolicyMessage").val() != '') {
                        $("div #divOOP").show();
                        policyText += $("#hdnPolicyMessage").val();
                        policyText += "<br/>";
                    }
                    else {
                        $("div #divOOP").hide();
                    }
            }
            //Upgrade booking class policy.
            $("#hdnbookingClassToUpgrade").remove();
            if ($("#hdnbookingClassToUpgrade").val() == undefined) {
                if (response.Poilcy != null && response.Poilcy.BookingClassToUpgrade != undefined && response.Poilcy.BookingClassToUpgrade != '') {
                    $("#divBookingClassUpgrade").show();
                    var $bookingClassToUpgrade = $('<input/>', { type: 'hidden', id: 'hdnbookingClassToUpgrade', value: response.Poilcy.BookingClassToUpgrade });
                    $bookingClassToUpgrade.appendTo("#FlightSection");
                }
            }

            if ($("#hdnbookingClassToUpgrade").val() != undefined) {
                $("#hdnFlightBookingClass").val($("#hdnbookingClassToUpgrade").val());
            }

            $.each(response.Flight, function (key, flight) {
                var flightID = flight.RPH;
                if (flightID.indexOf(",") >= 0) {
                    flightID = flightID.replace(',', '_');
                }

                $("#resultCount").show();
                if (pageIndex == 1) {
                    if (isFirstFlight) {
                        $("#preferedFlightId").val(flight.RPH);
                        isFirstFlight = false;
                    }
                }
                if (flight.DirectionInd == 1) {
                    //One way trip enum is 1.
                    // Taking the One way html to bind from TravelFareFinder.html.
                    $(".TotalReturnTravelDuration").hide();
                    $(".ReturnFlightDepartureTime").hide();
                    var clone = $("#divFlightSearchResultOneWay").html();
                    // Taking the One way flight detail tabs html to bind from TravelFareFinder.html .
                    var cloneFlightTab = $("#divTabFlightDetailsShow").html();
                    $.each(flight.Trip, function (Tripkey, TripValue) {
                        var departureTripDateTime = new Date(TripValue.FlightOrginDestination.OriginDateTime);
                        var departureTripDateList = departureTripDateTime.toDateString();
                        var departureTripTimeList = departureTripDateTime.toTimeString().split(':');
                        var arrivalTripDateTime = new Date(TripValue.FlightOrginDestination.DestinationDateTime);
                        var arrivalTripDateList = arrivalTripDateTime.toDateString();
                        var arrivalTripTimeList = arrivalTripDateTime.toTimeString().split(':');
                        var tripDuration = TripValue.TotalDuration.split(":");
                        var clonecont = clone;
                        var tripTotalHrs = 0;
                        if (tripDuration[0].length > 2) {
                            var hrs = tripDuration[0].split('.');
                            tripTotalHrs = (parseInt(hrs[0]) * 24) + parseInt(hrs[1]);
                        }
                        else {
                            tripTotalHrs = tripDuration[0];
                        }

                        //Replacing the Key word with Values.
                        clonecont = clonecont.replace("FlightLogo", "/Media/Images/AirlineLogossmall/" + TripValue.Airline.Code + ".png");
                        clonecont = clonecont.replace("#FlightNameHead#", TripValue.Airline.Name);
                        clonecont = clonecont.replace("#FlightName#", TripValue.Airline.Name);
                        clonecont = clonecont.replace("#PolicyText#", policyText);
                        clonecont = clonecont.replace("#FlightNumber#", TripValue.Airline.Name);
                        clonecont = clonecont.replace("#List#", TripValue.StopOver);
                        clonecont = clonecont.replace("#DepatureTime#", departureTripDateList + " " + departureTripTimeList[0] + ":" + departureTripTimeList[1]);
                        clonecont = clonecont.replace("#DepatureCity#", TripValue.FlightOrginDestination.OriginCity);
                        clonecont = clonecont.replace("#ArrivalTime#", arrivalTripDateList + " " + arrivalTripTimeList[0] + ":" + arrivalTripTimeList[1]);
                        clonecont = clonecont.replace("#ArrivalCity#", TripValue.FlightOrginDestination.DestinationCity);
                        clonecont = clonecont.replace("#Duration#", tripTotalHrs + " Hrs " + tripDuration[1] + " Mins");
                        clonecont = clonecont.replace("#Stops#", TripValue.Stops);
                        clonecont = clonecont.replace("#NoOfPassenger#", $("#txtAdultCount").val());
                        clonecont = clonecont.replace("divDisplayPreferred", "divDisplayPreferred_" + flightIncrement);
                        clonecont = clonecont.replace("#Type#", "DEPARTURE");
                        clonecont = clonecont.replace("divTabstoggleUlListFlightDetails", "divTabsUlListFlightDetails_" + flightIncrement);
                        clonecont = clonecont.replace("TabFlightDetails", "divTabsUlListFlightDetails_" + flightIncrement);
                        clonecont = clonecont.replace("divTabToggleFlightDetails", "divTabsUlListFlightDetails_" + flightIncrement);
                        clonecont = clonecont.replace("divTabstoggleUlListPriceDetails", "divTabsUlListPriceDetails_" + flightIncrement);
                        clonecont = clonecont.replace("TabFlightPrice", "divTabsUlListPriceDetails_" + flightIncrement);
                        clonecont = clonecont.replace("divTabTogglePrice", "divTabsUlListPriceDetails_" + flightIncrement);
                        clonecont = clonecont.replace("#BookingClass#", bookClass);
                        clonecont = clonecont.replace("#Coach#", TripValue.Segment[0].BookingClassType);
                        clonecont = clonecont.replace("divFlightSegmentDetails", "divFlightSegmentDetails_" + flightIncrement);
                        clonecont = clonecont.replace("tblTrips", "tblTrips_" + flightIncrement);
                        clonecont = clonecont.replace("#TotalFare#", flight.Price.TotalAmount.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecont = clonecont.replace("#BaseFare#", flight.Price.BaseFare.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecont = clonecont.replace("#ServiceTax#", flight.Price.Tax.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecont = clonecont.replace("#PassengerTax#", flight.Price.Fee.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecont = clonecont.replace("#TotalFare#", flight.Price.TotalAmount.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecont = clonecont.replace("divPreferredOrSelect", "divPreferredOrSelect_" + flightIncrement);
                        clonecont = clonecont.replace("divFlightPreferred", "divFlightPreferred_" + flightIncrement);
                        clonecont = clonecont.replace("chkBook", "chkBook_" + flightIncrement);
                        clonecont = clonecont.replace("book", "book_" + flightIncrement);
                        clonecont = clonecont.replace("chkBookVal", flight.RPH);
                        clonecont = clonecont.replace("lblBook", "lblBook_" + flightIncrement);
                        clonecont = clonecont.replace("FlightSelect(lblBook)", "FlightSelect(" + flightIncrement + ")");
                        //Appending the cloned html to Main Div.
                        $("#divMain").append(clonecont);
                        // Book & Select button to be displayed for Flight Search with Travel Request.
                        if (isWithTR) {
                            $("#divPreferredOrSelect_" + flightIncrement).removeClass('hidden');
                            if (flight.IsPreferredAirline) {
                                $("#divDisplayPreferred_" + flightIncrement).removeClass('hidden');
                            }
                            else {
                                $("#divDisplayPreferred_" + flightIncrement).addClass('hidden');
                            }
                            if ((isApplyFilter && pageIndex == 1) || (pageIndex == 1)) {
                                if (flight.IsLowestLogicalFare) {
                                    if (isExc === "false") {
                                        $("#chkBook_" + flightIncrement).attr('checked', 'checked');
                                        $("#lblBook_" + flightIncrement).addClass('hide');
                                        $("#divFlightPreferred_" + flightIncrement).append("<label class='btn btn-info rze-1wayselect rze-selectedbtn'>Selected</label>");
                                        $("#divDisplayPreferred_" + flightIncrement).addClass('hidden');
                                    }
                                }
                            }
                        }
                        else {
                            $("#divPreferredOrSelect_" + flightIncrement).addClass('hidden');
                        }
                        //Flight Segment starts.
                        $.each(TripValue.Segment, function (Segmentkey, SegmentValue) {
                            var tabCloneSection = BindingFlightTabDetails(SegmentValue, cloneFlightTab);
                            var layDuration = SegmentValue.LayoverDuration.split(":");
                            tabCloneSection = tabCloneSection.replace("divLayover", "divLayover_" + flightID + "_" + SegmentValue.SegmentRPH);
                            $("#divFlightSegmentDetails_" + flightIncrement).append(tabCloneSection);
                            if (layDuration[0] == 00 && layDuration[1] == 00) {
                                $("#divLayover_" + flightID + "_" + SegmentValue.SegmentRPH).addClass('hide');
                            }
                        });
                        flightIncrement++;
                    });
                }
                else {
                    //Round Trip is 2.
                    $(".TotalReturnTravelDuration").show();
                    $(".ReturnFlightDepartureTime").show();
                    var isFirstTrip = false;
                    // Flight Trip (Depature/Arrival) html to bind from TravelFareFinder.html.
                    var cloneFlightResult = $("#divFlightResultTrips").html();
                    // Flight Segment html to bind from TravelFareFinder.html.
                    var cloneFlightSegTitle = $("#divFlightSegmentTitle").html();
                    // Flight Tab html to bind from TravelFareFinder.html.
                    var cloneFlightTab = $("#divTabFlightDetailsShow").html();
                    $.each(flight.Trip, function (Tripkey, TripValue) {
                        var departureTripDateTime = new Date(TripValue.FlightOrginDestination.OriginDateTime);
                        var departureTripDateList = departureTripDateTime.toDateString();
                        var departureTripTimeList = departureTripDateTime.toTimeString().split(':');
                        var arrivalTripDateTime = new Date(TripValue.FlightOrginDestination.DestinationDateTime);
                        var arrivalTripDateList = arrivalTripDateTime.toDateString();
                        var arrivalTripTimeList = arrivalTripDateTime.toTimeString().split(':');
                        var tripDuration = TripValue.TotalDuration.split(":");
                        var clonecont = cloneFlightResult;
                        var segTitle = cloneFlightSegTitle;

                        var tripTotalHrs = 0;
                        if (tripDuration[0].length > 2) {
                            var hrs = tripDuration[0].split('.');
                            tripTotalHrs = (parseInt(hrs[0]) * 24) + parseInt(hrs[1]);
                        }
                        else {
                            tripTotalHrs = tripDuration[0];
                        }

                        if (!isFirstTrip) {
                            var clonecontDepature = $("#divFlightSearchResultRoundTrip").html();

                            //Replacing the Key word with Values for Depture.
                            clonecontDepature = clonecontDepature.replace("#FlightName#", flight.Trip[0].Airline.Name +" - "+flight.Trip[1].Airline.Name);
                            clonecontDepature = clonecontDepature.replace("#PolicyText#", policyText);
                            clonecontDepature = clonecontDepature.replace("#NoOfPassenger#", $("#txtAdultCount").val());
                            clonecontDepature = clonecontDepature.replace("divFlightTrips", "divFlightTrips_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divTabstoggleUlListFlightDetails", "divTabsUlListFlightDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("TabFlightDetails", "divTabsUlListFlightDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divTabToggleFlightDetails", "divTabsUlListFlightDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divTabstoggleUlListPriceDetails", "divTabsUlListPriceDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("TabFlightPrice", "divTabsUlListPriceDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divTabTogglePrice", "divTabsUlListPriceDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divFlightHeader", "divFlightHeader_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divDisplayPreferred", "divDisplayPreferred_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("divFlightSegmentDetails", "divFlightSegmentDetails_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.Price.TotalAmount.toLocaleString(sessionStorage.CultureTypeInfo));
                            clonecontDepature = clonecontDepature.replace("#BaseFare#", flight.Price.BaseFare.toLocaleString(sessionStorage.CultureTypeInfo));
                            clonecontDepature = clonecontDepature.replace("#ServiceTax#", flight.Price.Tax.toLocaleString(sessionStorage.CultureTypeInfo));
                            clonecontDepature = clonecontDepature.replace("#PassengerTax#", flight.Price.Fee.toLocaleString(sessionStorage.CultureTypeInfo));
                            clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.Price.TotalAmount.toLocaleString(sessionStorage.CultureTypeInfo));
                            clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.Price.TotalAmount.toLocaleString(sessionStorage.CultureTypeInfo));
                            clonecontDepature = clonecontDepature.replace("divPreferredOrSelect", "divPreferredOrSelect_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("chkBook", "chkBook_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("book", "book_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("chkBookVal", flight.RPH);
                            clonecontDepature = clonecontDepature.replace("lblBook", "lblBook_" + flightIncrement);
                            clonecontDepature = clonecontDepature.replace("FlightSelect(lblBook)", "FlightSelect(" + flightIncrement + ")");
                            //Appending the Flight Details to main div html.
                            $("#divMain").append(clonecontDepature);

                            if (isWithTR) {
                                $("#divPreferredOrSelect_" + flightIncrement).removeClass('hidden');

                                if (flight.IsPreferredAirline) {
                                    console.log(flightIncrement + " isPref: " + flight.IsPreferredAirline);
                                    // alert(flight.flightIncrement + "==" + flight.IsPreferredAirline);
                                    $("#divDisplayPreferred_" + flightIncrement).removeClass('hidden');
                                }
                                else {
                                    console.log(flightIncrement + " isPref: " + flight.IsPreferredAirline);
                                    $("#divDisplayPreferred_" + flightIncrement).addClass('hidden');
                                }

                                if ((isApplyFilter && pageIndex == 1) || (pageIndex == 1)) {
                                    if (flight.IsLowestLogicalFare) {
                                        if (isExc === "false") {
                                            $("#chkBook_" + flightIncrement).attr('checked', 'checked');
                                            $("#lblBook_" + flightIncrement).addClass('hide');
                                            $("#divPreferredOrSelect_" + flightIncrement).append("<label class='btn btn-info flight-select rze-1wayselect margntop5 rze-selectedbtn'>Selected</label>")
                                            $("#divDisplayPreferred_" + flightIncrement).addClass('hidden');
                                        }
                                    }
                                }
                            }
                            else {
                                $("#divPreferredOrSelect_" + flightIncrement).addClass('hidden');
                            }

                            isFirstTrip = true;
                            segTitle = segTitle.replace("#Type#", "DEPARTURE");
                            clonecont = clonecont.replace("#TripTitle#", "Departure on " + departureTripDateList);
                        }
                        else {
                            segTitle = segTitle.replace("#Type#", "RETURN");
                            clonecont = clonecont.replace("#TripTitle#", "Departure on " + departureTripDateList);
                        }

                        clonecont = clonecont.replace("FlightLogo", "/Media/Images/AirlineLogossmall/" + TripValue.Airline.Code + ".png");
                        clonecont = clonecont.replace("#FlightName#", TripValue.Airline.Name);
                        clonecont = clonecont.replace("#FlightNumber#", TripValue.Airline.Name);
                        clonecont = clonecont.replace("#List#", TripValue.StopOver);
                        clonecont = clonecont.replace("#DepatureTime#", departureTripTimeList[0] + ":" + departureTripTimeList[1]);
                        clonecont = clonecont.replace("#DepatureDate#", departureTripDateList);
                        clonecont = clonecont.replace("#ArrivalTime#", arrivalTripTimeList[0] + ":" + arrivalTripTimeList[1]);
                        clonecont = clonecont.replace("#ArrivalDate#", arrivalTripDateList);
                        clonecont = clonecont.replace("#Duration#", tripTotalHrs + " Hrs " + tripDuration[1] + " Mins");
                        clonecont = clonecont.replace("#Stops#", TripValue.Stops);
                        $("#divFlightTrips_" + flightIncrement).append(clonecont);

                        //Replacing the Key word with Values for Segment Title.
                        segTitle = segTitle.replace("#BookingClass#", bookClass);
                        segTitle = segTitle.replace("#Coach#", TripValue.Segment[0].BookingClassType);
                        //Append Segment Title to Seg Detail div in html.
                        $("#divFlightSegmentDetails_" + flightIncrement).append(segTitle);

                        $.each(TripValue.Segment, function (Segmentkey, SegmentValue) {
                            var tabCloneSection = BindingFlightTabDetails(SegmentValue, cloneFlightTab);
                            var layDuration = SegmentValue.LayoverDuration.split(":");
                            tabCloneSection = tabCloneSection.replace("divLayover", "divLayover_" + flightID + "_" + SegmentValue.SegmentRPH);
                            $("#divFlightSegmentDetails_" + flightIncrement).append(tabCloneSection);
                            if (layDuration[0] == 00 && layDuration[1] == 00) {
                                $("#divLayover_" + flightID + "_" + SegmentValue.SegmentRPH).addClass('hide');
                            }
                        });
                    });
                    flightIncrement++;
                    isFirstTrip = false;
                }
            });

            $(".rze-ftabcontainer").hide();
            //set Start
            if (pageIndex == 1 && response.Flight.length > 0) {
                if (!isWithTR) {
                    $("#resultCount").html("Showing " + response.Flight.length + " " + "0f " + response.Pagination.TotalNoOfPages);
                    $("#hdnResultsCount").val(parseInt(response.Flight.length));
                    CurrentpageCount = parseInt(response.Flight.length);
                }
                else {
                    var removePreferredTromTotal = parseInt(response.Flight.length) - 1;
                    $("#resultCount").html("Showing " + removePreferredTromTotal + " " + "0f " + response.Pagination.TotalNoOfPages);
                    $("#hdnResultsCount").val(parseInt(removePreferredTromTotal));
                    CurrentpageCount = parseInt(removePreferredTromTotal);
                }
            }
            else {
                CurrentpageCount = CurrentpageCount + parseInt(response.Flight.length);
                $("#resultCount").html("Showing " + CurrentpageCount + " " + "0f " + response.Pagination.TotalNoOfPages);
                $("#hdnResultsCount").val(CurrentpageCount);
            }
            $("#hdnTotalResultsCount").val(parseInt(response.Pagination.TotalNoOfPages));
            //set End
        }
        else {
            $("#divMain").append('<h4 class="error-msg">No Flight found for given search criteria.</label>');
            return false;
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js FlightSearchResults() -->" + error);
    }
    $.unblockUI();
}

function FlightViewDetails(element) {
    try {
        $(".rze-ftabcontainer").hide();
        if ($('#' + element.id).hasClass('selected')) {
            $('#' + element.id).slideUp();
            ($('#' + element.id).removeClass('selected'))
        }
        else {
            ($('#' + element.id).addClass('selected'))
            $('#' + element.id).show();
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js FlightViewDetails() -->" + error);
    }
}

function BindingFlightTabDetails(SegmentValue, cloneFlightTab) {
    try {
        // Segments level details of the Flight Trips.
        var departureSegmentDateTime = new Date(SegmentValue.OriginDestinationDetail.OriginDateTime);
        var departureSegmentDateList = departureSegmentDateTime.toDateString();
        var departureSegmentTimeList = departureSegmentDateTime.toTimeString().split(':')
        var arrivalSegmentDateTime = new Date(SegmentValue.OriginDestinationDetail.DestinationDateTime);
        var arrivalSegmentDateList = arrivalSegmentDateTime.toDateString();
        var arrivalSegmentTimeList = arrivalSegmentDateTime.toTimeString().split(':')
        var segDuration = SegmentValue.JourneyDuration.split(":");
        var layDuration = SegmentValue.LayoverDuration.split(":");
        var tabCloneSection = cloneFlightTab;

        //Replacing the Key word with Values for Segment Details.
        tabCloneSection = tabCloneSection.replace("FlightDetailLogo", "/Media/Images/AirlineLogossmall/" + SegmentValue.Airline.Code + ".png");
        tabCloneSection = tabCloneSection.replace("#FlightName#", SegmentValue.Airline.Name);
        tabCloneSection = tabCloneSection.replace("#FlightNumber#", SegmentValue.FlightNumber);
        tabCloneSection = tabCloneSection.replace("#MarketingAirline#", SegmentValue.Airline.MarketingAirline);
        tabCloneSection = tabCloneSection.replace("#OperatingAirline#", SegmentValue.Airline.OperatingAirline);
        tabCloneSection = tabCloneSection.replace("#DepartTime#", departureSegmentDateList + ", " + departureSegmentTimeList[0] + ":" + departureSegmentTimeList[1]);
        tabCloneSection = tabCloneSection.replace("#DepartLoc#", SegmentValue.OriginDestinationDetail.OriginLocationCode);
        tabCloneSection = tabCloneSection.replace("#DepatureAirport#", SegmentValue.OriginDestinationDetail.OriginLocationAirportName + " (" + SegmentValue.OriginDestinationDetail.OriginLocationCode + ")");
        tabCloneSection = tabCloneSection.replace("#ArrivalTime#", arrivalSegmentDateList + ", " + arrivalSegmentTimeList[0] + ":" + arrivalSegmentTimeList[1]);
        tabCloneSection = tabCloneSection.replace("#ArrivalLoc#", SegmentValue.OriginDestinationDetail.DestinationLocationCode);
        tabCloneSection = tabCloneSection.replace("#OrginAirport#", SegmentValue.OriginDestinationDetail.DestinationLocationAirportName + " (" + SegmentValue.OriginDestinationDetail.DestinationLocationCode + ")");
        tabCloneSection = tabCloneSection.replace("#Duration#", segDuration[0] + " Hrs " + segDuration[1] + " Mins");
        tabCloneSection = tabCloneSection.replace("#Layover#", layDuration[0] + " Hrs " + layDuration[1] + " Mins");

        return tabCloneSection;
    }
    catch (error) {
        $().Logger.error("FlightSearch.js BindingFlightTabDetails() -->" + error);
    }
}

function FlightSelect(SelectedId) {
    try {
        //Get the selected Flight  count from url.
        var flightItineraryCount = parseInt(getUrlVars()["Count"]);

        //Checking the count of Flight selected. Change color from yellow to green on selecting the flights.
        if ($("#chkBook_" + SelectedId).is(":checked") == false) {
            // Allowing the employee to select only one, if employee belongs to grade approval exceptions.
            var isExc = getUrlVars()["IsExc"];
            if ((isExc === "true" && flightItineraryCount > 0) || (isExc === "true" && $('input[type="checkbox"]:checked').length == 1)) {
                alertmsg('You can select only 1 Flight');
                return false;
            }
            if (flightItineraryCount >= 1) {
                if ($('input[type="checkbox"]:checked').length + flightItineraryCount >= 5) {
                    alertmsg('You have already selected allowed number of flights');
                    return false;
                }
            }
            if ($('input[type="checkbox"]:checked').length >= 5) {
                alertmsg('Selection flight allowed upto 4.');
                return false;
            }
            else {
                $("#lblBook_" + SelectedId).addClass("SelectFlight");
                $("#chkBook_" + SelectedId).prop('checked', true);
            }
        }
        else {
            if ($("#chkBook_" + SelectedId).is(":checked")) {
                $("#lblBook_" + SelectedId).removeClass("SelectFlight");
                $("#chkBook_" + SelectedId).prop('checked', false);
            }
            else {
                $("#lblBook_" + SelectedId).addClass("SelectFlight");
                $("#chkBook_" + SelectedId).prop('checked', true);
            }
        }
    }
    catch (error) {
        $().Logger.error("FlightSearch.js FlightSelect() -->" + error);
    }
}

function GetFlightFilteredResults(Submit) {
    try {
        if (Submit) {
            isLoadingData = true;
            pageIndex = 1;
            $("#divMain").empty();
            $("#resultCount").html("");
            CurrentpageCount = 0;
            TotalPageCount = 0;
            ShowCount = 0;
            $("#hdnShowCount").val("0")
        }

        $.blockUI({ message: '<h1><i class="fa fa-cog fa-spin"></i> ' + "Just a moment" + '</h1>', showOverlay: true });
        var isWithTR = false;

        var roundTrip = 0;
        var searchRequest = new Object();

        // Pagination .
        if (pageIndex == 1 || pageIndex == undefined) {
            var paginationCriteria = {
                PageIndex: 1,
                PageSize: parseInt($("#hdnDefaultPageSize").val()),
                TotalNoOfPages: 0
            };
        }
        else {
            var paginationCriteria = {
                PageIndex: pageIndex,
                PageSize: parseInt($("#hdnDefaultPageSize").val()),
                TotalNoOfPages: 0
            };
        }

        //Sorting.
        if (!isSortByPrice) {
            var sortCriteria = {
                Type: 1,
                Order: 1
            };
        }
        else {
            var sortCriteria = {
                Type: 1,
                Order: 2
            };
        }

        //Filters.
        var flightName = [];
        $('#mySelect1 :selected').each(function (i, selected) {
            var start = $(selected).text().indexOf("(", 2);
            if (start != undefined) {
                flightName[i] = $(selected).text().substring(start + 1, start + 3);

                //flightName[i] = $(selected).text();
                isFlightNameFilter = true;
            }
        });
        var filterCriteria = new Object();
        filterCriteria.OnwardDepartureTime = new Object();
        filterCriteria.ReturnDepartureTime = new Object();
        filterCriteria.OnwardTotalDuration = new Object();
        filterCriteria.ReturnTotalDuration = new Object();
        filterCriteria.Price = new Object();

        if (typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined') {
            minReturnTotalDuration = filterCriteria.ReturnTotalDuration.MinTime = $('#minReturnTotalDuration').val();
            maxReturnTotalDuration = filterCriteria.ReturnTotalDuration.MaxTime = $('#maxReturnTotalDuration').val();
            minReturnDepartureTime = filterCriteria.ReturnDepartureTime.MinTime = $('#minReturnDepartureTime').val();
            maxReturnDepartureTime = filterCriteria.ReturnDepartureTime.MaxTime = $('#maxReturnDepartureTime').val();
        }
        minOnwardDepartureTime = filterCriteria.OnwardDepartureTime.MinTime = $('#minOnwardDepartureTime').val();
        maxOnwardDepartureTime = filterCriteria.OnwardDepartureTime.MaxTime = $('#maxOnwardDepartureTime').val();
        minOnwardTotalDuration = filterCriteria.OnwardTotalDuration.MinTime = $('#minOnwardTotalDuration').val();
        maxOnwardTotalDuration = filterCriteria.OnwardTotalDuration.MaxTime = $('#maxOnwardTotalDuration').val();

        filterCriteria.Price.MinValue = $('#minFlightFare').val();
        filterCriteria.Price.MaxValue = $('#maxFlightFare').val();
        filterCriteria.AirlineNames = flightName;

        // Search Request.
        var searchCriteria = new Object();
        searchCriteria.TicketClass = $("#drpTicketClass").val();
        if (typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined') {
            roundTrip = 2;
            searchCriteria.AirTripType = roundTrip;
        }
        searchCriteria.NoOfPassengers = $("#txtAdultCount").val();
        searchCriteria.Criteria = SearchRequestCriteria();

        searchRequest.RequestNo = getUrlVars()["RequestNo"];
        if (searchRequest.RequestNo != undefined) {
            isWithTR = true;
            $('#hdnIsWithTR').val(isWithTR);
        }

        searchRequest.Search = searchCriteria;
        searchRequest.Pagination = paginationCriteria;
        searchRequest.Sort = sortCriteria;
        searchRequest.Filter = filterCriteria;

        $("#Flightfilters").hide();
        $("#divFlightShowAddItinenary").hide();

        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "Flight/Search",
            "POST",
           searchRequest,
            function (response) {
                if (response != null) {
                    FlightSearchResults(response, true, isWithTR);
                    isLoadingData = false;
                    return false;
                }
                else {
                    $("#divMain").append('<h4 class="error-msg">No Flight found for given search criteria.</label>');
                    return false;
                }
                $.unblockUI();
            },
            function (error) {
            }, "JSON");
    }
    catch (error) {
        $().Logger.error("FlightSearch.js GetFlightFilteredResults() -->" + error);
    }
}
