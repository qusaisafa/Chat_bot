var outputArea = $("#chat-output");

$("#user-input-form").on("submit", function (e) {

    e.preventDefault();

    var message = $("#user-input").val();

    outputArea.append("\n    <div class='user-message'>\n   <img style='width: 36px;float: right;'src='user.png'>   <div class='message'>\n        " + message + "\n      </div>\n    </div>\n  ");

    ajaxCall(userId, message);

    $("#user-input").val("");
});

var ajaxCall = function (id, queryData) {
    var formData = {userId: id, query: queryData};
    $.ajax({
        url: 'http://ServerURL/bot',
        data: formData,
        // async: false,
        success: function (data) {
            buildHtmlQuestion(id, data);
        },
        error: function () {
        }
    });
    return false;
}
// function temp(userId, txt){
//     ajaxCall(userId, txt);
// }
function buildHtmlQuestion(userId, jsonResponse) {
    var hints = [];
    var responseMessage = jsonResponse['response'].toString();
    if (jsonResponse['hint']) {
        hints = jsonResponse['hint'].split("|");
    }

    else if(responseMessage.indexOf('address') >= 0 || responseMessage.indexOf('coupon') >= 0 ){
        hints = null;
    }
    else if(responseMessage.indexOf('Clear History') >= 0 ){
        hints[0] = "Clear History";
        hints[1] = "start";
    }
    else if(!responseMessage){
        responseMessage = "something wrong!"
        hints[0] = "start" ;
    }
    else{
        hints[0] = "YES";
        hints[1] = "NO";
    }
    var queryName = jsonResponse['query'];
    var questionHtml =  '\n    <div class="bot-message">\n  <img style="width: 40px;float: left;margin-top: 5px;"src="bot.png">    <div class="message">\n        ' + responseMessage + '\n      </div>\n    </div>\n  ';
    var html = '\n <div class="bot-message ">';
    html +='\n <div class="hint-container ">';
    if(hints!=null)
        for(var i=0;i<hints.length;i++){
            var hint = hints[i];
            html +='      \n<button  class="hint-message">\n        ' + hints[i] +'\n       </button>\n      ';
        }
    html += '</div>';

    setTimeout(function () {
        outputArea.append(questionHtml);
        if(hints!=null)
            outputArea.append(html);

        outputArea.find('.hint-message').click(function(e) {

            $('.hint-container').hide();
            e.preventDefault();
            var txt = $(e.target).text();
            if(txt.indexOf('Clear History') >= 0){
                $('.chat-output').empty();
            }
            else {
                setTimeout(function () {
                    outputArea.append('\n      <div class="user-message">\n <img style="width: 36px;float: right;"src="user.png">  <div class="message">\n ' + txt + '  </div>\n      </div>\n    ');
                    outputArea.append('<div class="typing-loader"></div>');
                    $('div.typing-loader').delay(500).fadeOut(function () {});
                }, 250);
                ajaxCall(userId, txt);
            }
        });

        var scroll    = $('#chat-output');
        var height = scroll[0].scrollHeight;
        scroll.scrollTop(height+50);
        //     $('html, body').animate({
        //         scrollTop: $(".chat-output").offset().top
        //     }, 1500);
    }, 250);

}
$( document ).ready(function() {
    $("#chat").hide();
});
// var userId = Math.floor(Math.random() * 99999999);
var userId="";
$('.chat-button').click(function(e) {
    $("#chat").toggle();
    if($("#chat").css("display") != "none") {
        if($(".bot-message").length > 0) {
            userId = Math.floor(Math.random() * 99999999);
            ajaxCall(userId, "/start");
        }
    }
    else{
        // $('.chat-output').empty();
    }
});