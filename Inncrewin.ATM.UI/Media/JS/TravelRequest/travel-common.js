// JavaScript source code
$(document).ready(function () {
    /*Tooltip*/
    $("span").tooltip({ container: 'body' });
});

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
    $('[rel="Adminpopover"]').popover({
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

//function SearchToggle(tabname) {
//    $("#rze-wrap" + tabname).slideToggle();
//    $("#rze-overlay" + tabname).toggleClass("overlaybox")
//}

