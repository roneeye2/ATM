var ApproverItineraryComments = "";
var viewFlightIncrement = 0;
var ExpDetailTabSliderLenthCnt = 3;
var ExpDetailTabSliderMoveIndex = 2;
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
    }
    catch (error) {
        //$().Logger.error("TravelRequestDetail.js load()-->" + error);
    }
});

$(function () {
    $("#ExpenseCreateReport_header").load('header.html', function () {

        $("#ExpenseBillAmount").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $("#ExpenseExchangeRate").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $("#txtsettlingAmount").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $("#ExpenseReportRefId").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        if ($('#ExpenseReports_header').length > 0) {
            ExpDetailTabSliderLenthCnt = 2;
            ExpDetailTabSliderMoveIndex = 1;
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
                    li.setAttribute("onclick", "getActiveExpTabDetail(this);");
                    ul.appendChild(li);
                    if (ReqNo.indexOf("NewTR") == -1)
                        document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>TR' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closeExpTab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                    else
                        document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>' + value + '<small title="' + value + '">' + value + '</small><i onclick="closeExpTab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                    if ($("#myTab").children().length > ExpDetailTabSliderLenthCnt) {
                        $(".slider").attr("id", "slider1");
                    if ($('#ExpenseReports_header').length > 0) {
                        $('#slider1 .viewport').addClass('expense');
                    }
                        $('#slider1').tinycarousel();
                        var slider1 = $("#slider1").data("plugin_tinycarousel");
                        slider1.update();
                    }


                });
            }
        }
        loadExpenseTabs();
    });
})

function loadExpenseTabs()
{
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
                if ($("#myTab").children().length > ExpDetailTabSliderLenthCnt) {
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

            loadTabs();
        }
    }
}

function loadTabs()
{
    LoadExpenseCurrency();
    if (!$("#myTab li").hasClass("active")) {
        $('#myNavbar li.active').each(function () {
            $(this).removeClass("active");
        });
        if (sessionStorage.nextTab != undefined) {
            var nextTab = $.parseJSON(sessionStorage.nextTab);
            var ReqNo = nextTab.split("//")[0];
            var ReqType = nextTab.split("//")[1];
            $("#elementExp_" + ReqNo + "_" + ReqType).attr('class', 'active');
            if ($("#myTab").children().length > ExpDetailTabSliderLenthCnt) {
                var slider1 = $("#slider1").data("plugin_tinycarousel");
                slider1.update();
                $("#myTab").children().remove('.mirrored');
                var tab = $("#myTab").children();
                var currenttab = $("#elementExp_" + ReqNo + "_" + ReqType);
                var index = tab.index(currenttab);
                var tempIndex = index - ExpDetailTabSliderMoveIndex;
                if (tempIndex > 0)
                    slider1.move(index - ExpDetailTabSliderMoveIndex);
            }
            sessionStorage.removeItem("nextTab");
            sessionStorage.removeItem("prevTab");
            sessionStorage.removeItem("ClickedTab");
        }
        else if (sessionStorage.prevTab != undefined) {
            var prevTab = $.parseJSON(sessionStorage.prevTab);
            var ReqNo = prevTab.split("//")[0];
            var ReqType = prevTab.split("//")[1];
            $("#elementExp_" + ReqNo + "_" + ReqType).attr('class', 'active');
            if ($("#myTab").children().length > ExpDetailTabSliderLenthCnt) {
                var slider1 = $("#slider1").data("plugin_tinycarousel");
                slider1.update();
                $("#myTab").children().remove('.mirrored');
                var tab = $("#myTab").children();
                var currenttab = $("#elementExp_" + ReqNo + "_" + ReqType);
                var index = tab.index(currenttab);
                var tempIndex = index - ExpDetailTabSliderMoveIndex;
                if (tempIndex > 0)
                    slider1.move(index - ExpDetailTabSliderMoveIndex);
            }
            sessionStorage.removeItem("nextTab");
            sessionStorage.removeItem("prevTab");
            sessionStorage.removeItem("ClickedTab");
        }
        else if (sessionStorage.ClickedTab != undefined) {
            var ClickedTab = $.parseJSON(sessionStorage.ClickedTab);
            var ReqNo = ClickedTab.split("//")[0];
            var ReqType = ClickedTab.split("//")[1];
            $("#elementExp_" + ReqNo + "_" + ReqType).attr('class', 'active');
            sessionStorage.removeItem("nextTab");
            sessionStorage.removeItem("prevTab");
        }
        else {
            //$('#myTab li:last').attr('class', 'active');
            if ($("#myTab").children().length > ExpDetailTabSliderLenthCnt) {
                var slider1 = $("#slider1").data("plugin_tinycarousel");
                slider1.update();
                $("#myTab").children().remove('.mirrored');
                var tab = $("#myTab").children();
                var currenttab = $('#myTab li:last');
                var index = tab.index(currenttab);
                var tempIndex = index - ExpDetailTabSliderMoveIndex;
                if (tempIndex > 0)
                    slider1.move(index - ExpDetailTabSliderMoveIndex);
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
                if (ReqNumber.indexOf("NewExp") == -1) {
                    if (ReqNumber > 0)
                        LoadExpenseReport(ReqNumber, RequestType);
                }
                else {
                    LoadExpenseReport('', '');
                }
            });
        }
        if ($("#myTab").children().length > ExpDetailTabSliderLenthCnt && sessionStorage.ClickedTab != undefined) {
            var slider1 = $("#slider1").data("plugin_tinycarousel");
            slider1.update();
            var ClickedTab = $.parseJSON(sessionStorage.ClickedTab);
            $("#myTab").children().remove('.mirrored');
            var tab = $("#myTab").children();
            var currenttab = $("#elementExp_" + ClickedTab.split("//")[0] + "_" + ClickedTab.split("//")[1]);
            var index = tab.index(currenttab);
            var tempIndex = index - ExpDetailTabSliderMoveIndex;
            if (tempIndex > 0)
                slider1.move(index - ExpDetailTabSliderMoveIndex);
        }
        sessionStorage.removeItem("ClickedTab");
    }
}

