
$(document).ready(function () {
    LoadExpenseCategories();
    LoadExpenseCurrency();
    $('#footer').load('/footer.html', function () { FindAdminOrEmployee(); });
    $("#ExpenseClaimDate").datepicker({
        changeMonth: true, changeYear: true,
        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
        onClose: function (event) {
            validateB2EDate(event, "ExpenseClaimDate")
        }
    });

    $("#RequestedDate_Self").datepicker({
        changeMonth: true, changeYear: true,
        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
        onClose: function (event) {
            validateB2EDate(event, "RequestedDate_Self")
        }
    });

    $("#RequestedDate_Approver").datepicker({
        changeMonth: true, changeYear: true,
        dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
        onClose: function (event) {
            validateB2EDate(event, "RequestedDate_Approver")
        }
    });

    $("#ExpenseClaimDate").mask(sessionStorage.CultureMaskFormat);
    $("#RequestedDate_Self").mask(sessionStorage.CultureMaskFormat);
    $("#RequestedDate_Approver").mask(sessionStorage.CultureMaskFormat);
    GetHover();
});
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
function alertmsg(msg) {
    bootbox.alert({
        message: msg,
        size: 'small',
    })
}

//function CreateExpenseReport()
//{
//    $(".rze-expbody").show();

//}


// JavaScript source code
$(document).ready(function () {
    /*Tooltip*/
    $("span").tooltip({ container: 'body' });
});
// Set date picker for start date.
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
window.onload = function () {

    /*Table Hover*/
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
    $('tr.row_sub').mouseenter(function () {

        $('tr.row_main').css('background', '#fff')
        $(this).prev('tr.row_main').css('background', '#ccc')

    });
    $('tr.row_sub').mouseleave(function () {
        $('tr.row_main').css('background', '#fff')
        $(this).prev('tr.row_main').css('background', '#ccc')


    });

}

$(function () {
    $('[rel="popover"]').popover({
        trigger: 'focus',
        container: 'body',
        html: true,
        delay: {
            hide: "100"
        },
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function (e) {
        e.preventDefault();
    });
    $('[rel="Selfpopover"]').popover({
        trigger: 'focus',
        container: 'body',
        html: true,
        delay: {
            hide: "100"
        },
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function (e) {
        e.preventDefault();
    });
    $('[rel="MyReq_popover"]').popover({
        trigger: 'focus',
        container: 'body',
        html: true,
        delay: {
            hide: "100"
        },
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function (e) {
        e.preventDefault();
    });
    $('[rel="MyAssociate_popover"]').popover({
        trigger: 'focus',
        container: 'body',
        html: true,
        delay: {
            hide: "100"
        },
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function (e) {
        e.preventDefault();
    });

});













