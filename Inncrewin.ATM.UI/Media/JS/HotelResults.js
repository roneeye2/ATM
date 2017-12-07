$(".stars").each(function () {
    try {

        var val = "3";

        var size = Math.max(0, (Math.min(5, val))) * 16;

        var $span = $('<span />').width(size);

        $(this).html($span);
    } catch (error) {
        $().Logger.error("HotelResults.js .stars()-->" + error)

    }
});


$(function () {
    try {
        var obj = getUrlVars();
        var Noofdays = showDays(obj.CheckOutDate, obj.CheckInDate);
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "HotelSearch/Search/Results",
        "GET",
        null,
        function (response) {
            if (response != null) {
                for (res in response.Hotels) {
                    var img = $('<img />', {
                        id: 'HotelImage',
                        src: "http://img.zohostatic.com/discussions/v1/images/defaultPhoto.png",
                        alt: response.Hotels[res].HotelDetail.HotelName
                    });
                    $("#HotelResults").append(img);
                    var hotelname = response.Hotels[res].HotelDetail.HotelName;
                    $("#HotelResults").append('<label id="HotelName">' + hotelname + '</label><br />');
                    var location = "Jp nagar, bengaluru, karnataka, india";
                    $("#HotelResults").append('<label id="Location">' + location + '</label><br />');
                    var Price = "200$";
                    $("#HotelResults").append('<label id="Price">' + Price + '</label>' + '&nbsp;' + "Per Day<br />");
                    var TotalPrice = response.Hotels[res].Price.TotalPrice;
                    $("#HotelResults").append("Total Price" + '&nbsp;' + '<label id="TotalPrice">' + TotalPrice + '</label><br />');
                    var Description = "This is a beautiful hotel in the center of bengaluru with lush green surroundings";
                    $("#HotelResults").append('<label id="Description">' + Description + '</label><br />');
                    var PassengerCount = (+obj["Adult[1]"]) + (+obj["Adult[2]"]);
                    $("#HotelResults").append("Number of Passengers :" + '&nbsp;' + '<label id="PassengerCount">' + PassengerCount + '</label><br />');
                    var NoOfNights = Noofdays;
                    $("#HotelResults").append("No of nights :" + '&nbsp;' + '<label id="NoOfNights">' + NoOfNights + '</label><br />');
                    var tabs = $("#Tabs").html();
                    $("#HotelResults").append(tabs + '<br/>');
                    $("#Tabs").show();
                    $("#HotelResults").append('<br/>');
                }
            };
        }, function (XMLHttpRequest, textStatus, errorThrown) { }, null)
    } catch (error) {
        $().Logger.error("HotelResults.js function()-->" + error)
    }
});


function showDays(firstDate, secondDate) {
    try {
        var startDay = new Date(firstDate);
        var endDay = new Date(secondDate);
        var millisecondsPerDay = 1000 * 60 * 60 * 24;

        var millisBetween = startDay.getTime() - endDay.getTime();
        var days = millisBetween / millisecondsPerDay;

        return Math.floor(days);
    } catch (error) {
        $().Logger.error("HotelResults.js showDays()-->" + error)
    }
}


function ViewPrice() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "HotelSearch/Search/HotelDetails",
        "GET",
        null,
        function (response) {
            if (response != null) {
                var cloneHtml = '';
                for (hot in response.Hotels) {
                    for (dp in response.Hotels[hot].PerDayPrice) {
                        var bedtype = response.Hotels[hot].PerDayPrice[dp].BedType;
                        $("#ViewPrice").append('<label id="bedtype">' + bedtype + '</label><br />');
                        for (pb in response.Hotels[hot].PerDayPrice[dp].DayPrice) {
                            var dayprice = response.Hotels[hot].PerDayPrice[dp].DayPrice[pb].Price.TotalPrice;
                            $("#ViewPrice").append('<label id="DayPrice">' + dayprice + '</label><br />');
                            var date = response.Hotels[hot].PerDayPrice[dp].DayPrice[pb].ServiceDate;
                            $("#ViewPrice").append('<label id="date">' + date + '</label><br />');
                            var DivPrice = $("#ViewPrice").html();
                            cloneHtml = DivPrice;
                        }
                    }
                    $("#HotelResults").append(cloneHtml + '<br/>');
                    $("#ViewPrice").show();
                    $("#HotelResults").append('<br/>');
                }
            };
        }, function (XMLHttpRequest, textStatus, errorThrown) { }, null)
    } catch (error) {
        $().Logger.error("HotelResults.js ViewPrice()-->" + error)
    }
};