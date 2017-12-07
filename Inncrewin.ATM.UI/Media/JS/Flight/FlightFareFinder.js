$(function () {
    try {
        // When One way is selected
        $("#flight-oneway").click(function () {
            $("#txtFlightReturnDate").attr("disabled", "disabled");
            $("#Flightfilters").hide();
            $("#divBookingClassUpgrade").hide();
            $("#divMain").empty();
            $("#resultCount").hide();
        });

        // When Round Trip is selected
        $("#flight-roundtrip").click(function () {
            $("#txtFlightReturnDate").removeAttr("disabled");
            $("#Flightfilters").hide();
            $("#divBookingClassUpgrade").hide();
            $("#divMain").empty();
            $("#resultCount").hide();
        });

        // Date picker for Date textbox
        $("#txtFlightDepartDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "txtFlightDepartDate")
            },
            numberOfMonths: [1, 2],
            minDate: moment().format(sessionStorage.DateFormatForMoment),
            onSelect: function () {
                $('#txtFlightReturnDate').datepicker('option', 'minDate', this.value);
            }
        });

        $("#txtFlightDepartDate").mask(sessionStorage.CultureMaskFormat);
        $("#txtFlightReturnDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "txtFlightReturnDate")
            },
            numberOfMonths: [1, 2],
            minDate: moment().format(sessionStorage.DateFormatForMoment)
        });
        $("#txtFlightReturnDate").mask(sessionStorage.CultureMaskFormat);

        // Load Booking Type class for Flight
        LoadFlightBookingClass();

        // Flight depature search box
        $("#txtFlightFrom").autocomplete({
            minLength: 3,
            source: function (request, response) {
                $.when(GetFlightSearchlocation(request.term)).then(
                function (r) {
                    response(r);
                })
            }
        });

        // Flight Arrival search box
        $("#txtFlightTo").autocomplete({
            minLength: 3,
            source: function (request, response) {
                $.when(GetFlightSearchlocation(request.term)).then(
                function (r) {
                    response(r);
                })
            }
        });

        
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js -->" + error);
    }
});

function LoadFlightPolicyFareFinderData() {
    try {
        var travelRequestId = getUrlVars()["RequestNo"];
        if (travelRequestId === undefined)
            travelRequestId = 0;
        var serviceproxy = new ServiceProxy();
        serviceproxy.invoke(
        "Policy/FlightPolicyFareFinderData?travelRequestId=" + travelRequestId,
        "GET",
        null,
        function (response) {
            if (response != null) {
                var $hdnMinDays = $('<input/>', { type: 'hidden', id: 'hdnMinDays', value: response.MinDays });
                var $hdnMaxDays = $('<input/>', { type: 'hidden', id: 'hdnMaxDays', value: response.MaxDays });
                var $hdnPreferredBookingClass = $('<input/>', { type: 'hidden', id: 'hdnPreferredBookingClass', value: response.BookingClass });
                $hdnMinDays.appendTo("#FlightSection");
                $hdnMaxDays.appendTo("#FlightSection");
                $hdnPreferredBookingClass.appendTo("#FlightSection");

                var preferredOption = $('#drpTicketClass option[value="' + response.BookingClass + '"]')
                preferredOption.prop('selected', true);
                $("#drpTicketClass option[value='" + response.BookingClass + "']").remove();
                $("#drpTicketClass").prepend(preferredOption);
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js LoadFlightPolicyFareFinderData() -->" + error);
    }
}

function PolicyAppliedMessage() {
    try {
        if (getUrlVars()["RequestNo"] != undefined) {
            var bookingClass = $("#hdnPreferredBookingClass").val();
            var dropDownBookingClass = $('#drpTicketClass :selected').val();
            $("#ooutOfPolicyMessage").text('');
            $("#divOutOfPolicy").removeClass("rze-policyalert");
            if (bookingClass != undefined && bookingClass != dropDownBookingClass) {
                $("#divOutOfPolicy").addClass("rze-policyalert");
                $("#ooutOfPolicyMessage").html("Alert: Results for selected booking class will be out of policy.");
                $("#ooutOfPolicyMessage").css('color', 'red');
            }
        }

        $("#divMain").empty();
        $("#Flightfilters").hide();
        $("#divBookingClassUpgrade").hide();
        $("#resultCount").hide();
        IsUpgraded = false;
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js PolicyAppliedMessage() -->" + error);
    }
}

// Load Booking Type class for Flight
function LoadFlightBookingClass() {
    try {
        var serviceproxy = new ServiceProxy();
        serviceproxy.invoke(
        "Flight/GetFlightBookingClass",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $.each(response, function (key, value) {
                    if (value.Code == 'E')
                        $("#drpTicketClass").append($("<option selected></option>").val(value.Code).html(value.Name));
                    else
                        $("#drpTicketClass").append($("<option></option>").val(value.Code).html(value.Name));
                });

                if (getUrlVars()["RequestNo"] != undefined) {
                    LoadFlightPolicyFareFinderData();
                }
            };
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js LoadFlightBookingClass() -->" + error);
    }
}

// Get all the search locations for flight
function GetFlightSearchlocation(key) {
    try {
        var dfd = jQuery.Deferred();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Flight/SearchLocation/" + key,
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                dfd.resolve(response);
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
        return dfd.promise();
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js GetFlightSearchlocation() -->" + error);
    }
}

// Increment and decrement for Adults counts
$(document).on("click", ".dp-PlusRoomCount", paxIncrementValue);
$(document).on("click", ".dp-MinusRoomCount", paxDecrementValue)

//Adult count decrement to 1 minimum
function paxDecrementValue() {
    try {
        var b = $(this).parent().find("input");
        var a = b.val();
        if (a > 1) {
            b.val(parseInt(b.val()) - 1)
        }
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js paxDecrementValue() -->" + error);
    }
}

//Adult count increment to 7 maximum
function paxIncrementValue() {
    try {
        var b = $(this).parent().find("input");
        var a = b.val();
        if (a < 7) {
            b.val(parseInt(b.val()) + 1)
        }
    }
    catch (error) {
        $().Logger.error("FlightFareFinder.js paxIncrementValue() -->" + error);
    }
}
