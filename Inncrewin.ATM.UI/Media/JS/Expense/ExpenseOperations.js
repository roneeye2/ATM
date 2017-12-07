
function alertmsg(msg) {
    bootbox.alert({
        message: msg,
        size: 'small',
    })
}
function GetGrandTotalAmount() {
    var grandTotal = 0;
    $("[id^='savedExpenseTotalAmount_']").each(function () {
        grandTotal += parseInt($(this).text());
    });
    return grandTotal;
}
function GetCategoryTotalAmount(catType) {
    var grandTotal = 0;
    $('[id^=savedExpenseTotalAmount_' + catType + ']').each(function () {
        grandTotal += parseInt($(this).text());
    });
    return grandTotal;
}
function SearchToggle(tabname) {
    $("#rze-wrap" + tabname).slideToggle();
    $("#rze-overlay" + tabname).toggleClass("overlaybox")
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
            $("#hdnCultureInfo").val(response.CultureTypeInfo);
            $('.rze-loginname').html(response.UserName);
            $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
            $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
            $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
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
    var RequiredApproverLevel = $('#RequiredApproverLevel').val();
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
                if ($("#myExpTab li").hasClass("active")) {
                    $("#myExpTab li.active").each(function () {
                        var ReqNumber = $(this).attr('id').split("_")[1];
                        var RequestType = $(this).attr('id').split("_")[2];
                        RequestType = RequestType + '//' + message;
                        LoadExpenseReport(ReqNumber, RequestType);
                    });
                }
                $("#ApproverPanel").css("display", "none");
            }
            else {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-danger");
                $("#lblMessage").html('Expense report approver action failed.');
                $.unblockUI();
            }
        }
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
    $(window).scrollTop(0);
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