function FindAdminOrEmployee() {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetUserInfo",
        "POST",
    null,
    function (response) {
          if (response != null) {
              if (sessionStorage != null && sessionStorage != undefined) {
                  if (response.CultureTypeInfo != undefined && response.CultureTypeInfo != null) {
                      sessionStorage.CultureTypeInfo = response.CultureTypeInfo
                      var newDateFormat = $.datepicker.regional[response.CultureTypeInfo].dateFormat;
                      sessionStorage.CultureDateFormat = newDateFormat;
                      $.datepicker.setDefaults($.datepicker.regional['en-US']);
                      if (newDateFormat != null && newDateFormat != "") {
                          newDateFormat = (newDateFormat.replace("yy", "YYYY")).toUpperCase();
                          var dateValue = (moment("31/12/2017", "DD/MM/YYYY")).format(newDateFormat);
                          var maskvalue = dateValue.replace(/[0-9]/g, "9");
                          sessionStorage.CultureMaskFormat = maskvalue;
                          sessionStorage.DateFormatForMoment = newDateFormat;
                      }

                  }
              }
              $('.rze-loginname').html(response.UserName);
              $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
              $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
              $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
              if (response.Role != "TMCAdmin" && response.Role != "TMCUser" && response.Role != "TMCAdmin,TMCUser") {
                  $("#tmcProfile_headerBD").remove();
                  $("#tmcProfile_headerSD").remove();
                  $("#myProfile_headerBD").css("display", "");
                  $("#myProfile_headerSD").css("display", "");
              }
              else {
                  $("#myProfile_headerBD").remove();
                  $("#myProfile_headerSD").remove();
                  $("#tmcProfile_headerSD").css("display", "");
                  $("#tmcProfile_headerBD").css("display", "");
                  $('#ApproverTab').css('display', 'none');
                  $('#ApproverSection').attr('class', 'hide');
                  $('#SelfSection').attr('class', 'hide');
                  $('#AdminSection').attr('class', 'tab-pane fade in active');
                  $('#IsAdmin').val(true);

              }
              $.unblockUI();
          }
      },
    function (XMLHttpRequest, textStatus, errorThrown) {
        $.unblockUI();
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function SwitchExpTab(tab) {
    $("#lblMessage").css("display", "block");

    if ($("#myTab .active").attr('id') == 'elementExp_NewExp_Expense Report Draft') {
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").attr("class", "alert alert-info");
        $("#lblMessage").html('Kindly Save Data.');
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
            LoadExpenseReport(ReqNo, RequestType);
    }
            else {
                window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNo;
                
}
        }
    }
}

function GetLoggedInUserName() {
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetUserInfo",
        "POST",
    null,
    function (response) {
        if (response != null) {
            $('.rze-loginname').html(response.UserName);
        }
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function LoadSavedTravelRequest(response) {
    if (response.TravelRequestId == '') {
        $('#ExpenseRequestHeader').css('display', 'none');
    }
    else {
        $('#ExpenseRequestHeader').css('display', 'block');

    }

    $("#TravelRequestNo").html(response.TravelRequestId);
    $("#ExpenseStatus").html(response.ExpenseStatus);
    $("#TravelRequestAction").html(response.TravelRequestAction);
    $('#TravelRequestReferenceNumber').val(response.TravelRequestReferenceNumber);
    $("#TravelRequestProject").val(response.CorporateProjectName);
    $("#hdnProjectId").val(response.CorporateProjectId);
    $('#TravelRequestName').val(response.TravelRequestName);
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
        $("#AutoTravellerName" + row).val(value.employeeName);
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
        LoadTravellers(row);
        row = row + 1;
    });
    $("#TravelRequestStartDate").datepicker({ changeMonth: true, changeYear: true, dateFormat: 'dd/mm/yy' }).datepicker('setDate', new Date(response.TravelRequestStartDate))
    $("#TravelRequestStartDate").mask("99/99/9999");
    $("#TravelRequestEndDate").datepicker({ changeMonth: true, changeYear: true, dateFormat: 'dd/mm/yy' }).datepicker('setDate', new Date(response.TravelRequestEndDate))
    $("#TravelRequestEndDate").mask("99/99/9999");
    $('#TravelRequestReason').val(response.TravelRequestReason);
    $('#RequestorComments').css('display', 'block');
    if (response.TravelRequestComments != undefined && response.TravelRequestComments.length > 0) {
        //if (response.ExpenseStatusValue != '1') {
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
        $('#TravelRequestComments').html(response.RequestorComments.split('\\')[0]);
    }
    else {
        $('#TravelRequestComments').html(response.RequestorComments.split('\\')[0]);
    }

    //$("#btnSubmit").removeAttr("disabled");
    $('#SavedTravelRequestFlight').val(response.FlightPrice);
    $('#SavedTravelRequestHotel').val(response.HotelPrice);
    $('#SavedTravelRequestFlight').prop("disabled", true);
    $('#SavedTravelRequestHotel').prop("disabled", true);
    $('#SavedBudgetedCost').css('display', 'none');
    $.unblockUI();
}

function WithdrawExpenseReport() {

    $("#lblMessage").html('');
    if ($("#savedExpenseID").val() == "") {
        return false;
    }
    var RequestNumber = $("#savedExpenseID").val();
    var model = new Object();
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    //SaveTravelRequest();
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    "ExpenseRequest/ExpenseRequest/WithdrawExpenseReport/" + RequestNumber,
    "POST",
    $.postifyData(model),
    function (response) {
        if (response != null && response != "") {
            $("#btnWithdraw").hide();
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-success");

            if (response.indexOf('Approved') > 0) {
                $("#lblMessage").html(response);
            }
            else if (response.indexOf('submitted') > 0) {
                $("#lblMessage").html(response);
            }
            LoadExpenseReport(RequestNumber, "Self")
            $.unblockUI();
            $(window).scrollTop(0);

        }
    });
}

function addCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function LoadSubmittedTravelRequest(response) {
    $('#SubmittedTravelRequestNo').html(response.TravelRequestId);
    $("#SubmittedTravelRequestProject").html(response.CorporateProjectName);
    $('#SubmittedTravelTripName').html(response.TravelRequestName);
    $('#SubmittedTravelRequestedDate').html(response.TravelRequestedDate);
    $('#SubmittedTravelDestinationCity').html(response.TravelRequestCityValue);
    $('#SubmittedTravelRequestType').html(response.TravelRequestTypeValue);
    $('#SubmittedTravelRequestAction').html(response.TravelRequestAction);
    $('#SubmittedExpenseStatus').html(response.ExpenseStatus);
    $("#SubmittedTravelRequestStartDate").html(response.TravelRequestStartDate);
    $("#SubmittedTravelRequestEndDate").html(response.TravelRequestEndDate);
    $('#SubmittedTravelRequestReason').html(response.TravelRequestReason);
    $('#SubmittedTravelRequestReferenceNumber').val(response.TravelRequestReferenceNumber);
    //$('#SubmittedTravelRequestComments').html(response.TravelRequestComments);
    $('#SubmittedTravelRequestFlight').val(addCommas(response.FlightPrice));
    $('#SubmittedTravelRequestHotel').val(addCommas(response.HotelPrice));
    $("#SubmittedTraveller").empty();
    $("#SubmittedTraveller").append("<span>Traveller :</span>");
    var cnt = parseFloat('1');
    var travellerDetails = response.TravellersDetails;
    //travellerDetails.reverse();
    $.each(travellerDetails, function (key, value) {
        $("#SubmittedTraveller").append("&nbsp;<label class='vreq-tname'>" + cnt + ". " + value.employeeName + "</label> &nbsp; &nbsp;");
        cnt = cnt + 1;
    });
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
    var IsDifferentApprover = "True";
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
            if (value.employeeName == "My Self")
                IsDifferentApprover = "False";
        });
    }

    var RequiredApproverLevel = parseFloat(response.actionBy) + 1;
    $('#RequiredApproverLevel').val(RequiredApproverLevel);

    $('.file_Download_Form').css("display", "none");
    $('.file_Upload_Form').css("display", "none");

    switch (response.TravelRequestAction) {
        case "Not Required":
            {
                if (response.ExpenseStatusValue == 3) {
                    $('#btnApprove').css("display", "none");
                    $('#btnReject').css("display", "none");
                    $('#ApproverComments').css("display", "none");
                    $("#SubmittedTravelRequestCreateItinerary").empty();
                    $('#SubmittedTravelRequestFlight').prop('disabled', true);
                    $('#SubmittedTravelRequestHotel').prop('disabled', true);
                    $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                    $("#divSubmitItinerary").hide();
                    $("#btnSubmitItinerary").hide();
                    $.unblockUI();
                }
                else if (response.ExpenseStatusValue == 7) {
                    $('#StartReviewBtn').css("display", "none");
                    $('#ItineraryApproverComments').empty();
                    $('#SubmittedTravelRequestFlight').prop('disabled', true);
                    $('#SubmittedTravelRequestHotel').prop('disabled', true);
                    $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                    if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                        SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                    }

                } else if (response.ExpenseStatusValue == 10) {
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
                    if (response.ExpenseStatusValue == 6 || response.ExpenseStatusValue == 8) {
                        if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                            SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                        }
                        $("#divSubmitItinerary").hide();
                        $("#btnSubmitItinerary").hide();
                    }
                    $('.rza-delitinerary').remove();
                    $.unblockUI();
                }
                else {
                    $('#btnApprove').css("display", "none");
                    $('#btnReject').css("display", "none");
                    $('#ApproverComments').css("display", "none");
                    $("#SubmittedTravelRequestCreateItinerary").empty();
                    $('#SubmittedTravelRequestFlight').prop('disabled', true);
                    $('#SubmittedTravelRequestHotel').prop('disabled', true);
                    $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                    if (response.ExpenseStatusValue == 6 || response.ExpenseStatusValue == 8) {
                        if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                            SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                        }
                        $("#divSubmitItinerary").hide();
                        $("#btnSubmitItinerary").hide();
                    }
                    $('.rza-delitinerary').remove();
                    $.unblockUI();
                }
                $.unblockUI();
                return;
            }
        case "Approve/Reject Itinerary": // on itinerary submit
            {
                $('#StartReviewBtn').css("display", "inline-block");
                $('#IsDifferentApproverHdn').val(IsDifferentApprover);
                $('#SubmittedTravelRequestFlight').prop('disabled', true);
                $('#SubmittedTravelRequestHotel').prop('disabled', true);
                $('#SubmittedTravelRequestReferenceNumber').prop('disabled', true);
                if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                    SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                    $('#IsDifferentApproverHdn').val('True');
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
                $('#btnViewCheckout').css("display", "inline-block");
                $("#SubmittedTravelRequestCreateItinerary").empty();
                $('#btnSubmitItinerary').css("display", "none");
                if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                    SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                }
                $.unblockUI();
                return;
            }

        case "Checkout":
            {
                if (response.UserRole == "TMCUser") {
                    $('#btnViewCheckout').css("display", "inline-block");
                }

                $.unblockUI();
                return;
            }

        case "Create Itinerary": // on approve
            {
                $('#btnApprove').css("display", "none");
                $('#ApproverComments').css("display", "none");
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
                    if (response.ExpenseStatusValue < 6) {
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
                    if (response.ExpenseStatusValue < 6) {
                        $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                    }
                }

                //  CheckItineraryExists('N');
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
                if (response.FlightItineraryExists < 5) {
                    var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                    $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                }
                else if (response.HotelItineraryExists < 5) {
                    var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Create Itinerary </a>'
                    $("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                }

                if (response.IsHotelReSubmitted == true || response.IsFlightReSubmitted == true) {
                    SetReSubmitItinerarySettings(response.ReSubmittedHotelStatus, response.ReSubmittedFlightStatus, response.IsFlightReSubmitted, response.IsHotelReSubmitted, response.ItineraryId);
                }


                if (response.FlightItineraryExists == 0) {
                    $('#FlightItineraryTab').css('display', 'none');
                }
                else {
                    if (response.ExpenseStatusValue < 6) {
                        if (!response.IsFlightReSubmitted) {
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
                    if (response.ExpenseStatusValue < 6) {
                        if (!response.IsHotelReSubmitted) {
                            $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                        }
                    }
                }
                //  CheckItineraryExists('N');
                if (response.ExpenseStatusValue == 5) {
                    $("#divSubmitItinerary").show();
                    $("#btnSubmitItinerary").show();
                }
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
                $(".file_Upload_Form").show();
                GetVouchers(true);
                $.unblockUI();
                return;
            }
        case "Download Voucher":
            {
                if (response.UserRole == "TMCAdmin" || response.UserRole == "TMCUser") {
                    $(".file_Upload_Form").show();
                    GetVouchers(true);
                }
                else {
                    $(".file_Download_Form").show();
                    GetVouchers(false);
                }

                if (response.FlightItineraryExists == 0) {
                    $('#FlightItineraryTab').css('display', 'none');
                }
                else {
                    if (response.ExpenseStatusValue < 6) {
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
                    if (response.ExpenseStatusValue < 6) {
                        $('#HotelItineraryTab').append('<a class="rza-delitinerary">' + '<i onclick="DeleteHotelItinerary(\'' + response.ItineraryId + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>');
                    }
                }

                $.unblockUI();
                return;
            }
            $.unblockUI();
            return;
    }
    $.unblockUI();
}
//************************************************Voucher Upload / Download ***********************************************/

function GotoProflie(profile) {
    if ($("#myTab .active").attr('id') == 'elementExp_NewExp_Expense Report Draft') {
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").attr("class", "alert alert-info");
        $("#lblMessage").html('Kindly Save Data.');
        $("#lblMessage").css("display", "block");
        return false;
    }
    else {
        if (profile == 'myprofile')
            window.location = "/EmployeeProfile.html";
        else if (profile == 'mytmc')
            window.location = "/TMCProfile.html";
    }
}
//************************************************Voucher Upload / Download ***********************************************/
function LoadExpenseCurrency() {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    "ExpenseRequest/GetExpenseCurrencyDetails",
    "GET",
    null,
    function (response) {

        if (response != null && response.length > 0) {
            $("#ExpenseReportReimburseCurrency").html("");
            $("#ExpenseReportReimburseCurrency").append("<option value='0'>Select</option>");

            $("#ExpenseBillCurrency").html("");
            $("#ExpenseBillCurrency").append("<option value='0'>Select</option>");
            for (count in response) {
                $("#ExpenseReportReimburseCurrency").append("<option value='" + response[count].CurrencyId + "'>" + response[count].Code + '-' + response[count].Description + "</option>");
                $("#ExpenseBillCurrency").append("<option value='" + response[count].CurrencyId + "'>" + response[count].Code + '-' + response[count].Description + "</option>");

            }
            $.unblockUI();
        }
        else {
            $("#ExpenseReportReimburseCurrency").append("<option value='0'>Select</option>");
            $("#ExpenseBillCurrency").append("<option value='0'>Select</option>");
            $.unblockUI();
        }
    });

}
function DeleteAttachment(FilePath, ExpCatId)
{
    var model = new Object();
    var ExpenseReqNo = $("#savedExpenseID").val();
    FilePath = "filePath";
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    "ExpenseRequest/ExpenseRequest/DeleteSingleVoucher/" + ExpCatId.toString(),
     "POST",
    $.postifyData(model),
    function (jsonResponse)
    {
        if (jsonResponse != null)
        {
            //var jsObject = JSON.parse(jsonResponse);
            //$('.alreadyUplodedFileInfo').html(jsObject.voucherFiles); $("#txtAreaVoucherComments").val(jsObject.voucherComments);
            //$("#alreadyUploded_file_Info").text("File deleted successfully.").addClass("alert alert-success");
            //$(window).scrollTop(0);
            LoadSavedExpenseReport(ExpenseReqNo, "test", "Self");
        }
        $.unblockUI();
    });
}
function LoadExpenseReport(RequestNo, RequestType)
{

  

    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var AnyMessage = '';
    if (RequestType == '') {
        $("#fixedDashboardItem").find('li a').removeAttr('href');
        $('#header_Dashboard').attr('onclick', 'SwitchExpTab(\'Dashboard\')');
        $('#header_TravelRequest').attr('onclick', 'SwitchExpTab(\'TravelRequest\')');
        $('#header_TravelFareFinder').attr('onclick', 'SwitchExpTab(\'TravelFareFinder\')');
        $('#ExpenseReports_header').attr('onclick', 'SwitchExpTab(\'ExpenseReports\')');
        $('#myProfile_headerBD').find('a').removeAttr('href');
        $('#tmcProfile_headerBD').find('a').removeAttr('href');
        $('#myProfile_headerBD').attr('onclick', 'GotoProflie(\'myprofile\')');
        $('#tmcProfile_headerBD').attr('onclick', 'GotoProfile(\'mytmc\')');
        $.unblockUI();
    }
    else
    {
        if (RequestType.indexOf('//') > 0) {
            AnyMessage = RequestType.split('//')[1];
            RequestType = RequestType.split('//')[0];
        }
        var serviceProxy = new ExpServiceProxy();
        serviceProxy.invoke(
     "ExpenseRequest/ExpenseRequest/GetExpenseRequestById/" + RequestNo + "/" + RequestType,
    "GET",
    null,
     function (response) {
         if (response != null) {

             if (AnyMessage != '') {
                 $("#lblMessage").removeAttr("class");
                 if (AnyMessage == "Expense report approved.") {
                     $("#lblMessage").attr("class", "alert alert-success");
                     $("#lblMessage").html(AnyMessage);
                 }
                 else if (AnyMessage == "Expense report rejected.") {
                     $("#lblMessage").attr("class", "alert alert-danger");
                     $("#lblMessage").html(AnyMessage);
                 }
                 else {
                     $("#lblMessage").attr("class", "alert alert-info");
                     $("#lblMessage").html(AnyMessage);
                 }
                 $("#lblMessage").css("display", "block");
             }




             var ExpenseLineID = 0;

             $("#ExpenseReportName").val(response.ReportName);
             
           
       
             $("#ExpenseReportReimburseCurrency").val(response.ReimbursementCurrency);
             var length = $('#ExpenseReportReimburseCurrency > option').length;
             
             if (length < 1) {

                
                 LoadExpenseCurrency()
                 $("#ExpenseReportReimburseCurrency").val(response.ReimbursementCurrency);

             }
             else {

             }
             if (response.TravelRequestNumber > 0)
                $("#ExpenseReportRefId").val(response.TravelRequestNumber);
             if (RequestNo > 0) {
                 var ReimbCurr = $("#ExpenseReportReimburseCurrency option:selected").text();
                 $("#RezExpenses").html('');
                 $("#RezExpenses").show();
                 for (i = 0; i < response.ExpenseLineDetails.length; i++) {

                     $("#ExpenseCategoryType").val(response.ExpenseLineDetails[i].CategoryID);
                     var CategoryType = $("#ExpenseCategoryType option:selected").text();
                     CategoryType = CategoryType.replace(/ /g, '');
                     if ($("#savedExpenses_" + CategoryType).length == 0) {
                         var clonecont = GetExpensePanel();
                         ExpenseLineID = response.ExpenseLineDetails[i].ExpenseLineID;
                         clonecont = clonecont.replace(new RegExp("CatExpenseLineIDs", "ig"), (CategoryType + ExpenseLineID));
                         clonecont = clonecont.replace(new RegExp("ExpenseLineIDs", "ig"), ExpenseLineID);
                         clonecont = clonecont.replace(new RegExp("expCatType", "ig"), CategoryType);
                         clonecont = clonecont.replace(new RegExp("rez-savedexpense", "ig"), "rez-savedexpense_" + CategoryType);

                         var AttDetail = "";
                         for (j = 0; j < response.AttachmentDetails.length; j++) {
                             if (response.AttachmentDetails[j].ReferenceID == response.ExpenseLineDetails[i].ExpenseLineID)
                             {
                                 if (response.AttachmentDetails[j].Comments == 'null' || response.AttachmentDetails[j].Comments == null) {
                                     response.AttachmentDetails[j].Comments = '';
                                 }
                                 var filePath ="'"+ response.AttachmentDetails[j].Path+"'";
                                 AttDetail = AttDetail + '<div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <a id=' + 'AttachedFile' + ExpenseLineID + '_' + i + ' href=' + response.AttachmentDetails[j].Path + ' download><small>' + response.AttachmentDetails[j].DisplayName + '</small></a>'
                                     + '  <a class=deleteItem href="#"'
                                + ' onclick = "DeleteAttachment(' + filePath + ',' + response.AttachmentDetails[j].AttachmentID + ');"@>'
                                 +'<i class="fa fa-trash-o"></i></a>'
                                 + '<div>' + response.AttachmentDetails[j].Comments + '</div></div>'


                                 //AttDetail = AttDetail + '<div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>' + response.AttachmentDetails[j].DisplayName + '</small><div>' + response.AttachmentDetails[j].Comments + '</div></div>'
                             }

                         }
                         clonecont = clonecont.replace(new RegExp("No Attachments", "g"), AttDetail);

                         $("#RezExpenses").append(clonecont);
                     }
                     else {
                         var clonecont = GetExpensePanelBody();
                         ExpenseLineID = response.ExpenseLineDetails[i].ExpenseLineID;
                         clonecont = clonecont.replace(new RegExp("CatExpenseLineIDs", "ig"), (CategoryType + ExpenseLineID));
                         clonecont = clonecont.replace(new RegExp("ExpenseLineIDs", "ig"), ExpenseLineID);
                         clonecont = clonecont.replace(new RegExp("expCatType", "ig"), CategoryType);

                         var AttDetail = "";
                         for (j = 0; j < response.AttachmentDetails.length; j++) {
                             if (response.AttachmentDetails[j].ReferenceID == response.ExpenseLineDetails[i].ExpenseLineID)
                             {


                                 if (response.AttachmentDetails[j].Comments == 'null' || response.AttachmentDetails[j].Comments == null) {
                                     response.AttachmentDetails[j].Comments = '';
                                 }

                                 var filePath = "'" + response.AttachmentDetails[j].Path + "'";
                                 AttDetail = AttDetail + '<div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <a id=' + 'AttachedFile' + ExpenseLineID + '_' + i + ' href=' + response.AttachmentDetails[j].Path + ' download><small>' + response.AttachmentDetails[j].DisplayName + '</small></a>'
                                       + '  <a class=deleteItem href="#"'
                            + ' onclick = "DeleteAttachment(' + filePath + ',' + response.AttachmentDetails[j].AttachmentID + ');"@>'
                                 + '<i class="fa fa-trash-o"></i></a>'
                                 + '<div>' + response.AttachmentDetails[j].Comments + '</div></div>'

                                // AttDetail = AttDetail + '<div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>' + response.AttachmentDetails[j].DisplayName + '</small><div>' + response.AttachmentDetails[j].Comments + '</div></div>'
                             }

                         }
                         clonecont = clonecont.replace(new RegExp("No Attachments", "g"), AttDetail);
                         $('#savedExpenses_' + CategoryType + ' div#idexpSavedDet').append(clonecont);

                     }

                     //$("#lblMessage").attr("class", "alert alert-success");
                     //$("#lblMessage").html('Expense Report saved.');
                     var expenseAmount = response.ExpenseLineDetails[i].BillAmount * response.ExpenseLineDetails[i].ConvertionRate;
                     var cliamDate = new Date(response.ExpenseLineDetails[i].Date);
                     $("#ExpenseClaimDate").datepicker({
                         changeMonth: true, changeYear: true,
                         dateFormat: 'dd-mm-yy'
                     }).datepicker('setDate', cliamDate)

                     $("#ExpenseReportId").html(RequestNo);
                     $("#ExpenseReportStatus").html(response.ExpenseStatus);

                     $("#ExpenseReportAction").html(response.ExpenseAction);
                     $("#savedExpenseClaimDate_" + ExpenseLineID).text($("#ExpenseClaimDate").val());
                     $("#savedExpenseTotalAmount_" + CategoryType + ExpenseLineID).text(expenseAmount);
                     $("#savedExpenseSettlementAmount_" + CategoryType + ExpenseLineID).text(response.SettlingAmount);
                     $("#savedExpenseBillAmount_" + ExpenseLineID).text(response.ExpenseLineDetails[i].BillAmount);
                     $("#ExpenseBillCurrency").val(response.ExpenseLineDetails[i].CurrencyID)
                     $("#savedExpenseBillCurrency_" + ExpenseLineID).text($("#ExpenseBillCurrency option:selected").text());
                     $("#savedExpenseExchangeRate_" + ExpenseLineID).text(response.ExpenseLineDetails[i].ConvertionRate);
                     $("#savedExpenseJustification_" + ExpenseLineID).text(response.ExpenseLineDetails[i].Justification);
                     $("#TitleofExpense_" + ExpenseLineID).text($("#ExpenseCategoryType option:selected").text());
                     $("#TitleofExpense_" + ExpenseLineID).append('<span class="pull-right"><label>Total - <span id="ExpenseTotal_' + CategoryType + '"></span></label><a href=""><i class="more-less fa"></i></a></span>')
                     $("#savedExpenseID").val(RequestNo);
                     $("#savedExpenseLineID_" + ExpenseLineID).val(ExpenseLineID);
                     $("#savedExpenseTypeID_" + ExpenseLineID).val($("#ExpenseCategoryType option:selected").val());
                     $("#savedExpenseBillCurrencyID_" + ExpenseLineID).val($("#ExpenseBillCurrency option:selected").val());
                     $("#savedExpenseGrandTotal").text(expenseAmount);
                     $("#CreateExpenseGrandTotal").text(ReimbCurr.split('-')[0] + ' ' + GetGrandTotalAmount());
                     $("#ExpenseTotal_" + CategoryType).text(ReimbCurr.split('-')[0] + " " + GetCategoryTotalAmount(CategoryType));
                     ResetExpenseForm();
                 }
                 var reqCommented = false;
                 $("#ApproverCommetnsSection").empty();
                 if (response.ExpenseRequestComments.length > 0) {
                     $("#ApproverCommetnsSection").append("<h4>Approver Comments</h4>");
                     $.each(response.ExpenseRequestComments, function (key, value) {
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
                                     $("#ApproverCommetnsSection").append("<div class='" + cls + "'><div class='row'><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + " ( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcombot'><span>" + value.employeeName + "</span></div></div>");
                                 else
                                     $("#ApproverCommetnsSection").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + " ( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
                             }
                             else {
                                 // name first then comments
                                 if (value.Status.indexOf("Submitted") < 0) {
                                     // comments first then name.
                                     status = value.Status;
                                     cls = 'rze-revhiswrap';
                                     $("#ApproverCommetnsSection").append("<div class='" + cls + "'><div class='row'><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcombot'><span>" + value.employeeName + "</span></div></div>");
                                 }
                                 else {
                                     reqCommented = true;
                                     value.employeeName = value.employeeName.split('_')[0];
                                     status = value.Status;
                                     $("#ApproverCommetnsSection").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + " ( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
                                 }
                             }
                         }
                         else {
                             // name first then comments
                             reqCommented = true;
                             value.employeeName = value.employeeName.split('_')[0];
                             status = value.Status;
                             $("#ApproverCommetnsSection").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
                         }
                     });
                 }

                 if (response.ExpenseStatus.toLowerCase() == "exp-draft") {
                     $("#ApproverCommetnsSection").css("display", "none");
                     $(".rze-exphead").find('input, textarea, select').prop("disabled", true);


                     $("#divSubmit").css("display", "block");
                     $("#divSave").css("display", "block");
                     $(".rze-expactions").css("display", "block");
                     $("#CreateExpenseReport").css("display", "block");
                     $("#ApproverPanel").css("display", "none");
                     $(".rze-exphead").find('input, textarea, select').prop("disabled", false);
                 }
                 if (response.ExpenseStatusValue == 4) {
                     $("#divSubmit").css("display", "block");
                     $("#divSave").css("display", "block");
                     $(".rze-expactions").css("display", "block");
                     $("#CreateExpenseReport").css("display", "block");
                     $("#ApproverPanel").css("display", "none");
                     $(".rze-exphead").find('input, textarea, select').prop("disabled", false);

                 }
                 else if (response.ExpenseStatus.toLowerCase() != "exp-draft" && RequestType == 'Self') {
                     $("#divSubmit").css("display", "none");
                     $("#divSave").css("display", "none");
                     $(".rze-expactions").css("display", "none");
                     $("#CreateExpenseReport").css("display", "none");
                     $("#ApproverPanel").css("display", "none");
                     $(".rze-exphead").find('input, textarea, select').prop("disabled", true);
                     if (response.CorporateApproverLevel == response.actionBy) {
                         $("#div_withdrawReport").css("display", "none");
                     }
                     else {
                         $("#div_withdrawReport").css("display", "block");
                     }


                 }
                 if (RequestType == 'Associate') {

                     var RequiredApproverLevel = parseFloat('0');
                     var RejectedRequiredApproverLevel = parseFloat(response.RejectedActionBy) + 1;
                     $('#RejectedRequiredApproverLevel').val(RejectedRequiredApproverLevel);
                     if (response.ExpenseStatusValue <= 4) {
                         if (response.ExpenseRequestSubstituteApproverLevel != '-1') {
                             $('#IsSubAppr').val('true');
                             if (response.ExpenseRequestSubstituteApproverLevel == '0')
                                 RequiredApproverLevel = parseFloat(response.ExpenseRequestSubstituteApproverLevel) + 1;
                             else
                             RequiredApproverLevel = parseFloat(response.ExpenseRequestSubstituteApproverLevel);
                             $('#RejectedRequiredApproverLevel').val(RequiredApproverLevel);
                         }
                         else {
                             $('#IsSubAppr').val('false');
                             RequiredApproverLevel = parseFloat(response.actionBy) + 1;
                         }
                     }
                     $("#txtsettlingAmount").val(response.SettlingAmount);
                     $('#RequiredApproverLevel').val(RequiredApproverLevel);
                     $(".rze-expactions").css("display", "none");
                     $("#divSubmit").css("display", "none");
                     $("#CreateExpenseReport").css("display", "none");
                     $(".rze-exphead").find('input, textarea, select').prop("disabled", true);
                     if (response.ExpenseReqActionRequired) {
                         $("#ApproverPanel").css("display", "block");
                     }
                     else {
                         $("#ApproverPanel").css("display", "none");
                     }

                 }
                 var tab = $("#elementExp_" + RequestNo + "_" + RequestType);
                // $("#btnEditSavedExpense").click();
                 $("#ExpenseReportRefId").attr("disabled", "disabled");
                 $("#ExpenseReportReimburseCurrency").attr("disabled", "disabled");
                 $("#ExpenseReportName").attr("disabled", "disabled");
                 $.unblockUI();
                 //getActiveExpTabDetail(tab);
             }
             else
                 $.unblockUI();
         }
     },
            function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            },
            "json"
        );
    }

}

function ApproveOrRejectExpenseRequest(isApprove) {

    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    $("#lblMessage").html('');
    if ($("#SubmittedTravelRequestNo").html() == "") {
        return false;
    }

    var url = "ExpenseRequest/ApproveExpenseRequest/ApproverAction";
    var approverComments = "";
    approverComments = $("#ApproverComments").val();
    if (approverComments == '')
        approverComments = "null";
    var RequiredApproverLevel = "";

    if (isApprove)
        RequiredApproverLevel = $('#RequiredApproverLevel').val();
    else
        RequiredApproverLevel = $('#RejectedRequiredApproverLevel').val();

    if (RequiredApproverLevel == undefined || RequiredApproverLevel == NaN || RequiredApproverLevel == '')
        RequiredApproverLevel = parseFloat('0');
    else
        RequiredApproverLevel = parseFloat(RequiredApproverLevel);

    var IsSubAppr = $('#IsSubAppr').val();

    var settlingAmount = $("#txtsettlingAmount").val();
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    url,
    "GET",
    { approverAction: isApprove, expenseRequestId: $("#ExpenseReportId").text(), comments: approverComments, SettelmentPrice: settlingAmount, RequiredApproverLevel: RequiredApproverLevel, IsSubAppr: IsSubAppr },
    function (response) {


        if (response != null) {
            if (response == true) {
                $('#ApproverComments').val('');
                var message = '';
                if (isApprove == true) {
                    message = "Expense report approved.";
                }
                else {
                    message = "Expense report rejected.";
                }
                if ($("#myTab li").hasClass("active")) {
                    $("#myTab li.active").each(function () {
                        var ReqNumber = $(this).attr('id').split("_")[1];
                        var RequestType = $(this).attr('id').split("_")[2];
                        RequestType = RequestType + '//' + message;
                        LoadExpenseReport(ReqNumber, RequestType);
                    });
                }
                $("#ApproverPanel").css("display", "none");
                $.unblockUI();
            }
            else {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-danger");
                $("#lblMessage").html('Expense report approver action failed.');
                $.unblockUI();
            }
        }
        $.unblockUI();
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
    $(window).scrollTop(0);
}

function StartReview() {
    if ($("#FlightItineraryTab").css('display') == 'inline-block') {
        $('#liTravelRequest').removeClass();
        $('#FlightItineraryTab').removeClass().addClass('active');
        $('#HotelItineraryTab').removeClass();
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").html('');
        if ($('#IsFlightReSubmittedHdn').val() == 'true') {
            $('#HotelItineraryMain').attr('class', 'tab-pane fade');
            $('#FlightItineraryMain').attr('class', 'tab-pane fade active in');
            $('#tr-view').attr('class', 'tab-pane fade');
            ViewReSubmitItinerary('F');
        }
        else
            ViewFlightItinerary(0);
    }
    else if ($("#HotelItineraryTab").css('display') == 'inline-block') {
        $('#liTravelRequest').removeClass();
        $('#FlightItineraryTab').removeClass();
        $('#HotelItineraryTab').removeClass().addClass('active');
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").html('');
        $('#FlightItineraryMain').attr('class', 'tab-pane fade');
        $('#tr-view').attr('class', 'tab-pane fade');
        $('#HotelItineraryMain').attr('class', 'tab-pane fade in active rze-hpadding');
        if ($('#IsFlightReSubmittedHdn').val() == 'true') {
            $('#HotelItineraryMain').attr('class', 'tab-pane fade active in');
            $('#FlightItineraryMain').attr('class', 'tab-pane fade');
            $('#tr-view').attr('class', 'tab-pane fade');
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
}

function GoToRequest() {
    var FlightApprComments = $('#FlightItineraryApproverCommentstext').val();
    var HotelApprComments = $('#HotelItineraryApproverCommentstext').val();
    $('#FlightApprove').prop('disabled', true);
    if ($("#FlightItineraryMain input:checked").val()) {
        $('#IsFlightItineraryApproved').val('true');
    }
    if ($("#HotelItineraryMain input:checked").val()) {
        $('#IsHotelItineraryApproved').val('true');
    }

    $("#FlightItineraryTab").find('a').attr('href', '#FlightItineraryMain');
    $("#FlightItineraryTab").find('a').attr('onclick', 'NavigateToFlightItinerary();');

    $("#HotelItineraryTab").find('a').attr('href', '#HotelItineraryMain');
    $("#HotelItineraryTab").find('a').attr('onclick', 'NavigateToHotelItinerary();');


    $('#ProceedToHotel').attr('onclick', 'NavigateToHotelItinerary();');
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
    //ApplyApproverComments();
}

function SubmitReview() {
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
        }
    }
    else {
        // Hotel itinerary is not added.
        TravelRequestItineraryHotelId = -1;
    }

    var submitionComments = "";
    if ($("#ItineraryApproverCommentstext").val() != "" && $("#ItineraryApproverCommentstext").val() != undefined)
        submitionComments = $("#ItineraryApproverCommentstext").val();

    if (TravelRequestItineraryHotelId == undefined || TravelRequestItineraryHotelId == 0)
        TravelRequestItineraryHotelId = $("#hdnHotelIdToAproveReject").val();

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

    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    "TravelItinerary/Itinerary/ApproveOrRejectItinerary",
    "GET",
    { TravelRequestItineraryID: TravelRequestItineraryId, TravelRequestItineraryFlightID: TravelRequestItineraryFlightId, TravelRequestItineraryHotelID: TravelRequestItineraryHotelId, comments: submitionComments, requiredApproverLevel: RequiredApproverLevel },
    function (response) {
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
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        //alert("ApproveOrRejectTravelRequest");
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

// Travel request Confirm booking.
function CompleteCheckout() {
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
        var serviceProxy = new ExpServiceProxy();
        serviceProxy.invoke(
        "Booking/Create",
        "POST",
        data,
        function (response) {
            if (response != null) {
                if (response.Status == true) {
                    $("#divCompleteCheckout").removeAttr("class");
                    $("#divCompleteCheckout").attr("class", "hide");
                    $("#SubmittedExpenseStatus").html("Booking Submitted");
                    $("#SubmittedTravelRequestAction").html("Upload Voucher");
                    alertmsg(response.Message);
                }
                else {
                    alertmsg(response.Message);
                }
            }

            $.unblockUI();
        },
        "json"
        );
    }
    else {
        $.unblockUI();
    }
}

function ClearCommentsMessage() {
    $('#lblItineraryApproverCommentstext').html('');
}

function ViewCheckout() {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    $('#tr-view').attr('class', 'tab-pane fade');
    $('#HotelItineraryMain').attr('class', 'tab-pane fade');
    $('#FlightItineraryMain').attr('class', 'tab-pane fade');
    $('#CheckoutMain').attr('class', 'tab-pane fade in active');
    $('#CheckoutItinerary').css('display', 'inline-block');
    $('#CheckoutTab').css('display', 'inline-block');
    $("#CheckoutTab").addClass("active");
    $("#liTravelRequest").removeClass("active");
    $("#FlightItineraryTab").removeClass("active");
    $("#HotelItineraryTab").removeClass("active");
    $("#CheckoutMain").empty();
    $('#ItineraryComments').hide();
    var RequestNo = getUrlVars()["RequestNo"];
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "CheckoutItinerary/Checkout/ViewCheckout/" + RequestNo,
        "POST",
    null,
    function (response) {
        $("#TotalTravellers").val(response.length);
        $("#CheckoutMain").append("<div class='panel-group rze-chkpaxcont' id='accordion'></div>");
        $("#accordion").append("<div id='default' class='panel panel-default'></div>");
        $("#accordion").append("<div id='Flightdefault' class='panel panel-default'></div>");
        $("#accordion").append("<div id='Hoteldefault' class='panel panel-default'></div>");
        if ($("#FlightItineraryTab").is(":visible")) {
            var Flightinfo = $("#FlightInfo").html();
            $("#Flightdefault").append(Flightinfo);
            $("#Flightdefault").append("<div id='collapse2'class='panel-collapse collapse'><div id='Flightbody'class='panel-body'></div></div>")
        }
        if ($("#HotelItineraryTab").is(":visible")) {
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
                changeMonth: true, changeYear: true,
                maxDate: '-1D'
            }).datepicker('setDate', new Date(employee.DateOfBirth));

            $("#DateOfBirth" + employee.EmployeeId).mask("99/99/9999");
            $("#PassportExpiryDate" + employee.EmployeeId).datepicker({
                changeMonth: true, changeYear: true,
                minDate: '+1D'
            }).datepicker('setDate', new Date(employee.PassportExpiryDate));

            $("#PassportExpiryDate" + employee.EmployeeId).mask("99/99/9999");
            $("#PassportNo" + employee.EmployeeId).val(employee.PassportNo);
            $("#MealsPreference" + employee.EmployeeId).val(employee.MealPreference);
            $("#IssuedLocation" + employee.EmployeeId).val(employee.PassportIssuedLocation);
            $("#FrequentFlyerInfo" + employee.EmployeeId).val("");
            LoadDropDownList("#SeatPreference" + employee.EmployeeId, employee.SeatPreferences, employee.SeatPreference);
            $("#divpaxDetails-clone" + employee.EmployeeId).attr('id', "divpaxDetails-clone");
        });
        $.unblockUI();
    },
    "json"
    );
}

