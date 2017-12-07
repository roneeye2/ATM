var ApproverItineraryComments = "";
var viewFlightIncrement = 0;
var DetailTabSliderLenthCnt = 3;
var DetailTabSliderMoveIndex = 2;
var IsCBTSonata = false;
$(function () {
    // Show the flight itinerary.
    try {
        var isItinerary = false;
        var flightItinerary = getUrlVars()["Itinerary"]
        if (flightItinerary != null && flightItinerary == "true") {
            isItinerary = true;
        }
        $('#footer').load('footer.html');
        $("#header_RequestDetail").load('header.html', function () {
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelRequest/TravelRequest/GetUserInfo",
                "POST",
            null,
            function (response) {
                IsCBTSonata = response.ISCBTSONATA;
                if (IsCBTSonata) {
                    $('#header_TravelFareFinder').addClass('hide');
                }
                if (!response.ISEXPENSE) {
                    $('#ExpenseReports_header').hide();
                }
                FindAdminOrEmployee(response);
                $('.rze-loginname').html(response.UserName);
                $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
                $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
                $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
                if ($('#ExpenseReports_header').length > 0) {
                    DetailTabSliderLenthCnt = 2;
                    DetailTabSliderMoveIndex = 1;
                }

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
                            if ($("#myTab").children().length > DetailTabSliderLenthCnt) {
                                $(".slider").attr("id", "slider1");
                                if ($('#ExpenseReports_header').length > 0) {
                                    $('#slider1 .viewport').addClass('expense');
                                }
                                $('#slider1').tinycarousel();
                                var slider1 = $("#slider1").data("plugin_tinycarousel");
                                slider1.update();
                            }

                        });
                        if (!$("#myTab li").hasClass("active")) {
                            $('#myNavbar li.active').each(function () {
                                $(this).removeClass("active");
                            });
                            if (sessionStorage.nextTab != undefined) {
                                var nextTab = $.parseJSON(sessionStorage.nextTab);
                                var ReqNo = nextTab.split("//")[0];
                                var ReqType = nextTab.split("//")[1];
                                $("#element_" + ReqNo + "_" + ReqType).attr('class', 'active');
                                if ($("#myTab").children().length > DetailTabSliderLenthCnt) {
                                    var slider1 = $("#slider1").data("plugin_tinycarousel");
                                    slider1.update();
                                    $("#myTab").children().remove('.mirrored');
                                    var tab = $("#myTab").children();
                                    var currenttab = $("#element_" + ReqNo + "_" + ReqType);
                                    var index = tab.index(currenttab);
                                    var tempIndex = index - DetailTabSliderMoveIndex;
                                    if (tempIndex > 0)
                                        slider1.move(index - DetailTabSliderMoveIndex);
                                }
                                sessionStorage.removeItem("nextTab");
                                sessionStorage.removeItem("prevTab");
                                sessionStorage.removeItem("ClickedTab");
                            }
                            else if (sessionStorage.prevTab != undefined) {
                                var prevTab = $.parseJSON(sessionStorage.prevTab);
                                var ReqNo = prevTab.split("//")[0];
                                var ReqType = prevTab.split("//")[1];
                                $("#element_" + ReqNo + "_" + ReqType).attr('class', 'active');
                                if ($("#myTab").children().length > DetailTabSliderLenthCnt) {
                                    var slider1 = $("#slider1").data("plugin_tinycarousel");
                                    slider1.update();
                                    $("#myTab").children().remove('.mirrored');
                                    var tab = $("#myTab").children();
                                    var currenttab = $("#element_" + ReqNo + "_" + ReqType);
                                    var index = tab.index(currenttab);
                                    var tempIndex = index - DetailTabSliderMoveIndex;
                                    if (tempIndex > 0)
                                        slider1.move(index - DetailTabSliderMoveIndex);
                                }
                                sessionStorage.removeItem("nextTab");
                                sessionStorage.removeItem("prevTab");
                                sessionStorage.removeItem("ClickedTab");
                            }
                            else if (sessionStorage.ClickedTab != undefined) {
                                var ClickedTab = $.parseJSON(sessionStorage.ClickedTab);
                                var ReqNo = ClickedTab.split("//")[0];
                                var ReqType = ClickedTab.split("//")[1];
                                $("#element_" + ReqNo + "_" + ReqType).attr('class', 'active');
                                sessionStorage.removeItem("nextTab");
                                sessionStorage.removeItem("prevTab");
                            }
                            else {
                                //$('#myTab li:last').attr('class', 'active');
                                if ($("#myTab").children().length > DetailTabSliderLenthCnt) {
                                    var slider1 = $("#slider1").data("plugin_tinycarousel");
                                    slider1.update();
                                    $("#myTab").children().remove('.mirrored');
                                    var tab = $("#myTab").children();
                                    var currenttab = $('#myTab li:last');
                                    var index = tab.index(currenttab);
                                    var tempIndex = index - DetailTabSliderMoveIndex;
                                    if (tempIndex > 0)
                                        slider1.move(index - DetailTabSliderMoveIndex);
                                }
                                $('#myTab li:last').attr('class', 'active');
                                sessionStorage.removeItem("nextTab");
                                sessionStorage.removeItem("prevTab");
                            }
                            if ($("#myTab li").hasClass("active")) {
                                $("#myTab li.active").each(function () {
                                    sessionStorage.removeItem("nextTab");
                                    sessionStorage.removeItem("prevTab");
                                    var ReqNumber = $(this).attr('id').split("_")[1];
                                    var RequestType = $(this).attr('id').split("_")[2];
                                    if (ReqNumber.indexOf("NewTR") == -1) {
                                        if (ReqNumber > 0)
                                            LoadTravelRequest(ReqNumber, RequestType);
                                    }
                                    else {
                                        LoadTravelRequest('', '');
                                    }
                                });
                            }
                            if ($("#myTab").children().length > DetailTabSliderLenthCnt && sessionStorage.ClickedTab != undefined) {
                                var slider1 = $("#slider1").data("plugin_tinycarousel");
                                slider1.update();
                                var ClickedTab = $.parseJSON(sessionStorage.ClickedTab);
                                $("#myTab").children().remove('.mirrored');
                                var tab = $("#myTab").children();
                                var currenttab = $("#element_" + ClickedTab.split("//")[0] + "_" + ClickedTab.split("//")[1]);
                                var index = tab.index(currenttab);
                                var tempIndex = index - DetailTabSliderMoveIndex;
                                if (tempIndex > 0)
                                    slider1.move(index - DetailTabSliderMoveIndex);
                            }
                            sessionStorage.removeItem("ClickedTab");
                        }
                    }
                }
                if (sessionStorage.SavedER != undefined) {
                    SavedER = $.parseJSON(sessionStorage.SavedER);
                    if (SavedER != '') {
                        $.each(SavedER, function (key, value) {
                            var ul = document.getElementById("myTab");
                            var li = document.createElement("li");
                            var a = document.createElement("a");
                            var ReqNo = key.split("//")[0];
                            var RequestType = key.split("//")[1];
                            li.setAttribute("id", "elementExp_" + ReqNo + "_" + RequestType);
                            li.setAttribute("onclick", "getActiveExpTabDetail(this);");
                            ul.appendChild(li);
                            if (ReqNo.indexOf("NewExp") == -1)
                                document.getElementById('elementExp_' + ReqNo + '_' + RequestType).innerHTML = '<a>Exp' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closeExpTab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            else
                                document.getElementById('elementExp_' + ReqNo + '_' + RequestType).innerHTML = '<a>' + value + '<small title="' + value + '">' + value + '</small><i onclick="closeExpTab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            if ($("#myTab").children().length > DetailTabSliderLenthCnt) {
                                $(".slider").attr("id", "slider1");
                                if ($('#ExpenseReports_header').length > 0) {
                                    if (!$('#slider1').hasClass('expense')) {
                                        $('#slider1 .viewport').addClass('expense');
                                    }
                                }
                                $('#slider1').tinycarousel();
                                var slider1 = $("#slider1").data("plugin_tinycarousel");
                                slider1.update();
                            }

                        });
                    }
                }
            });
            //if (IsCBTSonata) {
            //    $('#ApprRequestStatusDiv').addClass('hide');
            //    $('#RequestorRequestStatusDiv').addClass('hide');
            //    $('#AdminRequestStatusDiv').addClass('hide');
            //}
        });

        $(".form-group").change(function () {
            $("#btnSubmit").attr("disabled", "disabled");
            ////alert("Handler for .change() called.");
        });
        $('#liTravelRequest').click(function () {
            setTimeout(function () {
            if ($('#SubmittedTravelRequestStatus').text().toLowerCase() == "booking submitted" && $('#SubmittedTravelRequestAction').text().toLowerCase() == "upload voucher")
            {
                $('#VoucherDiv').show();
            }
            }, 500);
            //alert('tr clicked');
        });
        //GetLoggedInUserName();
        CheckItineraryExists('N');
        $('.submittedBudget').keypress(function (event) {
            var $this = $(this);
            if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
               ((event.which < 48 || event.which > 57) &&
               (event.which != 0 && event.which != 8))) {
                event.preventDefault();
            }

            var text = $(this).val();
            if ((event.which == 46) && (text.indexOf('.') == -1)) {
                setTimeout(function () {
                    if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                        $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                    }
                }, 1);
            }

            if ((text.indexOf('.') != -1) &&
                (text.substring(text.indexOf('.')).length > 2) &&
                (event.which != 0 && event.which != 8) &&
                ($(this)[0].selectionStart >= text.length - 2)) {
                event.preventDefault();
            }
            $('#liTravelRequest').removeClass().addClass("active");
            // Display itinerary.
            if (isItinerary) {
                //active
                CheckItineraryExists('Y');
            }
        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js function()-->" + error);
    }

});

function SwitchTab(tab) {
    try {
        if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            $(window).scrollTop(0);
            return false;
        }
        if (tab == 'Dashboard')
            window.location = "/Dashboard.html";
        else if (tab == 'TravelRequest')
            window.location = "/TravelRequest.html";
        else if (tab == 'TravelFareFinder')
            window.location = "/TravelFareFinder.html";
        else if (tab == 'ExpenseReports')
            window.location = "/ExpenseReports.html";
        else
            return true;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SwitchTab()-->" + error);
    }
}

function GetLoggedInUserName() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetUserInfo",
            "POST",
        null,
        function (response) {
            if (response != null) {
                $('.rze-loginname').html(response.UserName);
            }
            else {
                alertmsg('Some Error Occur in Getting Logged In User. Please try again after some time.');
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GetLoggedInUserName()-->" + error);
    }
}

