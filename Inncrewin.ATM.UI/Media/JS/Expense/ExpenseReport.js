var RequestNo = 0;
var ExpenseLineID = 0;
var IsUpdate = false;
// The travellers.

var intervals = [];
var timerCnt = parseFloat('0');
var PageIndex = 1;
var CurrentCount;
function ValidateExpenseDetailForm()
{
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

function SaveExpenseReport()
{
    
    if (ValidateExpenseDetailForm()) {
        return false;
    }
    else {
        var model = new Object();
        RequestNo = $("#savedExpenseID").val();
        if (RequestNo > 0)
            model.ExpenseID = RequestNo;
        else
            model.ExpenseID = 0;
        model.Name = $("#ExpenseReportName").val();
        model.ReimbursementAmount = 0;
        model.ReimbursementCurrencyID = $("#ExpenseReportReimburseCurrency option:selected").val();
        model.TravelRequestNo = $("#ExpenseReportRefId").val();
        if (model.TravelRequestNo == "")
            model.TravelRequestNo = "0";

        model.ExpenseRequestLineItem = new Array();
        model.ExpenseAttachments = new Array();
        var expenseRequestLineItems = new Object();

        var cnt = 0;
        $('*[id*=FilePath]').each(function () {
            var expenseAttachment = new Object();
            expenseAttachment.FileName = $(this).text();
            expenseAttachment.Path = $(this).attr('href');
            expenseAttachment.Comments = $('#comment' + cnt).text();
            model.ExpenseAttachments.push(expenseAttachment);
            cnt = cnt + 1;
        });


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
        function (response)
        {
            if (response != null) {
                $('#AttachedFiles').empty();
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
                        var AttachmentsDetail = response.split("||")
                        var cntVal = 1;

                        var AttDetail = "";
                        for (i = 1; i < AttachmentsDetail.length; i++)
                        {
                            if (AttachmentsDetail[i].split("//")[3] == 'null' || AttachmentsDetail[i].split("//")[3] == null) {
                                AttachmentsDetail[i].split("//")[3] = '';
                            }
                            AttDetail = AttDetail + '<div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <a id=' + 'FilePath' + ExpenseLineID + '_' + i + ' href=' + AttachmentsDetail[i].split("//")[1] + ' download><small>' + AttachmentsDetail[i].split("//")[2] + '</small></a>'
                                 //+ '<a class=deleteItem href="#" onclick="DeleteAttachment("' + AttachmentsDetail[i].split("//")[1] + '","' + response.AttachmentID + '")" name=' + jsonResponse.FileName + ' id=deleteItem_' + FileCounter + ' @><i class="fa fa-trash-o"></i></a>'
                                + '<div>' + AttachmentsDetail[i].split("//")[3] + '</div></div>'

                        }
                        clonecont = clonecont.replace(new RegExp("No Attachments", "g"), AttDetail);
                        $("#RezExpenses").append(clonecont);

                    }
                    else {
                        var clonecont = GetExpensePanelBody();
                        ExpenseLineID = response.split("//")[1];
                        clonecont = clonecont.replace(new RegExp("CatExpenseLineIDs", "ig"), (CategoryType + ExpenseLineID));
                        clonecont = clonecont.replace(new RegExp("ExpenseLineIDs", "ig"), ExpenseLineID);

                        clonecont = clonecont.replace(new RegExp("expCatType", "ig"), CategoryType);

                        var AttachmentsDetail = response.split("||")
                        var cntVal = 1;
                        var AttDetail = "";

                        for (i = 1; i < AttachmentsDetail.length; i++) {
                            AttDetail = AttDetail + '<div class="col-md-4"><i class="fa fa-file-text" aria-hidden="true"></i> - <a id=' + 'FilePath' + ExpenseLineID + '_' + i + ' href=' + AttachmentsDetail[i].split("//")[1] + ' download><small>' + AttachmentsDetail[i].split("//")[2] + '</small></a>'
                                //+ '<a class=deleteItem href="#" onclick="DeleteAttachment("' + AttachmentsDetail[i].split("//")[1] + '","' + response.AttachmentID + '")" name=' + jsonResponse.FileName + ' id=deleteItem_' + FileCounter + ' @><i class="fa fa-trash-o"></i></a>'
                                + '<div>' + AttachmentsDetail[i].split("//")[3] + '</div></div>'


                        }
                        clonecont = clonecont.replace(new RegExp("No Attachments", "g"), AttDetail);
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
                    if(RequestNo > 0)
                        $("#savedExpenseID").val(RequestNo);
                    else
                        $("#savedExpenseID").val("");
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
                closeExpTab(event, 'NewExp', 'Expense Report Draft');
                LoadSavedExpenseReport(RequestNo, "test", "Self");
                return true;
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
    $("#ExpenseClaimDateError").html('');
    $("#ExpenseCategoryTypeError").html('');
    $("#ExpenseBillAmountError").html('');
    $("#ExpenseBillCurrencyError").html('');
    $("#ExpenseJustificationError").html('');

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
    var divHtml = '<div class="panel panel-default" id="savedExpenses_expCatType"><div class="panel-heading"><h4 class="panel-title" data-toggle="collapse" data-parent="#RezExpenses" href="#rez-savedexpense"id="TitleofExpense_ExpenseLineIDs" >Cab Convinience</h4></div><input type="hidden" id="savedExpenseFormCount_ExpenseLineIDs" name="savedExpenseFormCount" /><input type="hidden" id="savedExpenseID" name="savedExpenseID" /><input type="hidden" id="savedExpenseLineID_ExpenseLineIDs" name="savedExpenseLineID" /><div id="rez-savedexpense" class="panel-collapse collapse in"><div class="panel-body"><div id="idexpSavedDet"><div class="expsaveddet"><div class="row"><div class="col-md-2"><label>Claim Date: <span id="savedExpenseClaimDate_ExpenseLineIDs">07 Jul 2017</span> </label></div><div class="col-md-2"><label>Bill Amount: <span id="savedExpenseBillAmount_ExpenseLineIDs">9000000</span></label></div><div class="col-md-2"><label>Bill Currency: <span id="savedExpenseBillCurrency_ExpenseLineIDs">AUD</span></label><input type="hidden" id="savedExpenseBillCurrencyID_ExpenseLineIDs" name="savedExpenseBillCurrencyID_ExpenseLineIDs"></div><div class="col-md-2"><label>Exchange Rate: <span id="savedExpenseExchangeRate_ExpenseLineIDs">49.09</span></label></div><div class="col-md-2"><label>Total Amount :<span class="rze-savedexptype" id="savedExpenseTotalAmount_CatExpenseLineIDs">0.00</span></label><input type="hidden" id="savedExpenseTypeID_ExpenseLineIDs" name="savedExpenseTypeID_ExpenseLineIDs"/></div><div class="col-md-2"><label>Settled Amount :<span class="rze-savedexptype" id="savedExpenseSettlementAmount_CatExpenseLineIDs">0.00</span></label></div>'
        + '<div class="rze-expactions"><span class="pull-right"><a><i id="btnEditSavedExpense" class="fa fa-pencil" aria-hidden="true" onclick=" EditSavedExpense(savedExpenseLineID_ExpenseLineIDs);"></i></a><a href=""><i class="fa fa-trash" aria-hidden="true"></i></a></span></div><div class="col-md-12"><label>Justification: <span id="savedExpenseJustification_ExpenseLineIDs">Business Trip</span></label></div><div class="col-md-12 rze-expattach"><label>Attachments</label><div class="row" id="savedExpenseAttachments_ExpenseLineIDs">'
        + 'No Attachments'
        + '</div></div></div></div></div></div></div></div>'
    return divHtml;
}

function GetExpensePanelBody() {
    var divHtml = '<input type="hidden" id="savedExpenseFormCount_ExpenseLineIDs" name="savedExpenseFormCount" /><input type="hidden" id="savedExpenseID" name="savedExpenseID" /><input type="hidden" id="savedExpenseLineID_ExpenseLineIDs" name="savedExpenseLineID" /><div class="expsaveddet"><div class="row"><div class="col-md-2"><label>Claim Date: <span id="savedExpenseClaimDate_ExpenseLineIDs">07 Jul 2017</span> </label></div><div class="col-md-2"><label>Bill Amount: <span id="savedExpenseBillAmount_ExpenseLineIDs">9000000</span></label></div><div class="col-md-2"><label>Bill Currency: <span id="savedExpenseBillCurrency_ExpenseLineIDs">AUD</span></label><input type="hidden" id="savedExpenseBillCurrencyID_ExpenseLineIDs" name="savedExpenseBillCurrencyID_ExpenseLineIDs"></div><div class="col-md-2"><label>Exchange Rate: <span id="savedExpenseExchangeRate_ExpenseLineIDs">49.09</span></label></div><div class="col-md-2"><label>Total Amount: <span class="rze-savedexptype" id="savedExpenseTotalAmount_CatExpenseLineIDs">0.00</span></label><input type="hidden" id="savedExpenseTypeID_ExpenseLineIDs" name="savedExpenseTypeID_ExpenseLineIDs"/></div><div class="col-md-1 rze-expactions"><span class="pull-right"><a><i id="btnEditSavedExpense" class="fa fa-pencil" aria-hidden="true" onclick=" EditSavedExpense(savedExpenseLineID_ExpenseLineIDs);"></i></a><a href=""><i class="fa fa-trash" aria-hidden="true"></i></a></span></div><div class="col-md-12"><label>Justification: <span id="savedExpenseJustification_ExpenseLineIDs">Business Trip</span></label></div><div class="col-md-12 rze-expattach"><label>Attachments</label><div class="row" id="savedExpenseAttachments_ExpenseLineIDs">'
                    + 'No Attachments'
                    + '</div></div></div></div></div></div>'
    return divHtml;

}


function TotalReimbursementAmount(amount, convertionrate) {
    $("#ExpenseExchangeRateError").html('');
    $("#TotalReimbursementAmount").html("")
    var exchangeRate = parseFloat($("#" + convertionrate).val()).toFixed(3);
    var billAmount = parseFloat($("#" + amount).val()).toFixed(3);
    if (!isNaN(exchangeRate) && exchangeRate != 0 && exchangeRate != undefined) {
        $("#ExpenseExchangeRate").val(exchangeRate);
    }
    if (!isNaN(billAmount) && billAmount != 0 && billAmount != undefined) {
        $("#ExpenseBillAmount").val(billAmount);
    }
    if (!isNaN(exchangeRate) && exchangeRate != 0 && exchangeRate != undefined && !isNaN(billAmount) && billAmount != 0 && billAmount != undefined) {
        var totalReimbursementAmount = (billAmount * exchangeRate).toFixed(3);
        $("#ExpenseExchangeRateError").html("Total: " + totalReimbursementAmount);
        $("#TotalReimbursementAmount").html("Total : " + totalReimbursementAmount);
        return totalReimbursementAmount;
    }
    else {
        $("#TotalReimbursementAmount").html("Total : 0");
        $("#ExpenseExchangeRateError").html("Total : 0");
        return 0;
    }
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
                closeExpTab(event, 'NewExp', 'Expense Report Draft');
                LoadSavedExpenseReport(ExpenseReqNo, "test", "Self");
                //LoadExpenseReport(ExpenseReqNo, "Self");
            }
            $.unblockUI();
            $(window).scrollTop(0);

        }
    });

}
function ExpenseBillCurrencyOnChange() {
    debugger;
    $('#ExpenseBillCurrencyError').html('');
    var ExpBillCurr = $('#ExpenseBillCurrency').val();
    var ExpRemCurr = $('#ExpenseReportReimburseCurrency').val();
    if (ExpBillCurr == ExpRemCurr)
    {
        $('#ExpenseExchangeRate').val('1');
        $("#ExpenseExchangeRate").attr("disabled", "disabled");
        TotalReimbursementAmount('ExpenseBillAmount', 'ExpenseExchangeRate');
    }
    else {
        $('#ExpenseExchangeRate').val('');
        $("#ExpenseExchangeRate").removeAttr("disabled");
        TotalReimbursementAmount('ExpenseBillAmount', 'ExpenseExchangeRate');
    }
}
function ExpenseReportReimburseCurrencyOnChange() {
    debugger;
    $('#ExpenseReportReimburseCurrencyError').html('')
    var ExpBillCurr = $('#ExpenseBillCurrency').val();
    var ExpRemCurr = $('#ExpenseReportReimburseCurrency').val();
    if (ExpBillCurr == ExpRemCurr) {
        $('#ExpenseExchangeRate').val('1');
        $("#ExpenseExchangeRate").attr("disabled", "disabled");
        TotalReimbursementAmount('ExpenseBillAmount', 'ExpenseExchangeRate');
    }
    else {
        $('#ExpenseExchangeRate').val('');
        $("#ExpenseExchangeRate").removeAttr("disabled");
        TotalReimbursementAmount('ExpenseBillAmount', 'ExpenseExchangeRate');
    }
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