function LoadExpenseReport(RequestNo, RequestType) {

    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var AnyMessage = '';
    if (RequestType == '') {
        $.unblockUI();
    }
    else {
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
                         $("#RezExpenses").append(clonecont);
                     }
                     else {
                         var clonecont = GetExpensePanelBody();
                         ExpenseLineID = response.ExpenseLineDetails[i].ExpenseLineID;
                         clonecont = clonecont.replace(new RegExp("CatExpenseLineIDs", "ig"), (CategoryType + ExpenseLineID));
                         clonecont = clonecont.replace(new RegExp("ExpenseLineIDs", "ig"), ExpenseLineID);
                         clonecont = clonecont.replace(new RegExp("expCatType", "ig"), CategoryType);
                         $('#savedExpenses_' + CategoryType + ' div#idexpSavedDet').append(clonecont);

                     }
                     //$("#lblMessage").removeAttr("class");
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
                     if (response.ExpenseStatusValue <= 4) {
                         if (response.ExpenseRequestSubstituteApproverLevel != '0') {
                             $('#IsSubAppr').val('true');
                             RequiredApproverLevel = parseFloat(response.ExpenseRequestSubstituteApproverLevel);
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
                 // $("#btnEditSavedExpense").click();
                 $("#ExpenseReportRefId").attr("disabled", "disabled");
                 $("#ExpenseReportReimburseCurrency").attr("disabled", "disabled");
                 $("#ExpenseReportName").attr("disabled", "disabled");

                 $.unblockUI();
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

function ValidateExpenseDetailForm() {
    var anyError = false;
    if ($("#ExpenseReportName").val().trim() == "") {
        $("#ExpenseReportNameError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseBillAmount").val().trim() == "") {
        $("#ExpenseBillAmountError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseExchangeRate").val().trim() == "") {
        $("#ExpenseExchangeRateError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseJustification").val().trim() == "") {
        $("#ExpenseJustificationError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseReportReimburseCurrency").val() == "0" || $("#ExpenseReportReimburseCurrency").val() == '00000000-0000-0000-0000-000000000000') {
        $("#ExpenseReportReimburseCurrencyError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseCategoryType").val() == "0" || $("#ExpenseCategoryType").val() == '00000000-0000-0000-0000-000000000000') {
        $("#ExpenseCategoryTypeError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseBillCurrency").val() == "0" || $("#ExpenseBillCurrency").val() == '00000000-0000-0000-0000-000000000000') {
        $("#ExpenseBillCurrencyError").html("Required");
        anyError = true;
    }
    if ($("#ExpenseClaimDate").val() == "") {
        $("#ExpenseClaimDateError").html("Required");
        anyError = true;
    }
    return anyError
}

function SaveExpenseReport() {
    if (ValidateExpenseDetailForm()) {
        return;
    }
    else {
        var model = new Object();
        RequestNo = $("#savedExpenseID").val();
        if (RequestNo > 0)
            model.ExpenseID = RequestNo;
        model.Name = $("#ExpenseReportName").val();
        model.ReimbursementAmount = 0;
        model.ReimbursementCurrencyID = $("#ExpenseReportReimburseCurrency option:selected").val();
        model.TravelRequestNo = $("#ExpenseReportRefId").val();
        model.ExpenseRequestLineItem = new Array();
        var expenseRequestLineItems = new Object();
        if (IsUpdate == true) {
            expenseRequestLineItems.ExpenseLineID = ExpenseLineID;
        }
        expenseRequestLineItems.CategoryID = $("#ExpenseCategoryType option:selected").val();
        expenseRequestLineItems.Name = "no Name";
        expenseRequestLineItems.Date = $("#ExpenseClaimDate").val();
        expenseRequestLineItems.CurrencyID = $("#ExpenseBillCurrency option:selected").val();
        expenseRequestLineItems.BillAmount = $("#ExpenseBillAmount").val();
        expenseRequestLineItems.ConvertionRate = $("#ExpenseExchangeRate").val();
        expenseRequestLineItems.Justification = $("#ExpenseJustification").val();
        model.ExpenseRequestLineItem.push(expenseRequestLineItems);
        model.IsActive = true;
        var serviceProxy = new ExpServiceProxy();
        serviceProxy.invoke(
            "ExpenseRequest/SaveExpenseRequest",
        "POST",
        $.postifyData(model),
        function (response) {
            if (response != null) {
                var ReimbCurr = $("#ExpenseReportReimburseCurrency option:selected").text();
                var CategoryType = $("#ExpenseCategoryType option:selected").text();
                CategoryType = CategoryType.replace(/ /g, '');
                var ReimburseCurrencyType = $("#ExpenseReportReimburseCurrency option:selected").text();
                var expenseAmount = TotalReimbursementAmount("ExpenseBillAmount", "ExpenseExchangeRate");
                if (ExpenseLineID == 0) {
                    $("#RezExpenses").show();
                    if ($("#savedExpenses_" + CategoryType).length == 0) {
                        var clonecont = GetExpensePanel();
                        ExpenseLineID = response.split("//")[1];
                        clonecont = clonecont.replace(new RegExp("CatExpenseLineIDs", "ig"), (CategoryType + ExpenseLineID));
                        clonecont = clonecont.replace(new RegExp("ExpenseLineIDs", "ig"), ExpenseLineID);

                        clonecont = clonecont.replace(new RegExp("expCatType", "ig"), CategoryType);
                        clonecont = clonecont.replace(new RegExp("rez-savedexpense", "ig"), "rez-savedexpense_" + CategoryType);
                        $("#RezExpenses").append(clonecont);
                    }
                    else {
                        var clonecont = GetExpensePanelBody();
                        ExpenseLineID = response.split("//")[1];
                        clonecont = clonecont.replace(new RegExp("CatExpenseLineIDs", "ig"), (CategoryType + ExpenseLineID));
                        clonecont = clonecont.replace(new RegExp("ExpenseLineIDs", "ig"), ExpenseLineID);

                        clonecont = clonecont.replace(new RegExp("expCatType", "ig"), CategoryType);
                        $('#savedExpenses_' + CategoryType + ' div div#idexpSavedDet').append(clonecont);
                    }
                }
                RequestNo = response.split("//")[0];
                var RequestStatus = response.split("//")[2];
                var RequestAction = response.split("//")[3];
                if (RequestNo > 0) {
                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("style", "display:block");
                    $("#lblMessage").attr("class", "alert alert-success");
                    $("#lblMessage").html('Expense Report saved.');
                    $("#ExpenseReportId").html(RequestNo);
                    $("#ExpenseReportStatus").html(RequestStatus);
                    $("#ExpenseReportAction").html(RequestAction);
                    $("#GrandTotal").attr("style", "display:block");
                    $("#savedExpenseClaimDate_" + ExpenseLineID).text($("#ExpenseClaimDate").val());
                    $("#savedExpenseTotalAmount_" + (CategoryType + ExpenseLineID)).text(expenseAmount);
                    $("#savedExpenseBillAmount_" + ExpenseLineID).text($("#ExpenseBillAmount").val());
                    $("#savedExpenseBillCurrency_" + ExpenseLineID).text($("#ExpenseBillCurrency option:selected").text());
                    $("#savedExpenseExchangeRate_" + ExpenseLineID).text($("#ExpenseExchangeRate").val());
                    $("#savedExpenseJustification_" + ExpenseLineID).text($("#ExpenseJustification").val());
                    $("#TitleofExpense_" + ExpenseLineID).text($("#ExpenseCategoryType option:selected").text());
                    $("#TitleofExpense_" + ExpenseLineID).append('<span class="pull-right"><label>Total - <span id="ExpenseTotal_' + CategoryType + '"></span></label><a href=""><i class="more-less fa"></i></a></span>')
                    $("#savedExpenseID").val(RequestNo);
                    $("#savedExpenseLineID_" + ExpenseLineID).val(ExpenseLineID);
                    $("#savedExpenseTypeID_" + ExpenseLineID).val($("#ExpenseCategoryType option:selected").val());
                    $("#savedExpenseBillCurrencyID_" + ExpenseLineID).val($("#ExpenseBillCurrency option:selected").val());
                    $("#savedExpenseGrandTotal").text(expenseAmount);
                    $("#CreateExpenseGrandTotal").text(ReimbCurr.split("-")[0] + ' ' + GetGrandTotalAmount());
                    $("#ExpenseTotal_" + CategoryType).text(ReimbCurr.split("-")[0] + ' ' + GetCategoryTotalAmount(CategoryType));
                    ResetExpenseForm();
                    $(".rze-exphead").find('input, textarea, select').prop("disabled", true);
                }
                ExpenseLineID = 0;
                IsUpdate = false;
                // $("#btnSubmit").removeAttr("hidden");
                $("#SubmitDiv").attr("style", "display:block");
            }
        });
        //}
    }
}

function LoadExpenses(divExpense) {
    $("#savedExpenseClaimDate").text($("#ExpenseClaimDate").val());
    $("#savedExpenseType").text($("#ExpenseCategoryType option:selected").text());
    $("#savedExpenseBillAmount").text($("#ExpenseBillAmount").val());
    $("#savedExpenseBillCurrency").text($("#ExpenseBillCurrency option:selected").text());
    $("#savedExpenseExchangeRate").text($("#ExpenseExchangeRate").val());
    $("#savedExpenseJustification").text($("#ExpenseJustification").val());
    $("#TitleofExpense").text($("#ExpenseName").val());
    $("#savedExpense2").hide();
}

function ResetExpenseForm() {
    $("#ExpenseName").val('');
    $("#ExpenseClaimDate").val('');
    $("#ExpenseCategoryType").val('0');
    $("#ExpenseBillAmount").val('');
    $("#ExpenseBillCurrency").val('0');
    $("#ExpenseExchangeRate").val('');
    $("#ExpenseJustification").val('');
    $("#savedExpenseFormCount").val($("#savedExpenseFormCount").val() + 1);
    $("#TotalReimbursementAmount").html('');

}

function EditSavedExpense(expenseLineID) {
    var expenseLineId = expenseLineID.value;
    $("#ExpenseClaimDate").val($("#savedExpenseClaimDate_" + expenseLineId).text());
    //$("#ExpenseCategoryType").text($("#savedExpenseType").text());
    $("#ExpenseBillAmount").val($("#savedExpenseBillAmount_" + expenseLineId).text());
    //$("#ExpenseBillCurrency").text($("#savedExpenseBillCurrency").text());
    $("#ExpenseExchangeRate").val($("#savedExpenseExchangeRate_" + expenseLineId).text());
    $("#ExpenseJustification").val($("#savedExpenseJustification_" + expenseLineId).text());
    $("#ExpenseName").val($.trim($("#TitleofExpense_" + expenseLineId).text()));
    $("#ExpenseCategoryType").val($("#savedExpenseTypeID_" + expenseLineId).val());
    $("#ExpenseBillCurrency").val($("#savedExpenseBillCurrencyID_" + expenseLineId).val());
    IsUpdate = true;
    ExpenseLineID = expenseLineId;
    $("#btnSubmit").removeAttr("disabled");
    $("#btnSave").removeAttr("disabled");
    //$("#savedExpenseFormCount").val(1);
}

function DeleteExpense() {

}

function GetExpensePanel() {
    var divHtml = '<div class="panel panel-default" id="savedExpenses_expCatType"><div class="panel-heading"><h4 class="panel-title" data-toggle="collapse" data-parent="#RezExpenses" href="#rez-savedexpense"id="TitleofExpense_ExpenseLineIDs" >Cab Convinience</h4></div><input type="hidden" id="savedExpenseFormCount_ExpenseLineIDs" name="savedExpenseFormCount" /><input type="hidden" id="savedExpenseID" name="savedExpenseID" /><input type="hidden" id="savedExpenseLineID_ExpenseLineIDs" name="savedExpenseLineID" /><div id="rez-savedexpense" class="panel-collapse collapse in"><div class="panel-body"><div id="idexpSavedDet"><div class="expsaveddet"><div class="row"><div class="col-md-2"><label>Claim Date: <span id="savedExpenseClaimDate_ExpenseLineIDs">07 Jul 2017</span> </label></div><div class="col-md-2"><label>Bill Amount: <span id="savedExpenseBillAmount_ExpenseLineIDs">9000000</span></label></div><div class="col-md-3"><label>Bill Currency: <span id="savedExpenseBillCurrency_ExpenseLineIDs">AUD</span></label><input type="hidden" id="savedExpenseBillCurrencyID_ExpenseLineIDs" name="savedExpenseBillCurrencyID_ExpenseLineIDs"></div><div class="col-md-2"><label>Exchange Rate: <span id="savedExpenseExchangeRate_ExpenseLineIDs">49.09</span></label></div><div class="col-md-2"><label>Total Amount :<span class="rze-savedexptype" id="savedExpenseTotalAmount_CatExpenseLineIDs">0.00</span></label><input type="hidden" id="savedExpenseTypeID_ExpenseLineIDs" name="savedExpenseTypeID_ExpenseLineIDs"/></div>'
        + '<div class="rze-expactions"><span class="pull-right"><a><i id="btnEditSavedExpense" class="fa fa-pencil" aria-hidden="true" onclick=" EditSavedExpense(savedExpenseLineID_ExpenseLineIDs);"></i></a><a href=""><i class="fa fa-trash" aria-hidden="true"></i></a></span></div><div class="col-md-12"><label>Justification: <span id="savedExpenseJustification_ExpenseLineIDs">Business Trip</span></label></div><div class="col-md-12 rze-expattach"><label>Attachments</label><div class="row" id="savedExpenseAttachments_ExpenseLineIDs"><div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>Fuel Bill.png (50 KB)</small><div>Comments</div></div><div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>Cab Bill1.png (50 KB)</small><div>Comments</div></div><div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>Cab Bill2.png (50 KB)</small><div>Comments</div></div></div></div></div></div></div></div></div></div>'
    return divHtml;
}

function GetExpensePanelBody() {
    var divHtml = '<input type="hidden" id="savedExpenseFormCount_ExpenseLineIDs" name="savedExpenseFormCount" /><input type="hidden" id="savedExpenseID" name="savedExpenseID" /><input type="hidden" id="savedExpenseLineID_ExpenseLineIDs" name="savedExpenseLineID" /><div class="expsaveddet"><div class="row"><div class="col-md-2"><label>Claim Date: <span id="savedExpenseClaimDate_ExpenseLineIDs">07 Jul 2017</span> </label></div><div class="col-md-2"><label>Bill Amount: <span id="savedExpenseBillAmount_ExpenseLineIDs">9000000</span></label></div><div class="col-md-3"><label>Bill Currency: <span id="savedExpenseBillCurrency_ExpenseLineIDs">AUD</span></label><input type="hidden" id="savedExpenseBillCurrencyID_ExpenseLineIDs" name="savedExpenseBillCurrencyID_ExpenseLineIDs"></div><div class="col-md-2"><label>Exchange Rate: <span id="savedExpenseExchangeRate_ExpenseLineIDs">49.09</span></label></div><div class="col-md-2"><label>Total Amount: <span class="rze-savedexptype" id="savedExpenseTotalAmount_CatExpenseLineIDs">0.00</span></label><input type="hidden" id="savedExpenseTypeID_ExpenseLineIDs" name="savedExpenseTypeID_ExpenseLineIDs"/></div><div class="col-md-1 rze-expactions"><span class="pull-right"><a><i id="btnEditSavedExpense" class="fa fa-pencil" aria-hidden="true" onclick=" EditSavedExpense(savedExpenseLineID_ExpenseLineIDs);"></i></a><a href=""><i class="fa fa-trash" aria-hidden="true"></i></a></span></div><div class="col-md-12"><label>Justification: <span id="savedExpenseJustification_ExpenseLineIDs">Business Trip</span></label></div><div class="col-md-12 rze-expattach"><label>Attachments</label><div class="row" id="savedExpenseAttachments_ExpenseLineIDs"><div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>Fuel Bill.png (50 KB)</small><div>Comments</div></div><div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>Cab Bill1.png (50 KB)</small><div>Comments</div></div><div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <small>Cab Bill2.png (50 KB)</small><div>Comments</div></div></div></div></div></div></div></div>'
    return divHtml;

}

function TotalReimbursementAmount(amount, convertionrate) {
    $("#ExpenseExchangeRateError").html('');
    var exchangeRate = parseFloat($("#" + convertionrate).val());
    var billAmount = parseFloat($("#" + amount).val());
    var totalReimbursementAmount = billAmount * exchangeRate;
    $("#TotalReimbursementAmount").html("Total: " + totalReimbursementAmount);
    return totalReimbursementAmount;
}

function SubmitExpenseReport() {
    $("#lblMessage").html('');
    if ($("#savedExpenseID").val() == "") {
        return false;
    }
    var ExpenseReqNo = $("#savedExpenseID").val();
    var model = new Object();
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    //SaveTravelRequest();
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    "ExpenseRequest/ExpenseRequest/SubmitExpenseRequest/" + ExpenseReqNo + "/" + "0",
    "GET",
    $.postifyData(model),
    function (response) {
        if (response != null) {
            if (response != "") {

                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-success");

                if (response.indexOf('Approved') > 0) {
                    //LoadTravelRequest($("#TravelRequestNo").text(), 'TR-Draft');
                    $("#lblMessage").html(response);
                    //$("#TravelRequestStatus").html(response);

                    //$("#SubmittedTravelRequestCreateItinerary").append(createitenary);
                }
                else if (response.indexOf('submitted') > 0) {
                    $("#lblMessage").html(response);
                    //$("#TravelRequestStatus").html("Travel Request Review");
                    //$("#TravelRequestAction").html("Not Required");
                }
                closetab(event, 'NewExp', 'Expense Report Draft');
                LoadSavedExpenseReport(ExpenseReqNo, "test", "Self");
                //LoadExpenseReport(ExpenseReqNo, "Self");
            }
            $.unblockUI();
            $(window).scrollTop(0);

        }
    });

}

function LoadSavedExpenseReport(RequestNo, title, RequestType) {

    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + RequestNo;
    var MatchFound = false;
    var MatchedReqType = '';
    if (sessionStorage.SavedER != undefined) {
        SavedER = $.parseJSON(sessionStorage.SavedER);
        if (SavedER != '') {
            $.each(SavedER, function (key, value) {
                var savedKey = key.split("//")[0];
                if (savedKey == RequestNo)
                    MatchFound = true;
                if (MatchFound) {
                    MatchedReqType = key.split("//")[1];
                    if (MatchedReqType != RequestType) {
                        // changing existing one.
                        var tripName = title;
                        delete SavedER[key];
                        key = RequestNo + '//' + RequestType;
                        SavedER[key] = tripName;
                        sessionStorage.SavedER = JSON.stringify(SavedER);
                    }
                }
            });
            if (!MatchFound) {
                SavedER[RequestNo + "//" + RequestType] = title;
                sessionStorage.SavedER = JSON.stringify(SavedER);
            }
        }
    }
    else {
        var obj = {};
        obj[RequestNo + "//" + RequestType] = title;
        sessionStorage.SavedER = JSON.stringify(obj);
    }
    if ($("#myExpTab").children().length >= 3) {
        var clickedTab = RequestNo + "//" + RequestType;
        sessionStorage.ClickedTab = JSON.stringify(clickedTab);
    }
}

function LoadGrandTotal() {
    $('*[id*=ExpenseTotal_]:visible').each(function () {
        var value = $(this).text()
    });
}

function closetab(e, req, RequestType) {

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
            var id = "element_" + req + "_" + RequestType;
            if ($("#myExpTab .active").attr('id') == id) {
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
                $("#myExpTab li.active").each(function () {
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

function CreateRequest() {
    if (sessionStorage.SavedER != undefined) {
        SavedER = $.parseJSON(sessionStorage.SavedER);
        if (SavedER != '') {
            SavedER["NewExp//Expense Report Draft"] = "New Exp.";
            sessionStorage.SavedER = JSON.stringify(SavedER);
        }
    }
    else {
        var obj = {};
        obj["NewExp//Expense Report Draft"] = "New Exp.";
        sessionStorage.SavedER = JSON.stringify(obj);
    }
    window.location = "ExpenseCreateReport.html";
}

function CloseRequest(req) {
    if (req == undefined || req != "NewExp") {
        if ($("#myExpTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
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
}

function SwitchTab(tab) {
    $("#lblMessage").css("display", "none");

    if ($("#myExpTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
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

function getActiveTabDetail(tab) {
    $('#myNavbar li.active').each(function () {
        $(this).removeClass("active");
    });
    $(tab).attr('class', 'active');
    var ReqNo = tab.id.split("_")[1];
    var ReqType = tab.id.split("_")[2];
    if (ReqNo > 0) {
        var clickedTab = ReqNo + "//" + ReqType;
        sessionStorage.ClickedTab = JSON.stringify(clickedTab);
        window.location = "ExpenseSavedReport.html" + "?RequestNo=" + ReqNo;
    }
}

//function FindAdminOrEmployee() {
//    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
//    var serviceProxy = new ExpServiceProxy();
//    serviceProxy.invoke(
//        "ExpenseRequest/ExpenseRequest/GetUserInfo",
//        "POST",
//    null,
//    function (response) {
//        if (response != null) {
//            $("#hdnCultureInfo").val(response.CultureTypeInfo);
//            $('.rze-loginname').html(response.UserName);
//            $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
//            $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
//            $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
//            if (response.Role != "TMCAdmin" && response.Role != "TMCUser") {
//                $("#tmcProfile_headerBD").remove();
//                $("#tmcProfile_headerSD").remove();
//                $("#myProfile_headerBD").css("display", "");
//                $("#myProfile_headerSD").css("display", "");
//                if (response.approver == false) {
//                    $('#ApproverTab').css('display', 'block');
//                    $('#ApproverSection').attr('class', 'hide');
//                    $('#MyAssociates').hide();
//                    $('#AdminSection').attr('class', 'hide');
//                    $('#SelfSection').attr('class', 'tab-pane fade in active');
//                    $('#IsAdmin').val(false);
//                    LoadNonApproverExpenseRequest();
//                }
//                else {
//                    $('#ApproverTab').css('display', 'block');
//                    $('#ApproverSection').attr('class', 'hide');
//                    $('#AdminSection').attr('class', 'hide');
//                    $('#SelfSection').attr('class', 'tab-pane fade in active');
//                    $('#IsAdmin').val(false);
//                    LoadNonApproverExpenseRequest();
//                    $('#IsAdmin').val(false);
//                }
//            }
//            else {
//                $("#myProfile_headerBD").remove();
//                $("#myProfile_headerSD").remove();
//                $("#tmcProfile_headerSD").css("display", "");
//                $("#tmcProfile_headerBD").css("display", "");
//                $('#ApproverTab').css('display', 'none');
//                $('#ApproverSection').attr('class', 'hide');
//                $('#SelfSection').attr('class', 'hide');
//                $('#AdminSection').attr('class', 'tab-pane fade in active');
//                $('#IsAdmin').val(true);
//                //LoadAdminRequest('AdminDashboard');
//            }
//            $.unblockUI();
//        }
//    },
//    function (XMLHttpRequest, textStatus, errorThrown) {
//        $.unblockUI();
//        console.log(XMLHttpRequest);
//    },
//    "json"
//    );
//}

function checkUncheckFilter(filter) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var obj = {};
    var uncheckobj = {};
    var filterCriteria = new Array();

    var status = $(filter).parent().html().split('>')[1];

    if ($(filter)[0].checked) {
        obj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
    }
    else {
        uncheckobj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
    }
    if ($('#StatusFilter input:checked').length > 0) {
        $('#StatusFilter input:checked').each(function () {

            var status = $(this).parent().html().split('>')[1];

            obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
            if (status.toLowerCase().indexOf("approved") >= 0) {
                var type = status.split('-')[0].toLowerCase();
                filterCriteria.push(type + "-approved by l1");
                filterCriteria.push(type + "-approved by l2");
                filterCriteria.push(type + "-approved by l3");
            }
            else if (status.toLowerCase().indexOf("rejected") >= 0) {
                filterCriteria.push(type + "-rejected by l1");
                filterCriteria.push(type + "-rejected by l2");
                filterCriteria.push(type + "-rejected by l3");
            }
            else
                filterCriteria.push(status.toLowerCase());
        });
    }
    $.each(obj, function (key, value) {
        var s = value.split('-');
        if (s.length > 0) {
            var str = s[1];
            if (s[0].toLowerCase().indexOf('itr.') >= 0)
                value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
            else
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
        }
        else {
            var s = value.split(' ');
            value = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            value = s.join(' ');
        }
        $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)' checked='checked'>" + value + "</label></div>");
    });
    $.each(uncheckobj, function (key, value) {
        var s = value.split('-');
        if (s.length > 0) {
            var str = s[1];
            if (s[0].toLowerCase().indexOf('itr.') >= 0)
                value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
            else
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
        }
        else {
            var s = value.split(' ');
            value = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            value = s.join(' ');
        }

        $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
    });
    if (!$.isEmptyObject(uncheckobj)) {
        $.each(uncheckobj, function (key, value) {
            for (var i in filterCriteria) {
                if (filterCriteria[i] == value) {
                    filterCriteria.splice(i, 1);
                    break;
                }
            }
        });
    }
    ApplyStatusFilter(filterCriteria);
    $.unblockUI();
}

function checkUncheckFilterSelf(filter) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var obj = {};
    var uncheckobj = {};
    var filterCriteria = new Array();

    var status = $(filter).parent().html().split('>')[1];

    if ($(filter)[0].checked) {
        obj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
    }
    else {
        uncheckobj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
    }
    if ($('#StatusFilterSelf input:checked').length > 0) {
        $('#StatusFilterSelf input:checked').each(function () {

            var status = $(this).parent().html().split('>')[1];
            obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
            if (status.toLowerCase().indexOf("approved") >= 0) {
                var type = status.split('-')[0].toLowerCase();
                filterCriteria.push(type + "-approved by l1");
                filterCriteria.push(type + "-approved by l2");
                filterCriteria.push(type + "-approved by l3");
            }
            else if (status.toLowerCase().indexOf("rejected") >= 0) {
                filterCriteria.push(type + "-rejected by l1");
                filterCriteria.push(type + "-rejected by l2");
                filterCriteria.push(type + "-rejected by l3");
            }
            else
                filterCriteria.push(status.toLowerCase());
        });
    }
    $.each(obj, function (key, value) {
        var s = value.split('-');
        if (s.length > 0) {
            var str = s[1];
            if (s[0].toLowerCase().indexOf('itr.') >= 0)
                value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
            else
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
        }
        else {
            var s = value.split(' ');
            value = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            value = s.join(' ');
        }
        $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)' checked='checked'>" + value + "</label></div>");
    });
    $.each(uncheckobj, function (key, value) {
        var s = value.split('-');
        if (s.length > 0) {
            var str = s[1];
            if (s[0].toLowerCase().indexOf('itr.') >= 0)
                value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
            else
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
        }
        else {
            var s = value.split(' ');
            value = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            value = s.join(' ');
        }
        $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
    });
    if (!$.isEmptyObject(uncheckobj)) {
        $.each(uncheckobj, function (key, value) {
            for (var i in filterCriteria) {
                if (filterCriteria[i] == value) {
                    filterCriteria.splice(i, 1);
                    break;
                }
            }
        });
    }
    ApplyStatusFilterSelf(filterCriteria);
    $.unblockUI();
}

function ApplyStatusFilter(criteria) {

    if (criteria.length > 0) {
        if (sessionStorage.originalGrid != undefined) {
            originalGrid = $.parseJSON(sessionStorage.originalGrid);
            if (originalGrid != '') {
                $("#ApproverExpenseRequestGrid").empty();
                $.each(originalGrid, function (key, value) {
                    if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#ApproverExpenseRequestGrid").append(newRow);
                    }
                });
                var statusNotifyCount = $('#ApproverGrid tbody tr.row_main').length;
                if (statusNotifyCount > 0) {
                    $("#dashboardMyApprovalsTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                    $("#hdnShowCount").val(parseInt(statusNotifyCount));
                    $("#hdnTotalResultsCount").val(statusNotifyCount);
                }
                else { $("#dashboardMyApprovalsTabResultCount").html(" "); }
                if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#ApproverExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                else {
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#ApproverExpenseRequestGrid").empty();
                    $("#dashboardMyApprovalsTabResultCount").empty();
                    $("#ApproverExpenseRequestGrid").append(newRow);
                }
            }
        }
    }
    else {
        ResetStatusFilter('');
    }
}

function ApplyStatusFilterSelf(criteria) {
    if (criteria.length > 0) {
        if (sessionStorage.originalSelfGrid != undefined) {
            originalSelfGrid = $.parseJSON(sessionStorage.originalSelfGrid);
            if (originalSelfGrid != '') {
                $("#SelfExpenseRequestGrid").empty();
                $.each(originalSelfGrid, function (key, value) {
                    if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {

                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#SelfExpenseRequestGrid").append(newRow);
                    }
                });
                var statusNotifyCount = $('#SelfRequestGrid tbody tr.row_main').length;
                if (statusNotifyCount > 0) {
                    $("#myselfTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                    $("#hdnShowCount").val(parseInt(statusNotifyCount));
                    $("#hdnTotalResultsCount").val(statusNotifyCount);
                }
                else { $("#myselfTabResultCount").html(" "); }
                if ($("#SelfExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#SelfExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                else {
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#SelfExpenseRequestGrid").empty();
                    $("#myselfTabResultCount").empty();
                    $("#SelfExpenseRequestGrid").append(newRow);
                }
            }
        }
    }
    else {
        ResetStatusFilterSelf('');
    }
}

function ResetStatusFilterSelf(cond) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    if (sessionStorage.originalSelfGrid != undefined) {
        originalSelfGrid = $.parseJSON(sessionStorage.originalSelfGrid);
        if (originalSelfGrid != '') {
            $("#SelfExpenseRequestGrid").empty();
            $.each(originalSelfGrid, function (key, value) {
                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                $("#SelfExpenseRequestGrid").append(newRow);
                $("#hdnShowCount").val(parseInt(originalSelfGrid.length));
                $("#myselfTabResultCount").html("Showing " + originalSelfGrid.length + " " + "of " + originalSelfGrid.length);
                $("#hdnTotalResultsCount").val(parseInt(originalSelfGrid.length));
            });
            if ($("#SelfExpenseRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#SelfExpenseRequestGrid").append(ViewAllRow);
                GetHover();
            }
        }
    }
    if (cond == 'All') { // check all checkbox;
        var atr = $('#showingAllFilterSelf').attr('onclick');
        var str = atr.split('All');
        var natr = str.join('Clear');
        $('#showingAllFilterSelf').replaceWith('<input id="showingAllFilterSelf" type="checkbox" checked="checked">');
        $('#showingAllFilterSelf').attr('onclick', natr);
        var obj = {};
        if ($('#StatusFilterSelf input').length > 0) {
            $('#StatusFilterSelf input').each(function () {
                var status = $(this).parent().html().split('>')[1];
                obj[$(this).parent().closest('div')[0].id] = status;
            });
            $.each(obj, function (key, value) {
                $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)' checked='checked'>" + value + "</label></div>");
            });
        }

    }
    if (cond == 'Clear')  // uncheck All Checkbox
    {
        var atr = $('#showingAllFilterSelf').attr('onclick');
        var str = atr.split('Clear');
        var natr = str.join('All');
        $('#showingAllFilterSelf').replaceWith('<input id="showingAllFilterSelf" type="checkbox">');
        $('#showingAllFilterSelf').attr('onclick', natr);
        var obj = {};
        if ($('#StatusFilterSelf input').length > 0) {
            $('#StatusFilterSelf input').each(function () {
                var status = $(this).parent().html().split('>')[1];
                obj[$(this).parent().closest('div')[0].id] = status;
            });
            $.each(obj, function (key, value) {
                $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
            });
        }
    }
    $.unblockUI();
}

function ResetStatusFilter(cond) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    if (sessionStorage.originalGrid != undefined) {
        originalGrid = $.parseJSON(sessionStorage.originalGrid);
        if (originalGrid != '') {
            $("#ApproverExpenseRequestGrid").empty();
            $.each(originalGrid, function (key, value) {
                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                $("#ApproverExpenseRequestGrid").append(newRow);
                $("#hdnShowCount").val(parseInt(originalGrid.length));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + originalGrid.length + " " + "of " + originalGrid.length);
                $("#hdnTotalResultsCount").val(parseInt(originalGrid.length));

            });
            if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#ApproverExpenseRequestGrid").append(ViewAllRow);
                GetHover();
            }
        }
    }
    if (cond == 'All') { // check all checkbox;
        var atr = $('#showingAllFilter').attr('onclick');
        var str = atr.split('All');
        var natr = str.join('Clear');
        $('#showingAllFilter').replaceWith('<input id="showingAllFilter" type="checkbox" checked="checked">');
        $('#showingAllFilter').attr('onclick', natr);
        var obj = {};
        if ($('#StatusFilter input').length > 0) {
            $('#StatusFilter input').each(function () {
                var status = $(this).parent().html().split('>')[1];
                obj[$(this).parent().closest('div')[0].id] = status;
            });
            $.each(obj, function (key, value) {
                $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)' checked='checked'>" + value + "</label></div>");
            });
        }

    }
    if (cond == 'Clear')  // uncheck All Checkbox
    {
        var atr = $('#showingAllFilter').attr('onclick');
        var str = atr.split('Clear');
        var natr = str.join('All');
        $('#showingAllFilter').replaceWith('<input id="showingAllFilter" type="checkbox">');
        $('#showingAllFilter').attr('onclick', natr);
        var obj = {};
        if ($('#StatusFilter input').length > 0) {
            $('#StatusFilter input').each(function () {
                var status = $(this).parent().html().split('>')[1];
                obj[$(this).parent().closest('div')[0].id] = status;
            });
            $.each(obj, function (key, value) {
                $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
            });
        }
    }
    $.unblockUI();
}

function ApprExpenseRequestViewItem(status) {
    PageIndex = 1;
    ////$.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var criteria = new Array();
    var id = '';
    var type = '';
    var isPushedToCriteria = 'false';
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        type = "exp-";
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    type = "itr.-";
        //}
    else
        criteria.push(status.toLowerCase());

    if (type != '') {
        if (status.toLowerCase().indexOf("approved") >= 0) {
            criteria.push(type + "approved by l1");
            criteria.push(type + "approved by l2");
            criteria.push(type + "approved by l3");
            isPushedToCriteria = 'true';
        }
        else if (status.toLowerCase().indexOf("rejected") >= 0) {
            criteria.push(type + "rejected by l1");
            criteria.push(type + "rejected by l2");
            criteria.push(type + "rejected by l3");
            isPushedToCriteria = 'true';
        }
        else
            isPushedToCriteria = 'false';
        //criteria.push(status.toLowerCase());
    }

    var obj = {};
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        var s = status.split(' ')[2];
        status = "EXP-" + s[0].toUpperCase() + s.slice(1);
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    var s = status.split(' ')[1];
        //    status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        //}
    else {
        var s = status.split(' ');
        status = '';
        for (i = 0; i < s.length; i++) {
            if (s[i] != '')
                s[i] = s[i][0].toUpperCase() + s[i].slice(1);
        }
        status = s.join(' ');
    }

    if (isPushedToCriteria == 'false')
        criteria.push(status.toLowerCase());

    $('#StatusFilter div').each(function () {
        if ($(this).text().toLowerCase() == status.toLowerCase())
            id = $(this)[0].id;
    });
    obj[id] = status;
    ResetStatusFilter('Clear');
    $.each(obj, function (key, value) {
        $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)' checked='checked'>" + value + "</label></div>");
    });
    $('#ApproverExpenseRequestGrid').empty();
    $('#dashboardMyApprovalsTabResultCount').empty();
    if (status == "Itr.-Review") {
        var RequestStatus = $('#RequestStatus').val("6");
        $('#hdnStatusFilterOnCount').val('ITR-Pending');
    }
    else if (status == "EXP-Submitted") {
        var RequestStatus = $('#RequestStatus').val("2");
        $('#hdnStatusFilterOnCount').val('ERPending');
    }
    if (status == "Expense-Approved") {
        var RequestStatus = $('#RequestStatus').val("3");
        $('#hdnStatusFilterOnCount').val('ERApproved');
    }
    else if (status == "Expense-Rejected") {
        var RequestStatus = $('#RequestStatus').val("4");
        $('#hdnStatusFilterOnCount').val('ERRejected');
    }
        //else if (status == "Itr.-Approved") {
        //    var RequestStatus = $('#RequestStatus').val("7");
        //    $('#hdnStatusFilterOnCount').val('ITR-Approved');
        //}
        //else if (status == "Itr.-Rejected") {
        //    var RequestStatus = $('#RequestStatus').val("8");
        //    $('#hdnStatusFilterOnCount').val('ITR-Rejected');
        //}
    else { }
    //FilterRequest('Associates', true);
    //////ApplyStatusFilter(criteria); //sethu demo
    ////$.unblockUI();
}

function SelfExpenseRequestViewItem(status) {
    ////$.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    PageIndex = 1;
    var criteria = new Array();
    var id = '';
    var type = '';
    var isPushedToCriteria = 'false';
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        type = "exp-";
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    type = "itr.-";
        //}
    else
        criteria.push(status.toLowerCase());

    if (type != '') {
        if (status.toLowerCase().indexOf("approved") >= 0) {
            criteria.push(type + "approved by l1");
            criteria.push(type + "approved by l2");
            criteria.push(type + "approved by l3");
            isPushedToCriteria = 'true';
        }
        else if (status.toLowerCase().indexOf("rejected") >= 0) {
            criteria.push(type + "rejected by l1");
            criteria.push(type + "rejected by l2");
            criteria.push(type + "rejected by l3");
            isPushedToCriteria = 'true';
        }
        else
            isPushedToCriteria = 'false';
        //criteria.push(status.toLowerCase());
    }
    var obj = {};
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        var s = status.split(' ')[2];
        status = "EXP-" + s[0].toUpperCase() + s.slice(1);
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    var s = status.split(' ')[1];
        //    status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        //}
    else {
        var s = status.split(' ');
        status = '';
        for (i = 0; i < s.length; i++) {
            if (s[i] != '')
                s[i] = s[i][0].toUpperCase() + s[i].slice(1);
        }
        status = s.join(' ');
    }

    if (isPushedToCriteria == 'false')
        criteria.push(status.toLowerCase());

    $('#StatusFilterSelf div').each(function () {
        if ($(this).text().toLowerCase() == status.toLowerCase())
            id = $(this)[0].id;
    });
    obj[id] = status;
    ResetStatusFilterSelf('Clear');
    $.each(obj, function (key, value) {
        $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)' checked='checked'>" + value + "</label></div>");
    });
    $('#SelfExpenseRequestGrid').empty();
    $('#myselfTabResultCount').empty();
    if (status == "EXP-Draft") {
        var RequestStatus = $('#RequestStatus_Self').val("1");
    }
    else if (status == "EXP-Submitted") {
        var RequestStatus = $('#RequestStatus_Self').val("2");
    }
    else if (status == "EXP-Approved") {
        var RequestStatus = $('#RequestStatus_Self').val("3");
    }
    else if (status == "EXP-Rejected") {
        var RequestStatus = $('#RequestStatus_Self').val("4");
    }
        //else if (status == "Itr.-Approved") {
        //    var RequestStatus = $('#RequestStatus_Self').val("7");
        //}
        //else if (status == "Itr.-Rejected") {
        //    var RequestStatus = $('#RequestStatus_Self').val("8");
        //}
    else { }
    //$('#hdnStatusFilterOnCount').val(RequestStatus);
    //FilterRequest('self', true);
    //////ApplyStatusFilterSelf(criteria);   //sethu demo cgs
    ////$.unblockUI();
}

function LoadStatus() {
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke("ExpenseRequest/ExpenseRequest/GetExpenseRequestStatus",
    "POST",
    null,
    function (response) {
        var cnt = parseFloat('1');
        $.each(response, function (key, value) {

            if (key == '0')
                value = "All";
            else {
                if (value.indexOf("Expense Request") >= 0) {
                    value = "EXP-" + value.split(' ')[2];
                }
            }
            //if (key > 8 || value == "All") {
            //    $("#StatusFilterAdmin").append("<div id='" + cnt + "_Admin'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)'>" + value + "</label></div>");
            //    $("#RequestStatus_Admin").append("<option value='" + key + "'>" + value + "</option>");
            //}
            $("#RequestStatus").append("<option value='" + key + "'>" + value + "</option>");
            $("#RequestStatus_Approver").append("<option value='" + key + "'>" + value + "</option>");
            if (value != "All") {
                $("#RequestStatus").append("<div id='" + cnt + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
                $("#RequestStatus_Approver").append("<div id='" + cnt + "_Self'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
                cnt = cnt + 1;
            }
        });
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function LoadExpenseCategories() {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
    "ExpenseRequest/ExpenseCategoryDetails",
    "GET",
    null,
    function (response) {

        if (response != null && response.length > 0) {
            $("#ExpenseCategoryType").html("");
            $("#ExpenseCategoryType").append("<option value='0'>Select</option>");
            for (count in response) {
                $("#ExpenseCategoryType").append("<option value='" + response[count].ExpenseCategoryID + "'>" + response[count].CategoryName + "</option>");

            }
            $.unblockUI();
        }
        else {
            $("#ExpenseCategoryType").append("<option value='0'>Select</option>");
            $.unblockUI();
        }
    });

}

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

function LoadApproverExpenseRequest() {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var arrDashboardStatus;
    var IsScroll = $('#hdnIsScroll').val();
    var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
    if (IsScroll == "true") {
        var pageIndex = parseInt(PageIndex);
        var totalCnt = $("#hdnTotalResultsCount").val();
        var showCnt = $("#hdnShowCount").val();
        if (showCnt == totalCnt) {
            return false;
        }
        if (pageIndex > 1) {
            skipCount = (pageIndex - 1) * defaultTakeCount;
        }
        else {
            skipCount = 0;
        }
    }
    else {
        skipCount = 0;
    }

    var selectedMonth = "June";//$('#thirdMonth').text().split(" ")[0];
    var selectedYear = "2017";//$('#thirdMonth').text().split(" ")[2];
    selectedMonth = $.inArray(selectedMonth, monthNames) + 1;

    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetApproverExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount,
        //"TravelRequest/TravelRequest/GetApproverTravelRequest/632AB514-23B6-4157-99D5-281DCEE6114B/1104/" + selectedMonth + "/" + selectedYear,
    "POST",
    null,
    function (response) {

        if (response.data.length > 0) {
            if (PageIndex == 1) { $("#ApproverExpenseRequestGrid").empty(); }
            $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
            $("#hdncorporateId").val("1104");
            $.each(response.data, function (key, value) {
                var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
               + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
               + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
               + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Associate\');">View Details / Take Action</a></div></td></tr>';
                $("#ApproverExpenseRequestGrid").append(newRow);

            });
            if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                //var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                //$("#ApproverExpenseRequestGrid").append(ViewAllRow);
            }
            isLoadingData = false;
            GetHover();
            if (response.dashboardStatus == "") {
                response.dashboardStatus = "0,0,0,0,0,0"
            }
            arrDashboardStatus = response.dashboardStatus.split(",");
            var pendingCnt = parseFloat(arrDashboardStatus[0]);
            var approvedCnt = parseFloat(arrDashboardStatus[1]);
            var rejectedCnt = parseFloat(arrDashboardStatus[2]);
            if (PageIndex == 1) {
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
                $("#hdnConstantTotalResults").val(parseInt(response.count));

                //Dashboard status count on page load
                $('#TRPending').html(ConvertNumber(pendingCnt));
                $('#TRApproved').html(ConvertNumber(approvedCnt));
                $('#TRRejected').html(ConvertNumber(rejectedCnt));
            }
            else {
                CurrentCount = $("#hdnShowCount").val();
                CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                $("#hdnShowCount").val(parseInt(CurrentCount));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }

            var originalGrid = $('#ApproverGrid tr.row_main:has(td)').map(function (i, v) {
                var $td = $('td', this);

                return {
                    id: ++i,
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
                    RequestStatus: $td.eq(6).text(),
                    Action: $td.eq(7).text()
                }
            }).get();
            sessionStorage.originalGrid = JSON.stringify(originalGrid);
            $.unblockUI();
        }
        else {
            if (PageIndex == 1) {
                if (response.dashboardStatus == "") {
                    response.dashboardStatus = "0,0,0,0,0,0"
                }
                arrDashboardStatus = response.dashboardStatus.split(",");
                var pendingCnt = parseFloat(arrDashboardStatus[0]);
                var approvedCnt = parseFloat(arrDashboardStatus[2]);
                var rejectedCnt = parseFloat(arrDashboardStatus[3]);
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#ApproverExpenseRequestGrid").empty();
                $("#dashboardMyApprovalsTabResultCount").empty();
                $("#ApproverExpenseRequestGrid").append(newRow);

                $('#TRPending').html(ConvertNumber(pendingCnt));
                $('#TRApproved').html(ConvertNumber(approvedCnt));
                $('#TRRejected').html(ConvertNumber(rejectedCnt));
                $.unblockUI();
            }
        }
        if (arrDashboardStatus[0] == 0)
            $('#TRPending_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRPending_Anchor').attr("onclick", "ApprExpenseRequestViewItem('expense report submitted')").removeClass("rez-nolinks");
        if (arrDashboardStatus[1] == 0)
            $('#TRApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRApproved_Anchor').attr("onclick", "ApprExpenseRequestViewItem('expense report approved')").removeClass("rez-nolinks");
        if (arrDashboardStatus[2] == 0)
            $('#TRRejected_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRRejected_Anchor').attr("onclick", "ApprExpenseRequestViewItem('expense report rejected')").removeClass("rez-nolinks");
        //if (arrDashboardStatus[3] == 0)
        //    $('#IRPending_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRPending_Anchor').attr("onclick", "ApprExpenseRequestViewItem('itinerary review')").removeClass("rez-nolinks");
        //if (arrDashboardStatus[4] == 0)
        //    $('#IRApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRApproved_Anchor').attr("onclick", "ApprExpenseRequestViewItem('itinerary approved')").removeClass("rez-nolinks");
        //if (arrDashboardStatus[5] == 0)
        //    $('#IRRejected_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRRejected_Anchor').attr("onclick", "ApprExpenseRequestViewItem('itinerary rejected')").removeClass("rez-nolinks");
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function LoadNonApproverExpenseRequest() {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var arrDashboardStatus;
    var IsScroll = $('#hdnIsScroll').val();
    var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
    if (IsScroll == "true") {
        var pageIndex = parseInt(PageIndex);
        var totalCnt = $("#hdnTotalResultsCount").val();
        var showCnt = $("#hdnShowCount").val();
        if (showCnt == totalCnt) {
            return false;
        }
        if (pageIndex > 1) {
            skipCount = (pageIndex - 1) * defaultTakeCount;
        }
        else {
            skipCount = 0;
        }
    }
    else {
        skipCount = 0;
    }
    var selectedMonth = $('#thirdMonth_Self').text().split(" ")[0];
    var selectedYear = $('#thirdMonth_Self').text().split(" ")[2];
    selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetNonApproverExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount,
    "POST",
    null,
    function (response) {
        if (response != null && response != undefined) {
            if (response.data != null && response.data.length == 0) { PageIndex = 1; }

            if (response.data != null && response.data.length > 0) {

                if (PageIndex == 1) { $("#SelfExpenseRequestGrid").empty(); }
                $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
                $("#hdncorporateId").val("1104");
                $.each(response.data, function (key, value) {

                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                    + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                    + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                     + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                     + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                    + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                    $("#SelfExpenseRequestGrid").append(newRow);
                    //dlo
                });
                isLoadingData = false;

                GetHover();
                if (response.dashboardStatus == "") {
                    response.dashboardStatus = "0,0,0,0,0,0"
                }

                arrDashboardStatus = response.dashboardStatus.split(",");

                var savedCnt = parseFloat(arrDashboardStatus[0]);
                var submittedCnt = parseFloat(arrDashboardStatus[1]);
                var approvedCnt = parseFloat(arrDashboardStatus[2]);
                var rejectedCnt = parseFloat(arrDashboardStatus[3]);
                //var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
                //var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
                if (PageIndex == 1) {
                    //Dashboard status count on page load

                    $('#TRSaved_Self').html(ConvertNumber(savedCnt));
                    $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
                    $("#TRApproved_Self").html(ConvertNumber(approvedCnt));
                    $('#TRRejected_Self').html(ConvertNumber(rejectedCnt));
                    //$("#IRApproved_Self").html(ConvertNumber(IRapprovedCnt));
                    //$("#IRRejected_Self").html(ConvertNumber(IRrejectedCnt));
                    //
                    $("#hdnShowCount").val(parseInt(response.data.length));
                    $("#myselfTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                    $("#myselfTabResultCount").show();
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                    $("#hdnConstantTotalResults").val(parseInt(response.count));
                }
                else {
                    CurrentCount = $("#hdnShowCount").val();
                    CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                    $("#hdnShowCount").val(parseInt(CurrentCount));
                    $("#myselfTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                    $("#myselfTabResultCount").show();
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }

                var originalSelfGrid = $('#SelfRequestGrid tr.row_main:has(td)').map(function (i, v) {
                    var $td = $('td', this);
                    return {
                        id: ++i,
                        RequestNo: $td.eq(0).text(),
                        RequestDate: $td.eq(1).text(),
                        TravelRequestNo: $td.eq(2).text(),
                        ReportName: $td.eq(3).text(),
                        BillAmount: $td.eq(4).text(),
                        BillCurrency: $td.eq(5).text(),
                        RequestStatus: $td.eq(6).text(),
                        Action: $td.eq(7).text()
                    }
                }).get();
                sessionStorage.originalSelfGrid = JSON.stringify(originalSelfGrid);
                //if ($("#SelfTravelRequestGrid").children().length > 0) {
                //    var ViewAllRow = "<tr id=rzebtn><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                //    $("#SelfTravelRequestGrid").append(ViewAllRow);
                //}
                $.unblockUI();
            }
            else {
                if (PageIndex == 1) {
                    if (response.dashboardStatus == "") {
                        response.dashboardStatus = "0,0,0,0,0,0"
                    }
                    arrDashboardStatus = response.dashboardStatus.split(",");
                    var savedCnt = parseFloat(arrDashboardStatus[0]);
                    var submittedCnt = parseFloat(arrDashboardStatus[1]);
                    var approvedCnt = parseFloat(arrDashboardStatus[2]);
                    var rejectedCnt = parseFloat(arrDashboardStatus[3]);
                    //var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
                    //var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
                    var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#SelfExpenseRequestGrid").empty();
                    $("#myselfTabResultCount").empty();
                    $("#SelfExpenseRequestGrid").append(newRow);

                    $('#TRSaved_Self').html(ConvertNumber(savedCnt));
                    $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
                    $("#TRApproved_Self").html(ConvertNumber(approvedCnt));
                    $('#TRRejected_Self').html(ConvertNumber(rejectedCnt));
                    //$("#IRApproved_Self").html(ConvertNumber(IRapprovedCnt));
                    //$("#IRRejected_Self").html(ConvertNumber(IRrejectedCnt));
                    $.unblockUI();
                }
            }

            //if (CallFrom == "calenderBack") {
            //    return false;
            //}
            if (savedCnt == 0)
                $('#TRSaved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
            else
                $('#TRSaved_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Report draft')").removeClass("rez-nolinks");

            if (rejectedCnt == 0)
                $('#TRRejected_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
            else
                $('#TRRejected_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Report rejected')").removeClass("rez-nolinks");

            if (submittedCnt == 0)
                $('#TRSubmitted_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
            else
                $('#TRSubmitted_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Report submitted')").removeClass("rez-nolinks");

            if (approvedCnt == 0)
                $('#TRApproved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
            else
                $('#TRApproved_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Report approved')").removeClass("rez-nolinks");

            //if (IRapprovedCnt == 0)
            //    $('#IRApproved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
            //else
            //    $('#IRApproved_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('itinerary approved')").removeClass("rez-nolinks");

            //if (IRrejectedCnt == 0)
            //    $('#IRRejected_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
            //else
            //    $('#IRRejected_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('itinerary rejected')").removeClass("rez-nolinks");

        }
    }
 ,
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function rzeDboardFootable() {
    $('.table').footable({
        "breakpoints": {
            "xxs": 320,
            "xs": 480, // extra small
            "sm": 768, // small
            "md": 992, // medium
            "lg": 1200 // large
        }
    });
    //$("#ApproverExpenseRequestGrid td:empty").addClass("emptytd");
    $("#SelfExpenseRequestGrid td:empty").addClass("emptytd");
}

function gototravelrequestedit(RequestNo, title, RequestType) {

    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + RequestNo;
    var MatchFound = false;
    var MatchedReqType = '';
    if (sessionStorage.SavedER != undefined) {
        SavedER = $.parseJSON(sessionStorage.SavedER);
        if (SavedER != '') {
            $.each(SavedER, function (key, value) {
                var savedKey = key.split("//")[0];
                if (savedKey == RequestNo)
                    MatchFound = true;
                if (MatchFound) {
                    MatchedReqType = key.split("//")[1];
                    if (MatchedReqType != RequestType) {
                        // changing existing one.
                        var tripName = title;
                        delete SavedER[key];
                        key = RequestNo + '//' + RequestType;
                        SavedER[key] = tripName;
                        sessionStorage.SavedER = JSON.stringify(SavedER);
                    }
                }
            });
            if (!MatchFound) {
                SavedER[RequestNo + "//" + RequestType] = title;
                sessionStorage.SavedER = JSON.stringify(SavedER);
            }
        }
    }
    else {
        var obj = {};
        obj[RequestNo + "//" + RequestType] = title;
        sessionStorage.SavedER = JSON.stringify(obj);
    }
    if ($("#myExpTab").children().length >= 3) {
        var clickedTab = RequestNo + "//" + RequestType;
        sessionStorage.ClickedTab = JSON.stringify(clickedTab);
    }
}

function convertDate(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

function ConvertNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}

function LoadCalender() {
    $('#calenderBackward').attr("onclick", "calenderBackward('');")
    $('#calenderForward').attr("onclick", "calenderForward('');")
    $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
    $('#calenderForward_Self').attr("onclick", "calenderForward('self');")

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var now = new Date();

    var d = new Date(),

    n = d.getMonth(),

    day = d.getDay(),

    y = d.getFullYear();


    var presentMonth = new Date();

    var oneMonthsFromNow = new Date(y, n - 1, day);

    var twoMonthsFromNow = new Date(y, n - 2, day);

    $('#thirdMonth_Self').html(monthNames[presentMonth.getMonth()].substring(0, 3) + "  " + presentMonth.getFullYear());

    $('#secondMonth_Self').html(monthNames[oneMonthsFromNow.getMonth()].substring(0, 3) + "  " + oneMonthsFromNow.getFullYear());

    $('#firstMonth_Self').html(monthNames[twoMonthsFromNow.getMonth()].substring(0, 3) + "  " + twoMonthsFromNow.getFullYear());

    $('#thirdMonth_Admin').html(monthNames[presentMonth.getMonth()].substring(0, 3) + "  " + presentMonth.getFullYear());

    $('#secondMonth_Admin').html(monthNames[oneMonthsFromNow.getMonth()].substring(0, 3) + "  " + oneMonthsFromNow.getFullYear());

    $('#firstMonth_Admin').html(monthNames[twoMonthsFromNow.getMonth()].substring(0, 3) + "  " + twoMonthsFromNow.getFullYear());

    $('#thirdMonth').html(monthNames[presentMonth.getMonth()].substring(0, 3) + "  " + presentMonth.getFullYear());

    $('#secondMonth').html(monthNames[oneMonthsFromNow.getMonth()].substring(0, 3) + "  " + oneMonthsFromNow.getFullYear());

    $('#firstMonth').html(monthNames[twoMonthsFromNow.getMonth()].substring(0, 3) + "  " + twoMonthsFromNow.getFullYear());
    CalenderRestriction();
}

function CalenderRestriction() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var now = new Date();
    var presentMonthNo = now.getMonth();
    var presentYear = now.getFullYear();
    var presentMonth = monthNames[presentMonthNo];
    var CalenderUpperLimitMonth = $('#thirdMonth').text().split(" ")[0];
    var CalenderUpperLimitYear = $('#thirdMonth').text().split(" ")[2];
    if (CalenderUpperLimitMonth == presentMonth && CalenderUpperLimitYear == presentYear)
        $('#calenderForward').removeAttr("onclick");

    var CalenderLowerLimitMonth = $('#firstMonth').text().split(" ")[0];
    var CalenderLowerLimitYear = $('#firstMonth').text().split(" ")[2];
    if (CalenderLowerLimitMonth == "Jan" && CalenderLowerLimitYear == "2017")
        $('#calenderBackward').removeAttr("onclick");


    var CalenderUpperLimitMonth_Self = $('#thirdMonth_Self').text().split(" ")[0];
    var CalenderUpperLimitYear_Self = $('#thirdMonth_Self').text().split(" ")[2];
    if (CalenderUpperLimitMonth_Self == presentMonth && CalenderUpperLimitYear_Self == presentYear)
        $('#calenderForward_Self').removeAttr("onclick");

    var CalenderLowerLimitMonth_Self = $('#firstMonth_Self').text().split(" ")[0];
    var CalenderLowerLimitYear_Self = $('#firstMonth_Self').text().split(" ")[2];
    if (CalenderLowerLimitMonth_Self == "Jan" && CalenderLowerLimitYear_Self == "2017")
        $('#calenderBackward_Self').removeAttr("onclick");

    var CalenderUpperLimitMonth_Admin = $('#thirdMonth_Admin').text().split(" ")[0];
    var CalenderUpperLimitYear_Admin = $('#thirdMonth_Admin').text().split(" ")[2];
    if (CalenderUpperLimitMonth_Admin == presentMonth && CalenderUpperLimitYear_Admin == presentYear)
        $('#calenderForward_Admin').removeAttr("onclick");

    var CalenderLowerLimitMonth_Admin = $('#firstMonth_Admin').text().split(" ")[0];
    var CalenderLowerLimitYear_Admin = $('#firstMonth_Admin').text().split(" ")[2];
    if (CalenderLowerLimitMonth_Admin == "Jan" && CalenderLowerLimitYear_Admin == "2017")
        $('#calenderBackward_Admin').removeAttr("onclick");

}

function SelectCalender(element) {
    $('#hdnSelectCalenderMonth').html(element.innerText.split(" ")[0].split("[")[1]);
    $('#hdnSelectCalenderYear').html(element.innerText.split(" ")[1].split("]")[0]);
}

function calenderBackward(page) {

    //ResetRequest()
    PageIndex = 1;
    $("#hdnShowCount").val("0");
    var calender = '';
    var firstCalenderDate = new Date();
    var secondCalenderDate = new Date();
    var thirdCalenderDate = new Date();
    var now = new Date();
    if (page.toLowerCase() == 'self') {
        calender = $('#firstMonth_Self').text();
    }
    else if (page.toLowerCase() == 'admin') {
        calender = $('#firstMonth_Admin').text();
    }
    else {
        calender = $('#firstMonth').text();
    }
    var selectedMonth = calender.split(" ")[0];
    var selectedYear = calender.split(" ")[2];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (selectedYear == '2017') {
        var month = $.inArray(selectedMonth, monthNames);
        var janMonth = $.inArray('Jan', monthNames);
        var diff = month - janMonth;
        var preMonth = $.inArray(selectedMonth, monthNames);
        var PresentDate = new Date(selectedYear, preMonth, 1);
        var oneMonthsFromNow = new Date(PresentDate.setMonth(month - 1));
        var PresentDate = new Date(selectedYear, preMonth, 1);
        var oneMonthsAfter = new Date(PresentDate.setMonth(month + 1));
        var PresentDate = new Date(selectedYear, preMonth, 1);
        firstCalenderDate = oneMonthsFromNow;
        secondCalenderDate = PresentDate;
        thirdCalenderDate = oneMonthsAfter;
    }


    if (page.toLowerCase() == 'self') {
        $('#firstMonth_Self').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

        $('#secondMonth_Self').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

        $('#thirdMonth_Self').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

        LoadNonApproverExpenseRequest();
    }
    else if (page.toLowerCase() == 'admin') {
        $('#firstMonth_Admin').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

        $('#secondMonth_Admin').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

        $('#thirdMonth_Admin').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

        LoadAdminRequest('AdminDashboard');
    }
    else {
        $('#firstMonth').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

        $('#secondMonth').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

        $('#thirdMonth').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

        LoadApproverExpenseRequest();
    }
    $('#calenderBackward').attr("onclick", "calenderBackward('');")
    $('#calenderForward').attr("onclick", "calenderForward('');")
    $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
    $('#calenderForward_Self').attr("onclick", "calenderForward('self');")
    CalenderRestriction();
}

function calenderForward(page) {
    //ResetRequest()
    PageIndex = 1;
    $("#hdnShowCount").val("0");
    var firstCalenderDate = new Date();
    var secondCalenderDate = new Date();
    var thirdCalenderDate = new Date();
    var calender = '';
    var now = new Date();
    if (page.toLowerCase() == "self") {
        calender = $('#thirdMonth_Self').text();
    }
    else if (page.toLowerCase() == 'admin') {
        calender = $('#firstMonth_Admin').text();
    }
    else {
        calender = $('#thirdMonth').text();
    }
    var selectedMonth = calender.split(" ")[0];
    var selectedYear = calender.split(" ")[2];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var month = $.inArray(selectedMonth, monthNames);
    var presentMonth = now.getMonth();
    if ((presentMonth - month) > 2) {
        var month = $.inArray(selectedMonth, monthNames);
        var PresentDate = new Date(selectedYear, month, 1);
        var oneMonthsAfterNow = new Date(PresentDate.setMonth(month + 1));
        PresentDate = new Date(selectedYear, month, 1);
        var secondMonthsAfterNow = new Date(PresentDate.setMonth(month + 2));
        PresentDate = new Date(selectedYear, month, 1);
        var thirdMonthsAfterNow = new Date(PresentDate.setMonth(month + 3));
        firstCalenderDate = oneMonthsAfterNow;
        secondCalenderDate = secondMonthsAfterNow;
        thirdCalenderDate = thirdMonthsAfterNow;
    }
    else {
        var diff = presentMonth - month;
        var preMonth = $.inArray(selectedMonth, monthNames);
        var PresentDate = new Date(selectedYear, preMonth, 1);
        var oneMonthsFromNow = new Date(PresentDate.setMonth(month - 1));
        var PresentDate = new Date(selectedYear, preMonth, 1);
        var oneMonthsAfter = new Date(PresentDate.setMonth(month + 1));
        var PresentDate = new Date(selectedYear, preMonth, 1);
        firstCalenderDate = oneMonthsFromNow;
        secondCalenderDate = PresentDate;
        thirdCalenderDate = oneMonthsAfter;
    }


    if (page.toLowerCase() == "self") {
        $('#firstMonth_Self').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

        $('#secondMonth_Self').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

        $('#thirdMonth_Self').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

        LoadNonApproverExpenseRequest();
    }
    else if (page.toLowerCase() == "admin") {
        $('#firstMonth_Admin').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

        $('#secondMonth_Admin').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

        $('#thirdMonth_Admin').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

        LoadAdminRequest('AdminDashboard');
    }
    else {
        $('#firstMonth').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

        $('#secondMonth').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

        $('#thirdMonth').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

        LoadApproverExpenseRequest();
    }
    $('#calenderBackward').attr("onclick", "calenderBackward('');")
    $('#calenderForward').attr("onclick", "calenderForward('');")
    $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
    $('#calenderForward_Self').attr("onclick", "calenderForward('self');")
    $('#calenderBackward_Admin').attr("onclick", "calenderBackward('Admin');")
    $('#calenderForward_Admin').attr("onclick", "calenderForward('Admin');")
    CalenderRestriction();
}

function FilterRequest(tabname, Submit) {
    if (Submit) { PageIndex = 1 }
    if (PageIndex == 1) { $("#hdnShowCount").val("0"); }
    $("#hdnIsFilterApplied").val(true);
    $("#hdnFilterRequestType").val(tabname);

    var statusFilterApplied;
    if (tabname.toLowerCase() != 'self') {
        if ($('#hdnStatusFilterOnCount').val() != '0')
            statusFilterApplied = $('#hdnStatusFilterOnCount').val();
        else
            statusFilterApplied = "NoFilter";
    }
    else { statusFilterApplied = "NoFilter"; }

    if (tabname == 'Associates') {
        if ($('#hdnStatusFilterOnCount').val() != '0')
            statusFilterApplied = $('#hdnStatusFilterOnCount').val();
        else
            statusFilterApplied = "NoFilter";
    }

    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var isApprover = $('#MyAssociates').hasClass("active");
    if (!isApprover) {
        var RequestedDate = $('#RequestedDate_Self').val();
        var RequestStatus = $('#RequestStatus').val();
        var TripName = $('#ReportName_Self').val();
        var RequestNo = $('#RequestNo_Self').val();

    }
    else {
        var RequestedDate = $('#RequestedDate_Approver').val();
        var RequestStatus = $('#RequestStatus_Approver').val();
        var TripName = $('#ReportName_Approver').val();
        var RequestNo = $('#RequestNo_Approver').val();

        if (statusFilterApplied != null && statusFilterApplied != "") {
            if (statusFilterApplied = "ERPending") {
                RequestStatus = "2";
            }
            else if (statusFilterApplied = "ERApproved") {
                RequestStatus = "3";
            }
            else if (statusFilterApplied = "ERRejected") {
                RequestStatus = "4";
            }
            else if (statusFilterApplied = "ERWithdrawn") {
                RequestStatus = "5";
            }

        }
    }
    // need to provide request start date from calender last 3 month...????
    var IsScroll = $('#hdnIsScroll').val();
    var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
    if (IsScroll == "true") {
        var pageIndex = parseInt(PageIndex);
        var totalCnt = $("#hdnTotalResultsCount").val();
        var showCnt = $("#hdnShowCount").val();
        if (showCnt == totalCnt) {
            return false;
        }
        if (pageIndex > 1) {
            skipCount = (pageIndex - 1) * defaultTakeCount;
        }
        else {
            skipCount = 0;
        }
    }
    else {
        skipCount = 0;
    }
    if (tabname == 'Associates') { //sethu uat fix
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var selectedMonth = $('#thirdMonth').text().split(" ")[0];
        var selectedYear = $('#thirdMonth').text().split(" ")[2];
        selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    }
    else if (tabname == 'Self') {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var selectedMonth = $('#thirdMonth_Self').text().split(" ")[0];
        var selectedYear = $('#thirdMonth_Self').text().split(" ")[2];
        selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    }
    var totalCount = $("#hdnConstantTotalResults").val();
    var UserId = $('#hdnUserId').val();
    var corporateId = $('#hdncorporateId').val();
    var RequestFilterCriteria =
        {
            ReportName: TripName,
            RequestNo: RequestNo,
            RequestDate: RequestedDate,
            RequestStatus: RequestStatus,
            isApprover: isApprover,
            UserId: UserId,
            corporateId: corporateId
        };
    isLoadingData = true;
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/FilterExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + totalCount + "/" + statusFilterApplied,
    "POST",
       RequestFilterCriteria,
    function (response) {
        $('#hdnStatusFilterOnCount').val('0');
        if (isApprover) {
            if (response.data.length > 0) {
                if (PageIndex == 1) { $("#ApproverExpenseRequestGrid").empty(); }
                $.each(response.data, function (key, value) {
                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                  + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                  + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                   + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                   + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                  + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Associate\');">View Details / Take Action</a></div></td></tr>';


                    $("#ApproverExpenseRequestGrid").append(newRow);
                });
                isLoadingData = false;
                if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#ApproverExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                SearchToggle(tabname);
                HideSearchToggle(tabname);
                $.unblockUI();
            }
            else {
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#ApproverExpenseRequestGrid").empty();
                $("#dashboardMyApprovalsTabResultCount").empty();
                $("#ApproverExpenseRequestGrid").append(newRow);
                SearchToggle(tabname);
                $.unblockUI();
            }
            if (PageIndex == 1) {
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }
            else {
                CurrentCount = $("#hdnShowCount").val();
                CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                $("#hdnShowCount").val(parseInt(CurrentCount));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }
        }
        else {
            if (response.data.length > 0) {
                $("#hdnShowCount").val(parseInt(response.data.length) + parseInt($("#hdnShowCount").val()))
                if (PageIndex == 1) { $("#SelfExpenseRequestGrid").empty(); }
                $.each(response.data, function (key, value) {

                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                                  + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                                  + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                                   + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                                   + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                                  + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                    $("#SelfExpenseRequestGrid").append(newRow);
                });
                isLoadingData = false;
                if ($("#SelfExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#SelfExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                tabname = "Self";
                SearchToggle(tabname);
                HideSearchToggle(tabname);
                $.unblockUI();
            }
            else {
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#SelfExpenseRequestGrid").empty();
                $("#myselfTabResultCount").empty();
                $("#SelfExpenseRequestGrid").append(newRow);
                tabname = "Self";
                SearchToggle(tabname);
                $.unblockUI();
            }

            if (PageIndex == 1) {
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#myselfTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }
            else {
                CurrentCount = $("#hdnShowCount").val();
                //CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                $("#hdnShowCount").val(parseInt(CurrentCount));
                $("#myselfTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }
        }


        //if (tabname.toLowerCase() != 'self')
        //    ResetStatusFilter('Clear');
        //else
        //    ResetStatusFilterSelf('Clear');

    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

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

function addCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function GotoProflie(profile) {
    if ($("#myExpTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").attr("class", "alert alert-info");
        $("#lblMessage").html('Kindly Save Data.');
        return false;
    }
    else {
        if (profile == 'myprofile')
            window.location = "/EmployeeProfile.html";
        else if (profile == 'mytmc')
            window.location = "/TMCProfile.html";
    }
}

//function getActiveTabDetail(tab)
//{
//    
//    if ($("#myExpTab .active").attr('id') == 'element_NewExp_Travel Request Draft')
//    {
//        $("#lblMessage").removeAttr("class");
//        $("#lblMessage").attr("class", "alert alert-info");
//        $("#lblMessage").html('Kindly Save Data.');
//        event.preventDefault();
//    }
//    else
//    {
//        $('#myExpTab li.active').each(function ()
//        {
//            $(this).removeClass("active");
//        });
//        $(tab).attr('class', 'active');
//        var ReqNo = tab.id.split("_")[1];
//        var RequestType = tab.id.split("_")[2];
//        if (ReqNo > 0)
//            LoadExpenseReport(ReqNo, RequestType);
//    }
//}


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

function LoadDropDownList(dropDownId, list, value) {
    $(dropDownId).html("");
    for (count in list) {
        $(dropDownId).append("<option value='" + list[count].Value.toString() + "'>" + list[count].Text.toString() + "</option>");
    }
    $(dropDownId).val(value);

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


var isLoadingData;
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height() && !isLoadingData) {
        isLoadingData = true;
        $('#hdnIsScroll').val("true");
        var IsFilterApplied = $('#hdnIsFilterApplied').val();

        var totalCnt = $("#hdnTotalResultsCount").val();
        var showCnt = $("#hdnShowCount").val();
        if (showCnt == totalCnt) {
            return false;
        }
        if (IsFilterApplied == "false") {
            PageIndex++;
            if ($('#hdnCalledByAdminDashboard').val() == "true") { LoadAdminRequest('AdminDasboard'); }
            else if ($('#MySelf').hasClass('active')) { LoadNonApproverExpenseRequest(); }
            else { LoadApproverExpenseRequest(); } //$('#MyAssociates').hasClass('active')
        }
        else {
            PageIndex++;
            var FilterRequestTabType = $('#hdnFilterRequestType').val();
            FilterRequest(FilterRequestTabType);
        }
    }
});

function ConvertNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}