function closetab(e, req, RequestType) {
    try {
        var ShouldCloseRequest = CloseRequest(req);
        if (ShouldCloseRequest) {
            if (sessionStorage.SavedTR != undefined) {
                SavedTR = $.parseJSON(sessionStorage.SavedTR);
                if (SavedTR != '') {
                    var presentKey = req + "//" + RequestType;
                    var keys = Object.keys(SavedTR),
                    idIndex = keys.indexOf(presentKey),
                    nextIndex = idIndex += 1;
                    var nextKey = keys[nextIndex]
                    var idNewIndex = keys.indexOf(presentKey);
                    prevIndex = idNewIndex -= 1;
                    var prevKey = keys[prevIndex]
                    delete SavedTR[req + "//" + RequestType];
                    var id = "element_" + req + "_" + RequestType;
                    if ($("#myTab .active").attr('id') == id) {
                        if (nextKey != undefined) {
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                            var reqNo = nextKey.split("//")[0];
                            sessionStorage.nextTab = JSON.stringify(nextKey);
                            window.location = "TravelRequestDetail.html" + "?RequestNo=" + reqNo;
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            return false;
                        }
                        else if (prevKey != undefined) {
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                            var reqNo = prevKey.split("//")[0];
                            sessionStorage.prevTab = JSON.stringify(prevKey);
                            window.location = "TravelRequestDetail.html" + "?RequestNo=" + reqNo;
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            return false;
                        }
                        else {
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                            window.location = "Dashboard.html";
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            return false;
                        }
                    }
                    else {
                        sessionStorage.SavedTR = JSON.stringify(SavedTR);
                        $("#myTab li.active").each(function () {
                            var ReqNumber = $(this).attr('id').split("_")[1];
                            var RequestType = $(this).attr('id').split("_")[2];
                            var presentKey = ReqNumber + "//" + RequestType;
                            sessionStorage.nextTab = JSON.stringify(presentKey);
                            window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNumber;
                        });
                        if (sessionStorage.nextTab == undefined)
                            window.location = "Dashboard.html";
                        if (e.stopPropagation != undefined)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;
                        return false;
                    }
                }
                return false;
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js closetab()-->" + error);
    }
}

function CloseRequest(req) {
    try {
        if (req == undefined || req != "NewTR") {
            if ($("#myTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                event.preventDefault();
                return false;
            }
            else if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                $(window).scrollTop(0);
                event.preventDefault();
            }
            else
                return true;
        }
        else
            return true;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js CloseRequest()-->" + error);
    }
}
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    try {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js getUrlVars()-->" + error);
    }
}

function LoadSavedTravelRequest(response) {
    try {
        if (response != null) {
            if (response.TravelRequestId == '') {
                $('#TravelRequestHeader').css('display', 'none');
            }
            else {
                $('#TravelRequestHeader').css('display', 'block');

            }

            if (response.TravelRequestStatusValue >= 2) {
                $('#SavedTravelRequestFlight').attr('display', 'block');
                $('#SavedTravelRequestHotel').attr('display', 'block');
            }
            else {
                $('#SavedTravelRequestFlight').attr('display', 'none');
                $('#SavedTravelRequestHotel').attr('display', 'none');
            }
            if (IsCBTSonata == false) {
                $('#SavedIsBillable').css('display', 'none');
                $('#SavedIsLongTermAssignment').css('display', 'none');
                $('#SavedIsFamilyTicket').css('display', 'none');
                $('#SavedEstimatedPrice').css('display', 'none');
                $('#SavedCurrency').css('display', 'none');
                $('#SavedClientName').css('display', 'none');
                $('#SavedModeOfTravel').css('display', 'none');
                $('#SavedGrade').css('display', 'none');
                $('#SavedDuration').css('display', 'none');
                $('#SavedForexCurrency').css('display', 'none');
                $('#SavedForexCurrencyAmount').css('display', 'none');
                $('#SavedTravelKnownDate').css('display', 'none');
                $('#addMoreTraveller').css('display', 'block');
            }
            else {
                $('#SavedIsBillable').css('display', 'block');
                $('#SavedIsLongTermAssignment').css('display', 'block');
                $('#SavedIsFamilyTicket').css('display', 'block');
                $('#SavedEstimatedPrice').css('display', 'block');
                $('#SavedCurrency').css('display', 'block');
                $('#SavedClientName').css('display', 'block');
                $('#SavedModeOfTravel').css('display', 'block');
                $('#SavedGrade').css('display', 'block');
                $('#SavedDuration').css('display', 'block');
                $('#SavedForexCurrency').css('display', 'block');
                $('#SavedForexCurrencyAmount').css('display', 'block');
                $('#SavedTravelKnownDate').css('display', 'block');
                $('#addMoreTraveller').css('display', 'none');

                //Load Mode Of Travel Dropdown
                LoadTravelModes();

                LoadTravelCurrency();
            }


            $('#hdnCorporateId').val(response.CorporateId);
            $("#TravelRequestNo").html(response.TravelRequestId);
            $("#TravelRequestStatus").html(response.TravelRequestStatus);
            $("#TravelRequestAction").html(response.TravelRequestAction);
            $('#TravelRequestReferenceNumber').val(response.TravelRequestReferenceNumber);
            $("#TravelRequestProject").val(response.CorporateProjectName);
            $("#hdnProjectId").val(response.CorporateProjectId);
            // if ($('#IsCBTSonata').val() == true) {
            if (IsCBTSonata == true) {
                $('#TravelRequestName').val(response.TravelRequestName);
                $('#TravelRequestIsBillable').val(+(response.IsBillable));

                $('#TravelRequestLongTermAssignment').val(+(response.IsLongTermAssignment));
                if (response.IsFamilyIncluded != null) {
                    $('#TravelRequestFamilyTicket').val(+(response.IsFamilyIncluded));
                }
                else {
                    $('#TravelRequestFamilyTicket').val('');
                }
                $('#TravelRequestEstimatedPrice').val(response.FlightPrice);
                $('#TravelRequestClientName').val(response.ClientName);
                $('#TravelRequestCurrency').val(response.CurrencyID);
                if (response.ModeOfTravel != null) {
                    $('#TravelRequestModeOfTravel').val(response.ModeOfTravel);
                }
                else {
                    $('#TravelRequestModeOfTravel').val(0);
                }
                if (response.ForexCurrencyID == null) {
                    $("#TravelRequestAdvForexCurrency").val('00000000-0000-0000-0000-000000000000');
                }
                else {
                    $("#TravelRequestAdvForexCurrency").val(response.ForexCurrencyID);
                }
                $('#TravelRequestAdvForexAmount').val(response.AdvForexAmount);


                //Setting Travel known Date
                if (response.TravelKnownDate != null) {
                    $("#TravelRequestTravelKnownDate").datepicker({
                        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
                        onClose: function (event) {
                            validateB2EDate(event, "TravelRequestTravelKnownDate")
                        }
                    }).datepicker('setDate', new Date(response.TravelKnownDate))
                    $("#TravelRequestTravelKnownDate").mask(sessionStorage.CultureMaskFormat);
                }
                else {
                    $("#TravelRequestTravelKnownDate").datepicker({
                        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
                        onClose: function (event) {
                            validateB2EDate(event, "TravelRequestTravelKnownDate")
                        },
                        changeMonth: true,
                        changeYear: true
                    });
                    $("#TravelRequestStartDate").mask(sessionStorage.CultureMaskFormat);
                }
            }
            $('#tremp-search').modal('hide');
            var row = parseFloat("1");
            $.each(response.TravellersDetails, function (key, value) {
                $('#IsEditFlow').val("true");
                // Load next traveller.
                if (row > 1) {
                    if (parseInt($("#hdnTravellerType").val()) < 7) {
                        $("#hdnTravellerType").val(parseInt(row));
                        $("#hdnTravellerTypeCount").val(parseInt($("#hdnTravellerTypeCount").val()) + 1);
                        TravellerName(parseInt($("#hdnTravellerTypeCount").val()));
                    }
                }
                // Adding current row.
                $("#hdntravellerId").val(row);
                $("#textTravellerName" + row).val(value.employeeName);
                $("#AutoTravellerName" + row).val(value.employeeName + ' - ' + value.employeeCode);
                //$("#AutoTravellerName" + row).val(value.employeeName);
                $("#hdnEmployeeId" + row).val(value.employeeId);
                $("#hdnGrade" + row).val(value.gradeId);

                if (row == 1) {
                    $("#addMoreTraveller").removeClass('hide');
                    $("#hdnFirstLevelApproverID").val(value.FirstLevelApproverID);
                    $("#hdnSecondLevelApproverID").val(value.SecondLevelApproverID);
                    $("#hdnThirdLevelApproverID").val(value.ThirdLevelApproverID);
                    $("#hdntravellerIds").val(value.employeeId);


                    // Fetch travel types.
                    LoadTravelType();

                    // Set travel type.
                    $("#TravelRequestType").val(response.TravelRequestTypeId);

                    // Fetch countires bsed on travel type.
                    CountryDetails();

                    // Set country.
                    $("#TravelRequestCountry").val(response.TravelRequestCountryId);

                    // Fetch states based on country.
                    LoadStates();

                    // Set state.
                    $("#TravelRequestState").val(response.TravelRequestStateId);

                    // Fetch cities based on state.
                    LoadCities();

                    // Set city.
                    $("#TravelRequestCity").val(response.TravelRequestCityId);

                }
                else {
                    $("#hdntravellerIds").val($("#hdntravellerIds").val() + "," + value.employeeId);
                }
                if (IsCBTSonata == true && response.NeedToHaveApprover == true) {
                    $('#AutoApprover').css('display', 'block');
                    GetAutoCompleteApprover(response.CorporateId, value.employeeId, response.HasApprovers);
                }
                LoadTravellers(row);
                row = row + 1;
            });
            $("#TravelRequestStartDate").datepicker({
                dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
                onClose: function (event) {
                    validateB2EDate(event, "TravelRequestStartDate")
                }
            }).datepicker('setDate', new Date(response.TravelRequestStartDate))
            $("#TravelRequestStartDate").mask(sessionStorage.CultureMaskFormat);
            $("#TravelRequestEndDate").datepicker({
                dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
                onClose: function (event) {
                    validateB2EDate(event, "TravelRequestEndDate")
                }
            }).datepicker('setDate', new Date(response.TravelRequestEndDate))
            $("#TravelRequestEndDate").mask(sessionStorage.CultureMaskFormat);
            if (IsCBTSonata == true) {
                var startDate = $('#TravelRequestStartDate').val().split('/');
                var endDate = $('#TravelRequestEndDate').val().split('/');
                if (startDate != undefined && startDate != '' && endDate != undefined && endDate != '') {
                    startDateFormatted = new Date(startDate[2], startDate[1] - 1, startDate[0]);
                    endDateFormatted = new Date(endDate[2], endDate[1] - 1, endDate[0]);
                    var difference = new Date(endDateFormatted - startDateFormatted);
                    var duration = difference / 1000 / 60 / 60 / 24;
                    $('#TravelRequestDuration').val(duration);
                }
            }
            $('#TravelRequestReason').val(response.TravelRequestReason);
            $('#RequestorComments').css('display', 'block');
            if (response.TravelRequestComments != undefined && response.TravelRequestComments.length > 0) {
                var loadRight = false;
                $("#SavedTravelRequestComments").empty();
                $('#SavedTravelRequestComments').removeClass().addClass('rze-borbot');
                if (response.TravelRequestComments != null)
                    $("#SavedTravelRequestComments").append("<div class='col-md-12 nopadding'><h4 class='margin-bot20'>Review History</h4></div>");
                else
                    $("#SavedTravelRequestComments").append("<div class='col-md-12'><h4 class='margin-bot20'>Your Comments (If any)</h4></div>");

                $.each(response.TravelRequestComments, function (key, value) {
                    var comments = '';
                    var status = '';
                    var cls = 'rze-revhiswrap reviewright';
                    if (value.Comments != null)
                        comments = value.Comments;
                    if (value.employeeName != "My Self") {
                        status = value.Status;
                        cls = 'rze-revhiswrap';
                        if (value.Status.indexOf("Submitted") < 0)
                            $("#SavedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div disabled class='col-md-10'>" + comments + " (" + status + " " + value.CommentDate + " " + (value.CommentTime) + ")</div><div class='col-md-2'><span data-original-title='' title=''>" + value.employeeName + "</span></div></div>");
                        else
                            $("#SavedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div class='col-md-2'><span data-original-title='' title=''>" + value.employeeName + "</span></div><div disabled class='col-md-10'>" + comments + " (" + status + " " + value.CommentDate + " " + (value.CommentTime) + ")</div></div>");
                    }
                    else {
                        status = value.Status;
                        if (value.Status.indexOf("Submitted") > 0)
                            $("#SavedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div class='col-md-2'><span data-original-title='' title=''>" + value.employeeName + "</span></div><div disabled class='col-md-10'>" + comments + " (" + status + " " + value.CommentDate + " " + (value.CommentTime) + ")</div></div>");
                        else
                            $("#SavedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div disabled class='col-md-10'>" + comments + " (" + status + " " + value.CommentDate + " " + (value.CommentTime) + ")</div><div class='col-md-2'><span data-original-title='' title=''>" + value.employeeName + "</span></div></div>");

                    }
                });
                if (response.RequestorComments != null)
                    $('#TravelRequestComments').html(response.RequestorComments.split('\\')[0]);
            }
            else {
                if (response.RequestorComments != null)
                    $('#TravelRequestComments').html(response.RequestorComments.split('\\')[0]);
            }
            $('#SavedTravelRequestFlight').val(response.FlightPrice);
            $('#SavedTravelRequestHotel').val(response.HotelPrice);
            $('#SavedTravelRequestFlight').prop("disabled", true);
            $('#SavedTravelRequestHotel').prop("disabled", true);
            $('#SavedBudgetedCost').css('display', 'none');

            $("#Attachment").removeClass();
            $('#attachmentUploadForm').find('.rze-uploadvouch').hide();
            GetVouchers(true, true);
        }
        else {
            alertmsg('Some Error Occur in Loading Saved Travel Request . Please try again after some time.');
        }
        $.unblockUI();
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js LoadSavedTravelRequest()-->" + error);
    }
}

function addCommas(x) {
    try {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js addCommas()-->" + error);
    }
}

function LoadSubmittedTravelRequest(response) {
    try {
        if (response != null) {
            $('#SubmittedTravelRequestNo').html(response.TravelRequestId);
            $("#SubmittedTravelRequestProject").html(response.CorporateProjectName);
            $('#SubmittedTravelTripName').html(response.TravelRequestName);
            $('#SubmittedTravelRequestedDate').html(response.TravelRequestedDate);
            $('#SubmittedTravelDestinationCity').html(response.TravelRequestCityValue);
            $('#SubmittedTravelRequestType').html(response.TravelRequestTypeValue);
            $('#SubmittedTravelRequestAction').html(response.TravelRequestAction);
            $('#SubmittedTravelRequestStatus').html(response.TravelRequestStatus);
            $("#SubmittedTravelRequestStartDate").html(response.TravelRequestStartDate);
            $("#SubmittedTravelRequestEndDate").html(response.TravelRequestEndDate);
            $('#SubmittedTravelRequestReason').html(response.TravelRequestReason);
            $('#SubmittedTravelRequestReferenceNumber').val(response.TravelRequestReferenceNumber);
            $('#SubmittedTravelRequestFlight').val(addCommas(response.FlightPrice));
            $('#SubmittedTravelRequestHotel').val(addCommas(response.HotelPrice));
            if (IsCBTSonata == true) {
                $('#budgetedcost').css('display', 'none');
                $('#SubmittedIsBillable').css('display', 'block');
                $('#SubmittedIsLongTermAssignment').css('display', 'block');
                $('#SubmittedIsFamilyTicket').css('display', 'block');
                $('#SubmittedEstimatedPrice').css('display', 'block');
                $('#SubmittedCurrency').css('display', 'block');
                $('#SubmittedClientName').css('display', 'block');
                $('#SubmittedModeOfTravel').css('display', 'block');
                //$('#SavedGrade').css('display', 'block');
                //$('#SavedDuration').css('display', 'block');
                $('#SubmittedForexCurrency').css('display', 'block');
                $('#SubmittedForexAmount').css('display', 'block');
                $('#SubmittedTravelKnownDate').css('display', 'block')
                if (response.IsBillable == true) {
                    $('#SubmittedTravelRequestIsBillable').html("Yes");
                }
                else {
                    $('#SubmittedTravelRequestIsBillable').html("No");
                }
                if (response.IsFamilyIncluded == true) {
                    $('#SubmittedTravelRequestFamilyTicket').html("Yes");
                }
                else {
                    $('#SubmittedTravelRequestFamilyTicket').html("No");
                }
                if (response.IsLongTermAssignment != null) {
                    if (response.IsLongTermAssignment == true) {
                        $('#SubmittedTravelRequestLongTermAssignment').html("Yes");
                    }
                    else {
                        $('#SubmittedTravelRequestLongTermAssignment').html("No");
                    }
                }
                else {
                    $('#SubmittedTravelRequestLongTermAssignment').html("");
                }
                $('#SubmittedTravelRequestEstimatedPrice').html(response.FlightPrice);
                $('#SubmittedTravelRequestClientName').html(response.ClientName);
                if (response.AdvForexAmount != null) {
                    $('#SubmittedTravelRequestAdvForexAmount').html(response.AdvForexAmount);
                }
                else {
                    $('#SubmittedTravelRequestAdvForexAmount').html('');
                }
                if (response.TravelKnownDate != null) {
                    $('#SubmittedTravelRequestTravelKnownDate').html(response.TravelKnownDate);
                }
                else {
                    $('#SubmittedTravelRequestTravelKnownDate').html('');
                }
                $('#SubmittedTravelRequestCurrency').html(response.CurrencyName);
                if (response.ForexCurrencyID != null) {
                    $('#SubmittedTravelRequestAdvForexCurrency').html(response.ForexCurrencyName);
                }
                else {
                    $('#SubmittedTravelRequestAdvForexCurrency').html('');
                }
                if (response.ModeOfTravel != null) {
                    $('#SubmittedTravelRequestModeOfTravel').html(response.ModeOfTravelValue);
                }
                else {
                    $('#SubmittedTravelRequestModeOfTravel').html('');
                }
                if (response.ApproverName != null) {
                    $('#SubmittedTravellerApprover').css('display', 'block')
                    $('#SubmittedTravelRequestApprover').html(response.ApproverName.split('//')[0] + ' - ' + response.ApproverName.split('//')[2]);
                    $('#SubmittedApproverID').val(response.ApproverName.split('//')[1]);
                }
                else {
                    $('#SubmittedTravellerApprover').css('display', 'none')
                }

            }

            $('#IsHotelItineraryToSubmitHdn').val(response.HotelItineraryToSubmit);
            $('#IsFlightItineraryToSubmitHdn').val(response.FlightItineraryToSubmit);
            $('#ApprovedHotelItineraryToSubmitHdn').val(response.ApprovedHotelItineraryToSubmit);
            $('#ApprovedFlightItineraryToSubmitHdn').val(response.ApprovedFlightItineraryToSubmit);


            $("#SubmittedTraveller").empty();
            $("#SubmittedTraveller").append("<span>Traveller :</span>");
            var cnt = parseFloat('1');
            var travellerDetails = response.TravellersDetails;
            $.each(travellerDetails, function (key, value) {
                $("#SubmittedTraveller").append("&nbsp;<label class='vreq-tname'>" + cnt + ". " + value.employeeName +' - '+ value.employeeCode + "</label> &nbsp; &nbsp;");
                cnt = cnt + 1;
            });
            GetBookingConfirmationNumber(response.TravelRequestStatus, response.TravelRequestId);
            var reqCommented = false;
            $("#SubmittedTravelRequestComments").empty();
            if (response.TravelRequestComments.length > 0) {
                $("#SubmittedTravelRequestComments").append("<h4>Travel Request History</h4>");
                $.each(response.TravelRequestComments, function (key, value) {
                    var comments = '';
                    var status = '';
                    var cls = 'rze-revhiswrap reviewright';
                    if (value.Comments != null)
                        comments = value.Comments;
                    if (value.employeeName.indexOf("_Req") == -1) {
                        if (value.employeeName != "My Self") {
                            // comments first then name
                            status = value.Status;
                            cls = 'rze-revhiswrap';
                            if (value.Status.indexOf("Submitted") < 0)
                                $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + " ( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcombot'><span>" + value.employeeName + "</span></div></div>");
                            else
                                $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + " ( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
                        }
                        else {
                            // name first then comments
                            if (value.Status.indexOf("Submitted") < 0) {
                                // comments first then name.
                                status = value.Status;
                                cls = 'rze-revhiswrap';
                                $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcombot'><span>" + value.employeeName + "</span></div></div>");
                            }
                            else {
                                reqCommented = true;
                                value.employeeName = value.employeeName.split('_')[0];
                                status = value.Status;
                                $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + " ( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
                            }
                        }
                    }
                    else {
                        // name first then comments
                        reqCommented = true;
                        value.employeeName = value.employeeName.split('_')[0];
                        status = value.Status;
                        $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
                    }
                });
            }
            if (response.TravelRequestItineraryComments.length > 0) {
                $("#ItineraryComments").empty();
                $("#ItineraryComments").append("<div class='rze-borbot' id='itineraryContent'></div>");
                $("#itineraryContent").append("<h4>Itinerary Review History</h4>");
                $.each(response.TravelRequestItineraryComments, function (key, value) {
                    var comments = '';
                    var status = '';
                    var cls = 'rze-revhiswrap reviewright';
                    if (value.Comments != null)
                        comments = value.Comments;
                    value.employeeName = value.employeeName.split('_')[0];
                    status = value.Status;
                    $("#itineraryContent").append("<div class='" + cls + "'><div class='row'><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcombot'><span>" + value.employeeName + "</span></div></div>");
                });
            }

            var RequiredApproverLevel = parseFloat('0');
            if (response.TravelRequestStatusValue <= 4) {
                if (response.TravelRequestSubstituteApproverLevel != '0') {
                    $('#IsSubAppr').val('true');
                    RequiredApproverLevel = parseFloat(response.TravelRequestSubstituteApproverLevel);
                }
                else {
                    $('#IsSubAppr').val('false');
                    RequiredApproverLevel = parseFloat(response.actionBy) + 1;
                }
            }
            else {
                if (response.TravelItinerarySubstituteApproverLevel != '0') {
                    $('#IsSubAppr').val('true');
                    RequiredApproverLevel = parseFloat(response.TravelItinerarySubstituteApproverLevel);
                }
                else {
                    $('#IsSubAppr').val('false');
                    RequiredApproverLevel = parseFloat(response.actionBy) + 1;
                }
            }
            $('#RequiredApproverLevel').val(RequiredApproverLevel);

            $('.file_Download_Form').css("display", "none");
            $('.file_Upload_Form').css("display", "none");
            $('#attachmentDownloadForm').find('.fileupload-buttonbar').removeClass().addClass('fileupload-buttonbar hide');
            GetVouchers(false, true);
            switch (response.TravelRequestAction) {
                case "Not Required":
                    {
                        if (response.TravelRequestStatusValue == 3) {
                            $('#btnApprove').css("display", "none");
                            $('#btnReject').css("display", "none");
                            $('#ApproverComments').css("display", "none");
                            $("#SubmittedTravelRequestCreateItinerary").empty();
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                            $("#divSubmitItinerary").hide();
                            $("#btnSubmitItinerary").hide();
                            $.unblockUI();
                        }
                        else if (response.TravelRequestStatusValue == 7) {
                            if (!response.IsForCorporate) {
                                $('#StartReviewBtn').css("display", "none");
                                $('#ItineraryApproverComments').empty();
                                $('#SubmittedTravelRequestFlight').prop('disabled', true);
                                $('#SubmittedTravelRequestHotel').prop('disabled', true);
                                $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                                if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                    SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                                }
                            }
                            else {
                                $('#ReqStartReviewBtn').css('display', 'none');
                                $('#CorporateItineraryTab').css('display', 'inline-block');
                                $('#NeedToHideItineraryCommentHdn').val("True");
                                $('#ApprCorporateItinerarybtn').attr('disabled', 'disabled');
                                $('#ApprActualPricetxt').attr('disabled', 'disabled');
                                $('#FlightItineraryTab').css('display', 'none');
                                $('#HotelItineraryTab').css('display', 'none');
                            }

                        } else if (response.TravelRequestStatusValue == 10) {
                            if (!response.IsForCorporate) {
                                // Booking submitted.
                                $('#btnApprove').css("display", "none");
                                $('#btnReject').css("display", "none");
                                $('#divCompleteCheckout').css("display", "none");
                                $('#btnViewCheckout').css("display", "none");
                                $('#ApproverComments').css("display", "none");
                                $("#SubmittedTravelRequestCreateItinerary").empty();
                                $('#SubmittedTravelRequestFlight').prop('disabled', true);
                                $('#SubmittedTravelRequestHotel').prop('disabled', true);
                                $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                                if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                    SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                                }
                                $("#divSubmitItinerary").hide();
                                $("#btnSubmitItinerary").hide();
                                $('.rza-delitinerary').remove();
                            }
                            else {
                                $('#ReqStartReviewBtn').css('display', 'none');
                                $('#CorporateItineraryTab').css('display', 'inline-block');
                                $('#NeedToHideItineraryCommentHdn').val("True");
                                $('#FlightItineraryTab').css('display', 'none');
                                $('#HotelItineraryTab').css('display', 'none');
                            }
                            $.unblockUI();
                        }
                        else {
                            if (!response.IsForCorporate) {
                                $('#btnApprove').css("display", "none");
                                $('#btnReject').css("display", "none");
                                $('#ApproverComments').css("display", "none");
                                $("#SubmittedTravelRequestCreateItinerary").empty();
                                $('#SubmittedTravelRequestFlight').prop('disabled', true);
                                $('#SubmittedTravelRequestHotel').prop('disabled', true);
                                $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                                if (response.TravelRequestStatusValue == 6 || response.TravelRequestStatusValue == 8) {
                                    if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                        SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                                    }
                                    $("#divSubmitItinerary").hide();
                                    $("#btnSubmitItinerary").hide();
                                }
                                $('.rza-delitinerary').remove();
                            }
                            else {
                                if (response.TravelRequestStatusValue != 2 && response.TravelRequestStatusValue != 4 && response.TravelRequestStatusValue != 1) {
                                    $('#ReqStartReviewBtn').css('display', 'none');
                                    $('#CorporateItineraryTab').css('display', 'inline-block');
                                    $('#NeedToHideItineraryCommentHdn').val("True");
                                    $('#NeedToDisableItineraryHdn').val("True");
                                    $('#NeedToDisableItineraryCommentHdn').val("True");
                                    if (response.TravelRequestStatusValue == 15) {
                                        $('#SubmittedTravelRequestCreateItinerary').css('display', 'none');
                                        $('#SubmitCorporateItinerarybtn').css('display', 'none');
                                    }
                                    if (response.TravelRequestStatusValue == 6) {
                                        $('#ApproveCorporateItinerarybtn').attr('disabled', 'disabled');
                                        $('#RejectCorporateItinerarybtn').attr('disabled', 'disabled');
                                    }
                                }
                                else {
                                    $('#btnApprove').css("display", "none");
                                    $('#btnReject').css("display", "none");
                                    $('#ApproverComments').css("display", "none");
                                }
                                $('#FlightItineraryTab').css('display', 'none');
                                $('#HotelItineraryTab').css('display', 'none');
                            }
                            $.unblockUI();
                        }
                        $.unblockUI();
                        return;
                    }
                case "Approve/Reject Itinerary": // on itinerary submit
                    {
                        if (!response.IsForCorporate) {
                            $('#StartReviewBtn').html('Start Review');
                            $('#StartReviewBtn').attr('onclick', 'StartReview()');
                            $('#StartReviewBtn').css("display", "inline-block");
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                            }
                        }
                        else {
                            $("#ReqStartReviewBtn").css("display", "inline-block");
                            $('#CorporateItineraryTab').css('display', 'inline-block');
                            $('#ApprCorporateItinerarybtn').css('display', 'inline-block');
                            $('#ApprActualPriceDIV').css('display', 'inline-block');
                            $('#ApprActualPricetxt').val(response.ItineraryActualPrice);
                            $('#NeedToDisableItineraryHdn').val("True");
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                            $.unblockUI();
                            return;
                        }
                        $.unblockUI();
                        return;
                    }
                case "Approve/Reject Request": // on Request submit
                    {
                        $('#btnApprove').css("display", "inline-block");
                        $('#btnReject').css("display", "inline-block");
                        $('#ApproverComments').css("display", "block");
                        $("#SubmittedTravelRequestCreateItinerary").empty();
                        $('#SubmittedTravelRequestFlight').prop('disabled', false);
                        $('#SubmittedTravelRequestHotel').prop('disabled', false);
                        $('#SubmittedTravelRequestReferenceNumber').prop('disabled', false);
                        $('#FlightItineraryTab').hide();
                        $('#HotelItineraryTab').hide();
                        $.unblockUI();
                        return;
                    }

                case "Complete Checkout":
                    {
                        if (!response.IsForCorporate) {
                            $('#btnViewCheckout').css("display", "inline-block");
                            $("#SubmittedTravelRequestCreateItinerary").empty();
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            $('#btnSubmitItinerary').css("display", "none");
                            if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                            }
                        }
                        else {
                            $('#ReqStartReviewBtn').css('display', 'none');
                            $('#CorporateItineraryTab').css('display', 'inline-block');
                            $('#NeedToHideItineraryCommentHdn').val("True");
                            $('#btnViewCheckout').css("display", "inline-block");
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                        }
                        $.unblockUI();
                        return;
                    }

                case "Checkout":
                    {
                        if (!response.IsForCorporate) {
                            SetProceedtoCheckout(response);
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                            }
                        }
                        else {
                            SetProceedtoCheckout(response);
                            $('#ReqStartReviewBtn').css('display', 'none');
                            $('#CorporateItineraryTab').css('display', 'inline-block');
                            $('#NeedToHideItineraryCommentHdn').val("True");
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                        }
                        $.unblockUI();
                        return;
                    }

                case "Create Itinerary": // on approve
                    {
                        $('#btnApprove').css("display", "none");
                        $('#ApproverComments').css("display", "none");
                        if (!response.IsForCorporate) {
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            $("#SubmittedTravelRequestCreateItinerary").empty();
                            if (response.FlightItineraryExists < 5) {
                                var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                                $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                            }
                            else if (response.HotelItineraryExists < 5) {
                                var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                                $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                            }

                            if (response.FlightItineraryExists == 0) {
                                $('#FlightItineraryTab').css('display', 'none');
                            }
                            else {
                                if (response.TravelRequestStatusValue < 6) {
                                    $('#FlightItineraryTab').append('<a class="rza-delitinerary">' + '<i style="width:20px; height:20px;"onclick="DeleteFlightItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                                }
                                else {
                                    if ($('#FlightItineraryTab .rza-delitinerary').length > 0) {
                                        $('.rza-delitinerary').remove();
                                    }
                                }

                            }

                            if (response.HotelItineraryExists == 0) {
                                $('#HotelItineraryTab').css('display', 'none');
                            }
                            else {
                                if (response.TravelRequestStatusValue < 6) {
                                    $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                                }
                            }
                        }
                        else {
                            if (response.TravelRequestStatusValue == 3) {
                                var createitenary = '<a class="btn btn-primary" onclick="OpenCorporateItinerary()">Create Itinerary </a>'
                                $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                                $('#NeedToDisableItineraryHdn').val("false");
                            }
                            else {
                                var createitenary = '<a class="btn btn-primary" onclick="GetCorporateItinerary()">Create Itinerary </a>'
                                $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                                $('#CorporateItineraryTab').css('display', 'inline-block');
                                $('#SubmitCorporateItinerarybtn').css('display', 'inline-block');
                                $('#SubmitCorporateItinerarybtn').attr('onClick', 'UpdateCorporateItinerary()');
                                $('#NeedToDisableItineraryHdn').val("false");
                            }
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                        }
                        $.unblockUI();
                        return;
                    }
                case "Submit Itinerary": // on approve
                    {
                        $('#btnApprove').css("display", "none");
                        $('#ApproverComments').css("display", "none");
                        $('#SubmittedTravelRequestFlight').prop('disabled', true);
                        $('#SubmittedTravelRequestHotel').prop('disabled', true);
                        $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                        $("#SubmittedTravelRequestCreateItinerary").empty();
                        var IsGradeLevelExc = $("#IsGradeLevelExc").val();
                        if (response.FlightItineraryExists < 5) {
                            var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                            //Checks whether it is  a Grade Level Approval Exception or not
                            if (IsGradeLevelExc === "true") {
                                if (response.HotelItineraryExists == 0) {
                                    $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                                }
                            }
                            else {
                                $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                            }
                        }
                        else if (response.HotelItineraryExists < 5) {
                            var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                            //Checks whether it is  a Grade Level Approval Exception or not
                            if (IsGradeLevelExc === "true") {
                                if (response.HotelItineraryExists == 0) {
                                    $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                                }
                            }
                            else {
                                $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                            }
                        }

                        if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                            SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                        }


                        if (response.FlightItineraryExists == 0) {
                            $('#FlightItineraryTab').css('display', 'none');
                        }
                        else {
                            if (response.TravelRequestStatusValue < 6) {
                                if (!response.IsFlightReSubmitted) {
                                    if (response.ReSubmittedFlightStatus == 5)
                                        $('#FlightItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteFlightItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                                }
                            }
                            else {
                                if ($('#FlightItineraryTab .rza-delitinerary').length > 0) {
                                    $('.rza-delitinerary').remove();
                                }
                            }
                        }

                        if (response.HotelItineraryExists == 0) {
                            $('#HotelItineraryTab').css('display', 'none');
                        }
                        else {
                            if (response.TravelRequestStatusValue < 6) {
                                if (!response.IsHotelReSubmitted) {
                                    if (response.ReSubmittedHotelStatus == 5)
                                        $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                                }
                            }
                        }
                        //  CheckItineraryExists('N');
                        if (response.TravelRequestStatusValue == 5) {
                            $("#divSubmitItinerary").show();
                            $("#btnSubmitItinerary").show();
                        }
                        $("#Attachment").removeClass();
                        $('#attachmentDownloadForm').find('.fileupload-buttonbar').removeClass().addClass('fileupload-buttonbar');
                        $('#attachmentUploadForm').find('.rze-uploadvouch').hide();
                        GetVouchers(true, true);
                        $.unblockUI();
                        return;
                    }
                case "Re-Submit Request": // on Reject
                    {
                        $('#btnApprove').css("display", "none");
                        $('#btnReject').css("display", "none");
                        $('#ApproverComments').css("display", "none");
                        $('#SubmittedTravelRequestFlight').prop('disabled', true);
                        $('#SubmittedTravelRequestHotel').prop('disabled', true);
                        $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                        $("#SubmittedTravelRequestCreateItinerary").empty();
                        var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                        $("#SubmittedTravelRequestCreateItinerary").append(createitenary);

                        $("#Attachment").removeClass();
                        $('#attachmentUploadForm').find('.rze-uploadvouch').hide();
                        GetVouchers(true, true);

                        $.unblockUI();
                        return;
                    }
                case "Re-Submit Itinerary":
                    {
                        $('#btnApprove').css("display", "none");
                        $('#ApproverComments').css("display", "none");
                        $('#SubmittedTravelRequestFlight').prop('disabled', true);
                        $('#SubmittedTravelRequestHotel').prop('disabled', true);
                        $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                        SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                        $("#SubmittedTravelRequestCreateItinerary").empty();
                        var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                        $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                        $.unblockUI();
                        return;
                    }
                case "Upload Voucher":
                    {
                        if (!response.IsForCorporate) {
                            $(".file_Upload_Form").show();
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            GetVouchers(true, false);
                            if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                            }
                        }
                        else {
                            $(".file_Upload_Form").show();
                            GetVouchers(true, false);
                            $('#ReqStartReviewBtn').css('display', 'none');
                            $('#CorporateItineraryTab').css('display', 'inline-block');
                            $('#NeedToHideItineraryCommentHdn').val("True");
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                        }
                        $('#CheckoutTab').css('display', 'none');
                        $.unblockUI();
                        return;
                    }
                case "Download Voucher":
                    {
                        if (!response.IsForCorporate) {
                            $('#SubmittedTravelRequestFlight').prop('disabled', true);
                            $('#SubmittedTravelRequestHotel').prop('disabled', true);
                            $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                            if (response.UserRole == "TMCAdmin" || response.UserRole == "TMCUser") {
                                $(".file_Upload_Form").show();
                                GetVouchers(true, false);
                            }
                            else {
                                $(".file_Download_Form").show();
                                GetVouchers(false, false);
                            }

                            if (response.FlightItineraryExists == 0) {
                                $('#FlightItineraryTab').css('display', 'none');
                            }
                            else {
                                if (response.TravelRequestStatusValue < 6) {
                                    $('#FlightItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteFlightItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                                }
                                else {
                                    if ($('#FlightItineraryTab .rza-delitinerary').length > 0) {
                                        $('.rza-delitinerary').remove();
                                    }
                                }
                            }

                            if (response.HotelItineraryExists == 0) {
                                $('#HotelItineraryTab').css('display', 'none');
                            }
                            else {
                                if (response.TravelRequestStatusValue < 6) {
                                    $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                                }
                            }
                            if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                                SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                            }
                        }
                        else {
                            if (response.UserRole == "TMCAdmin" || response.UserRole == "TMCUser") {
                                $(".file_Upload_Form").show();
                                GetVouchers(true, false);
                            }
                            else {
                                $(".file_Download_Form").show();
                                GetVouchers(false, false);
                            }
                            $('#FlightItineraryTab').css('display', 'none');
                            $('#HotelItineraryTab').css('display', 'none');
                            $('#ReqStartReviewBtn').css('display', 'none');
                            $('#CorporateItineraryTab').css('display', 'inline-block');
                            $('#NeedToHideItineraryCommentHdn').val("True");
                            return;
                        }
                    }
                case "Submit for Approval ":
                    {
                        $("#ReqStartReviewBtn").css("display", "inline-block");
                        $('#CorporateItineraryTab').css('display', 'inline-block');
                        $('#FlightItineraryTab').css('display', 'none');
                        $('#HotelItineraryTab').css('display', 'none');
                        $('#ApproveCorporateItinerarybtn').css('display', 'inline-block');
                        $('#RejectCorporateItinerarybtn').css('display', 'inline-block');
                        $('#NeedToDisableItineraryHdn').val("True");
                        $.unblockUI();
                        return;
                    }
                case "Await Itinerary Creation":
                    {
                        GetCorporateItinerary();
                        if ($('#ItinerarySection').val() != "") {
                            $('#CorporateItineraryTab').attr('display', 'block');
                        }
                        $('#FlightItineraryTab').css('display', 'none');
                        $('#HotelItineraryTab').css('display', 'none');
                        $('#NeedToHideItineraryCommentHdn').val("True");
                        $('#NeedToDisableItineraryHdn').val("True");
                        $('#RejectCorporateItinerarybtn').attr('disabled', 'disabled');
                        $('#ApproveCorporateItinerarybtn').attr('disabled', 'disabled');
                        $('#ReqStartReviewBtn').css('display', 'none');
                        return;
                    }
                    $.unblockUI();
                    return;
            }
        }
        else {
            alertmsg('Some Error Occur in Loading Submitted Travel Request. Please try again after some time.');
        }
        $.unblockUI();
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js LoadSubmittedTravelRequest()-->" + error);
    }
}

