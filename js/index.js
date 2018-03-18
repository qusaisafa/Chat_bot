var outputArea = $("#chat-output");
var userId = 9999999999; //default

$("#user-input-form").on("submit", function (e) {

    e.preventDefault();

    var message = $("#user-input").val();

    outputArea.append("\n    <div class='user-message'>\n   <img style='width: 36px;float: right;'src='user.png'>   <div class='message'>\n        " + message + "\n      </div>\n    </div>\n  ");

    ajaxCall(message);

    $("#user-input").val("");

    scrollDown();
});
var ajaxCall = function (queryData) {
    var formData = {userId: userId, query: queryData};
    $.ajax({
        url: 'http://serverUrl',
        data: formData,
        success: function (data) {
            buildHtmlQuestion(data);
        },
        error: function () {
            BotMessage();
        }
    });
    return false;
}

function buildHtmlQuestion(jsonResponse) {
    var hints = [];
    var responseMessage = jsonResponse['response'].toString();
    if (jsonResponse['hint']) {
        hints = jsonResponse['hint'].split("|");
    }

    else if(responseMessage.indexOf('address') >= 0 || responseMessage.indexOf('coupon') >= 0 ){
    }
    else if(responseMessage.indexOf('Clear History') >= 0 ){
        hints[0] = "Clear History";
        hints[1] = "/start";
    }
    else{
        hints[0] = "YES";
        hints[1] = "NO";
    }
    var html = '\n <div class="bot-message ">';
    html +='\n <div class="hint-container ">';
    if(hints)
        for (var i = 0; i < hints.length; i++) {
            var hint = hints[i];
            html += '      \n<button  class="hint-message">\n        ' + hints[i] + '\n       </button>\n      ';
        }

    html += '</div>';
        BotMessage(responseMessage)
        scrollDown();
        if(hints) {
            window.setTimeout(function () {
                outputArea.append(html);
                scrollDown()
                outputArea.find('.hint-message').click(function(e) {
                    clickHandler(e);
                });
            }, 600);
        }
    saveSettings();
}

function scrollDown(){
    var scroll    = $('#chat-output');
    var height = scroll[0].scrollHeight;
    scroll.scrollTop(height );
    saveSettings();
}
$( document ).ready(function() {
    $("#chat").hide();
});

$('.chat-button').click(function(e) {
    $("#chat").toggle();
    if($("#chat").css("display") != "none") {
        if(sessionStorage.getItem("chatOutput")!=null){
            userId = sessionStorage.getItem("userId");
            $('#chat-output').html(sessionStorage.getItem("chatOutput"));
            outputArea.find('.hint-message').click(function(e) {
                clickHandler(e);
                saveSettings()
            });
            scrollDown();
            $('div.typing-loader').hide();
        }

        if($(".bot-message").length <= 0) {
            userId = Math.floor(Math.random() * 99999999);
            ajaxCall("/start");

        }
        saveSettings()
    }
});

function saveSettings() {
    sessionStorage.setItem("chatOutput", $('#chat-output').html());
    sessionStorage.setItem("userId", userId);

}

function clearSettings() {
    sessionStorage.setItem("chatOutput", "");
    sessionStorage.setItem("userId", "");
}

function clickHandler(e){
    $('.hint-container').hide();
    e.preventDefault();
    var txt = $(e.target).text();
    if(txt.indexOf('Clear History') >= 0){
        $('.chat-output').empty();
            clearSettings();
    }
    else {
        outputArea.append('\n      <div class="user-message">\n <img style="width: 36px;float: right;"src="user.png">  <div class="message">\n ' + txt + '  </div>\n      </div>\n    ');
        ajaxCall(txt);

    }
}

function BotMessage(question){
    var loading =  '\n    <div class="bot-message">\n  <img style="width: 40px;float: left;margin-top: 5px;"src="bot.png">    <div class="message">\n       <div class="typing-loader"></div> \n      </div>\n    </div>\n  ';
    outputArea.append(loading);
    if(question) {
        $('div.typing-loader').delay(500).fadeOut(function () {
        });
        window.setTimeout(function () {
            $(".message:last").append(question);
        }, 600);
    }
}