function LoadDropDownList(dropDownId, list, value) {
    $(dropDownId).html("");
    for (count in list) {
        $(dropDownId).append("<option value='" + list[count].Value.toString() + "'>" + list[count].Text.toString() + "</option>");
    }
    $(dropDownId).val(value);

}

function UpdateEmployee(EmployeeId) {
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
        var serviceProxy = new ExpServiceProxy();
        serviceProxy.invoke(
           "CheckoutItinerary/Checkout/UpdateEmployee",
           "POST",
            data,
       function (response) {
           if (response == true) {
               $("#lblMessage").attr("class", "alert alert-success");
               $("#lblMessage").html('Employee Details Updated');
           }
           else {
               $("#lblMessage").attr("class", "alert alert-danger");
               $("#lblMessage").html('Update failed');
           }
           $.unblockUI();
       },
        "json"
        );
    }
    else {
        $.unblockUI();
    }
}

function IsSelfBookingEnabled() {
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "CheckoutItinerary/Checkout/IsSelfBookingEnabled",
        "POST",
    null,
    function (response) {
        if (response == false) {
            var ViewReqBooking = '<div class="rze-chkout-btn" id="divRequestBooking"><button type="button" class="btn btn-primary"  tabindex="0" id="btnViewReqBooking" name="btnViewReqBooking" onclick="return RequestBooking();">Request Booking</button></div>'
            $("#CheckoutMain").append(ViewReqBooking);
        }
        else {
            var CompleteCheckout = '<div class="rze-chkout-btn" id="divCompleteCheckout"><button type="button" class="btn btn-primary"  tabindex="0" id="btnCompleteCheckout" onclick="return CompleteCheckout();">Complete Checkout</button></div>'
            $('#CheckoutMain').append(CompleteCheckout);
        }
    },
    "json"
    );

}

function GoBackToRequest() {
    $('#liTravelRequest').removeClass().addClass("active");
    $('#FlightItineraryTab').removeClass();
    $('#HotelItineraryTab').removeClass();
    $('#FlightItineraryMain').attr('class', 'tab-pane fade');
    $('#HotelItineraryMain').attr('class', 'tab-pane fade rze-hotelcontwrap col-md-12');
    $('#tr-view').attr('class', 'tab-pane fade active in');
}

function EmployeeNameValidation(e) {
    var key = e.keyCode;
    if (key >= 48 && key <= 57) {
        e.preventDefault();
    }
}

function AgeValidation() {
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
}

function PassportNumberValidation() {
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
}

function FindUserInfo() {
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "TravelRequest/TravelRequest/GetUserInfo",
        "POST",
    null,
    function (response) {
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
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
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
            if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                event.preventDefault();
                return false;
            }
            else if ($("#myTab .active").attr('id') == 'elementExp_NewExp_Expense Report Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                event.preventDefault();
                return false;
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
            if (ReqNo > 0)
                window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNo;
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js getActiveTabDetail()-->" + error);
    }
}
