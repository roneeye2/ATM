
$(function ()
{
 
    
    'use strict';
    $('#fileUploadForm').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        //xhrFields: {'Access-Control-Allow-Origin':'*'},
        //url: 'http://localhost/jQueryFileUpload/server/php'
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileUploadForm').fileupload(
        'option',
        'redirect',
        window.location.href.replace(/\/[^\/]*$/, '/cors/result.html?%s')
    );

    if (window.location.hostname === 'blueimp.github.io') {
        //$('#fileUploadForm').fileupload('option', {
        //    //url: '//jquery-file-upload.appspot.com/',
        //    // Enable image resizing, except for Android and Opera, which actually support image resizing, but fail to send Blob objects via XHR requests:
        //    disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
        //    maxFileSize: 999000,
        //    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        //});
        if ($.support.cors) {
            $.ajax({
                //url: '//jquery-file-upload.appspot.com/',
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>').text('Upload server currently unavailable - ' + new Date()).appendTo('#fileUploadForm');
            });
        }
    } else {
        $('#fileUploadForm').addClass('fileupload-processing');

        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            //url: $('#fileUploadForm').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileUploadForm')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done').call(this, $.Event('done'), { result: result });
        });
    }

    $('#btUpload').on('click', function (event)
    {
        debugger;
        $("div[id^=file_upload_error]").html("");
        $("div[id^=alreadyUploded_file_Info]").text("").removeClass("alert alert-success");
       
        var file_size = 0; var file_counter = 0; var file_selection = true; var file_type = true; var file_size_flag = true; var file_counter_flag = true;
        var extension = ""; var fileName = "";
        if ($("table[role=presentation]").text().trim() == "" && $("#txtAreaVoucherComments").val().trim() == "") {
            $("#file_upload_error").html("<span class='alert alert-danger'>(Voucher information required).</font>");
            return false;
        }
        else
        {
            $(".template-upload #fileNameSpan").each(function (index, element)
            {

                file_counter = file_counter + 1;
                fileName = $(element).text();
                file_size = file_size + parseInt($(element).siblings("#fileSizeSpan").text());
                extension = fileName.replace(/^.*\./, '');
                if (extension == fileName)
                    extension = '';
                else extension = extension.toLowerCase();
                if (file_size > 5120)
                {
            
                    file_size_flag = false;
                    return;
                }
                if (extension != "pdf" && extension != "doc" && extension != "docx" && extension.toLowerCase() != "jpeg" && extension.toLowerCase() != "jpg" && extension.toLowerCase() != "png")
                {
                
                    file_type = false;
                    return;
                }
                if (file_counter > 5)
                {
            
                    file_counter_flag = false;
                    return;
                }
            });

           
            if (file_type == false)
            {
                $("div[id^=file_upload_error]").html("<span class='alert alert-danger'>(Allowed file formats are PDF,Jpeg,png, Word).</font>");
                return 

            }
            if (file_size_flag == false)
            {
                $("div[id^=file_upload_error]").html("<span class='alert alert-danger'>Submitted file size " + file_size + " KB is greater than 5MB (5120 KB).</font>");
                return 

            }
            if (file_counter_flag == false)
            {
                $("div[id^=file_upload_error]").html("<span class='alert alert-danger'>Please select less than 5 files at a time.</font>");
                return 

            }
            //$(".template-upload #fileNameSpan").each(function (index, element)
            //{
            //    file_counter = file_counter + 1;
            //    fileName = $(element).text();
            //    file_size = file_size + parseInt($(element).siblings("#fileSizeSpan").text());
            //    extension = fileName.replace(/^.*\./, '');
            //    if (extension == fileName) extension = '';
            //    else extension = extension.toLowerCase();
            //    if (file_size > 5120) { file_selection = false; file_size_flag = false; }
            //    if (extension != "pdf" && extension != "doc" && extension != "docx" && extension.toLowerCase() != "jpeg" && extension.toLowerCase() != "png") { file_selection = false; file_type = false; }
            //    if (file_counter > 5)
            //    {
            //        file_selection = false; file_counter_flag = false;
            //    }
            //});
            //if ($("table[role=presentation]").text().trim() == "")
            //{
            //    file_selection = false;
            //    $("#file_upload_error").html("<span class='alert alert-danger'>Atleast one file should be selected.</font>");
            //    return false;
            //}
            //if (file_selection == false)
            //{
            //    if (file_type == false)
            //    {
            //        $("#file_upload_error").html("<span class='alert alert-danger'>(Allowed file formats are PDF,Jpeg,png, Word).</font>");
            //        return false;
            //    }
            //    if (file_size_flag == false)
            //    {
            //        $("#file_upload_error").html("<span class='alert alert-danger'>Submitted file size " + file_size + " KB is greater than 5MB (5120 KB).</font>");
            //        return false;
            //    }
            //    if (file_counter_flag == false)
            //    {
            //        $("#file_upload_error").html("<span class='alert alert-danger'>Please select less than 5 files at a time.</font>");
            //        return false;
            //    }
            //}
            //if ($("#txtAreaVoucherComments").val().trim() != "") {
            //    //if (!(/^\s*[~!@#$%^&*\s]+\s*$/).test($("#txtAreaVoucherComments").val().trim()) && $("#txtAreaVoucherComments").val().trim() != '') { $("#file_upload_error").html("<span class='alert alert-danger'>(Voucher comments should not contain special charecters.)</font>"); return false; }
            //}
            return true;
        }
    });
    

});
