// Search criteria.
function SearchCriteria() {
    try {
        var searchCriteria = new Object();
        searchCriteria.TicketClass = $("#drpTicketClass").val();
        if (typeof $('#txtFlightReturnDate').attr('disabled') === 'undefined') {
            searchCriteria.AirTripType = 2;
        }
        else {
            searchCriteria.AirTripType = 1;
        }

        searchCriteria.NoOfPassengers = $("#txtAdultCount").val();

        // Gets the criteria from flightsearch.js.
        searchCriteria.Criteria = SearchRequestCriteria();

        return searchCriteria;
    } catch (error) {
        $().Logger.error("AddToItnerary.js SearchCriteria()-->" + error)
    }
}

// Add flight itienrary.
function AddToItinerary(IsProceedToHotel) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var addedFlightItineraryCount = parseInt(getUrlVars()["Count"]);
        var flightIds = [];
        var travelRequestId = $("#FFTravelRequestNo").html();
        $('input[type="checkbox"]:checked').each(function () {
            var flightItinerary = CreateFlightItinerary($(this).val());
            flightIds.push(flightItinerary);
        });

        // Validating flights count.
        if (flightIds.length == 0 && IsProceedToHotel == false) {
            $.unblockUI();
            alertmsg('Select atleast one flight.');
            return false;
        }

        // Allow proceed to hotel if flight count is zero.
        if (flightIds.length == 0 && IsProceedToHotel == true) {
            $.unblockUI();
            return true;
        }
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var preferedFlightId = $('#preferedFlightId').val();
        var model = {
            TravelRequestId: travelRequestId,
            FlightRequest: SearchCriteria(),
            Flights: flightIds,
            PreferredFlightId: preferedFlightId,
            CorporatePolicyIDs: $("#hdnCorporatePolicies").val(),
            IsBookingClassPolicyViolated: $("#hdnHasBookingClassPolicyViolated").val(),
        };

        var isValue = false;
        var data = $.postifyData(model);
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelItinerary/Itinerary/Add",
        "POST",
        data,
        function (response) {
            $.unblockUI();
            if (response == true) {
                if (IsProceedToHotel == true) {
                    isValue = true;
                }
                else {
                    bootbox.alert({
                        title: "Alert",
                        message: "Flight itinerary added successfully, kindly click on Ok to view added flights.",
                        size: 'small',
                        callback: function () {
                            window.location.href = "TravelRequestDetail?RequestNo=" + travelRequestId + "&Itinerary=true";
                        }
                    })
                }
            }
            else {
                if (IsProceedToHotel == true) {
                    bootbox.confirm("Creating flight itinerary failed, To continue click on Ok to search hotel.",
                        function (result) { isValue = result; });
                }
                else {
                    alertmsg('Creating flight itinerary failed for travel request id:' + travelRequestId);
                    isValue = false;
                }
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        null, false
        );

        return isValue;
    } catch (error) {
        $().Logger.error("AddToItnerary.js AddToItinerary()-->" + error)
    }
}

function CreateFlightItinerary(flightId) {
    try {
        var model = new Object();
        model.FlightId = flightId;
        return model;
    } catch (error) {
        $().Logger.error("AddToItnerary.js CreateFlightItinerary()-->" + error)
    }
}

function fnSelectFlight(flightId) {
    try {
        var flightItineraryCount = parseInt(getUrlVars()["Count"]);
        if ($("#book_" + flightId).is(":checked") == false) {
            if (flightItineraryCount >= 1) {
                if ($('input[type="checkbox"]:checked').length + flightItineraryCount >= 6) {
                    alertmsg('You have already selected allowed number of flights');
                    return false;
                }
            }
            if ($('input[type="checkbox"]:checked').length >= 5) {
                alertmsg('Selection flight allowed upto 4.');
                return false;
            }
            else {
                $("#labelbook_" + flightId).addClass("SelectFlight");
                $("#book_" + flightId).prop('checked', true);
            }
        }
        else {
            if ($("#book_" + flightId).is(":checked")) {
                $("#labelbook_" + flightId).removeClass("SelectFlight");
                $("#book_" + flightId).prop('checked', false);
            }
            else {
                $("#labelbook_" + flightId).addClass("SelectFlight");
                $("#book_" + flightId).prop('checked', true);
            }
        }
    } catch (error) {
        $().Logger.error("AddToItnerary.js fnSelectFlight()-->" + error)
    }
}

function popUpDialog(TR) {
    try {
        $('#dialog-ff').html('Flights are already added. Kindly remove previous selection to new.');
        $('#dialog-ff').removeClass('hidden');
        $("#dialog-ff").dialog({
            modal: true,
            open: function (event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            },
            buttons: {
                "OK": function () {
                    $(this).dialog("close");
                    $('#dialog-ff').addClass('hidden');
                    window.location.href = "TravelRequestDetail?RequestNo=" + TR + "&Itinerary=true";
                },
                Cancel: function () {
                    $(this).dialog("close");
                    $('#dialog-ff').addClass('hidden');
                    $('#FlightTab').removeClass('active');
                    $('#HotelTab').addClass('active');
                    if (!$('#HotelSection').hasClass('active')) {
                        $.get("/b2e-hotel.html", function (data) {
                            $('#HotelSection').html(data);
                        });
                        $('#FlightSection').removeClass('tab-pane fade in active').addClass('tab-pane fade');
                        $('#HotelSection').removeClass('tab-pane fade').addClass('tab-pane fade in active');
                    }
                }
            }
        });
    } catch (error) {
        $().Logger.error("AddToItnerary.js popUpDialog()-->" + error)
    }
}