function SetReSubmitItinerarySettings(ReSubmittedHotelStatus, ReSubmittedFlightStatus, IsFlightReSubmitted, IsHotelReSubmitted, ItineraryId) {
    try {
        var f = 'F';
        var h = 'H';

        if (IsFlightReSubmitted) {
            $('#IsFlightReSubmittedHdn').val(true);
            $('#AddNewItineraryHdn').val(ItineraryId);
            //$('#tr-view').append("<input type='hidden' id='AddNewItineraryHdn' name='AddNewItineraryHdn' value='" + ItineraryId + "'/>");
            //$('#tr-view').append("<input type='hidden' id='IsFlightReSubmittedHdn' name='IsReSubmittedItineraryHdn' value='true'/>");
            $("#FlightItineraryTab").find('a').attr('onclick', 'ViewReSubmitItinerary(\'' + f + '\');');

            if (ReSubmittedFlightStatus >= 5) {
                if ($('#SubmittedTravelRequestAction').text().toLowerCase() == 'approve/reject itinerary') {
                    ReSubmittedFlightStatus = 6;
                    //$('#tr-view').append("<input type='hidden' id='AddNewFlightBlockHdn' name='AddNewFlightBlockHdn' value='" + ReSubmittedFlightStatus + "'/>");
                    $('#AddNewFlightBlockHdn').val(ReSubmittedFlightStatus);
                }
                else {
                    //$('#tr-view').append("<input type='hidden' id='AddNewFlightBlockHdn' name='AddNewFlightBlockHdn' value='" + ReSubmittedFlightStatus + "'/>");
                    $('#AddNewFlightBlockHdn').val(ReSubmittedFlightStatus);
                }
            }
            else {
                //$('#tr-view').append("<input type='hidden' id='AddNewFlightBlockHdn' name='AddNewFlightBlockHdn' value='0'/>");
                $('#AddNewFlightBlockHdn').val(0);
            }
        }


        if (IsHotelReSubmitted) {
            $('#AddNewItineraryHdn').val(ItineraryId);
            $('#IsHotelReSubmittedHdn').val(true);
            //$('#tr-view').append("<input type='hidden' id='AddNewItineraryHdn' name='AddNewItineraryHdn' value='" + ItineraryId + "'/>");
            //$('#tr-view').append("<input type='hidden' id='IsHotelReSubmittedHdn' name='IsReSubmittedItineraryHdn' value='true'/>");
            $("#HotelItineraryTab").find('a').attr('onclick', 'ViewReSubmitItinerary(\'' + h + '\');');

            if (ReSubmittedHotelStatus >= 5) {
                if ($('#SubmittedTravelRequestAction').text().toLowerCase() == 'approve/reject itinerary') {
                    ReSubmittedHotelStatus = 6;
                    //$('#tr-view').append("<input type='hidden' id='AddNewHotelBlockHdn' name='AddNewHotelBlockHdn' value='" + ReSubmittedHotelStatus + "'/>");
                    $('#AddNewHotelBlockHdn').val(ReSubmittedHotelStatus);
                }
                else {
                    //$('#tr-view').append("<input type='hidden' id='AddNewHotelBlockHdn' name='AddNewHotelBlockHdn' value='" + ReSubmittedHotelStatus + "'/>");
                    $('#AddNewHotelBlockHdn').val(ReSubmittedHotelStatus);
                }
            }
            else {
                //$('#tr-view').append("<input type='hidden' id='AddNewHotelBlockHdn' name='AddNewHotelBlockHdn' value='0'/>");
                $('#AddNewHotelBlockHdn').val(0);
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SetReSubmitItinerarySettings()-->" + error);
    }
}

function GetVouchers(showDeleteIcon, isAttachment) {
    try {
        var travelRequestId = getUrlVars()["RequestNo"];
        if (travelRequestId == '' || travelRequestId == undefined || travelRequestId == null) {
            travelRequestId = $("#TravelRequestNo").text();
            if (travelRequestId == '' || travelRequestId == undefined || travelRequestId == null) {
                travelRequestId = $("#SubmittedTravelRequestNo").text();
            }
        }
        else {
            if (travelRequestId.indexOf("#") >= 0) travelRequestId = travelRequestId.replace('#', '');
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            'TravelRequest/GetVouchers/?travelRequestId=' + travelRequestId + '&showDeleteIcon=' + showDeleteIcon + '&isAttachment=' + isAttachment,
            "POST",
        null,
        function (jsonResponse) {
            var jsObject = JSON.parse(jsonResponse);
            if (isAttachment) {
                if (showDeleteIcon) {
                    $('.alreadyUplodedAttachmentInfo').html(jsObject.voucherFiles);
                    if (jsObject.voucherFiles.length > 0)
                        $('#attachmentUploadForm').find('.rze-uploadvouch').show();
                }
                else if (showDeleteIcon == false) {
                    if (jsObject.voucherFiles.length == 0 && (jsObject.voucherComments == "null" || jsObject.voucherComments == "")) {
                        $("#attachmentDownloadForm").show(); $('#attachmentDownloadForm').find('#download_file_info').html("No attachment uploaded.");
                    }
                    else {
                        if (jsObject.voucherFiles.length > 0) { $('#attachmentDownloadForm').find('#download_file_info').html(jsObject.voucherFiles); $("#attachmentDownloadForm").show(); }
                    }
                }
            }
            else {
                if (showDeleteIcon) { $('.alreadyUplodedFileInfo').html(jsObject.voucherFiles); $("#txtAreaVoucherComments").val(jsObject.voucherComments); }
                else if (showDeleteIcon == false) {
                    if (jsObject.voucherFiles.length == 0 && (jsObject.voucherComments == "null" || jsObject.voucherComments == "")) {
                        $(".file_Download_Form").show(); $('#fileDownloadForm').find('#download_file_info').html("No voucher uploaded."); $("#SavedVoucherComments").text("No Comments.")
                    }
                    else {
                        if (jsObject.voucherFiles.length > 0) $('#fileDownloadForm').find('#download_file_info').html(jsObject.voucherFiles)
                            //$('.downloadFileInfo').html(jsObject.voucherFiles);
                        if (jsObject.voucherComments != "null" && jsObject.voucherComments != "") $("#SavedVoucherComments").text(jsObject.voucherComments);
                    }
                }
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GetVouchers()-->" + error);
    }
}

$(document).ready(function () {
    try {
        //Client Side delete is done through jquery fileupload plugin
        //Server Side delete is done through ajax
        $('span.alreadyUplodedFileInfo').on('click', '.deleteItem', function (event) {
            var voucherFileName = $(this).attr("name");
            var isAttachment = false;
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
            'TravelRequest/DeleteSingleVoucher/?voucherFileName=' + voucherFileName + '&isAttachment=' + isAttachment,
            "POST",
            null,
            function (jsonResponse) {
                if (jsonResponse != null) {
                    var jsObject = JSON.parse(jsonResponse);
                    $('.alreadyUplodedFileInfo').html(jsObject.voucherFiles); $("#txtAreaVoucherComments").val(jsObject.voucherComments);
                    $("#alreadyUploded_file_Info").text("File deleted successfully.").addClass("alert alert-success");
                    $(window).scrollTop(0);
                }
                $.unblockUI();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            },
            null
            );
        });

        $('span.alreadyUplodedAttachmentInfo').on('click', '.deleteItem', function (event) {
            var voucherFileName = $(this).attr("name");
            var isAttachment = true;
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
            'TravelRequest/DeleteSingleVoucher/?voucherFileName=' + voucherFileName + '&isAttachment=' + isAttachment,
            "POST",
            null,
            function (jsonResponse) {
                if (jsonResponse != null) {
                    var jsObject = JSON.parse(jsonResponse);
                    if (jsObject.voucherFiles.length > 0)
                        $('.alreadyUplodedAttachmentInfo').html(jsObject.voucherFiles);
                    else
                        $('#attachmentUploadForm').find('.rze-uploadvouch').hide();
                    $("#lblMessage").removeAttr("class").attr("class", "alert alert-success").html('File deleted successfully.');
                    $(window).scrollTop(0);
                    $.unblockUI();
                }
                else {
                    $("#lblMessage").removeAttr("class").attr("class", "alert alert-danger").html('Failed to delete File , Please try again after some time.');
                    $(window).scrollTop(0);
                    $.unblockUI();
                }
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            },
            null
            );
        });

        $('#attachmentDownloadForm').on('click', '.deleteItem', function (event) {
            var voucherFileName = $(this).attr("name");
            var isAttachment = true;
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
            'TravelRequest/DeleteSingleVoucher/?voucherFileName=' + voucherFileName + '&isAttachment=' + isAttachment,
            "POST",
            null,
            function (jsonResponse) {
                if (jsonResponse != null) {
                    var jsObject = JSON.parse(jsonResponse);
                    if (jsObject.voucherFiles.length > 0)
                        $('#attachmentDownloadForm').find('#download_file_info').html(jsObject.voucherFiles);
                    $("#lblMessage").removeAttr("class").attr("class", "alert alert-success").html('File deleted successfully.');
                    $(window).scrollTop(0);
                    $.unblockUI();
                }
                else {
                    $("#lblMessage").removeAttr("class").attr("class", "alert alert-danger").html('Failed to delete File , Please try again after some time.');
                    $(window).scrollTop(0);
                    $.unblockUI();
                }
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            },
            null
            );
        });

    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ready()-->" + error);
    }
});

$(window).load(function () {
    try {
        for (var i = 1; i < 10 ; i++) {
            setTimeout(function () {
                if ($("#ui-datepicker-div").length == 1) {
                    $("#ui-datepicker-div").css("display", "none");
                    $(window).scrollTop(0);
                    i = -1;
                }
            }, i * 100);
            if (i == -1) {
                break;
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js load()-->" + error);
    }
});

function GotoProflie(profile) {
    try {
        if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            $(window).scrollTop(0);
            return false;
        }
        else {
            if (profile == 'myprofile')
                window.location = "/EmployeeProfile.html";
            else if (profile == 'mytmc')
                window.location = "/TMCProfile.html";
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GotoProflie()-->" + error);
    }
}

function LoadTravelRequest(RequestNo, RequestType) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var AnyMessage = '';
        if (RequestType == '') {
            $('#SavedTravelRequest').attr('class', 'tab-pane fade in active');
            $('#TravelRequest').attr('class', 'tab-pane fade in active');
            $('#SubmittedTravelRequest').attr('class', 'hide');
            $('#RequestorComments').css('display', 'block');
            $('#travelrequestheader').css('display', 'none');
            $('#travelrequestheaderStatus').css('display', 'none');
            $('#travelrequestheaderAction').css('display', 'none');
            $('#SavedBudgetedCost').css('display', 'none');
            $('#IsEditFlow').val("false");
            $("#TravelRequestNo").html('');
            $("#fixedDashboardItem").find('li a').removeAttr('href');
            $('#header_Dashboard').attr('onclick', 'SwitchTab(\'Dashboard\')');
            $('#header_TravelRequest').attr('onclick', 'SwitchTab(\'TravelRequest\')');
            $('#header_TravelFareFinder').attr('onclick', 'SwitchTab(\'TravelFareFinder\')');
            $('#ExpenseReports_header').attr('onclick', 'SwitchTab(\'ExpenseReports\')');
            $('#myProfile_headerBD').find('a').removeAttr('href');
            $('#tmcProfile_headerBD').find('a').removeAttr('href');
            $('#myProfile_headerBD').attr('onclick', 'GotoProflie(\'myprofile\')');
            $('#tmcProfile_headerBD').attr('onclick', 'GotoProfile(\'mytmc\')');
            $("#Attachment").removeClass();
            $('#attachmentUploadForm').find('.rze-uploadvouch').hide();
            if (IsCBTSonata == true) {
                $('#SavedIsBillable').css('display', 'block');
                $('#SavedIsLongTermAssignment').css('display', 'block');
                $('#SavedIsFamilyTicket').css('display', 'block');
                $('#SavedEstimatedPrice').css('display', 'block');
                $('#SavedCurrency').css('display', 'block');
                $('#SavedClientName').css('display', 'block');
                $('#SavedModeOfTravel').css('display', 'block');

                //Load Mode of Travel
                LoadTravelModes();

                //Load Currency
                LoadTravelCurrency();
                $('#SavedGrade').css('display', 'block');
                $('#SavedDuration').css('display', 'block');
                $('#SavedForexCurrency').css('display', 'block');
                $('#SavedForexCurrencyAmount').css('display', 'block');
                $('#SavedTravelKnownDate').css('display', 'block');
                $('#addMoreTraveller').css('display', 'none');
            }
            $.unblockUI();
        }
        else {
            if (RequestType.indexOf('//') > 0) {
                AnyMessage = RequestType.split('//')[1];
                RequestType = RequestType.split('//')[0];
            }
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelRequest/TravelRequest/GetTravelRequestById/" + RequestNo + "/" + RequestType,
                "Get",
            null,
            function (response) {
                if (response != null) {
                    if (AnyMessage != '') {
                        $("#lblMessage").removeAttr("class");

                        if (AnyMessage.toLowerCase().indexOf("rejected") >= 0) {
                            $("#lblMessage").attr("class", "alert alert-danger");
                            $("#lblMessage").html(AnyMessage);
                        }
                        else if (AnyMessage.toLowerCase().indexOf("approved") >= 0 || AnyMessage.toLowerCase().indexOf("submitted") >= 0 || AnyMessage.toLowerCase().indexOf("added") >= 0) {
                            $("#lblMessage").attr("class", "alert alert-success");
                            $("#lblMessage").html(AnyMessage);
                        }
                        else {
                            $("#lblMessage").attr("class", "alert alert-info");
                            $("#lblMessage").html(AnyMessage);
                        }

                        //if (AnyMessage == "Travel request approved." || AnyMessage == "Successfully added flight itinerary.") {
                        //    $("#lblMessage").attr("class", "alert alert-success");
                        //    $("#lblMessage").html(AnyMessage);

                        //}
                        //else if (AnyMessage == "Travel request rejected.") {
                        //    $("#lblMessage").attr("class", "alert alert-danger");
                        //    $("#lblMessage").html(AnyMessage);
                        //}
                        //else if (AnyMessage == "Itinerary submitted successfully.") {
                        //    $("#lblMessage").attr("class", "alert alert-success");
                        //    $("#lblMessage").html(AnyMessage);
                        //}
                        //else if (AnyMessage == "Itinerary Approved") {
                        //    $("#lblMessage").attr("class", "alert alert-success");
                        //    $("#lblMessage").html(AnyMessage);
                        //}
                        //else if (AnyMessage == "Itinerary Rejected") {
                        //    $("#lblMessage").attr("class", "alert alert-danger");
                        //    $("#lblMessage").html(AnyMessage);
                        //}
                        //else if (AnyMessage == "Itinerary Approved successfully.") {
                        //    $("#lblMessage").attr("class", "alert alert-success");
                        //    $("#lblMessage").html(AnyMessage);
                        //}
                        //else {
                        //    $("#lblMessage").attr("class", "alert alert-info");
                        //    $("#lblMessage").html(AnyMessage);
                        //}
                        $(window).scrollTop(0);
                    }
                    if (response.TravelRequestStatus.toLowerCase() == "tr-draft" || response.TravelRequestStatus.toLowerCase().indexOf("rejected by") >= 0) {
                        if (RequestType == 'Admin' && response.IsForCorporate == true && response.TravelRequestStatus.toLowerCase().indexOf("rejected by") >= 0) {
                            RequestType = 'Associate'; // for admin - re- submit request.
                        }

                       

                        if (RequestType == 'Associate' && response.TravelRequestStatus.toLowerCase().indexOf("rejected by") >= 0) {
                            $('#SubmittedTravelRequest').attr('class', 'active in');
                            $('#SavedTravelRequest').attr('class', 'hide');
                            var row = '<input type="hidden" id="sub_' + RequestNo + '" name="sub_' + RequestNo + '" value="' + RequestType + '"/>';
                            $('#SubmittedTravelRequest').append(row);
                            LoadSubmittedTravelRequest(response);
                        }
                        else {
                            if (response.TravelRequestStatus.toLowerCase().indexOf("itr.-") >= 0 && response.TravelRequestStatus.toLowerCase().indexOf("rejected by") >= 0) {
                                $('#SubmittedTravelRequest').attr('class', 'active in');
                                $('#SavedTravelRequest').attr('class', 'hide');
                                var row = '<input type="hidden" id="sub_' + RequestNo + '" name="sub_' + RequestNo + '" value="' + RequestType + '"/>';
                                $('#SubmittedTravelRequest').append(row);
                                LoadSubmittedTravelRequest(response);
                            }
                            else {
                                if (RequestType == 'Admin' && response.IsForCorporate == true && response.TravelRequestStatus.toLowerCase().indexOf("tr-draft") >= 0) {
                                    $('#SubmittedTravelRequest').attr('class', 'active in'); // for admin - tr draft status request 
                                    $('#SavedTravelRequest').attr('class', 'hide');
                                    var row = '<input type="hidden" id="sub_' + RequestNo + '" name="sub_' + RequestNo + '" value="' + RequestType + '"/>';
                                    $('#SubmittedTravelRequest').append(row);
                                    LoadSubmittedTravelRequest(response);
                                }
                                else {
                                    $('#SubmittedTravelRequest').attr('class', 'hide');
                                    $('#SavedTravelRequest').attr('class', 'active in');
                                    $('#TravelRequest').attr('class', 'active in');
                                    var row = '<input type="hidden" id="sav_' + RequestNo + '" name="sav_' + RequestNo + '" value="' + RequestType + '"/>';
                                    $('#SavedTravelRequest').append(row);
                                    LoadSavedTravelRequest(response);
                                }
                            }
                        }
                    }
                    else {

                        $('#SubmittedTravelRequest').attr('class', 'active in');
                        $('#SavedTravelRequest').attr('class', 'hide');
                        var row = '<input type="hidden" id="sub_' + RequestNo + '" name="sub_' + RequestNo + '" value="' + RequestType + '"/>';
                        $('#SubmittedTravelRequest').append(row);
                        LoadSubmittedTravelRequest(response);
                    }
                }
                else {
                    alertmsg('Some Error Occur in Loading Travel Request. Please try again after some time.');
                }
                $.unblockUI();
            },
                function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                },
                "json"
            );
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js LoadTravelRequest()-->" + error);
    }

}

function getActiveTabDetail(tab) {
    try {
        if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            $(window).scrollTop(0);
            event.preventDefault();
        }
        else if ($("#myTab .active").attr('id') == 'elementExp_NewExp_Expense Report Draft') {
            $("#lblMessage").css('display', 'block');
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            $("#lblMessage").css("display", "block");
            event.preventDefault();
        }
        else {
            $('#myNavbar li.active').each(function () {
                $(this).removeClass("active");
            });
            $(tab).attr('class', 'active');
            var ReqNo = tab.id.split("_")[1];
            var RequestType = tab.id.split("_")[2];
            if (ReqNo > 0) {
                if (tab.id.split("_")[0].toLowerCase().indexOf('exp') == -1) {
                    LoadTravelRequest(ReqNo, RequestType);
                }
                else {
                    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + ReqNo;
                }
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js getActiveTabDetail()-->" + error);
    }
}

function ApproveOrRejectTravelRequest(isApprove) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        $("#lblMessage").html('');
        if ($("#SubmittedTravelRequestNo").html() == "") {
            return false;
        }

        var url = "";

        if (isApprove == true) {
            url = "TravelRequest/TravelRequest/Approve";
        }
        else {
            url = "TravelRequest/TravelRequest/Reject";
        }

        var approverComments = "";
        approverComments = $("#TravelRequestApproverComments").val();
        if (approverComments == '')
            approverComments = "null";
        var referenceNumber = "";
        referenceNumber = $("#SubmittedTravelRequestReferenceNumber").val();
        if (referenceNumber == '')
            referenceNumber = "null";
        var flightPrice = $("#SubmittedTravelRequestFlight").val()
        if (flightPrice.indexOf(',') > 0)
            flightPrice = flightPrice.replace(/,/g, '');
        var hotelPrice = $("#SubmittedTravelRequestHotel").val().replace(/,/g, '');
        if (hotelPrice.indexOf(',') > 0)
            hotelPrice = hotelPrice.replace(/,/g, '');
        var RequiredApproverLevel = $('#RequiredApproverLevel').val();
        if (RequiredApproverLevel == undefined || RequiredApproverLevel == NaN || RequiredApproverLevel == '')
            RequiredApproverLevel = parseFloat('0');
        else
            RequiredApproverLevel = parseFloat(RequiredApproverLevel);

        var IsSubAppr = $('#IsSubAppr').val();
        var TempNextApproverId = $('#SubmittedApproverID').val();
        if (TempNextApproverId == undefined || TempNextApproverId == NaN || TempNextApproverId == '')
            TempNextApproverId = parseFloat('0');
        else
            TempNextApproverId = parseFloat(TempNextApproverId);

        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        url,
        "GET",
        { travelRequestId: $("#SubmittedTravelRequestNo").text(), comments: approverComments, flightPrice: flightPrice, hotelPrice: hotelPrice, referenceNumber: referenceNumber, RequiredApproverLevel: RequiredApproverLevel, IsSubAppr: IsSubAppr, TempNextApproverId: TempNextApproverId },
        function (response) {
            if (response != null) {
                if (response == true) {
                    $('#TravelRequestApproverComments').val('');
                    var message = '';
                    if (isApprove == true) {
                        message = "Travel request approved.";
                    }
                    else {
                        message = "Travel request rejected.";
                    }
                    if ($("#myTab li").hasClass("active")) {
                        $("#myTab li.active").each(function () {
                            var ReqNumber = $(this).attr('id').split("_")[1];
                            var RequestType = $(this).attr('id').split("_")[2];
                            RequestType = RequestType + '//' + message;
                            LoadTravelRequest(ReqNumber, RequestType);
                        });
                    }
                }
                else {
                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("class", "alert alert-danger");
                    $("#lblMessage").html('Failed travel request.');
                    $(window).scrollTop(0);
                    $.unblockUI();
                }
            }
            else {
                alertmsg('Some Error Occur in Approval Or Rejection of Travel Request. Please try again after some time.');
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
        $(window).scrollTop(0);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ApproveOrRejectTravelRequest()-->" + error);
    }
}

function OpenTravelFareFinder(reqno) {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/Itinerary/CheckItineraryExists/" + reqno,
           "POST",
       null,
       function (response) {
           if (response != null) {
               var ItineraryCount = response.FlightItineraryCount;
               window.location = "TravelFareFinder.html" + "?RequestNo=" + reqno + "&Count=" + ItineraryCount + "&IsExc=" + response.IsExc + "&";
           }
           else {
               alertmsg('Some Error Occur in Openning  Travel Fare Finder. Please try again after some time.');
           }
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js OpenTravelFareFinder()-->" + error);
    }

}

/* Corporate Related Jquery method */

function OpenCorporateItinerary() {
    try {
        $('#tr-view').attr('class', 'tab-pane fade');
        $('#CorporateItineraryTab').css('display', 'inline-block');
        $('#CorporateItineraryMain').attr('class', 'tab-pane fade active in');
        $("#liTravelRequest").removeClass();
        $("#CorporateItineraryTab").addClass("active");
        $('#SubmitCorporateItinerarybtn').css('display', 'inline-block');
        $('#HotelItineraryMain').css('display', 'none');
        $('#FlightItineraryMain').css('display', 'none');
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js OpenCorporateItinerary()-->" + error);
    }
}

function NavigateToCorporateItinerary() {
    $('#tr-view').attr('class', 'tab-pane fade');
    $('#CorporateItineraryTab').css('display', 'inline-block');
    $('#CorporateItineraryMain').attr('class', 'tab-pane fade active in');
    $("#CorporateItineraryTab").addClass("active");
    $("#liTravelRequest").removeClass();
    $('#HotelItineraryMain').css('display', 'none');
    $('#FlightItineraryMain').css('display', 'none');
    $('#VoucherDiv').hide();
    if ($('#SubmittedTravelRequestAction').text().toLowerCase().trim().indexOf("checkout") >= 0) {
        $('#CheckoutMain').attr('class', 'tab-pane fade');
        $('#CheckoutItinerary').css('display', 'inline-block');
        $('#CheckoutTab').css('display', 'inline-block');
        $("#CheckoutTab").removeClass();
    }
    if ($('#NeedToDisableItineraryHdn').val() == "True")
        $('#ItinerarySection').attr('disabled', 'disabled');
    if ($('#NeedToHideItineraryCommentHdn').val() == "True")
        $('#CorporateItinearyComment').css('display', 'none');
    if ($('#NeedToDisableItineraryCommentHdn').val() == "True")
        $('#CorporateItineraryCommentSection').attr('disabled', 'disabled');
}

function GetCorporateItinerary() {
    try {
        var travelRequestId = $("#SubmittedTravelRequestNo").html();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelItinerary/CorporateItinerary/GetCorporateItinerary",
        "GET",
       { travelRequestId: travelRequestId },
        function (response) {
            if (response != "") {
                if ($('#SubmittedTravelRequestAction').text().toLowerCase().trim() != "await itinerary creation") {
                    $('#tr-view').attr('class', 'tab-pane fade');
                    $('#CorporateItineraryMain').attr('class', 'tab-pane fade active in');
                    $("#CorporateItineraryTab").addClass("active");
                    $("#liTravelRequest").removeClass();
                }
                $('#CorporateItineraryTab').css('display', 'inline-block');
                $('#HotelItineraryMain').css('display', 'none');
                $('#FlightItineraryMain').css('display', 'none');
                $('#VoucherDiv').hide();
                $('#ItinerarySection').val(response);
                if ($('#NeedToDisableItineraryHdn').val() == "True")
                    $('#ItinerarySection').attr('disabled', 'disabled');
                $("#CorporateItineraryTab").find('a').attr('onclick', 'NavigateToCorporateItinerary();');
                if ($('#NeedToHideItineraryCommentHdn').val() == "True")
                    $('#CorporateItinearyComment').css('display', 'none');
                if ($('#NeedToDisableItineraryCommentHdn').val() == "True")
                    $('#CorporateItineraryCommentSection').attr('disabled', 'disabled');
            }
        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js OpenCorporateItinerary()-->" + error);
    }
}

function NavigateToSubmit(status) {
    if (status != 2) {
        // Requestor Approve Flow.
        if (status == 1) {
            $('#ActionSelectedHdn').val("true");
            $('#ApproveCorporateItinerarybtn').css('background', '#7FFF00');
            $('#RejectCorporateItinerarybtn').css('background', '#f9992b');
        }
        else {
            $('#ActionSelectedHdn').val("false");
            $('#RejectCorporateItinerarybtn').css('background', '#7FFF00');
            $('#ApproveCorporateItinerarybtn').css('background', '#f9992b');
        }
        $('#tr-view').attr('class', 'tab-pane fade active in');
        $('#CorporateItineraryTab').css('display', 'inline-block');
        $('#CorporateItineraryMain').attr('class', 'tab-pane fade');
        $("#CorporateItineraryTab").removeClass("active");
        $('#HotelItineraryMain').css('display', 'none');
        $('#FlightItineraryMain').css('display', 'none');
        $('#ReqStartReviewBtn').html("Submit Review");
        $('#ReqStartReviewBtn').attr('onclick', 'CorporateSubmitReview()');
    }
    else {
        //Approver Approve Flow.
        $('#ApprCorporateItinerarybtn').css('background', '#5cb85c');
        $('#tr-view').attr('class', 'tab-pane fade active in');
        $('#CorporateItineraryTab').css('display', 'inline-block');
        $('#CorporateItineraryMain').attr('class', 'tab-pane fade');
        $("#CorporateItineraryTab").removeClass("active");
        $('#ReqStartReviewBtn').html("Submit Review");
        $('#ReqStartReviewBtn').attr('onclick', 'ApproveCorporateItinerary()');
    }
}

function ApproveCorporateItinerary() {
    var travelRequestId = $("#SubmittedTravelRequestNo").html();
    var ItineraryComments = $("#CorporateItineraryCommentSection").val();
    if (ItineraryComments == '')
        ItineraryComments = "null";
    var isApprove = "True";
    var RequiredApproverLevel = $('#RequiredApproverLevel').val();
    if (RequiredApproverLevel == undefined || RequiredApproverLevel == NaN || RequiredApproverLevel == '')
        RequiredApproverLevel = parseFloat('0');
    else
        RequiredApproverLevel = parseFloat(RequiredApproverLevel);

    var ActualPrice = $('#ApprActualPricetxt').val();
    if (ActualPrice == undefined || ActualPrice == NaN || ActualPrice == '')
        ActualPrice = parseFloat('0');
    else
        ActualPrice = parseFloat(ActualPrice);

    var TempNextApproverID = $("#SubmittedApproverID").val();
    if (TempNextApproverID == "" || TempNextApproverID == null)
        TempNextApproverID = "0";
    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
    "TravelItinerary/CorporateItinerary/CorporateSubmitReview",
    "GET",
   { travelRequestId: travelRequestId, isApprove: isApprove, ItineraryComments: ItineraryComments, isRequestor: "false", level: RequiredApproverLevel, price: ActualPrice , TempNextApproverID : TempNextApproverID },
    function (response) {
        $("#lblMessage").removeAttr("class");
        if (isApprove) {
            $("#lblMessage").attr("class", "alert alert-success");
        }
        else {
            $("#lblMessage").attr("class", "alert alert-danger");
        }
        $("#lblMessage").html(response);
        if ($("#myTab li").hasClass("active")) {
            $("#myTab li.active").each(function () {
                var ReqNumber = $(this).attr('id').split("_")[1];
                var RequestType = $(this).attr('id').split("_")[2];
                RequestType = RequestType + '//' + response.Error[0].Message;
                LoadTravelRequest(ReqNumber, RequestType);
            });
        }
    });
}

function CorporateSubmitReview() {
    var isApprove = $('#ActionSelectedHdn').val();
    var travelRequestId = $("#SubmittedTravelRequestNo").html();
    var ItineraryComments = $("#CorporateItineraryCommentSection").val();
    if (ItineraryComments == '')
        ItineraryComments = "null";
    var level = parseFloat("0");
    var Price = parseFloat("0");
    var TempNextApproverID = $("#SubmittedApproverID").val();
    if (TempNextApproverID == "" || TempNextApproverID == null)
        TempNextApproverID = "0";
    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
    "TravelItinerary/CorporateItinerary/CorporateSubmitReview",
    "GET",
   { travelRequestId: travelRequestId, isApprove: isApprove, ItineraryComments: ItineraryComments, isRequestor: "True", level: level, price: Price , TempNextApproverID : TempNextApproverID},
    function (response) {
        $("#lblMessage").removeAttr("class");
        if (isApprove) {
            $("#lblMessage").attr("class", "alert alert-success");
        }
        else {
            $("#lblMessage").attr("class", "alert alert-danger");
        }
        $("#lblMessage").html(response);
        if ($("#myTab li").hasClass("active")) {
            $("#myTab li.active").each(function () {
                var ReqNumber = $(this).attr('id').split("_")[1];
                var RequestType = $(this).attr('id').split("_")[2];
                RequestType = RequestType + '//' + response.Error[0].Message;
                LoadTravelRequest(ReqNumber, RequestType);
            });
        }
    });
}

function SubmitCorporateItinerary() {
    try {
        var travelRequestId = $("#SubmittedTravelRequestNo").html();
        var Itinerary = $("#ItinerarySection").val();
        var ItineraryComments = $("#CorporateItineraryCommentSection").val();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelItinerary/CorporateItinerary/Submit",
        "GET",
       { travelRequestId: travelRequestId, ItineraryText: Itinerary, ItineraryComments: ItineraryComments },
        function (response) {
            $('#tr-view').attr('class', 'tab-pane fade active in');
            $('#CorporateItineraryTab').css('display', 'inline-block');
            $('#CorporateItineraryMain').attr('class', 'tab-pane fade');
            $("#CorporateItineraryTab").removeClass("active");
            if ($("#myTab li").hasClass("active")) {
                $("#myTab li.active").each(function () {
                    var ReqNumber = $(this).attr('id').split("_")[1];
                    var RequestType = $(this).attr('id').split("_")[2];
                    RequestType = RequestType + '//' + response.Error[0].Message;
                    LoadTravelRequest(ReqNumber, RequestType);
                });
            }
        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js OpenCorporateItinerary()-->" + error);
    }
}

function UpdateCorporateItinerary() {
    try {
        var travelRequestId = $("#SubmittedTravelRequestNo").html();
        var Itinerary = $("#ItinerarySection").val();
        var ItineraryComments = $("#CorporateItineraryCommentSection").val();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelItinerary/CorporateItinerary/UpdateCorporateItinerary",
        "GET",
       { travelRequestId: travelRequestId, ItineraryText: Itinerary, ItineraryComments: ItineraryComments },
        function (response) {
            $('#tr-view').attr('class', 'tab-pane fade active in');
            $('#CorporateItineraryTab').css('display', 'inline-block');
            $('#CorporateItineraryMain').attr('class', 'tab-pane fade');
            $("#CorporateItineraryTab").removeClass("active");
            if ($("#myTab li").hasClass("active")) {
                $("#myTab li.active").each(function () {
                    var ReqNumber = $(this).attr('id').split("_")[1];
                    var RequestType = $(this).attr('id').split("_")[2];
                    RequestType = RequestType + '//' + response.Error[0].Message;
                    LoadTravelRequest(ReqNumber, RequestType);
                });
            }
        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js OpenCorporateItinerary()-->" + error);
    }
}

function CorporateCompleteBooking() {
    var travelRequestId = $("#SubmittedTravelRequestNo").html();
    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
    "TravelItinerary/CorporateItinerary/CorporateCompleteBooking",
    "GET",
   { travelRequestId: travelRequestId },
    function (response) {
        $('#tr-view').attr('class', 'tab-pane fade active in');
        $('#CorporateItineraryTab').css('display', 'inline-block');
        $('#CorporateItineraryMain').attr('class', 'tab-pane fade');
        $("#CorporateItineraryTab").removeClass("active");
        $("#CheckoutTab").removeClass("active");
        $("#CheckoutMain").attr('class', 'tab-pane fade');
        $("#btnViewCheckout").css('display', 'none');
        $("#divCorporateRequestBooking").css('display', 'none');
        if ($("#myTab li").hasClass("active")) {
            $("#myTab li.active").each(function () {
                var ReqNumber = $(this).attr('id').split("_")[1];
                var RequestType = $(this).attr('id').split("_")[2];
                RequestType = RequestType + '//' + response.Error[0].Message;
                LoadTravelRequest(ReqNumber, RequestType);
            });
        }
    });
}

/* Corporate Related Jquery method */

function SubmitItinerary() {
    try {
        if ($('#IsFlightReSubmittedHdn').val() == 'true' && $('#IsHotelReSubmittedHdn').val() == 'true') {
            if ($('#IsFlightItineraryToSubmitHdn').val() > 0 || $('#IsHotelItineraryToSubmitHdn').val() > 0) {
                var msg = "";
                if ($('#IsFlightItineraryToSubmitHdn').val() == 0 && $('#IsHotelItineraryToSubmitHdn').val() > 0) {
                    msg = "do you want to add new flight ?";
                }
                else {
                    if ($('#IsFlightItineraryToSubmitHdn').val() > 0 && $('#IsHotelItineraryToSubmitHdn').val() == 0) {
                        msg = "do you want to add new hotel ?";
                    }
                    else {
                        msg = "";
                    }
                }
                if (msg != "") {
                    bootbox.confirm({
                        size: "small",
                        message: msg,
                        callback: function (result) { /* result is a boolean; true = OK, false = Cancel*/
                            if (!result) { SubmitITR(); }
                        }
                    });
                }
                else { SubmitITR(); }
            }
            else { SubmitITR(); }
        }
        else { SubmitITR(); }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SubmitItinerary()-->" + error);
    }
}

function SubmitITR() {
    try {
        var travelRequestId = $("#SubmittedTravelRequestNo").html();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelItinerary/Itinerary/Submit/" + travelRequestId,
        "GET",
        null,
        function (response) {
            if (response != null && response.Status == true) {
                var message = response.Error[0].Message;
                $('#FlightItineraryTab i').remove();
                $('#HotelItineraryTab i').remove();

                $("#FlightItineraryTab").find('a').attr('href', '#FlightItineraryMain');
                $("#FlightItineraryTab").find('a').attr('onclick', 'ViewFlightItinerary(0);');
                $("#HotelItineraryTab").find('a').attr('href', '#HotelItineraryMain');
                $("#HotelItineraryTab").find('a').attr('onclick', 'ViewHotelItinerary(0);');

                if ($("#myTab li").hasClass("active")) {
                    $("#myTab li.active").each(function () {
                        var ReqNumber = $(this).attr('id').split("_")[1];
                        var RequestType = $(this).attr('id').split("_")[2];
                        RequestType = RequestType + '//' + message;
                        LoadTravelRequest(ReqNumber, RequestType);
                    });
                }
                $('#attachmentDownloadForm .rze-upvouchtable').find('.files').empty();
                $.unblockUI();
            }
            else {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-danger");
                $("#lblMessage").html(response.Error[0].Message);
                $('#attachmentDownloadForm .rze-upvouchtable').find('.files').empty();
                $(window).scrollTop(0);
                $.unblockUI();
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SubmitITR()-->" + error);
    }
}

function ViewFlightItinerary(status) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        ApproverItineraryComments = $('#HotelItineraryApproverCommentstext').val();
        var flightItrShow = true;
        if (status == 0 || status == 7) {
            if (status == 7) {
                if ($('#newFlightItineraryContent').length == 0) {
                    $("#FlightItineraryMain").empty();
                }
            }
            else {
                $("#FlightItineraryMain").empty();
            }
        }
        var RequestNo = getUrlVars()["RequestNo"];
        var ActiveItinerary = parseFloat('0');
        var ItineraryStatus = parseFloat('0');
        if (status > 0) {
            ItineraryStatus = parseFloat(status);
            if (status == 8) {
                if ($('#rejectedFlightItineraryContent').children().length > 1) {
                    flightItrShow = false;
                    $.unblockUI();
                }
            }
            else {
                if ($('#newFlightItineraryContent').children().length > 1) {
                    if (status != 5) {
                        flightItrShow = false;
                        $.unblockUI();
                    }
                    else {
                        $('#newFlightItineraryContent').empty();
                    }
                }
            }
        }
        if (flightItrShow) {
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelItinerary/Itinerary/ViewFlightItinerary/" + RequestNo + "/" + ItineraryStatus,
                "POST",
            null,
            function (response) {
                if (response != null) {

                    // only for re-submit itinerary flow.
                    var $FlightElement = 'FlightItineraryMain';

                    if (status > 0) {
                        if (status == 8) {
                            $FlightElement = 'rejectedFlightItineraryContent';
                        }
                        else {
                            $FlightElement = 'newFlightItineraryContent';
                        }
                        if (response.Status <= 8)
                            response.Status = status;
                        // for status after request booking...
                        $('#newFlightItineraryContent').empty();
                    }

                    if (response.ItineraryFlights.length <= 0 && $("#hdnHotelIdToAproveReject").length <= 0) {
                        $('#tr-view').attr('class', 'tab-pane fade');
                        $('#liTravelRequest').removeClass();
                        $('#FlightItineraryTab').removeClass();
                        $('#HotelItineraryTab').removeClass().addClass("active");
                        $('#' + $FlightElement).attr('class', 'tab-pane fade');
                        $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');
                        $("#FlightItineraryTab").find('a').attr('href', '#' + $FlightElement);
                        $("#FlightItineraryTab").find('a').attr('onclick', 'NavigateToFlightItinerary();');
                        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();
                        ViewHotelItinerary(0);
                    }
                    else
                        if (response.ItineraryFlights.length <= 0 || $("#hdnFlightIdToAproveReject").length > 0) {
                            if ($('#IsFlightReSubmittedHdn').val() != 'true') {
                                GoToRequest();
                            }
                            else {
                                $('#newFlightItineraryContent').remove();
                            }
                        }

                    $("#FlightItineraryTab").find('a').attr('href', '#' + $FlightElement);
                    $("#FlightItineraryTab").find('a').attr('onclick', 'NavigateToFlightItinerary();');

                    $("#" + $FlightElement).append("<div class='flightselected' id='divFlightselected'>Flights you Selected</div>");

                    if (response.Status >= 6 && $('#SubmittedTravelRequestAction').text() != "Not Required")
                        $('#TravelRequestItineraryID').val(response.TravelRequestItineraryId);

                    BindingFlightDetails(response, ItineraryStatus);

                    if ($FlightElement != 'rejectedFlightItineraryContent')
                        BindingOtherFlightDetails($FlightElement, response.Status);

                    //Flight Tabs
                    $(".rze-ftabcontainer").hide();
                    $(".rze-ftabscont a").click(function () {
                        if ($(this).hasClass("selected")) {
                            var ftabidval = $(this).attr("data-tabid");
                            $(ftabidval).slideUp();
                            $(this).removeClass("selected");
                        }
                        else {
                            $(".rze-ftabcontainer").hide();
                            $(".rze-ftabscont a").removeClass("selected")
                            $(this).addClass("selected")
                            var ftabid = $(this).attr("data-tabid");
                            console.log(ftabid);
                            $(ftabid).slideDown();
                        }
                    });

                    selectedFlight();
                    ApplyApproverComments();
                    $.unblockUI();

                }
                else {
                    alertmsg('Some Error Occur in Getting Flight Itinerary Details. Please try again after some time.');
                }
            }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ViewFlightItinerary()-->" + error);
    }

}

function BindingFlightDetails(response, ItineraryStatus) {
    try {
        var $MainContainer = "FlightItineraryMain";

        if (ItineraryStatus > 0) {
            if (ItineraryStatus == 8) {
                $MainContainer = "rejectedFlightItineraryContent";
            }
            else {
                $MainContainer = "newFlightItineraryContent";
            }
        }

        $.each(response.ItineraryFlights, function (key, flight) {

            var flightID = flight.TravelRequestItineraryFlightId;
            var OutOfPolicyText = flight.OutOfPolicyText;
            var travelAction = $('#SubmittedTravelRequestAction').text().toLowerCase();

            if (flight.DirectionInd == 1) {
                //One way trip enum is 1.
                // Taking the One way html to bind from TravelFareFinder.html.
                var clone = $("#divFlightSearchResultOneWay").html();
                // Taking the One way flight detail tabs html to bind from TravelFareFinder.html .
                var cloneFlightTab = $("#divTabFlightDetailsShow").html();
                $.each(flight.ItineraryFlightTrip, function (Tripkey, TripValue) {

                    var departureTripDateTime = new Date(TripValue.DepartureDateTime);
                    var departureTripDateList = departureTripDateTime.toDateString();
                    var departureTripTimeList = departureTripDateTime.toTimeString().split(':');
                    var arrivalTripDateTime = new Date(TripValue.ArrivalDateTime);
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

                    //Assign Booking Class.
                    var bookClass = TripValue.ItineraryFlightTripSegment[0].BookingClass;

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

                    //Replacing the Key word with Values.
                    clonecont = clonecont.replace("FlightLogo", "/Media/Images/AirlineLogossmall/" + TripValue.AirlineCode + ".png");
                    clonecont = clonecont.replace("#FlightName#", TripValue.AirlineName);
                    clonecont = clonecont.replace("divOOP", "divOOP" + flightID);
                    if (flight.OutOfPolicyText !== undefined && flight.OutOfPolicyText != '')
                        clonecont = clonecont.replace("#PolicyText#", flight.OutOfPolicyText);
                    else
                        clonecont = clonecont.replace("#PolicyText#", '');
                    clonecont = clonecont.replace("#FlightNumber#", TripValue.AirlineName);
                    clonecont = clonecont.replace("#List#", TripValue.StopOver);
                    clonecont = clonecont.replace("#DepatureTime#", departureTripDateList + " " + departureTripTimeList[0] + ":" + departureTripTimeList[1]);
                    clonecont = clonecont.replace("#DepatureCity#", TripValue.OriginCity);
                    clonecont = clonecont.replace("#ArrivalTime#", arrivalTripDateList + " " + arrivalTripTimeList[0] + ":" + arrivalTripTimeList[1]);
                    clonecont = clonecont.replace("#ArrivalCity#", TripValue.DestinationCity);
                    clonecont = clonecont.replace("#Duration#", tripTotalHrs + " Hrs " + tripDuration[1] + " Mins");
                    clonecont = clonecont.replace("#Stops#", TripValue.Stops);
                    clonecont = clonecont.replace("#NoOfPassenger#", response.PaxCount);
                    clonecont = clonecont.replace("divDisplayPreferred", "divDisplayPreferred_" + viewFlightIncrement);
                    clonecont = clonecont.replace("#Type#", "DEPARTURE");
                    clonecont = clonecont.replace("divTabstoggleUlListFlightDetails", "divTabsUlListFlightDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("TabFlightDetails", "divTabsUlListFlightDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("divTabToggleFlightDetails", "divTabsUlListFlightDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("divTabstoggleUlListPriceDetails", "divTabsUlListPriceDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("TabFlightPrice", "divTabsUlListPriceDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("divTabTogglePrice", "divTabsUlListPriceDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("#BookingClass#", bookClass);
                    clonecont = clonecont.replace("#Coach#", TripValue.ItineraryFlightTripSegment[0].CabinType);
                    clonecont = clonecont.replace("divFlightSegmentDetails", "divFlightSegmentDetails_" + viewFlightIncrement);
                    clonecont = clonecont.replace("tblTrips", "tblTrips_" + viewFlightIncrement);
                    clonecont = clonecont.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));
                    clonecont = clonecont.replace("#BaseFare#", flight.TotalBaseFare.toLocaleString(sessionStorage.CultureTypeInfo));
                    clonecont = clonecont.replace("#ServiceTax#", flight.TotalTax.toLocaleString(sessionStorage.CultureTypeInfo));
                    clonecont = clonecont.replace("#PassengerTax#", flight.TotalFee.toLocaleString(sessionStorage.CultureTypeInfo));
                    clonecont = clonecont.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));

                    // Price change info.
                    clonecont = clonecont.replace("divChangePriceOneWayDiff", 'divChangePriceOneWayDiff_' + flightID);
                    clonecont = clonecont.replace("#ChangePriceOneWayDiff#", flight.Notes);
                    clonecont = clonecont.replace("divPreferredOrSelect", "divPreferredOrSelect_" + viewFlightIncrement);
                    clonecont = clonecont.replace("TravelRequestItineraryFlightID", "TravelRequestItineraryFlightID_" + flightID);

                    //Appending the cloned html to Main Div.

                    $("#" + $MainContainer).append(clonecont);

                    // Check price change info.
                    if (flight.Notes != null) {
                        $("#divChangePriceOneWayDiff_" + flightID).removeAttr("style");
                        $('[data-toggle="tooltip"]').tooltip();
                    }
                    else {
                        $("#divChangePriceOneWayDiff_" + flightID).hide();
                    }

                    if (flight.IsPreferred) {
                        $("#divPreferredOrSelect_" + viewFlightIncrement).removeClass('hidden');
                    }

                    //Flight Segment starts.
                    $.each(TripValue.ItineraryFlightTripSegment, function (Segmentkey, SegmentValue) {
                        var tabCloneSection = BindingFlightTabDetails(SegmentValue, cloneFlightTab);
                        var layDuration = SegmentValue.LayoverDuration.split(":");
                        tabCloneSection = tabCloneSection.replace("divLayover", "divLayover_" + flight.ExternalNumber + "_" + SegmentValue.TravelRequestItineraryFlightTripSegmentId);
                        $("#divFlightSegmentDetails_" + viewFlightIncrement).append(tabCloneSection);
                        if (layDuration[0] == 00 && layDuration[1] == 00) {
                            $("#divLayover_" + flight.ExternalNumber + "_" + SegmentValue.TravelRequestItineraryFlightTripSegmentId).hide();
                        }
                    });
                    if (flight.OutOfPolicyText != null)
                        $("#divOOP" + flightID).css('display', 'block');
                    $('#TravelRequestItineraryFlightID_' + flightID).val(flightID);
                    BindingFlightItineraryAction(flightID, OutOfPolicyText, response.Status, viewFlightIncrement, flight.IsApproved, travelAction, flight.IsPreferred, ItineraryStatus, flight.DirectionInd);
                    viewFlightIncrement++;
                });
            }
            else {
                //Round Trip is 2.
                var isFirstTrip = false;
                // Flight Trip (Depature/Arrival) html to bind from TravelFareFinder.html.
                var cloneFlightResult = $("#divFlightResultTrips").html();
                // Flight Segment html to bind from TravelFareFinder.html.
                var cloneFlightSegTitle = $("#divFlightSegmentTitle").html();
                // Flight Tab html to bind from TravelFareFinder.html.
                var cloneFlightTab = $("#divTabFlightDetailsShow").html();
                $.each(flight.ItineraryFlightTrip, function (Tripkey, TripValue) {

                    var departureTripDateTime = new Date(TripValue.DepartureDateTime);
                    var departureTripDateList = departureTripDateTime.toDateString();
                    var departureTripTimeList = departureTripDateTime.toTimeString().split(':');
                    var arrivalTripDateTime = new Date(TripValue.ArrivalDateTime);
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
                        clonecontDepature = clonecontDepature.replace("#FlightName#", flight.ItineraryFlightTrip[0].AirlineName + " - " + flight.ItineraryFlightTrip[1].AirlineName);
                        clonecontDepature = clonecontDepature.replace("divOOP", "divOOP" + flightID);
                        if (flight.OutOfPolicyText != undefined && flight.OutOfPolicyText != '')
                            clonecontDepature = clonecontDepature.replace("#PolicyText#", flight.OutOfPolicyText);
                        else
                            clonecontDepature = clonecontDepature.replace("#PolicyText#", '');
                        clonecontDepature = clonecontDepature.replace("#NoOfPassenger#", response.PaxCount);
                        clonecontDepature = clonecontDepature.replace("divFlightTrips", "divFlightTrips_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("divTabstoggleUlListFlightDetails", "divTabsUlListFlightDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("TabFlightDetails", "divTabsUlListFlightDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("divTabToggleFlightDetails", "divTabsUlListFlightDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("divTabstoggleUlListPriceDetails", "divTabsUlListPriceDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("TabFlightPrice", "divTabsUlListPriceDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("divTabTogglePrice", "divTabsUlListPriceDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("divFlightHeader", "divFlightHeader_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("divFlightSegmentDetails", "divFlightSegmentDetails_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecontDepature = clonecontDepature.replace("#BaseFare#", flight.TotalBaseFare.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecontDepature = clonecontDepature.replace("#ServiceTax#", flight.TotalTax.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecontDepature = clonecontDepature.replace("#PassengerTax#", flight.TotalFee.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));
                        clonecontDepature = clonecontDepature.replace("divDisplayPreferred", "divDisplayPreferred_" + viewFlightIncrement);

                        // Price change info.
                        clonecontDepature = clonecontDepature.replace("divChangePriceDiff", 'divChangePriceDiff_' + flightID);
                        clonecontDepature = clonecontDepature.replace("#ChangePriceDiff#", flight.Notes);
                        clonecontDepature = clonecontDepature.replace("DivFlightActionButtons", "DivFlightActionButtons_" + viewFlightIncrement);
                        clonecontDepature = clonecontDepature.replace("TravelRequestItineraryFlightID", "TravelRequestItineraryFlightID_" + flightID);

                        //Appending the Flight Details to main div html.
                        $("#" + $MainContainer).append(clonecontDepature);

                        // Check price change info.
                        if (flight.Notes != null) {
                            $("#divChangePriceDiff_" + flightID).removeAttr("style");
                            $('[data-toggle="tooltip"]').tooltip();
                        }
                        else {
                            $("#divChangePriceDiff_" + flightID).hide();
                        }

                        if (flight.IsPreferred) {
                            $("#divDisplayPreferred_" + viewFlightIncrement).removeClass('hidden');
                        }

                        isFirstTrip = true;
                        segTitle = segTitle.replace("#Type#", "DEPARTURE");
                        clonecont = clonecont.replace("#TripTitle#", "Departure on " + departureTripDateList);
                    }
                    else {
                        segTitle = segTitle.replace("#Type#", "RETURN");
                        clonecont = clonecont.replace("#TripTitle#", "Departure on " + departureTripDateList);
                    }

                    clonecont = clonecont.replace("FlightLogo", "/Media/Images/AirlineLogossmall/" + TripValue.AirlineCode + ".png");
                    clonecont = clonecont.replace("#FlightName#", TripValue.AirlineName);
                    clonecont = clonecont.replace("#FlightNumber#", TripValue.AirlineName);
                    clonecont = clonecont.replace("#List#", TripValue.StopOver);
                    clonecont = clonecont.replace("#DepatureTime#", departureTripTimeList[0] + ":" + departureTripTimeList[1]);
                    clonecont = clonecont.replace("#DepatureDate#", departureTripDateList);
                    clonecont = clonecont.replace("#ArrivalTime#", arrivalTripTimeList[0] + ":" + arrivalTripTimeList[1]);
                    clonecont = clonecont.replace("#ArrivalDate#", arrivalTripDateList);
                    clonecont = clonecont.replace("#Duration#", tripTotalHrs + " Hrs " + tripDuration[1] + " Mins");
                    clonecont = clonecont.replace("#Stops#", TripValue.Stops);
                    $("#divFlightTrips_" + viewFlightIncrement).append(clonecont);

                    //Assign Booking Class.
                    var bookClass = TripValue.ItineraryFlightTripSegment[0].BookingClass;

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

                    //Replacing the Key word with Values for Segment Title.
                    segTitle = segTitle.replace("#BookingClass#", bookClass);
                    segTitle = segTitle.replace("#Coach#", TripValue.ItineraryFlightTripSegment[0].CabinType);
                    //Append Segment Title to Seg Detail div in html.
                    $("#divFlightSegmentDetails_" + viewFlightIncrement).append(segTitle);

                    $.each(TripValue.ItineraryFlightTripSegment, function (Segmentkey, SegmentValue) {
                        var tabCloneSection = BindingFlightTabDetails(SegmentValue, cloneFlightTab);
                        var layDuration = SegmentValue.LayoverDuration.split(":");
                        tabCloneSection = tabCloneSection.replace("divLayover", "divLayover_" + flight.ExternalNumber + "_" + SegmentValue.TravelRequestItineraryFlightTripSegmentId);
                        $("#divFlightSegmentDetails_" + viewFlightIncrement).append(tabCloneSection);

                        if (layDuration[0] == 00 && layDuration[1] == 00) {
                            $("#divLayover_" + flight.ExternalNumber + "_" + SegmentValue.TravelRequestItineraryFlightTripSegmentId).hide();
                        }
                    });
                });
                if (flight.OutOfPolicyText != null)
                    $("#divOOP" + flightID).css('display', 'block');
                $('#TravelRequestItineraryFlightID_' + flightID).val(flightID);
                BindingFlightItineraryAction(flightID, OutOfPolicyText, response.Status, viewFlightIncrement, flight.IsApproved, travelAction, flight.IsPreferred, ItineraryStatus, flight.DirectionInd);
                viewFlightIncrement++;
                isFirstTrip = false;
            }

        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js BindingFlightDetails()-->" + error);
    }
}

function BindingFlightTabDetails(SegmentValue, cloneFlightTab) {
    try {
        // Segments level details of the Flight Trips.
        var departureSegmentDateTime = new Date(SegmentValue.DepartureDateTime);
        var departureSegmentDateList = departureSegmentDateTime.toDateString();
        var departureSegmentTimeList = departureSegmentDateTime.toTimeString().split(':')
        var arrivalSegmentDateTime = new Date(SegmentValue.ArrivalDateTime);
        var arrivalSegmentDateList = arrivalSegmentDateTime.toDateString();
        var arrivalSegmentTimeList = arrivalSegmentDateTime.toTimeString().split(':')
        var segDuration = SegmentValue.Duration.split(":");
        var layDuration = SegmentValue.LayoverDuration.split(":");
        var tabCloneSection = cloneFlightTab;

        //Replacing the Key word with Values for Segment Details.
        tabCloneSection = tabCloneSection.replace("FlightDetailLogo", "/Media/Images/AirlineLogossmall/" + SegmentValue.AirLineCode + ".png");
        tabCloneSection = tabCloneSection.replace("#FlightName#", SegmentValue.AirLineName);
        tabCloneSection = tabCloneSection.replace("#FlightNumber#", SegmentValue.FlightNumber);
        tabCloneSection = tabCloneSection.replace("#MarketingAirline#", SegmentValue.MarketingAirline);
        tabCloneSection = tabCloneSection.replace("#OperatingAirline#", SegmentValue.OperatingAirline);
        tabCloneSection = tabCloneSection.replace("#DepartTime#", departureSegmentDateList + ", " + departureSegmentTimeList[0] + ":" + departureSegmentTimeList[1]);
        tabCloneSection = tabCloneSection.replace("#DepartLoc#", SegmentValue.DepartureAirportCode);
        tabCloneSection = tabCloneSection.replace("#DepatureAirport#", SegmentValue.DepartureAirPortName + " (" + SegmentValue.DepartureAirportCode + ")");
        tabCloneSection = tabCloneSection.replace("#ArrivalTime#", arrivalSegmentDateList + ", " + arrivalSegmentTimeList[0] + ":" + arrivalSegmentTimeList[1]);
        tabCloneSection = tabCloneSection.replace("#ArrivalLoc#", SegmentValue.ArrivalAirportCode);
        tabCloneSection = tabCloneSection.replace("#OrginAirport#", SegmentValue.ArrivalAirportName + " (" + SegmentValue.ArrivalAirportCode + ")");
        tabCloneSection = tabCloneSection.replace("#Duration#", segDuration[0] + " Hrs " + segDuration[1] + " Mins");
        tabCloneSection = tabCloneSection.replace("#Layover#", layDuration[0] + " Hrs " + layDuration[1] + " Mins");

        return tabCloneSection;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js BindingFlightTabDetails()-->" + error);
    }
}

function BindingFlightItineraryAction(flightID, OutOfPolicyText, Status, FlightIndex, IsApproved, travelAction, IsPreferred, ItineraryStatus, Direction) {

    try {
        var previousApproverSelectedFlightID = "";
        var cloneItineraryBtn = $("#divItineraryActionBtn").html();
        cloneItineraryBtn = cloneItineraryBtn.replace("divFlightPreferredOrBookNow", "divFlightPreferredOrBookNow_" + FlightIndex);
        cloneItineraryBtn = cloneItineraryBtn.replace("chkbook", "chkbook_" + flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("#txtFlightId#", flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("#rdFlightId#", flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("radioPopOver", "radioPopOver_" + flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("ChkFlightId", flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("#OutOfPolicyText#", OutOfPolicyText);
        cloneItineraryBtn = cloneItineraryBtn.replace("FlightId", flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("lblSelectFlightbtn", "lblSelectFlightbtn_" + flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("PopOverFlightId", flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("DeleteFlightId", flightID);
        cloneItineraryBtn = cloneItineraryBtn.replace("OutOfPolicyBtn", "OutOfPolicyBtn_" + FlightIndex);
        cloneItineraryBtn = cloneItineraryBtn.replace("divProceedToApproveBtn", "divProceedToApproveBtn_" + FlightIndex);
        cloneItineraryBtn = cloneItineraryBtn.replace("divBasicBtn", "divBasicBtn_" + FlightIndex);
        cloneItineraryBtn = cloneItineraryBtn.replace("divDisabledApprovedBtn", "divDisabledApprovedBtn_" + FlightIndex);
        cloneItineraryBtn = cloneItineraryBtn.replace("divDeleteFlightBtn", "divDeleteFlightBtn_" + FlightIndex);


        if (Direction == 1) {
            $("#tblTrips_" + FlightIndex).append(cloneItineraryBtn);
        }
        else {
            $("#DivFlightActionButtons_" + FlightIndex).append(cloneItineraryBtn);
        }

        if (OutOfPolicyText != undefined && OutOfPolicyText != '') {
            $("#OutOfPolicyBtn_" + FlightIndex).removeClass('hidden');
        }
        if (Status == 6 && $('#SubmittedTravelRequestAction').text() != "Not Required") {
            $("#divProceedToApproveBtn_" + FlightIndex).removeClass('hidden');
            if (IsApproved) {
                previousApproverSelectedFlightID = flightID;
                SetFirstApproverSelectedFlight(flightID);
                $('#' + flightID).attr("checked", "checked");
                $('#lblSelectFlightbtn_' + flightID).removeClass().addClass("btn btn-success selectedFlight selected");
                $('#ApprovedFlightIdHdn').val(flightID);
            }
        }
        else if (Status > 6 && $('#SubmittedTravelRequestAction').text() != "Not Required") {
            if (travelAction == "complete checkout") {
                $("#divBasicBtn_" + FlightIndex).removeClass('hidden');
            }
            else {
                if (IsApproved) {
                    previousApproverSelectedFlightID = flightID;
                    SetFirstApproverSelectedFlight(flightID);
                    $('#ApprovedFlightIdHdn').val(flightID);

                    if (Status == 8) {
                        $("#divDisabledApprovedBtn_" + FlightIndex).removeClass('hidden');
                    }
                    else if ($('#IsFlightReSubmittedHdn').val() == 'true') {
                        if (Status == 7) {
                            $("#divDisabledApprovedBtn_" + FlightIndex).removeClass('hidden');
                        }
                    }
                    else {
                        if (Status < 8) {
                            $("#divProceedToApproveBtn_" + FlightIndex).removeClass('hidden');
                            $('#' + flightID).attr("checked", "checked");
                            $('#lblSelectFlightbtn_' + flightID).removeClass().addClass("btn btn-success selectedFlight selected");
                            $('#ApprovedFlightIdHdn').val(flightID);
                            // checked above btn
                        }
                        //else {
                        //    $("#divDisabledApprovedBtn_" + FlightIndex).removeClass('hidden');
                        //}
                    }
                }
                else {
                    if (Status == 8) {
                        $("#divBasicBtn_" + FlightIndex).removeClass('hidden');
                    }
                    else if ($('#IsFlightReSubmittedHdn').val() == 'true') {
                        if (Status == 7) {
                            $("#divBasicBtn_" + FlightIndex).removeClass('hidden');
                        }
                    }
                    else {
                        if (Status < 8) {
                            $("#divProceedToApproveBtn_" + FlightIndex).removeClass('hidden');
                        }
                    }
                }
            }
        }
        else {
            $("#divBasicBtn_" + FlightIndex).removeClass('hidden');
            if (Status == 5) {
                if (!IsPreferred) {
                    $("#divDeleteFlightBtn_" + FlightIndex).removeClass('hidden');
                }
            }
            else if ($('#SubmittedTravelRequestAction').text() == "Not Required" && Status > 6) {
                if (IsApproved) {
                    $("#divDisabledApprovedBtn_" + FlightIndex).removeClass('hidden');
                }
            }
        }
        $("#divFlightContainer_" + previousApproverSelectedFlightID + " .selectedFlight").addClass("selected");
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js BindingFlightItiDetails()-->" + error);
    }
}

function BindingOtherFlightDetails(Element, status) {
    try {
        $("#" + Element).append($('#divFlightItineraryOtherDetails').html());

        if (Element != 'rejectedFlightItineraryContent') {
            if (status == 5 && ($("#HotelItineraryTab").css('display') != 'inline-block')) {
                $('#divGotoRequestBtn').removeClass('hidden');
            }
            if ($('#SubmittedTravelRequestAction').text().toLowerCase().indexOf("approve") >= 0) {
                if (status >= 6 && status <= 7) {
                    $('#divItineraryApproverComments').removeClass('hidden');
                    $('#FlightItinerarybtn').removeClass('hidden');
                    if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                        if ($('#HotelItineraryTab').children().attr("onclick").indexOf('Navigate') >= 0)
                            $('#divRejectAndNavigate').removeClass('hidden');
                        else {
                            $('#divRejectFlightOnly').removeClass('hidden');
                        }
                    }
                    else {
                        $('#divRejectFlightOnly').removeClass('hidden');
                    }
                }
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js BindingOtherFlightItiDetails()-->" + error);
    }
}

function DeSelectFlight(flightId, $container) {
    try {
        $('#' + $container + flightId).parent().removeClass().addClass("btn btn-success selectedFlight");
        $('#' + $container + flightId).removeAttr('checked');
        $('#ItineraryApproverComments').removeClass('hidden');
        $('.btn btn-primary selectedFlight deselect').remove();
        return false;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js DeSelectFlight()-->" + error);
    }
}

function ViewReSubmitItinerary(type) {
    try {
        if (type == 'H') {
            ViewReSubmitHotelItinerary();
        }
        else {
            ViewReSubmitFlightItinerary();
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ViewReSubmitItinerary()-->" + error);
    }
}

function ViewReSubmitHotelItinerary() {
    try {
        if ($('#IsHotelReSubmittedHdn').val() == 'true') {
            NavigateToHotelItinerary();
            $("#HotelItineraryMain").empty();
            AddRejectedHotelBlock();

            if (parseFloat($('#AddNewHotelBlockHdn').val()) > 0) {
                AddNewHotelBlock(parseFloat($('#AddNewHotelBlockHdn').val()));
            }

            if (parseFloat($('#AddNewHotelBlockHdn').val()) == 5) {
                $("#HotelItineraryMain").append('<input type="button" class="btn btn-primary" id="GoToRequest" value="Go to Request" onclick="GoBackToRequest()" />');
            }
        }
        else
            ViewHotelItinerary(7);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ViewReSubmitHotelItinerary()-->" + error);
    }
}

function ViewReSubmitFlightItinerary() {
    try {
        if ($('#IsFlightReSubmittedHdn').val() == 'true') {
            NavigateToFlightItinerary();
            $("#FlightItineraryMain").empty();
            AddRejectedFlightBlock();

            if (parseFloat($('#AddNewFlightBlockHdn').val()) > 0) {
                AddNewFlightBlock(parseFloat($('#AddNewFlightBlockHdn').val()));
            }
            if (parseFloat($('#AddNewFlightBlockHdn').val()) == 5) {
                $("#FlightItineraryMain").append($('#divFlightNavigationBtn').html());
                $('#divGotoRequestBtn').removeClass('hidden');
                $('#InpCheckHotelBtn').removeClass('hidden');
            }
        }
        else
            ViewFlightItinerary(7);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ViewReSubmitFlightItinerary()-->" + error);
    }
}

function CheckItineraryExists(HighlightTab) {
    try {
        var RequestNo = getUrlVars()["RequestNo"];
        if (RequestNo === undefined) {
            return;
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/Itinerary/CheckItineraryExists/" + RequestNo,
           "POST",
       null,
      function (response) {
          if (response != null) {
              $("#IsGradeLevelExc").val(response.IsExc);
              //Checks whether it is  a Grade Level Approval Exception or not
              if (response.IsExc) {
                  if (response.ItineraryFlights.length == 1 && response.ItineraryHotels.length == 1) {
                      $("#SubmittedTravelRequestCreateItinerary").empty();
                  }
              }
              if (response.ItineraryFlights == null || response.ItineraryFlights.length == 0) {
                  $('#FlightItineraryTab').css('display', 'none');
                  $('#HotelItineraryTab').css('display', 'none');
              }
              else {
                  $('#FlightItineraryTab').css('display', 'inline-block');
                  $('#HotelItineraryTab').css('display', 'none');
                  if (response.Status < 6) {
                      $('#FlightItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteFlightItinerary(\'' + response.TravelRequestItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                  }
                  else {
                      if ($('#FlightItineraryTab .rza-delitinerary').length > 0) {
                          $('.rza-delitinerary').remove();
                      }
                  }
                  if (response.ItineraryFlights.length == 5 && response.ItineraryHotels.length == 5) {
                      $("#SubmittedTravelRequestCreateItinerary").empty();
                  }
              }
              //----------------------------------------------------
              //CheckHotelItineraryExists(HighlightTab);

              if (response.ItineraryHotels == null || response.ItineraryHotels.length == 0) {
                  $('#HotelItineraryTab').css('display', 'none');
              }
              else {
                  $('#HotelItineraryTab').css('display', 'inline-block');
                  if (response.Status < 6) {
                      $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.TravelRequestItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                  }
              }
              if (HighlightTab == 'Y')
                  HighlightItineraryTab();
          }
          else {
              alertmsg('Some Error Occur in Checking Itinerary Exist . Please try again after some time.');
          }

      }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js CheckItineraryExists()-->" + error);
    }
}

function DeleteFlight(flightID) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/Itinerary/DeleteItinerary/" + RequestNo + "/" + flightID,
           "POST",
       null,
       function (response) {
           if (response != null) {
               if (response == true) {
                   //if ($("#SubmittedTravelRequestCreateItinerary").text().trim() != "Create Itinerary") {
                   //    var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + RequestNo + '\')">Create Itinerary </a>'
                   //    $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                   //}
                   CheckItineraryExists('N');
                   if ($('#IsFlightReSubmittedHdn').val() == 'true') {
                       ViewFlightItinerary(5);
                   }
                   else
                       ViewFlightItinerary(0);
               }
           }
           else {
               alertmsg('Some Error Occur in Deleting Individual Flight Itinerary Details. Please try again after some time.');
           }
           $.unblockUI();
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js DeleteFlight()-->" + error);
    }
}

function DeleteFlightItinerary(flightItineraryID) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/Itinerary/DeleteFlightItinerary/" + RequestNo + "/" + flightItineraryID,
           "POST",
       null,
       function (response) {
           if (response != null) {
               if (response == true) {
                   window.location.href = "TravelRequestDetail?RequestNo=" + RequestNo;
               }
           }
           else {
               alertmsg('Some Error Occur in Deleting Complete Flight Itinerary Details. Please try again after some time.');
           }
           $.unblockUI();
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js DeleteFlightItinerary()-->" + error);
    }
}

// Itinerary Approve and reject section

function StartReview() {
    try {
        if ($("#FlightItineraryTab").css('display') == 'inline-block') {
            $('#liTravelRequest').removeClass();
            $('#FlightItineraryTab').removeClass().addClass("active");
            $('#HotelItineraryTab').removeClass();
            $('#tr-view').attr('class', 'tab-pane fade');
            $('#HotelItineraryMain').attr('class', 'tab-pane fade');
            $('#FlightItineraryMain').attr('class', 'tab-pane fade active in');
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").html('');

            if ($('#IsHotelReSubmittedHdn').val() == 'true')
                ViewReSubmitHotelItinerary();

            if ($('#IsFlightReSubmittedHdn').val() == 'true')
                ViewReSubmitFlightItinerary();

            if ($('#IsFlightReSubmittedHdn').val() == 'true') {
                if ($('#newFlightItineraryContent').html() != undefined) {
                    ViewReSubmitItinerary('F');
                }
                else {
                    if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                        ViewReSubmitItinerary('H');
                    }
                    else {
                        ViewHotelItinerary(0);
                    }
                }
            }
            else
                ViewFlightItinerary(0);
        }
        else if ($("#HotelItineraryTab").css('display') == 'inline-block') {
            $('#liTravelRequest').removeClass();
            $('#FlightItineraryTab').removeClass();
            $('#HotelItineraryTab').removeClass().addClass("active");
            $('#tr-view').attr('class', 'tab-pane fade');
            $('#HotelItineraryMain').attr('class', 'tab-pane fade active in rze-hpadding');
            $('#FlightItineraryMain').attr('class', 'tab-pane fade');
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").html('');
            if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                ViewReSubmitItinerary('H');
            }
            else
                ViewHotelItinerary(0);
        }
        else {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-danger");
            $("#lblMessage").html('Itinerary is Not Submitted.');
            $(window).scrollTop(0);
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js startreview()-->" + error);
    }
}

function flightBtnClick(flightId) {
    try {
        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();
        if (flightId > 0) {
            $('#IsFlightItineraryApproved').val('true');
            // unchecking  already approved Flight.
            var AlreadyApprovedFlight = $('#ApprovedFlightIdHdn').val();
            if (AlreadyApprovedFlight != undefined && AlreadyApprovedFlight != "0") {
                $('#lblSelectFlightbtn_' + AlreadyApprovedFlight).attr('class', 'btn btn-primary');
            }
            $('#ApprovedFlightIdHdn').val(flightId);
            $('#FlightReject').removeClass().addClass("btn btn-primary");
        }
        else
            $('#IsFlightItineraryApproved').val('false');

        $('#lblSelectFlightbtn_' + flightId).attr('class', 'btn btn-success');
        $('#' + flightId).prop('checked', true);

        var $flightIdToAproveReject = $('<input/>', { type: 'hidden', id: 'hdnFlightIdToAproveReject', value: flightId });
        $flightIdToAproveReject.appendTo("#FlightItineraryMain");

        $('#liTravelRequest').removeClass();
        $('#FlightItineraryTab').removeClass();

        $("#FlightItineraryTab").find('a').attr('href', '#FlightItineraryMain');
        $("#FlightItineraryTab").find('a').attr('onclick', 'NavigateToFlightItinerary();');
        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();

        if ($('#IsHotelReSubmittedHdn').val() == 'true' && $("#HotelItineraryTab").find('a').attr('onclick').indexOf('Navigate') == -1)
            ViewReSubmitHotelItinerary();

        if ($("#HotelItineraryMain").html() == undefined || $("#newHotelItineraryContent").html() == undefined || $('#ApprovedHotelIdHdn').val() != '0' || $('#HotelReject').hasClass('btn btn-success')) {
            if ($('#IsHotelReSubmittedHdn').val() == 'true' && $("#newHotelItineraryContent").html() == undefined) { // hotel rejected but not added for approval.
                GoToRequest();
            }
            else {
                if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                    $('#HotelItineraryTab').removeClass().addClass("active");
                    $('#FlightItineraryMain').attr('class', 'tab-pane fade');
                    $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');
                    if ($('#ApprovedHotelIdHdn').val() != '0' || $('#HotelReject').hasClass('btn btn-success')) {
                        GoToRequest();
                    }
                    else {
                        ViewReSubmitItinerary('H');
                    }
                }
                else {
                    if ($("#HotelItineraryMain").html() == undefined) {
                        GoToRequest();
                    }
                    else {
                        $('#HotelItineraryTab').removeClass().addClass("active");
                        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
                        $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');
                        if ($('#ApprovedHotelIdHdn').val() != '0' || $('#HotelReject').hasClass('btn btn-success')) {
                            GoToRequest();
                        }
                        else {
                            ViewHotelItinerary(0);
                        }
                    }
                }
            }
        }
        else {
            $('#HotelItineraryTab').removeClass().addClass("active");
            $('#FlightItineraryMain').attr('class', 'tab-pane fade');
            $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');
            if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                ViewReSubmitItinerary('H');
            }
            else {
                ViewHotelItinerary(0);
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js flightBtnClick()-->" + error);
    }
}

function SetFirstApproverSelectedHotel(HotelId) {
    try {
        if (HotelId != undefined) {
            $('#' + HotelId).prop('checked', true);
            if ($('#lblSelectHotelbtn_' + HotelId).hasClass("btn btn-primary"))
                $('#lblSelectHotelbtn_' + HotelId).removeClass().addClass("btn btn-success selectedHotel");
            else
                if ($('#lblSelectHotelbtn_' + HotelId).hasClass("selectedHotelwarp")) {
                    $('#lblSelectHotelbtn_' + HotelId).children().removeClass().addClass("btn btn-success selectedHotel");
                }
                else {
                    $('#lblSelectHotelbtn_' + HotelId).children().removeClass().addClass("btn btn-success selectedHotel hidden");
                }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SetFirstApproverSelectedHotel()-->" + error);
    }
}

function SetFirstApproverSelectedFlight(flightId) {
    try {
        if (flightId != undefined) {
            $('#lblSelectFlightbtn_' + flightId).attr('class', 'btn btn-success');
            $('#' + flightId).prop('checked', true);
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SetFirstApproverSelectedFlight()-->" + error);
    }
}

function HotelBtnClick(HotelId) {
    try {
        ApproverItineraryComments = $('#HotelItineraryApproverCommentstext').val();
        if (HotelId > 0) {
            $('#' + HotelId).prop('checked', true);
            // unchecking  already approved Hotel.
            var AlreadyApprovedHotel = $('#ApprovedHotelIdHdn').val();
            if (AlreadyApprovedHotel != undefined && AlreadyApprovedHotel != "0") {
                if ($('#lblSelectHotelbtn_' + AlreadyApprovedHotel).hasClass("btn btn-success"))
                    $('#lblSelectHotelbtn_' + AlreadyApprovedHotel).removeClass().addClass("btn btn-primary");
                else
                    $('#lblSelectHotelbtn_' + AlreadyApprovedHotel).children().removeClass().addClass("btn btn-primary");
            }
            // saving the new approved hotel id
            $('#IsHotelItineraryApproved').val('true');
            $('#ApprovedHotelIdHdn').val(HotelId);
            // Unchecking the Hotel Reject button.
            $('#HotelReject').removeClass().addClass("btn btn-primary");
        }
        else {
            $('#IsHotelItineraryApproved').val('false');
        }

        //$("#FlightItineraryTab").addClass("active");
        $("#HotelItineraryTab").removeClass("active");

        //$('#HotelItineraryMain .radio rze-deselect').children().attr('class', 'btn btn-primary');

        if ($('#lblSelectHotelbtn_' + HotelId).hasClass("btn btn-primary"))
            $('#lblSelectHotelbtn_' + HotelId).removeClass().addClass("btn btn-success selectedHotel");
        else {
            if ($('#lblSelectHotelbtn_' + HotelId).hasClass("selectedHotelwarp")) {
                $('#lblSelectHotelbtn_' + HotelId).children().removeClass().addClass("btn btn-success selectedHotel");
            }
            else {
                $('#lblSelectHotelbtn_' + HotelId).children().removeClass().addClass("btn btn-success selectedHotel");
            }
        }

        var $hotelIdToAproveReject = $('<input/>', { type: 'hidden', id: 'hdnHotelIdToAproveReject', value: HotelId });
        $hotelIdToAproveReject.appendTo("#HotelItineraryMain");

        if ($("#hdnFlightIdToAproveReject").length > 0) {
            GoToRequest();
            return false;
        }

        if ($('#IsFlightReSubmittedHdn').val() == 'true' && $("#FlightItineraryTab").find('a').attr('onclick').indexOf('Navigate') == -1)
            ViewReSubmitFlightItinerary();

        if ($("#FlightItineraryMain").html() == undefined || $("#newFlightItineraryContent").html() == undefined || $('#ApprovedFlightIdHdn').val() != '0' || $('#FlightReject').hasClass('btn btn-success')) {
            if ($('#IsFlightReSubmittedHdn').val() == 'true' && $("#newFlightItineraryContent").html() == undefined) { // Flight rejected but not added for approval.
                GoToRequest();
            }
            else {
                if ($('#IsFlightReSubmittedHdn').val() == 'true') {
                    $('#FlightItineraryTab').removeClass().addClass("active");
                    $("#HotelItineraryTab").removeClass("active");
                    $('#HotelItineraryMain').attr('class', 'tab-pane fade');
                    $('#FlightItineraryMain').attr('class', 'tab-pane fade in active');
                    if ($('#ApprovedFlightIdHdn').val() != '0' || $('#FlightReject').hasClass('btn btn-success')) {
                        NavigateToFlightItinerary();
                    }
                    else {
                        ViewReSubmitItinerary('F');
                    }
                }
                else {
                    if ($("#FlightItineraryMain").html() == undefined) {
                        GoToRequest();
                    }
                    else {
                        $('#FlightItineraryTab').removeClass().addClass("active");
                        $('#HotelItineraryMain').attr('class', 'tab-pane fade');
                        $("#HotelItineraryTab").removeClass("active");
                        $('#FlightItineraryMain').attr('class', 'tab-pane fade in active');
                        if ($('#ApprovedFlightIdHdn').val() != '0' || $('#FlightReject').hasClass('btn btn-success')) {
                            GoToRequest();
                        }
                        else {
                            ViewFlightItinerary(0);
                        }
                    }
                }
            }
        }
        else {
            $('#FlightItineraryTab').removeClass().addClass("active");
            $("#HotelItineraryTab").removeClass("active");
            $('#HotelItineraryMain').attr('class', 'tab-pane fade');
            $('#FlightItineraryMain').attr('class', 'tab-pane fade in active');
            if ($('#IsFlightReSubmittedHdn').val() == 'true') {
                ViewReSubmitItinerary('F');
            }
            else {
                ViewFlightItinerary(0);
            }
        }

        ApplyApproverComments();
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js HotelBtnClick()-->" + error);
    }
}

function GoToRequest() {
    try {
        var FlightApprComments = $('#FlightItineraryApproverCommentstext').val();
        var HotelApprComments = $('#HotelItineraryApproverCommentstext').val();

        $('#FlightApprove').prop('disabled', true);
        if ($("#FlightItineraryMain input:checked").val()) {
            $('#IsFlightItineraryApproved').val('true');
            $("#FlightItineraryTab").find('a').attr('href', '#FlightItineraryMain');
            $("#FlightItineraryTab").find('a').attr('onclick', 'NavigateToFlightItinerary();');
        }

        if ($("#HotelItineraryMain input:checked").val()) {
            $('#IsHotelItineraryApproved').val('true');
            $("#HotelItineraryTab").find('a').attr('href', '#HotelItineraryMain');
            $("#HotelItineraryTab").find('a').attr('onclick', 'NavigateToHotelItinerary();');
        }

        if (HotelApprComments != undefined && HotelApprComments != '')
            $('#ItineraryApproverCommentstext').html(HotelApprComments);
        else
            $('#ItineraryApproverCommentstext').html(FlightApprComments);

        if ($('#ItineraryApproverComments').hasClass('hidden'))
            $('#ItineraryApproverComments').removeClass('hidden');

        if (FlightApprComments != undefined && FlightApprComments == '')
            $('#FlightItineraryApproverCommentstext').val(HotelApprComments);
        else
            $('#FlightItineraryApproverCommentstext').val(FlightApprComments);

        if (HotelApprComments != undefined && HotelApprComments == '')
            $('#HotelItineraryApproverCommentstext').val(FlightApprComments);
        else
            $('#HotelItineraryApproverCommentstext').val(HotelApprComments);

        $('#HotelItineraryMain').attr('class', 'tab-pane fade');
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#tr-view').attr('class', 'tab-pane fade in active');

        $('#liTravelRequest').removeClass().addClass("active");
        $('#FlightItineraryTab').removeClass();
        $('#HotelItineraryTab').removeClass();

        $('#StartReviewBtn').html('Submit');
        $('#StartReviewBtn').attr('onclick', 'SubmitReview()');
        $('#StartReviewBtn').focus();
        $('#StartReviewBtn').css('border', '2px solid #ccc');
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GoToRequest()-->" + error);
    }

}

function ProceedToHotel() {
    try {
        $('#liTravelRequest').removeClass();
        $('#FlightItineraryTab').removeClass();
        $('#HotelItineraryTab').removeClass().addClass("active");
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');
        $("#FlightItineraryTab").find('a').attr('href', '#FlightItineraryMain');
        $("#FlightItineraryTab").find('a').attr('onclick', 'NavigateToFlightItinerary();');
        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();
        if ($('#ApprovedHotelIdHdn').val() != '0' || $('#HotelReject').hasClass('btn btn-success'))
            NavigateToHotelItinerary();
        else
            ViewHotelItinerary(0);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ProceedToHotel()-->" + error);
    }
}

function FlightItineraryReject() {
    try {
        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();
        var ApprovedFlight = $('#ApprovedFlightIdHdn').val();
        if (ApprovedFlight != '0') {
            $('#lblSelectFlightbtn_' + ApprovedFlight).removeClass().addClass("btn btn-primary");
        }
        $('#FlightReject').removeClass().addClass("btn btn-success");
        flightBtnClick(0);
        ApplyApproverComments();
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js FlightItineraryReject()-->" + error);
    }
}

function NavigateToFlightItinerary() {
    try {
        ApproverItineraryComments = $('#HotelItineraryApproverCommentstext').val();
        ApplyApproverComments();
        $('#liTravelRequest').removeClass();
        $('#FlightItineraryTab').removeClass().addClass("active");
        $('#HotelItineraryTab').removeClass();
        $('#tr-view').attr('class', 'tab-pane fade');
        $('#HotelItineraryMain').attr('class', 'tab-pane fade');
        $('#FlightItineraryMain').attr('class', 'tab-pane fade active in');
        $('#CheckoutTab').removeClass();
        $('#CheckoutMain').attr('class', 'tab-pane fade');
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js NavigateToFlightItinerary()-->" + error);
    }
}

function NavigateToHotelItinerary() {
    try {
        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();
        ApplyApproverComments();
        $('#liTravelRequest').removeClass();
        $('#FlightItineraryTab').removeClass();
        $('#HotelItineraryTab').removeClass().addClass("active");
        $('#tr-view').attr('class', 'tab-pane fade');
        $('#HotelItineraryMain').attr('class', 'tab-pane fade active in rze-hpadding');
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#CheckoutTab').removeClass();
        $('#CheckoutMain').attr('class', 'tab-pane fade');
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js NavigateToHotelItinerary()-->" + error);
    }
}

function HotelItineraryReject() {
    try {
        ApproverItineraryComments = $('#HotelItineraryApproverCommentstext').val();
        var ApprovedHotel = $('#ApprovedHotelIdHdn').val();
        if (ApprovedHotel != '0') {
            $('#radioPopOver_' + ApprovedHotel).attr("class", "btn btn-primary");
            //$('.rze-prdcontwrap').empty();
            if ($('#lblSelectHotelbtn_' + ApprovedHotel).hasClass("btn btn-success"))
                $('#lblSelectHotelbtn_' + ApprovedHotel).removeClass().addClass("btn btn-primary");
            else
                $('#lblSelectHotelbtn_' + ApprovedHotel).children().removeClass().addClass("btn btn-primary");
        }
        $('#HotelReject').removeClass().addClass("btn btn-success");
        HotelBtnClick(0);
        ApplyApproverComments();
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js HotelItineraryReject()-->" + error);
    }
}

function SubmitReview() {
    try {
        //get itinerary ID And update status
        var TravelRequestItineraryId = $('#TravelRequestItineraryID').val();

        var TravelRequestItineraryFlightId = '0';
        var TravelRequestItineraryHotelId = '0';
        var IsItineraryApprove = '';

        if ($("#FlightItineraryTab").css('display') == 'inline-block') {
            // Flight itinerary is added.
            if ($("#FlightItineraryMain  input:checked").length > 0) {
                //get itinerary Flight ID 
                var FlightId = $('input[type=radio][name="flight"]:checked').attr('id');
                TravelRequestItineraryFlightId = $("#TravelRequestItineraryFlightID_" + FlightId).val();

                if ($('#FlightReject').hasClass("btn btn-success")) {
                    TravelRequestItineraryFlightId = 0;
                }
            }
            else {
                if ($('#FlightReject').hasClass("btn btn-success")) {
                    TravelRequestItineraryFlightId = 0;
                }
                else {
                    if ($('#newFlightItineraryContent').html() == undefined) {
                        TravelRequestItineraryFlightId = -1;
                    }
                }
            }
        }
        else {
            // Flight itinerary is not added.
            TravelRequestItineraryFlightId = -1;
        }

        if ($("#HotelItineraryTab").css('display') == 'inline-block') {
            // Hotel Itinerary is added.
            if ($("#HotelItineraryMain input:checked").length > 0) {
                //get itinerary Hotel ID .
                var HotelId = $('input[type=radio][name="hotel"]:checked').attr('id');
                TravelRequestItineraryHotelId = $("#TravelRequestItineraryHotelID_" + HotelId).val();

                if ($('#HotelReject').hasClass("btn btn-success")) {
                    TravelRequestItineraryHotelId = 0;
                }
            }
            else {
                if ($('#HotelReject').hasClass("btn btn-success")) {
                    TravelRequestItineraryHotelId = 0;
                }
                else {
                    if ($('#newHotelItineraryContent').html() == undefined) {
                        TravelRequestItineraryHotelId = -1;
                    }
                }
            }
        }
        else {
            // Hotel itinerary is not added.
            TravelRequestItineraryHotelId = -1;
        }

        var submitionComments = "";
        if ($("#ItineraryApproverCommentstext").val() != "" && $("#ItineraryApproverCommentstext").val() != undefined)
            submitionComments = $("#ItineraryApproverCommentstext").val();

        if (TravelRequestItineraryFlightId === undefined) {
            TravelRequestItineraryFlightId = 0;
        }
        if (TravelRequestItineraryHotelId === undefined) {
            TravelRequestItineraryHotelId = 0;
        }
        if (submitionComments == '' || submitionComments == undefined)
            submitionComments = ";";

        var RequiredApproverLevel = $('#RequiredApproverLevel').val();
        if (RequiredApproverLevel == undefined || RequiredApproverLevel == NaN || RequiredApproverLevel == '')
            RequiredApproverLevel = parseFloat('0');
        else
            RequiredApproverLevel = parseFloat(RequiredApproverLevel);
        var IsSubAppr = $('#IsSubAppr').val();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelItinerary/Itinerary/ApproveOrRejectItinerary",
        "GET",
        { TravelRequestItineraryID: TravelRequestItineraryId, TravelRequestItineraryFlightID: TravelRequestItineraryFlightId, TravelRequestItineraryHotelID: TravelRequestItineraryHotelId, comments: submitionComments, requiredApproverLevel: RequiredApproverLevel, IsSubAppr: IsSubAppr },
        function (response) {
            if (response != null) {
                if (response != "Not Exist") {
                    var message = '';
                    $("#FlightItineraryTab").find('a').attr('href', '#FlightItineraryMain');
                    $("#FlightItineraryTab").find('a').attr('onclick', 'ViewFlightItinerary(0);');

                    $("#HotelItineraryTab").find('a').attr('href', '#HotelItineraryMain');
                    $("#HotelItineraryTab").find('a').attr('onclick', 'ViewHotelItinerary(0);');
                    $('#StartReviewBtn').css("display", "none");
                    $('#ItineraryApproverComments').empty();
                    $('#ItineraryApproverComments').css("display", "none");
                    ItineraryApproverComments
                    if (response == "True") {
                        message = 'Itinerary Approved';
                    }
                    else {
                        message = 'Itinerary Rejected';
                    }
                    if ($("#myTab li").hasClass("active")) {
                        $("#myTab li.active").each(function () {
                            var ReqNumber = $(this).attr('id').split("_")[1];
                            var RequestType = $(this).attr('id').split("_")[2];
                            RequestType = RequestType + '//' + message;
                            LoadTravelRequest(ReqNumber, RequestType);
                        });
                    }
                }
                else {
                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("class", "alert alert-danger");
                    $('#lblMessage').html('Itinerary Travel Request Does not Exist , Please Re-try.');
                    $(window).scrollTop(0);
                }
            }
            else {
                alertmsg('Some Error Occur in Approval Or Rejection of Itinerary. Please try again after some time.');
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("ApproveOrRejectTravelRequest");
            console.log(XMLHttpRequest);
        },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SubmitReview()-->" + error);
    }
}

// Travel request Confirm booking.
function CompleteCheckout() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var passengerCount = $("#TotalTravellers").val();
        var model = new Object();
        var anyError = false;
        model.TravelRequestId = $("#SubmittedTravelRequestNo").html();
        model.AirTravellers = new Array();
        for (var value = 0; value < passengerCount; value++) {
            var traveller = new Object();
            var employeeId = $("#EmployeeId" + value).val();
            traveller.EmployeeId = employeeId;
            traveller.FirstName = $("#EmployeeFirstName" + employeeId).val();
            traveller.LastName = $("#EmployeeLastName" + employeeId).val();
            traveller.Birthdate = $("#DateOfBirth" + employeeId).val()
            traveller.PassportNo = $("#PassportNo" + employeeId).val()
            traveller.Honorific = 2;
            traveller.PlaceOfIssue = $("#IssuedLocation" + employeeId).val()
            traveller.DateOfExpiry = $("#PassportExpiryDate" + employeeId).val()
            traveller.SeatPreference = $("#SeatPreference" + employeeId).val()
            traveller.MealPreference = $("#MealsPreference" + employeeId).val()
            traveller.FrequentFlyerNo = $("#FrequentFlyerInfo" + employeeId).val()
            model.AirTravellers.push(traveller);
        }
        anyError = AgeValidation() || PassportNumberValidation();
        if (!anyError) {
            var data = $.postifyData(model);
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
            "Booking/Create",
            "POST",
            data,
            function (response) {
                if (response != null) {
                    bootbox.alert({
                        title: "Alert",
                        message: response.Message,
                        size: 'small',
                        callback: function () {
                            window.location.href = "TravelRequestDetail?RequestNo=" + $("#SubmittedTravelRequestNo").html();
                        }
                    })
                }
                else {
                    alertmsg('Some Error Occur in Completing Checkout . Please try again after some time.');
                }

                $.unblockUI();
            }, function (XMLHttpRequest, textStatus, errorThrown) { }, null
            );
        }
        else {
            $.unblockUI();
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js CompleteCheckout()-->" + error);
    }
}

function ClearCommentsMessage() {
    $('#lblItineraryApproverCommentstext').html('');
}

function ViewCheckout() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        $('#tr-view').attr('class', 'tab-pane fade');
        $('#HotelItineraryMain').attr('class', 'tab-pane fade');
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#CorporateItineraryMain').attr('class', 'tab-pane fade');
        $("#CorporateItineraryTab").removeClass();
        $('#CheckoutMain').attr('class', 'tab-pane fade in active');
        $('#CheckoutItinerary').css('display', 'inline-block');
        $('#CheckoutTab').css('display', 'inline-block');
        $("#CheckoutTab").addClass("active");
        $("#liTravelRequest").removeClass("active");
        $("#FlightItineraryTab").removeClass("active");
        $("#HotelItineraryTab").removeClass("active");
        $("#CheckoutMain").empty();
        //$('#ItineraryComments').hide();
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "CheckoutItinerary/Checkout/ViewCheckout/" + RequestNo,
            "POST",
        null,
        function (response) {
            if (response != null) {
                $("#TotalTravellers").val(response.length);
                $("#CheckoutMain").append("<div class='panel-group rze-chkpaxcont' id='accordion'></div>");
                $("#accordion").append("<div id='default' class='panel panel-default'></div>");
                $("#accordion").append("<div id='Flightdefault' class='panel panel-default'></div>");
                $("#accordion").append("<div id='Hoteldefault' class='panel panel-default'></div>");
                //if ($("#FlightItineraryTab").is(":visible")) {
                if ($('#ApprovedFlightItineraryToSubmitHdn').val() > 0) {
                    var Flightinfo = $("#FlightInfo").html();
                    $("#Flightdefault").append(Flightinfo);
                    $("#Flightdefault").append("<div id='collapse2'class='panel-collapse collapse'><div id='Flightbody'class='panel-body'></div></div>")
                }
                if ($('#ApprovedHotelItineraryToSubmitHdn').val() > 0) {
                    var Hotelinfo = $("#HotelInfo").html();
                    $("#Hoteldefault").append(Hotelinfo);
                    $("#Hoteldefault").append("<div id='collapse3'class='panel-collapse collapse'><div id='Hotelbody'class='panel-body'></div></div>")
                }
                var passenger = $("#Passenger").html();
                passenger = passenger.replace("#TravellerCount#", response.length)
                $("#default").append(passenger);
                $("#default").append("<div id='collapse1'class='panel-collapse collapse in'><div id='body'class='panel-body'></div></div>")
                IsSelfBookingEnabled();
                $.each(response, function (key, employee) {
                    $("#body").append("<div class='rze-chckoutdet' id='divCheckoutPax_" + employee.EmployeeId + "'></div>");
                    $("#divpaxDetails-clone").attr('id', 'divpaxDetails-clone' + employee.EmployeeId);
                    var clonecont = $("#divpaxDetails-clone" + employee.EmployeeId).html();
                    clonecont = clonecont.replace(new RegExp("EmployeeId", "ig"), 'EmployeeId' + key);
                    clonecont = clonecont.replace(new RegExp("EmployeeFirstName", "ig"), 'EmployeeFirstName' + employee.EmployeeId);
                    clonecont = clonecont.replace(new RegExp("EmployeeLastName", "ig"), 'EmployeeLastName' + employee.EmployeeId);
                    clonecont = clonecont.replace(/DateOfBirth/g, 'DateOfBirth' + employee.EmployeeId);
                    clonecont = clonecont.replace(/CurrentDate/g, 'CurrentDate' + key);
                    clonecont = clonecont.replace(/PassportExpiryDate/g, 'PassportExpiryDate' + employee.EmployeeId);
                    clonecont = clonecont.replace(new RegExp("MealsPreference", "ig"), 'MealsPreference' + employee.EmployeeId);
                    clonecont = clonecont.replace(new RegExp("IssuedLocation", "ig"), 'IssuedLocation' + employee.EmployeeId);
                    clonecont = clonecont.replace(new RegExp("SeatPreference", "ig"), 'SeatPreference' + employee.EmployeeId);
                    clonecont = clonecont.replace(new RegExp("PassportNo", "ig"), 'PassportNo' + employee.EmployeeId);
                    clonecont = clonecont.replace(new RegExp("FrequentFlyerInfo", "ig"), 'FrequentFlyerInfo' + employee.EmployeeId);
                    clonecont = clonecont.replace("Updateprofile", 'Updateprofile' + employee.EmployeeId);
                    $("#divCheckoutPax_" + employee.EmployeeId).append(clonecont);

                    $("#Updateprofile" + employee.EmployeeId).attr('onclick', 'UpdateEmployee(\'' + employee.EmployeeId + '\')');
                    $("#EmployeeFirstName" + employee.EmployeeId).val(employee.EmployeeFirstName);
                    $("#EmployeeId" + key).val(employee.EmployeeId);
                    $("#CurrentDate" + key).val(employee.CurrentDate);
                    $("#EmployeeLastName" + employee.EmployeeId).val(employee.EmployeeLastName);
                    $("#DateOfBirth" + employee.EmployeeId).datepicker({
                        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
                        onClose: function (event) {
                            validateB2EDate(event, "DateOfBirth" + employee.EmployeeId)
                        },
                        maxDate: moment().add(-1, 'day').format(sessionStorage.DateFormatForMoment)
                    }).datepicker('setDate', new Date(employee.DateOfBirth));

                    $("#DateOfBirth" + employee.EmployeeId).mask(sessionStorage.CultureMaskFormat);
                    $("#PassportExpiryDate" + employee.EmployeeId).datepicker({
                        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
                        onClose: function (event) {
                            validateB2EDate(event, "PassportExpiryDate" + employee.EmployeeId)
                        },
                        minDate: moment().add(1, 'day').format(sessionStorage.DateFormatForMoment)
                    }).datepicker('setDate', new Date(employee.PassportExpiryDate));

                    $("#PassportExpiryDate" + employee.EmployeeId).mask(sessionStorage.CultureMaskFormat);
                    $("#PassportNo" + employee.EmployeeId).val(employee.PassportNo);
                    $("#MealsPreference" + employee.EmployeeId).val(employee.MealPreference);
                    $("#IssuedLocation" + employee.EmployeeId).val(employee.PassportIssuedLocation);
                    $("#FrequentFlyerInfo" + employee.EmployeeId).val("");
                    LoadDropDownList("#SeatPreference" + employee.EmployeeId, employee.SeatPreferences, employee.SeatPreference);
                    $("#divpaxDetails-clone" + employee.EmployeeId).attr('id', "divpaxDetails-clone");
                });
            }
            else {
                alertmsg('Some Error Occur in Getting Checkout Details. Please try again after some time.');
            }
            $.unblockUI();
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ViewCheckout()-->" + error);
    }
}

function LoadDropDownList(dropDownId, list, value) {
    try {
        $(dropDownId).html("");
        for (count in list) {
            $(dropDownId).append("<option value='" + list[count].Value.toString() + "'>" + list[count].Text.toString() + "</option>");
        }
        $(dropDownId).val(value);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js LoadDropDownList()-->" + error);
    }

}

function UpdateEmployee(EmployeeId) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").html('');
        var model = new Object();
        var anyError = false;
        model.EmployeeId = EmployeeId;
        model.TravelRequestId = getUrlVars()["RequestNo"];
        model.EmployeeFirstName = $("#EmployeeFirstName" + EmployeeId).val();
        model.EmployeeLastName = $("#EmployeeLastName" + EmployeeId).val();
        model.DateOfBirth = $("#DateOfBirth" + EmployeeId).val();
        model.PassportNo = $("#PassportNo" + EmployeeId).val();
        model.PassportExpiryDate = $("#PassportExpiryDate" + EmployeeId).val();
        model.PassportIssuedLocation = $("#IssuedLocation" + EmployeeId).val();
        model.MealPreference = $("#MealsPreference" + EmployeeId).val();
        model.SeatPreference = $("#SeatPreference" + EmployeeId).val();
        anyError = AgeValidation() || PassportNumberValidation();
        if (!anyError) {
            var data = $.postifyData(model);
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
               "CheckoutItinerary/Checkout/UpdateEmployee",
               "POST",
                data,
           function (response) {
               if (response != null) {
                   if (response == true) {
                       $("#lblMessage").attr("class", "alert alert-success");
                       $("#lblMessage").html('Employee Details Updated');
                   }
                   else {
                       $("#lblMessage").attr("class", "alert alert-danger");
                       $("#lblMessage").html('Update failed');
                   }
                   $(window).scrollTop(0);
               }
               else {
                   alertmsg('Some Error Occur in Updating Employee Details. Please try again after some time.');
               }
               $.unblockUI();
           }, function (XMLHttpRequest, textStatus, errorThrown) { }, null

            );
        }
        else {
            $.unblockUI();
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js UpdateEmployee()-->" + error);
    }
}

function FlightInformation() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "CheckoutItinerary/Checkout/ViewFlightInfo/" + RequestNo,
            "POST",
            null,
        function (response) {
            if (response != null) {
                if ($('#Flightbody').is(':empty')) {

                    $.each(response.ItineraryFlights, function (key, flight) {

                        var flightID = flight.TravelRequestItineraryFlightId;
                        var OutOfPolicyText = flight.OutOfPolicyText;

                        if (flight.DirectionInd == 1) {
                            //One way trip enum is 1.
                            // Taking the One way html to bind from TravelFareFinder.html.
                            var clone = $("#divFlightSearchResultOneWay").html();
                            $.each(flight.ItineraryFlightTrip, function (Tripkey, TripValue) {

                                var departureTripDateTime = new Date(TripValue.DepartureDateTime);
                                var departureTripDateList = departureTripDateTime.toDateString();
                                var departureTripTimeList = departureTripDateTime.toTimeString().split(':');
                                var arrivalTripDateTime = new Date(TripValue.ArrivalDateTime);
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
                                clonecont = clonecont.replace("FlightLogo", "/Media/Images/AirlineLogossmall/" + TripValue.AirlineCode + ".png");
                                clonecont = clonecont.replace("#FlightName#", TripValue.AirlineName);
                                clonecont = clonecont.replace("divOOP", "divOOP" + flightID);
                                if (flight.OutOfPolicyText !== undefined && flight.OutOfPolicyText != '')
                                    clonecont = clonecont.replace("#PolicyText#", flight.OutOfPolicyText);
                                else
                                    clonecont = clonecont.replace("#PolicyText#", '');
                                clonecont = clonecont.replace("#FlightNumber#", TripValue.AirlineName);
                                clonecont = clonecont.replace("#List#", TripValue.StopOver);
                                clonecont = clonecont.replace("#DepatureTime#", departureTripDateList + " " + departureTripTimeList[0] + ":" + departureTripTimeList[1]);
                                clonecont = clonecont.replace("#DepatureCity#", TripValue.OriginCity);
                                clonecont = clonecont.replace("#ArrivalTime#", "(" + arrivalTripDateList + ")" + arrivalTripTimeList[0] + ":" + arrivalTripTimeList[1]);
                                clonecont = clonecont.replace("#ArrivalCity#", TripValue.DestinationCity);
                                clonecont = clonecont.replace("#Duration#", tripTotalHrs + " Hrs " + tripDuration[1] + " Mins");
                                clonecont = clonecont.replace("#Stops#", TripValue.Stops);
                                clonecont = clonecont.replace("#NoOfPassenger#", response.PaxCount);
                                clonecont = clonecont.replace("divDisplayPreferred", "divDisplayPreferred_" + viewFlightIncrement);
                                clonecont = clonecont.replace("#Type#", "DEPARTURE");
                                clonecont = clonecont.replace("tblTrips", "tblTrips_" + viewFlightIncrement);
                                clonecont = clonecont.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));

                                // Price change info.
                                clonecont = clonecont.replace("divChangePriceOneWayDiff", 'divChangePriceOneWayDiff_' + flightID);
                                clonecont = clonecont.replace("#ChangePriceOneWayDiff#", flight.Notes);
                                clonecont = clonecont.replace("divPreferredOrSelect", "divPreferredOrSelect_" + viewFlightIncrement);
                                clonecont = clonecont.replace("TravelRequestItineraryFlightID", "TravelRequestItineraryFlightID_" + flightID);

                                //Appending the cloned html to Main Div.
                                $("#Flightbody").append(clonecont);
                                // Check price change info.
                                if (flight.Notes != null) {
                                    $("#divChangePriceOneWayDiff_" + flightID).removeAttr("style");
                                    $('[data-toggle="tooltip"]').tooltip();
                                }
                                else {
                                    $("#divChangePriceOneWayDiff_" + flightID).hide();
                                }

                                if (flight.IsPreferred) {
                                    $("#divPreferredOrSelect_" + viewFlightIncrement).removeClass('hidden');
                                }

                                if (flight.OutOfPolicyText != null)
                                    $("#divOOP" + flightID).css('display', 'block');
                                $('#TravelRequestItineraryFlightID_' + flightID).val(flightID);
                                viewFlightIncrement++;
                                $("#divFlightTripTabs").hide();
                            });
                        }
                        else {
                            //Round Trip is 2.
                            var isFirstTrip = false;
                            // Flight Trip (Depature/Arrival) html to bind from TravelFareFinder.html.
                            var cloneFlightResult = $("#divFlightResultTrips").html();
                            // Flight Segment html to bind from TravelFareFinder.html.
                            $.each(flight.ItineraryFlightTrip, function (Tripkey, TripValue) {

                                var departureTripDateTime = new Date(TripValue.DepartureDateTime);
                                var departureTripDateList = departureTripDateTime.toDateString();
                                var departureTripTimeList = departureTripDateTime.toTimeString().split(':');
                                var arrivalTripDateTime = new Date(TripValue.ArrivalDateTime);
                                var arrivalTripDateList = arrivalTripDateTime.toDateString();
                                var arrivalTripTimeList = arrivalTripDateTime.toTimeString().split(':');
                                var tripDuration = TripValue.TotalDuration.split(":");
                                var clonecont = cloneFlightResult;
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
                                    clonecontDepature = clonecontDepature.replace("#FlightName#", flight.ItineraryFlightTrip[0].AirlineName + " - " + flight.ItineraryFlightTrip[1].AirlineName);
                                    clonecontDepature = clonecontDepature.replace("divOOP", "divOOP" + flightID);
                                    if (flight.OutOfPolicyText != undefined && flight.OutOfPolicyText != '')
                                        clonecontDepature = clonecontDepature.replace("#PolicyText#", flight.OutOfPolicyText);
                                    else
                                        clonecontDepature = clonecontDepature.replace("#PolicyText#", '');
                                    clonecontDepature = clonecontDepature.replace("#NoOfPassenger#", response.PaxCount);
                                    clonecontDepature = clonecontDepature.replace("divFlightTrips", "divFlightTrips_" + viewFlightIncrement);
                                    clonecontDepature = clonecontDepature.replace("divFlightHeader", "divFlightHeader_" + viewFlightIncrement);
                                    clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));
                                    clonecontDepature = clonecontDepature.replace("#TotalFare#", flight.TotalFare.toLocaleString(sessionStorage.CultureTypeInfo));
                                    clonecontDepature = clonecontDepature.replace("divDisplayPreferred", "divDisplayPreferred_" + viewFlightIncrement);

                                    // Price change info.
                                    clonecontDepature = clonecontDepature.replace("divChangePriceDiff", 'divChangePriceDiff_' + flightID);
                                    clonecontDepature = clonecontDepature.replace("#ChangePriceDiff#", flight.Notes);
                                    clonecontDepature = clonecontDepature.replace("DivFlightActionButtons", "DivFlightActionButtons_" + viewFlightIncrement);
                                    clonecontDepature = clonecontDepature.replace("TravelRequestItineraryFlightID", "TravelRequestItineraryFlightID_" + flightID);

                                    //Appending the Flight Details to main div html.
                                    $("#Flightbody").append(clonecontDepature);
                                    // Check price change info.
                                    if (flight.Notes != null) {
                                        $("#divChangePriceDiff_" + flightID).removeAttr("style");
                                        $('[data-toggle="tooltip"]').tooltip();
                                    }
                                    else {
                                        $("#divChangePriceDiff_" + flightID).hide();
                                    }

                                    if (flight.IsPreferred) {
                                        $("#divDisplayPreferred_" + viewFlightIncrement).removeClass('hidden');
                                    }
                                    isFirstTrip = true;
                                    clonecont = clonecont.replace("#TripTitle#", "Departure on " + departureTripDateList);
                                }
                                else {
                                    clonecont = clonecont.replace("#TripTitle#", "Departure on " + departureTripDateList);
                                }

                                clonecont = clonecont.replace("FlightLogo", "/Media/Images/AirlineLogossmall/" + TripValue.AirlineCode + ".png");
                                clonecont = clonecont.replace("#FlightName#", TripValue.AirlineName);
                                clonecont = clonecont.replace("#FlightNumber#", TripValue.AirlineName);
                                clonecont = clonecont.replace("#List#", TripValue.StopOver);
                                clonecont = clonecont.replace("#DepatureTime#", departureTripTimeList[0] + ":" + departureTripTimeList[1]);
                                clonecont = clonecont.replace("#DepatureDate#", departureTripDateList);
                                clonecont = clonecont.replace("#ArrivalTime#", arrivalTripTimeList[0] + ":" + arrivalTripTimeList[1]);
                                clonecont = clonecont.replace("#ArrivalDate#", arrivalTripDateList);
                                clonecont = clonecont.replace("#Duration#", tripTotalHrs + " Hrs " + tripDuration[1] + " Mins");
                                clonecont = clonecont.replace("#Stops#", TripValue.Stops);
                                $("#divFlightTrips_" + viewFlightIncrement).append(clonecont);
                                $("#divFlightTripTabs").hide();
                            });

                            if (flight.OutOfPolicyText != null)
                                $("#divOOP" + flightID).css('display', 'block');
                            $('#TravelRequestItineraryFlightID_' + flightID).val(flightID);
                            viewFlightIncrement++;
                            isFirstTrip = false;
                        }
                    });
                }
            }
            else {
                alertmsg('Some Error Occur in Loading Flight Checkout Details. Please try again after some time.');
            }

            $('[data-toggle="tooltip"]').tooltip();
            $.unblockUI();
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js FlightInformation()-->" + error);
    }
}

function IsSelfBookingEnabled() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "CheckoutItinerary/Checkout/IsSelfBookingEnabled",
            "POST",
        null,
        function (response) {
            if ($('#SubmittedTravelRequestAction').text().toLowerCase().trim() != "booking submitted") {
                if (response == false) {
                    var ViewReqBooking = '<div class="rze-chkout-btn" id="divRequestBooking"><button type="button" class="btn btn-primary"  tabindex="0" id="btnViewReqBooking" name="btnViewReqBooking" onclick="return RequestBooking();">Request Booking</button></div>'
                    $("#CheckoutMain").append(ViewReqBooking);
                }
                else {
                    if ($('#CorporateItineraryTab').is(':visible')) {
                        var CompleteCheckout = '<div class="rze-chkout-btn" id="divCompleteCheckout"><button type="button" class="btn btn-primary"  tabindex="0" id="btnCompleteCheckout" onclick="return CorporateCompleteBooking();">Complete Checkout</button></div>'
                        $('#CheckoutMain').append(CompleteCheckout);
                    } else {
                        var CompleteCheckout = '<div class="rze-chkout-btn" id="divCompleteCheckout"><button type="button" class="btn btn-primary"  tabindex="0" id="btnCompleteCheckout" onclick="return CompleteCheckout();">Complete Checkout</button></div>'
                        $('#CheckoutMain').append(CompleteCheckout);
                    }
                }
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js IsSelfBookingEnabled()-->" + error);
    }

}

function CheckHotelItineraryExists(HighlightTab) {
    try {
        var RequestNo = getUrlVars()["RequestNo"];
        if (RequestNo === undefined) {
            return;
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/HotelItinerary/CheckHotelItineraryExists/" + RequestNo,
           "POST",
       null,
       function (response) {
           if (response != null) {
               $("#IsGradeLevelExc").val(response.IsExc);
               if (response.ItineraryHotels == null || response.ItineraryHotels.length == 0) {
                   $('#HotelItineraryTab').css('display', 'none');
               }
               else {
                   $('#HotelItineraryTab').css('display', 'inline-block');
                   if (response.Status < 6) {
                       $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.TravelRequestItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                   }
               }
               if (HighlightTab == 'Y')
                   HighlightItineraryTab();
           }
           else {
               alertmsg('Some Error Occur in Checking Hotel Itinerary Exist. Please try again after some time.');
           }
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js CheckHotelItineraryExists()-->" + error);
    }
}

function GetHotelItineraryCount() {
    try {
        var RequestNo = getUrlVars()["RequestNo"];
        if (RequestNo === undefined) {
            return;
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/HotelItinerary/CheckHotelItineraryExists/" + RequestNo,
           "POST",
       null,
       function (response) {
           if (response != null) {
               if (response.ItineraryHotels == null || response.ItineraryHotels.length == 0) {
                   return 0;
               }
               else {
                   return response.ItineraryHotels.length;
               }
           }
           else {
               alertmsg('Some Error Occur in Getting Hotel Itinerary Count. Please try again after some time.');
           }
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GetHotelItineraryCount()-->" + error);
    }
}

function AddRejectedFlightBlock() {
    try {
        var RejectedBlockClone = $("#divRejectedItineraryPanel").html();
        RejectedBlockClone = RejectedBlockClone.replace("PanelGroupId", "rze-fltrejectitr");
        RejectedBlockClone = RejectedBlockClone.replace("DataParentId", "#rze-fltrejectitr");
        RejectedBlockClone = RejectedBlockClone.replace("ViewRejectItineraryMthd", "ViewFlightItinerary(8);");
        RejectedBlockClone = RejectedBlockClone.replace("SpRejectedContent", "rejectedFlightItineraryContent");
        RejectedBlockClone = RejectedBlockClone.replace("DataTargetId", "#fitrcollapse2");
        RejectedBlockClone = RejectedBlockClone.replace("DivDataTarget", "fitrcollapse2");
        $("#FlightItineraryMain").append(RejectedBlockClone);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js AddRejectedFlightBlock()-->" + error);
    }
    // toggleIcon(e);
}

function AddNewFlightBlock(itrStatus) {
    try {
        var ItineraryId = $('#AddNewItineraryHdn').val();
        var NewBlockClone = $("#divNewItineraryPanel").html();
        NewBlockClone = NewBlockClone.replace("DataParentId", "#rze-fltrejectitr");
        NewBlockClone = NewBlockClone.replace("ViewNewItineraryMthd", "ViewFlightItinerary(" + itrStatus + ");");
        NewBlockClone = NewBlockClone.replace("DeleteNewItineraryMthd", "DeleteFlightItinerary(" + ItineraryId + ");");
        NewBlockClone = NewBlockClone.replace("SpNewContent", "newFlightItineraryContent");
        NewBlockClone = NewBlockClone.replace("DataTargetId", "#fitrcollapse3");
        NewBlockClone = NewBlockClone.replace("DivDataTarget", "fitrcollapse3");
        $("#rze-fltrejectitr").prepend(NewBlockClone);

        if (itrStatus == 5) {
            $('#SpDeleteItineraryBtn').removeClass('hidden');
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js AddNewFlightBlock()-->" + error);
    }
    //toggleIcon(e);
}

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('fa-angle-up fa-angle-down');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);

function AddRejectedHotelBlock() {
    try {
        var RejectedBlockClone = $("#divRejectedItineraryPanel").html();
        RejectedBlockClone = RejectedBlockClone.replace("PanelGroupId", "rze-hotrejectitr");
        RejectedBlockClone = RejectedBlockClone.replace("DataParentId", "#rze-hotrejectitr");
        RejectedBlockClone = RejectedBlockClone.replace("ViewRejectItineraryMthd", "ViewHotelItinerary(8);");
        RejectedBlockClone = RejectedBlockClone.replace("SpRejectedContent", "rejectedHotelItineraryContent");
        RejectedBlockClone = RejectedBlockClone.replace("DataTargetId", "#fitrcollapse4");
        RejectedBlockClone = RejectedBlockClone.replace("DivDataTarget", "fitrcollapse4");
        $("#HotelItineraryMain").append(RejectedBlockClone);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js AddRejectedHotelBlock()-->" + error);
    }
}


function AddNewHotelBlock(itrStatus) {
    try {
        var ItineraryId = $('#AddNewItineraryHdn').val();
        var NewBlockClone = $("#divNewItineraryPanel").html();
        NewBlockClone = NewBlockClone.replace("DataParentId", "#rze-hotrejectitr");
        NewBlockClone = NewBlockClone.replace("SpDeleteItineraryBtn", "SpDeleteItineraryBtn_" + ItineraryId);
        NewBlockClone = NewBlockClone.replace("ViewNewItineraryMthd", "ViewHotelItinerary(" + itrStatus + ");");
        NewBlockClone = NewBlockClone.replace("DeleteNewItineraryMthd", "DeleteHotelItinerary(" + ItineraryId + ");");
        NewBlockClone = NewBlockClone.replace("SpNewContent", "newHotelItineraryContent");
        NewBlockClone = NewBlockClone.replace("DataTargetId", "#fitrcollapse5");
        NewBlockClone = NewBlockClone.replace("DivDataTarget", "fitrcollapse5");
        $("#rze-hotrejectitr").prepend(NewBlockClone);

        if (itrStatus == 5) {
            $('#SpDeleteItineraryBtn_' + ItineraryId).removeClass('hidden');
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js AddNewHotelBlock()-->" + error);
    }
}

function ViewHotelItinerary(status) {
    try {
        ApproverItineraryComments = $('#FlightItineraryApproverCommentstext').val();
        var HotelItrShow = true;
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if (status == 0 || status == 7) {
            if (status == 7) {
                if ($('#newHotelItineraryContent').length == 0) {
                    $("#HotelItineraryMain").empty();
                    $("#HotelSearchResults").empty();
                }
            }
            else {
                $("#HotelItineraryMain").empty();
                $("#HotelSearchResults").empty();
            }
        }
        var RequestNo = getUrlVars()["RequestNo"];
        var ActiveItinerary = parseFloat('0');
        var ItineraryStatus = parseFloat('0');
        if (status > 0) {
            ItineraryStatus = parseFloat(status);
            if (status == 8) {
                if ($('#rejectedHotelItineraryContent').children().length > 1) {
                    HotelItrShow = false;
                    $.unblockUI();
                }
            }
            else {
                if ($('#newHotelItineraryContent').children().length > 1) {
                    if (status != 5) {
                        HotelItrShow = false;
                        $.unblockUI();
                    }
                    else {
                        $('#newHotelItineraryContent').empty();
                    }
                }
            }
        }
        if (HotelItrShow) {
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelItinerary/HotelItinerary/ViewHotelItinerary/" + RequestNo + "/" + ItineraryStatus,
                "POST",
            null,
            function (response) {
                if (response != null) {
                    var $HotelElement = 'HotelItineraryMain';
                    var $HotelSearchResults = "HotelSearchResults";

                    var travelAction = $('#SubmittedTravelRequestAction').text().toLowerCase();
                    if (status > 0) {
                        if (status == 8) {
                            $HotelElement = 'rejectedHotelItineraryContent';
                            $HotelSearchResults = 'HotelSearchResults_Rej';
                            $('#' + $HotelElement).append('<div id="' + $HotelSearchResults + '" class="hidden"></div>');

                        }
                        else {
                            $HotelElement = 'newHotelItineraryContent';
                            $HotelSearchResults = 'HotelSearchResults_New';

                            $('#' + $HotelElement).append('<div id="' + $HotelSearchResults + '" class="hidden"></div>');
                        }
                        if (response.Status <= 8)
                            response.Status = status;
                    }


                    $("#" + $HotelSearchResults).append("<div id='divHotelselected' class='rze-createItinerary'><div class='col-md-12'>Hotels you Selected</div></div>");
                    var previousApproverSelectedHotelId;

                    if ($('#SubmittedTravelRequestAction').text() != "Not Required") {
                        if (response.ItineraryHotels <= 0) {
                            GoToRequest();
                        }
                    }

                    if (response != null && response.ItineraryHotels != null && response.ItineraryHotels.length > 0) {
                        $("#HotelItineraryTab").find('a').attr('href', '#' + $HotelElement);
                        $("#HotelItineraryTab").find('a').attr('onclick', 'NavigateToHotelItinerary();');
                        $("#HotelItineraryTab").addClass('dataForHotelAvailable');
                        $("#hotelResults").show();

                        $("#" + $HotelElement).append("<input type='hidden' id='TravelRequestItineraryID' name='TravelRequestItineraryID' value='" + response.TravelRequestItineraryId + "'/>");

                        $.each(response.ItineraryHotels, function (key, value) {
                            HotelId = value.TravelRequestItineraryHotelId;

                            if (key == 0) {
                                $("#preferredResult").show();
                            }

                            $("#HotelResult").attr('id', 'HotelResult' + HotelId);
                            $("#divhotelPreferredOrBookNow_" + HotelId + "").empty();

                            var viewDetailsTab = "";
                            var otherInfo = "<tr>";
                            var generalDes = ["general", "hoteldescription"];
                            var otherDes = ["rooms", "location", "restaurant", "pleasenote", "location detail", "locationdescription"];
                            if (value.LongDescription != null && value.LongDescription.length > 0) {
                                var des = value.LongDescription.split('?/');

                                if (des.length > 0) {
                                    viewDetailsTab = "<tr>";

                                    for (i = 0; i < des.length; i++) {
                                        // loading general description.
                                        if (des[i] != '' && $.inArray(des[i].split('=')[0].toLowerCase(), generalDes) >= 0) {
                                            viewDetailsTab += "<td>" + "<span>" + des[i].split('=')[1] + "</span>" + "</td>" + "<br/>";
                                        }
                                        else // loading extra information.
                                        {
                                            if (des[i] != '' && $.inArray(des[i].split('=')[0].toLowerCase(), otherDes) >= 0) {
                                                otherInfo += "<td>" + "<strong>" + des[i].split('=')[0] + "</strong>" + "</td>" + ":" +
                                                                   "<td>" + "<span>" + des[i].split('=')[1] + "<span>" + "</td>" + "<br/>";
                                            }
                                        }
                                    }
                                }
                                if (viewDetailsTab != "") {
                                    viewDetailsTab += "</tr>";
                                    if (otherInfo != "<tr>" + "Additional Info") {
                                        otherInfo += "</tr>";
                                        viewDetailsTab += otherInfo;
                                    }
                                }
                            }
                            var imageGallery = "";
                            if (value.ImageGallery != null && value.ImageGallery.length > 0) {
                                imageGallery = "<tr>";
                                for (i = 0; i < value.ImageGallery.length; i++) {

                                    var row = "<td>" + "<div class='rze-galimg'>" + "<div class='rze-galimglbl hide'>" + value.ImageGallery[i].Description + "</div>" + "<img src='" + value.ImageGallery[i].URL + "' title='" + value.ImageGallery[i].Description + "' class='img-responsive'>" + "</img>" + "</div>" + "</td>";
                                    imageGallery += row;
                                }
                            }
                            if (imageGallery != '')
                                imageGallery += "</tr>";
                            if (viewDetailsTab == '')
                                viewDetailsTab = "No details to show";
                            if (imageGallery == '')
                                imageGallery = "No images to show";


                            var CheckIn = new Date(value.CheckInDate);
                            var CheckIndate = CheckIn.getDate();
                            var CheckInmonth = CheckIn.getMonth() + 1; //Months are zero based
                            var CheckInyear = CheckIn.getFullYear();
                            var CheckInDate = CheckIndate + "/" + CheckInmonth + "/" + CheckInyear;

                            var CheckOut = new Date(value.CheckOutDate);
                            var CheckOutdate = CheckOut.getDate();
                            var CheckOutmonth = CheckOut.getMonth() + 1; //Months are zero based
                            var CheckOutyear = CheckOut.getFullYear();
                            var CheckOutDate = CheckOutdate + "/" + CheckOutmonth + "/" + CheckOutyear;

                            var clonecont = $("#HotelResult" + HotelId).html();
                            clonecont = clonecont.replace("Img", 'Img' + HotelId);
                            clonecont = clonecont.replace("divHotelName", 'divHotelName' + HotelId);
                            clonecont = clonecont.replace("divOOP", 'divOOP' + HotelId);
                            clonecont = clonecont.replace("divCheckInDate", 'divCheckInDate' + HotelId);
                            clonecont = clonecont.replace("divCheckOutDate", 'divCheckOutDate' + HotelId);
                            clonecont = clonecont.replace("divSellPrice", 'divSellPrice' + HotelId);
                            clonecont = clonecont.replace("divChangePriceHotelDiff", 'divChangePriceHotelDiff_' + HotelId);
                            clonecont = clonecont.replace("#ChangePriceHotelDiff#", value.Notes);
                            clonecont = clonecont.replace("RoomName", 'RoomName' + HotelId);
                            clonecont = clonecont.replace("star", 'star' + value.StarRating);
                            clonecont = clonecont.replace("divhotelPreferredOrBookNow_", 'divhotelPreferredOrBookNow_' + HotelId);
                            clonecont = clonecont.replace("TravelRequestItineraryHotelID_", 'TravelRequestItineraryHotelID_' + HotelId);
                            clonecont = clonecont.replace(/Viewdetails_/g, 'Viewdetails_' + HotelId);
                            clonecont = clonecont.replace(/gallery_/g, 'gallery_' + HotelId);
                            clonecont = clonecont.replace("Viewdetailslbl", 'Viewdetailslbl' + HotelId);
                            clonecont = clonecont.replace("gallerylbl", 'gallerylbl' + HotelId);


                            $("#" + $HotelSearchResults).append(clonecont);
                            if (value.Notes != null) {
                                $("#divChangePriceHotelDiff_" + HotelId).removeAttr("style");
                            }
                            else {
                                $("#divChangePriceHotelDiff_" + HotelId).hide();
                            }

                            $("#Img" + HotelId).attr("src", value.DefaultImg);
                            $("#divHotelName" + HotelId).html(value.HotelName);
                            if (value.OutOfPolicyText != undefined && value.OutOfPolicyText != '') {
                                var policyElement = $("#divOOP" + HotelId + " span");
                                policyElement.html(value.OutOfPolicyText);
                            }
                            else {
                                $("#divOOP" + HotelId).hide();
                            }
                            //policyElement.replace("#PolicyText#",value.OutOfPolicyText);
                            $("#divCheckInDate" + HotelId).html(CheckInDate);
                            $("#divCheckOutDate" + HotelId).html(CheckOutDate);
                            var perPersonHotelRoomPrice = value.PricePerPerson;
                            $("#divSellPrice" + HotelId).html("IDR " + perPersonHotelRoomPrice.toLocaleString(sessionStorage.CultureTypeInfo) + "");
                            $(".star" + response.StarRating).html(value.StarRating);
                            $("#RoomName" + HotelId).html(value.HotelRoom[0].RoomTypeName);
                            $("#TravelRequestItineraryHotelID_" + HotelId).val(HotelId);
                            $("#Viewdetailslbl" + HotelId).text("Viewdetails");
                            $("#gallerylbl" + HotelId).text("Photo Gallery");
                            $("#Viewdetails_" + HotelId).html(viewDetailsTab);
                            $("#gallery_" + HotelId).html(imageGallery);
                            $("#HotelResult" + HotelId).attr('id', "HotelResult");

                            //// Setting Button for Hotel Based on Status and Action Of TR.  - START
                            //var DisplayButton = true;
                            if (value.IsPreferred == true) {
                                $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<Label id='book_" + HotelId + "' name='book_" + HotelId + "'><span class='btn btn-info'>Selected</span></label>");
                            }
                            if (response.Status == 6 && $('#SubmittedTravelRequestAction').text() != "Not Required") {
                                if (value.IsApproved) {
                                    previousApproverSelectedHotelId = HotelId;
                                    SetFirstApproverSelectedHotel(HotelId);
                                    $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label id='lblSelectHotelbtn_" + HotelId + "' class='selectedHotelwarp'><div class='btn btn-success selectedHotel'>Proceed to Approve<input class='hide' type='radio' id='" + HotelId + "' name='hotel' onClick='HotelBtnClick(" + HotelId + ")'></div></label><ul class='hide'><li class='btn-cont'><a id='radioPopOver_" + HotelId + "' onClick='HotelBtnClick(" + HotelId + ")' class='btn btn-success'>Proceed to Approve</a> </li></ul></div>");
                                    $('#ApprovedHotelIdHdn').val(HotelId);
                                }
                                else {
                                    $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label id='lblSelectHotelbtn_" + HotelId + "' class='selectedHotelwarp'><div class='btn btn-primary'>Proceed to Approve<input class='hide' type='radio' id='" + HotelId + "' name='hotel' onClick='HotelBtnClick(" + HotelId + ")'></div></label><ul class='hide'><li class='btn-cont'><a id='radioPopOver_" + HotelId + "' onClick='HotelBtnClick(" + HotelId + ")' class='btn btn-success'>Proceed to Approve</a> </li></ul></div>");
                                }
                            }
                            else if (response.Status > 6 && $('#SubmittedTravelRequestAction').text() != "Not Required") {
                                if ($('#SubmittedTravelRequestAction').text().toLowerCase() != "complete checkout") {
                                    if (value.IsApproved) {
                                        previousApproverSelectedHotelId = HotelId;
                                        $('#ApprovedHotelIdHdn').val(HotelId);
                                        SetFirstApproverSelectedHotel(HotelId);

                                        if (response.Status == 8) {
                                            $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label  disabled='disabled'class='btn btn-success selectedHotel'>Approved<input class='hide' type='radio' id='" + HotelId + "' name='hotel' disabled='disabled' checked='checked' value='Approved'></label></div>");
                                        }
                                        else if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                                            if (ItineraryStatus == 7) {
                                                $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label  disabled='disabled'class='btn btn-success selectedHotel'>Approved<input class='hide' type='radio' id='" + HotelId + "' name='hotel' disabled='disabled' checked='checked' value='Approved'></label></div>");
                                            }
                                        }
                                        else {
                                            if (response.Status < 8) {
                                                $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label id='lblSelectHotelbtn_" + HotelId + "' class='btn btn-success selectedHotel'>Proceed to Approve<input class='hide' type='radio' id='" + HotelId + "' name='hotel' checked='checked' onClick='HotelBtnClick(" + HotelId + ")'></label><ul class='hide'><li class='btn-cont'><a id='radioPopOver_" + HotelId + "' onClick='HotelBtnClick(" + HotelId + ")' class='btn btn-success'>Proceed to Approve</a></li></ul></div>");
                                            }
                                            //else {
                                            //    $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label  disabled='disabled'class='btn btn-success selectedHotel'>Approved<input class='hide' type='radio' id='" + HotelId + "' name='hotel' disabled='disabled' checked='checked' value='Approved'></label></div>");
                                            //}
                                        }
                                    }
                                    else {
                                        if (response.Status == 8) {
                                            $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<Label id='book_" + HotelId + "' name='book_" + HotelId + "'></label");
                                        }
                                        else if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                                            if (ItineraryStatus == 7) {
                                                $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<Label id='book_" + HotelId + "' name='book_" + HotelId + "'></label");
                                            }
                                        }
                                        else {
                                            if (response.Status < 8) {
                                                $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label id='lblSelectHotelbtn_" + HotelId + "' class='btn btn-primary'>Proceed to approve<input class='hide' type='radio' id='" + HotelId + "' name='hotel' onClick='HotelBtnClick(" + HotelId + ")'></label><ul class='hide'><li class='btn-cont'><a id='radioPopOver_" + HotelId + "' onClick='HotelBtnClick(" + HotelId + ")' class='btn btn-success'>Proceed to Approve</a></li></ul></div>");
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                if (response.Status == 5 && value.IsPreferred == false)
                                    $("#divhotelPreferredOrBookNow_" + HotelId + "").append('<a class="rze-delhotel">' + '<i onclick="DeleteHotel(\'' + value.TravelRequestItineraryHotelId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');

                                else if ($('#SubmittedTravelRequestAction').text() == "Not Required" && response.Status > 6) {
                                    if (value.IsApproved)
                                        $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<div class='radio rze-deselect'><ul><li> <label  disabled='disabled'class='btn btn-success selectedHotel'>Approved<input class='hide' type='radio' id='" + HotelId + "' name='hotel' disabled='disabled' checked='checked' value='Approved'></label></div>");
                                    else {
                                        $("#divhotelPreferredOrBookNow_" + HotelId + "").append("<Label id='book_" + HotelId + "' name='book_" + HotelId + "'></label>");
                                    }
                                }
                            }
                            // Setting Button for Hotel Based on Status and Action Of TR.  - END

                        });

                        StarRating();
                        $('#' + $HotelElement).append($('#' + $HotelSearchResults).html());
                        if ($('#HotelSearchResults').hasClass('hidden'))
                            $('#HotelSearchResults').empty();
                        if ($('#HotelSearchResults_New').hasClass('hidden'))
                            $('#HotelSearchResults_New').empty();
                        if ($('#HotelSearchResults_Rej').hasClass('hidden'))
                            $('#HotelSearchResults_Rej').empty();
                    }
                    if ($HotelElement != 'rejectedHotelItineraryContent') {
                        if ($('#SubmittedTravelRequestAction').text().toLowerCase().indexOf("approve") >= 0) {

                            if (response.Status >= 6 && response.Status <= 7) {
                                $("#" + $HotelElement).append('<div id="ItineraryApproverComments" class="rze-borbot"><h4> Itinerary Review </h4><div class="row"><div class="form-group col-sm-6 col-md-6 "><textarea class="form-control" rows="5" id="HotelItineraryApproverCommentstext" onclick="ClearCommentsMessage()" name="HotelItineraryApproverCommentstext" placeholder="Your comments here (not beyond 300 characters)"></textarea><label id="lblItineraryApproverCommentstext1" class="error"></label></div></div></div>');
                                $("#" + $HotelElement).append('<div id="HotelItinerarybtn" class="rze-borbot text-right rze-viewreqbtns"></div>');
                                $("#HotelItinerarybtn").append('<input type="button" class="btn btn-primary" id="HotelReject" value="Reject" onclick="HotelItineraryReject()" />');
                                $("#HotelItinerarybtn").append('&nbsp; &nbsp;');
                                $("#HotelItinerarybtn").append('<input type="hidden" id="IsHotelItineraryApproved" name="IsHotelItineraryApproved" value="false" />');
                            }
                        }
                    }
                    $('#HotelItineraryApproverCommentstext').val(ApproverItineraryComments);

                    /*hotel tab*/
                    $(".rze-tabcontainer").hide();
                    //$(".rze-prdcontwrap").empty();
                    $("#rze-prdnav a").click(function () {
                        $(".rze-tabcontainer").hide();
                        $("#rze-prdnav a").removeClass("selected")

                        $(this).addClass("selected")
                        var tabid = $(this).attr("data-tabid");
                        console.log(tabid);
                        $(tabid).show();
                    });

                    $(".rze-gallery .rze-galimg img").click(function () {

                        $(".overlaynew").remove();
                        $("body").append("<div class='overlaynew'></div>");
                        var newimgurl = $(this).attr("src");
                        var newimgtitle = $(this).attr("title");
                        $("body").append("<div class='rze-newzoomimage'><div class='rze-newzoomimageinn'><div><h4>" + newimgtitle + "</h4></div><img src=" + newimgurl + "></img> </div></div>");
                        $(".rze-newzoomimageinn").append("<div id='imgclose'>X close</div>");
                        console.log(newimgurl);
                        closeimg()
                    });
                    function closeimg() {
                        $("#imgclose").click(function () {
                            $("body .overlaynew").remove();
                            $("body .rze-newzoomimage").remove();
                        });
                    }
                    selectedHotel();
                    $("#divhotelPreferredOrBookNow_" + previousApproverSelectedHotelId + " .selectedHotel").addClass("selected");
                    ApplyApproverComments();
                }
                else {
                    alertmsg('Some Error Occur in Getting Hotel Itinerary Details. Please try again after some time.');
                }

                $('[data-toggle="tooltip"]').tooltip();
                $.unblockUI();
            }, function (XMLHttpRequest, textStatus, errorThrown) { },
            "json"
            );
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ViewHotelItinerary()-->" + error);
    }
}

function DeSelectHotel(hotelId) {
    try {
        $('#' + hotelId).parent().removeClass().addClass("btn btn-success selectedHotel");
        $('.btn btn-success selectedHotel deselect').remove();
        $('#' + hotelId).removeAttr('checked');
        return false;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js DeSelectHotel()-->" + error);
    }
}

function ApplyApproverComments() {
    try {
        if (ApproverItineraryComments != '') {
            $('#FlightItineraryApproverCommentstext').val(ApproverItineraryComments);
            $('#HotelItineraryApproverCommentstext').val(ApproverItineraryComments);
            $('#ItineraryApproverCommentstext').val(ApproverItineraryComments);
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js ApplyApproverComments()-->" + error);
    }
}

function DeleteHotel(HotelID) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/HotelItinerary/DeleteHotel/" + RequestNo + "/" + HotelID,
           "POST",
       null,
       function (response) {
           if (response != null) {
               if (response == true) {
                   CheckItineraryExists('N');
                   //if ($("#SubmittedTravelRequestCreateItinerary").text().trim() != "Create Itinerary") {
                   //    var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + RequestNo + '\')">Create Itinerary </a>'
                   //    $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                   //}
                   if ($('#IsHotelReSubmittedHdn').val() == 'true') {
                       ViewHotelItinerary(5);
                   }
                   else
                       ViewHotelItinerary(0);
               }
           }
           else {
               alertmsg('Some Error Occur in Deleting Individual Hotel Itinerary Details. Please try again after some time.');
           }
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js DeleteHotel()-->" + error);
    }
}

function DeleteHotelItinerary(HotelItineraryID) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/HotelItinerary/DeleteHotelItinerary/" + RequestNo + "/" + HotelItineraryID,
           "POST",
       null,
       function (response) {
           if (response != null) {
               if (response == true) {
                   window.location.href = "TravelRequestDetail?RequestNo=" + RequestNo;
               }
           }
           else {
               alertmsg('Some Error Occur in Deleting Complete Hotel Itinerary Details. Please try again after some time.');
           }
           $.unblockUI();
       }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js DeleteHotelItinerary()-->" + error);
    }
}

function GoBackToRequest() {
    try {
        $('#liTravelRequest').removeClass().addClass("active");
        $('#FlightItineraryTab').removeClass();
        $('#HotelItineraryTab').removeClass();
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#HotelItineraryMain').attr('class', 'tab-pane fade rze-hotelcontwrap col-md-12');
        $('#tr-view').attr('class', 'tab-pane fade active in');
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GoBackToRequest()-->" + error);
    }
}

function CheckHotel() {
    try {
        $('#FlightItineraryTab').removeClass();
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#HotelItineraryTab').removeClass().addClass("active");
        $('#HotelItineraryMain').addClass("active in rze-hpadding");
        if ($('#IsHotelReSubmittedHdn').val() == 'true') {
            ViewReSubmitItinerary('H');
        }
        else {
            ViewHotelItinerary(0);
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js CheckHotel()-->" + error);
    }
}

//To get the Hotel Information in the Checkout Page
function HotelInformation() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var RequestNo = getUrlVars()["RequestNo"];
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "CheckoutItinerary/Checkout/ViewHotelInfo/" + RequestNo,
            "POST",
        null,
        function (response) {
            if (response != null) {
                //Checks whether the Hotelbody is empty or not
                if (!$("#Hotelbody").is(":empty")) {
                    $("#Hotelbody").empty();
                }
                //Iterating through each hotel in the response
                $.each(response.ItineraryHotels, function (key, hotel) {
                    HotelId = hotel.TravelRequestItineraryHotelId;
                    //Converting the Check In Date in required format
                    var CheckIn = new Date(hotel.CheckInDate);
                    var CheckIndate = CheckIn.getDate();
                    var CheckInmonth = CheckIn.getMonth() + 1; //Months are zero based
                    var CheckInyear = CheckIn.getFullYear();
                    var CheckInDate = CheckIndate + "/" + CheckInmonth + "/" + CheckInyear;
                    //Converting the Check Out Date in required format
                    var CheckOut = new Date(hotel.CheckOutDate);
                    var CheckOutdate = CheckOut.getDate();
                    var CheckOutmonth = CheckOut.getMonth() + 1; //Months are zero based
                    var CheckOutyear = CheckOut.getFullYear();
                    var CheckOutDate = CheckOutdate + "/" + CheckOutmonth + "/" + CheckOutyear;

                    //Appending the required content to the Hotelbody
                    $("#Hotelbody").append("<div id='divCheckoutHotelResult_" + HotelId + "' class='rze-chkoutcont'></div>");
                    $("#divCheckoutHotelResult_" + HotelId).append("<div class='rze-prdcontwrap' id='hotelContWrap'></div>");
                    $("#hotelContWrap").append("<div class='col-xs-12 rze-prdcont row_main' id='hotelCont'></div>");
                    $("#hotelCont").append("<div class='col-md-2 rze-prdimg HotelImage'><img id='Img_" + HotelId + "' src='" + hotel.DefaultImg + "' class='img-responsive'></div>");
                    $("#hotelCont").append("<div class='col-md-10'><div class='row' id='hoteldetails'></div></div>");
                    $("#hoteldetails").append("<div class='col-md-7'><div class='row' id='hoteldesc'></div></div>");
                    $("#hoteldesc").append("<div class='col-md-7 rze-prdtittle' id='divHotelName_" + HotelId + "'>" + hotel.HotelName + "</div>");
                    $("#hoteldesc").append("<div id='divOOPolicy_" + HotelId + "'></div>");
                    if (hotel.OutOfPolicyText != undefined && hotel.OutOfPolicyText != '') {
                        $("#divOOPolicy_" + HotelId + "").append("<div class='rze-pollabel' style='display:inline'><a href='javascript:return void(0)' class='show'>Out of Policy</a><span style='text-align:left' class='tooltip'>" + hotel.OutOfPolicyText + "</span></div>");
                    }
                    $("#hoteldesc").append("<div class='col-md-5 text-center'><span class='star" + hotel.StarRating + "'>" + hotel.StarRating + "</span></div>");
                    $("#hoteldesc").append("<div class='col-md-8 rze-hotelcin'><div class='date_l' id='checkInDate_" + HotelId + "'>" + CheckInDate + "</div> <div class='date_r' id='checkOutDate_" + HotelId + "'>" + CheckOutDate + "</div></div>");
                    if (hotel.Notes != null) {
                        $("#hoteldetails").append("<div class='col-md-5 nopadding'><div class='rze-pricingcont row' id='priceContent'><div class='rze-price col-xs-12 col-sm-6 col-md-6'><div class='rze-priceval col-xs-12 col-md-8' id='priceDetails" + HotelId + "'><h3 id='hotelPrice" + HotelId + "'></h3><a id='divChangePriceDiff' href='#' data-toggle='tooltip' data-placement='bottom' title='" + hotel.Notes + "'><i class='fa fa-info-circle'></i></a></div></div></div></div>");
                    }
                    else {
                        $("#hoteldetails").append("<div class='col-md-5 nopadding'><div class='rze-pricingcont row' id='priceContent'><div class='rze-price col-xs-12 col-sm-6 col-md-6'><div class='rze-priceval col-xs-12 col-md-8' id='priceDetails" + HotelId + "'><h3 id='hotelPrice" + HotelId + "'></h3></div></div></div></div>");
                    }

                    var hotelPricePerPerson = hotel.PricePerPerson;
                    $("#hotelPrice" + HotelId).html("IDR " + hotelPricePerPerson.toLocaleString(sessionStorage.CultureTypeInfo));
                    $("#priceDetails" + HotelId).append("<span data-original-title='' title='' id='personPerNight'></span>");
                    $("#priceContent").append("<div class='rze-selectchk col-xs-12 col-sm-4 col-md-4'><div id='hotelPreferredOrBookNow_" + HotelId + "' class='text-center'><div id='hotelPreferredOrBookNow_" + HotelId + "' class='rze-righteletfirst xs-nofloat'><span class='btn btn-info'>Selected</span></div></div></div>");
                    $("#personPerNight").html("Per person /per Night");



                    $('#Hotelbody').show();
                });
                StarRating();
            }
            else {
                alertmsg('Some Error Occur in Getting Checkout Hotel Itinerary Details. Please try again after some time.');
            }

            $('[data-toggle="tooltip"]').tooltip();
            $.unblockUI();
        }, function (XMLHttpRequest, textStatus, errorThrown) { }, null
      )
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js HotelInformation()-->" + error);
    }
};

//To Convert the Star Rating obtained from response to corresponding stars
function StarRating() {
    $(".starnull").html('<span>without a star</span>');
    //$(".starnull").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star50").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span>');
    $(".star40").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star30").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star20").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star10").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');

    $(".star45").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-half-o"></i></span>');
    $(".star35").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-half-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star25").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-half-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star15").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star-half-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".star05").html('<span><i class="fa fa-star-half-o"></i> </span><span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
    $(".starUnrated").html('<span>without a star</span>');
}

function HighlightItineraryTab() {
    try {
        var unBlock = 'Y';
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if ($("#FlightItineraryTab").css('display') != 'none') {
            unBlock = 'N';
            $("#liTravelRequest").removeClass();
            $("#FlightItineraryTab").addClass("active");
            $("#HotelItineraryTab").removeClass();

            $('#FlightItineraryMain').attr('class', 'tab-pane fade in active');
            $('#tr-view').attr('class', 'tab-pane fade');
            $('#HotelItineraryMain').attr('class', 'tab-pane fade');

            ViewFlightItinerary(0);
        }
        else {
            if ($("#HotelItineraryTab").css('display') != 'none') {
                unBlock = 'N';
                $("#liTravelRequest").removeClass();
                $("#FlightItineraryTab").removeClass();
                $("#HotelItineraryTab").addClass("active");

                $('#FlightItineraryMain').attr('class', 'tab-pane fade');
                $('#tr-view').attr('class', 'tab-pane fade');
                $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');

                ViewHotelItinerary(0);
            }
        }
        if (unBlock == 'Y')
            $.unblockUI();
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js HighlightItineraryTab()-->" + error);
    }
}

// Request booking by the corporate employee.
function RequestBooking() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var travelRequestId = $("#SubmittedTravelRequestNo").html();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Booking/CreateRequest/" + travelRequestId,
        "POST",
        null,
        function (response) {
            if (response != null) {
                bootbox.alert({
                    title: "Alert",
                    message: response.Message,
                    size: 'small',
                    callback: function () {
                        window.location.href = "TravelRequestDetail?RequestNo=" + $("#SubmittedTravelRequestNo").html();
                    }
                })
            }
            else {
                alertmsg('Some Error Occur in Creating Booking. Please try again after some time.');
            }
            $.unblockUI();
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js RequestBooking()-->" + error);
    }
}

function selectedFlight() {
    try {
        $(".rze-flightContainer .selectedFlight").click(function () {
            $(".rze-flightContainer .selectedFlight").removeClass("selected");
            $(this).addClass("selected");
        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js selectedFlight()-->" + error);
    }
}

function selectedHotel() {
    try {
        $("#HotelItineraryMain .selectedHotel").click(function () {
            $("#HotelItineraryMain .selectedHotel").removeClass("selected");
            $(this).addClass("selected");
        });
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js selectedHotel()-->" + error);
    }
}

function EmployeeNameValidation(e) {
    try {
        var key = e.keyCode;
        if (key >= 48 && key <= 57) {
            e.preventDefault();
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js EmployeeNameValidation()-->" + error);
    }
}

function AgeValidation() {
    try {
        var passengerCount = $("#TotalTravellers").val();
        var anyError = false;
        for (var count = 0; count < passengerCount; count++) {
            var employeeId = $("#EmployeeId" + count).val();
            var serverCurrentDate = $("#CurrentDate" + count).val();
            var Birthdate = $("#DateOfBirth" + employeeId).val()
            var dateOfBirth = new Date(Birthdate);
            var today = new Date(serverCurrentDate);
            var age = Math.floor((today - dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 18) {
                anyError = anyError || true;
                $("#ErrorMessageDateOfBirth" + employeeId).html('Age should be above 18 years');
            }
            else {
                anyError = anyError || false;
                $("#ErrorMessageDateOfBirth" + employeeId).html('');
            }
        }
        return anyError;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js AgeValidation()-->" + error);

    }
}

function PassportNumberValidation() {
    try {
        var passengerCount = $("#TotalTravellers").val();
        var anyError = false;
        for (var count = 0; count < passengerCount; count++) {
            var employeeId = $("#EmployeeId" + count).val();
            var PassportNo = $("#PassportNo" + employeeId).val();
            if (PassportNo.length > 15) {
                anyError = anyError || true;
                $('#ErrorMessagePassportNo' + employeeId).html('Max upto 15 characters only');
            }
            else {
                anyError = anyError || false;
                $('#ErrorMessagePassportNo' + employeeId).html('');
            }
        }
        return anyError;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js PassportNumberValidation()-->" + error);
    }
}

function FindUserInfo() {
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
                    if (response.approver == false) {
                        $('#MyAssociate').css('display', 'none');
                        $('#Associate').attr('class', 'hide');
                        $('#Admin').attr('class', 'hide');
                        $('#IsAdmin').val(false);
                    }
                    else {
                        $('#Associate').attr('class', 'tab-pane fade');
                        $('#Admin').attr('class', 'hide');
                        $('#IsAdmin').val(false);
                        if (getUrlVars().hasOwnProperty("ApprViewAll")) {
                            // enable approver tab;
                            $('#MyRequest').removeClass("active");
                            $('#home').attr('class', 'tab-pane fade');
                            $('#MyAssociate').addClass("active");
                            $('#Associates').attr('class', 'tab-pane fade in active');
                        }
                    }
                }
                else {
                    $("#myProfile_headerBD").remove();
                    $("#myProfile_headerSD").remove();
                    $("#tmcProfile_headerBD").css("display", "");
                    $("#tmcProfile_headerSD").css("display", "");
                    $('#MyAssociate').css('display', 'none');
                    $('#Associate').attr('class', 'hide');
                    $('#MyRequestTab').attr('class', 'hide');
                    $('#menu1').attr('class', 'hide');
                    $('#home').attr('class', 'hide');
                    $('#IsAdmin').val(true);
                }
            }
            else {
                alertmsg('Some Error Occur in Getting Logged In User Details. Please try again after some time.');
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js FindUserInfo()-->" + error);
    }
}

// Submit request.
function SubmitTravelRequest() {

    try {
        $("#lblMessage").html('');
        var model = new Object();
        if ($("#TravelRequestNo").text() == "") {
            return false;
        }
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        //SaveTravelRequest();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/TravelRequest/Submit/" + $("#TravelRequestNo").text() + "/" + $("#hdnGrade1").val(),
        "GET",
        $.postifyData(model),
        function (response) {
            if (response != null) {
                if (response != "") {

                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("class", "alert alert-success");
                    $(window).scrollTop(0);
                    if (response.indexOf('Approved') > 0) {
                        LoadTravelRequest($("#TravelRequestNo").text(), 'TR-Draft');
                        $("#lblMessage").html('Travel request approved.');
                        $("#TravelRequestStatus").html(response);
                    }
                    else if (response.indexOf('submitted') > 0) {
                        $("#lblMessage").html('Travel request submitted.');
                        $("#TravelRequestStatus").html("Travel Request Review");
                        $("#TravelRequestAction").html("Not Required");
                    }
                    $("#btnSubmit").attr("disabled", "disabled");
                    $("#btnSave").attr("disabled", "disabled");

                    if (sessionStorage.SavedTR != undefined) {
                        var MatchFound = '';
                        var id = '';
                        var reqNo = '';
                        if ($("#myTab li").hasClass("active")) {
                            $("#myTab li.active").each(function () {
                                var ReqNumber = $(this).attr('id').split("_")[1];
                                var RequestType = $(this).attr('id').split("_")[2];
                                if (RequestType.indexOf("Travel Request Draft") == 0) {
                                    SavedTR = $.parseJSON(sessionStorage.SavedTR);
                                    if (SavedTR != '') {
                                        $.each(SavedTR, function (key, value) {
                                            var savedKey = key.split("//")[0];
                                            MatchFound = savedKey.indexOf(ReqNumber);
                                            if (MatchFound == 0) {
                                                var tripName = $("#TravelRequestName").val();
                                                delete SavedTR[key];
                                                key = ReqNumber + '//self';
                                                SavedTR[key] = tripName;
                                                id = "element_" + ReqNumber + "_self";
                                                reqNo = ReqNumber;
                                            }
                                        });
                                    }
                                    sessionStorage.SavedTR = JSON.stringify(SavedTR);
                                }
                            });
                        }
                    }
                    if ($("#myTab .active").attr('id') == 'element_' + reqNo + '_Travel Request Draft') {
                        $("#myTab li.active").each(function () {
                            $(this).attr('id', id);
                            var value = $("#TravelRequestName").val();
                            var content = '<a>TR' + reqNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(event,\'' + reqNo + '\',\'self\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            $(this).empty();
                            $(this).append(content);
                        });
                    }

                    $('#addMoreTraveller').css("display", "none");
                    $('#SavedTravelRequest [id^="closeTraveller"]').css("display", "none");
                    $('#SavedTravelRequest [id^="SearchTraveller"]').attr('onclick', 'return false');
                    $("#SavedTravelRequest input").prop("disabled", true);
                    $("#SavedTravelRequest select").prop("disabled", true);
                    $("#SavedTravelRequest textarea").prop("disabled", true);

                    $('#attachmentUploadForm').find('.fileupload-buttonbar').hide();
                    $('#attachmentUploadForm').find('.deleteItem').hide();
                    $.unblockUI();
                    $(window).scrollTop(0);

                }
                else {
                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("class", "alert alert-danger");
                    $("#lblMessage").html('Failed submitting travel request.');
                    $.unblockUI();
                    $(window).scrollTop(0);
                }
            }
            else {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-danger");
                $("#lblMessage").html('Failed submitting travel request.');
                $.unblockUI();
                $(window).scrollTop(0);
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        }
        );
        $(window).scrollTop(0);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SubmitTravelRequest()-->" + error);
    }
}

// The travellers.
function LoadTravellers(row) {
    try {
        var count = parseInt($("#hdnTravellerTypeCount").val());
        var secondTime = false;
        var ids = '';
        for (var i = 1; i <= count; i++) {
            if ($("#hdnEmployeeId" + i).val() != '' && $("#hdnEmployeeId" + i).val() != undefined) {
                if (secondTime == false)
                    ids = $("#hdnEmployeeId" + i).val();
                else
                    ids = ids + ',' + $("#hdnEmployeeId" + i).val();
                secondTime = true;
            }
        }
        $("#SearchEmployeeCode").focus();
        var url = '';
        $("#modelGrid").html('');
        if (row == 1) {
            if ($("#hdnEmployeeId1").val() == "") {
                url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers";
            }
            else {
                url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val();
            }
        }
        else {
            // projectid, employeeid, garderid, countryid.
            //url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val() + "/" + $("#hdnGrade1").val() + "/" + $("#hdnFirstLevelApproverID").val() + "/" + $("#hdnSecondLevelApproverID").val() + "/" + $("#hdnThirdLevelApproverID").val() + "/" + $("#hdntravellerIds").val();
            url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val() + "/" + $("#hdnGrade1").val() + "/" + $("#hdnFirstLevelApproverID").val() + "/" + $("#hdnSecondLevelApproverID").val() + "/" + $("#hdnThirdLevelApproverID").val() + "/" + ids;
        }

        GetAutoCompleteTraveller(url, row);
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js LoadTravellers()-->" + error);
    }
}

// Call api to get travellers.
function GetAutoCompleteTraveller(url, row) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            url,
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                var value = row;
                var LoggedInUser = '';
                if ($('#IsEditFlow').val() == "false") {
                    // should not when edit flow
                    if (row != 1) {
                        var clonecont = $("#rza_addemp-clone").html();
                        clonecont = clonecont.replace("rza_addemp - clone", "rza_addemp - clone" + value);
                        clonecont = clonecont.replace("rza-empremove", "rza-empremove" + value);
                        clonecont = clonecont.replace(new RegExp("lblTravellerName", "ig"), "lblTravellerName" + value);
                        clonecont = clonecont.replace(new RegExp("textTravellerName", "ig"), "textTravellerName" + value);
                        clonecont = clonecont.replace(new RegExp("AutoTravellerName", "ig"), "AutoTravellerName" + value);
                        clonecont = clonecont.replace(new RegExp("hdnGrade", "ig"), "hdnGrade" + value);
                        clonecont = clonecont.replace(new RegExp("hdnEmployeeId", "ig"), "hdnEmployeeId" + value);
                        clonecont = clonecont.replace(new RegExp("SearchTraveller", "ig"), "SearchTraveller" + value);
                        clonecont = clonecont.replace("DeleteTravellers();", "DeleteTravellers(" + value + ");");
                        clonecont = clonecont.replace(new RegExp("closeTraveller", "ig"), "closeTraveller" + value);
                        clonecont = clonecont.replace("ShowModel();", "ShowModel(" + value + ");");
                        clonecont = clonecont.replace("ShowTraveller();", "ShowTraveller(" + value + ");");
                        clonecont = clonecont.replace(new RegExp("lbltxtTravellerName", "ig"), "lbltxtTravellerName" + value);
                        $("#rza_addemp-clonecont").append(clonecont);
                    }
                }
                for (count in response) {
                    if (row == 1 && $('#IsEditFlow').val() == "false") {
                        if (response[count].EmployeeName.indexOf("_Myself") != -1) {
                            LoggedInUser = count;
                            response[count].EmployeeName = response[count].EmployeeName.split('_')[0];
                            $('#IsDefaultTravellerLoaded').val('false');
                        }
                    }
                    response[count].id = response[count].CorporateGradeID + "," + response[count].EmployeeId + ",'" + response[count].EmployeeName + "'," + response[count].FirstLevelApproverID + "," + response[count].SecondLevelApproverID + "," + response[count].ThirdLevelApproverID;
                    response[count].value = response[count].EmployeeName + "-" + response[count].EmployeeCode;
                }
                if (LoggedInUser != '') {
                    $("#AutoTravellerName" + row).val(response[LoggedInUser].EmployeeName.split('_')[0] + ' - ' + response[LoggedInUser].EmployeeCode);
                    $("#hdnTravellerId").val(row);
                    $("#hdnTravellerTypeCount").val(row);
                    SelectFunction(response[LoggedInUser].id.split(',')[0], response[LoggedInUser].id.split(',')[1], response[LoggedInUser].id.split(',')[2], response[LoggedInUser].id.split(',')[3], response[LoggedInUser].id.split(',')[4], response[LoggedInUser].id.split(',')[5]);
                }
                else {
                    if ($("#AutoTravellerName" + row).val() != '' && $('#IsEditFlow').val() == "false") {
                        $("#AutoTravellerName" + row).val('');
                        $("#hdnEmployeeId" + row).val('');
                        $("#hdnGrade" + row).val('');
                    }
                }
                $("#AutoTravellerName" + row).autocomplete({
                    source: response,
                    select: function (event, ui) {
                        if (ui.item === null) {
                            $(this).val('');
                            $('#lbltxtTravellerName' + row).html('Please search valid traveller');
                        }
                        else {
                            $("#hdnTravellerId").val(row);
                            $("#hdnTravellerTypeCount").val(row);
                            SelectFunction(ui.item.id.split(',')[0], ui.item.id.split(',')[1], ui.item.id.split(',')[2], ui.item.id.split(',')[3], ui.item.id.split(',')[4], ui.item.id.split(',')[5]);
                            $("#AutoTravellerName" + row).val(ui.item.value);
                            $('#IsDefaultTravellerLoaded').val('true');
                            $('#lbltxtTravellerName' + row).html('');
                            $.unblockUI();
                            return false;
                        }
                    },
                    change: function (event, ui) {
                        if (ui.item === null) {
                            $(this).val('');
                            $('#lbltxtTravellerName' + row).html('Please search valid traveller');
                        }
                    }
                });
                $.unblockUI();
            }
            else {
                if ($('#IsEditFlow').val() == "false") {
                    DeleteTravellers(row);
                    $('#lblTravellerError').html('No more travellers are available');
                    $("#AutoTravellerName" + row).val('');
                }
                $.unblockUI();
            }
            $.unblockUI();
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            alertmsg("GetTraveller");
            console.log(XMLHttpRequest);
        },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js GetAutoCompleteTraveller()-->" + error);
    }
}

function SetProceedtoCheckout(response) {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "CheckoutItinerary/Checkout/IsSelfBookingEnabledForCorporate/" + response.CorporateId,
            "POST",
        null,
        function (result) {
            if ((response.UserRole == "TMCUser" || response.UserRole == "TMCAdmin") && !result) {
                $('#btnViewCheckout').css("display", "inline-block");
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js SetProceedtoCheckout()-->" + error);
    }

}


function GetBookingConfirmationNumber(travelRequestStatus, travelRequestId) {
    if (travelRequestStatus == "Confirmed" || travelRequestStatus == "Cancelled" || travelRequestStatus == "Ticketed") {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetBookingConfirmationDetails/" + travelRequestId,
            "Get",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    // Product Type Value of FMS = 35 & Product Type Value of iTank = 36
                    if (response[i].ProductTypeValue == 35 && response[i].BookingConfirmationNumber != null) {
                        $("#divFlightConfirmationNo").css('display', "block");
                        $("#FlightConfirmationNo").html(response[i].BookingConfirmationNumber);
                    }
                    else if (response[i].ProductTypeValue == 36 && response[i].BookingConfirmationNumber != null) {
                        $("#divHotelConfirmationNo").css('display', "block");
                        $("#HotelConfirmationNo").html(response[i].BookingConfirmationNumber);
                    }
                }

                if ($("#divFlightConfirmationNo").css('display') == 'none') {
                    $("#divFlightConfirmationNo").remove();
                }

            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json", true
        );
    }
}




function SwitchExpTab(tab) {
    $("#lblMessage").css("display", "none");

    if ($("#myTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").attr("class", "alert alert-info");
        $("#lblMessage").html('Kindly Save Data.');
        return false;
    }
    if (tab == 'Dashboard')
        window.location = "/ExpenseReports.html";
    else if (tab == 'ExpenseReport')
        window.location = "/ExpenseReports.html";
    else
        return true;
}
function closeExpTab(e, req, RequestType) {
    var ShouldCloseRequest = CloseExpRequest(req);
    if (ShouldCloseRequest) {
        if (sessionStorage.SavedER != undefined) {
            SavedER = $.parseJSON(sessionStorage.SavedER);
            if (SavedER != '') {
                var presentKey = req + "//" + RequestType;
                var keys = Object.keys(SavedER),
                idIndex = keys.indexOf(presentKey),
                nextIndex = idIndex += 1;
                var nextKey = keys[nextIndex]
                var idNewIndex = keys.indexOf(presentKey);
                prevIndex = idNewIndex -= 1;
                var prevKey = keys[prevIndex]
                delete SavedER[req + "//" + RequestType];
                var id = "elementExp_" + req + "_" + RequestType;
                if ($("#myTab .active").attr('id') == id) {
                    if (nextKey != undefined) {
                        sessionStorage.SavedER = JSON.stringify(SavedER);
                        var reqNo = nextKey.split("//")[0];
                        sessionStorage.nextTab = JSON.stringify(nextKey);
                        window.location = "ExpenseSavedReport.html" + "?RequestNo=" + reqNo;
                        if (e.stopPropagation != undefined)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;
                        return false;
                    }
                    else if (prevKey != undefined) {
                        sessionStorage.SavedER = JSON.stringify(SavedER);
                        var reqNo = prevKey.split("//")[0];
                        sessionStorage.prevTab = JSON.stringify(prevKey);
                        window.location = "ExpenseSavedReport.html" + "?RequestNo=" + reqNo;
                        if (e.stopPropagation != undefined)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;
                        return false;
                    }
                    else {
                        sessionStorage.SavedER = JSON.stringify(SavedER);
                        window.location = "ExpenseReports.html";
                        if (e.stopPropagation != undefined)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;
                        return false;
                    }
                }
                else {
                    sessionStorage.SavedER = JSON.stringify(SavedER);
                    $("#myTab li.active").each(function () {
                        var ReqNumber = $(this).attr('id').split("_")[1];
                        var RequestType = $(this).attr('id').split("_")[2];
                        var presentKey = ReqNumber + "//" + RequestType;
                        sessionStorage.nextTab = JSON.stringify(presentKey);
                        window.location = "ExpenseSavedReport.html" + "?RequestNo=" + ReqNumber;
                    });
                    if (sessionStorage.nextTab == undefined)
                        window.location = "ExpenseReports.html";
                    if (e.stopPropagation != undefined)
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                    return false;
                }
            }
            return false;
        }
    }
}
function CloseExpRequest(req) {
    if (req == undefined || req != "NewExp") {
        if ($("#myTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            event.preventDefault();
            return false;
        }
        else if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            $(window).scrollTop(0);
            event.preventDefault();
        }
        else
            return true;
    }
    else
        return true;
}
function getActiveExpTabDetail(tab) {
    if ($("#myTab .active").attr('id') == 'elementExp_NewExp_Expense Report Draft') {
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").attr("class", "alert alert-info");
        $("#lblMessage").html('Kindly Save Data.');
        $("#lblMessage").css("display", "block");
        event.preventDefault();
    }
    else if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").attr("class", "alert alert-info");
        $("#lblMessage").html('Kindly Save Data.');
        $(window).scrollTop(0);
        event.preventDefault();
    }
    else {
        $('#myTab li.active').each(function () {
            $(this).removeClass("active");
        });
        $(tab).attr('class', 'active');
        var ReqNo = tab.id.split("_")[1];
        var RequestType = tab.id.split("_")[2];
        if (ReqNo > 0) {
            if (tab.id.split("_")[0].toLowerCase().indexOf('exp') > 0) {
                window.location = "ExpenseSavedReport.html" + "?RequestNo=" + ReqNo;
            }
            else {
                window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNo;

            }
        }
    }
}
