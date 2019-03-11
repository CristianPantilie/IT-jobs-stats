// beforeLoad: function() {
// },
// afterLoad: function() {
// },
// beforeShow: function() {
// },
// afterShow: function() {
// },
// beforeClose: function() {
// },
// afterClose: function() {
// }

var lang = document.documentElement.lang;
var buttonBack = {
    'ro' : 'Înapoi',
    'en': 'Back'
};

function openJobRequests(){
    $.fancybox({
        'wrapCSS'       : 'JobRequestPop',
        'href'          : '#jobRequestPop',
        'width'         : '420px',
        'closeClick'    : false,
        'closeBtn'      : true,
        'closeExisting' : true
    });
};
function openCoverLetterRequest(){
    $.fancybox({
        'wrapCSS'       : 'JobRequestPop',
        'href'          : '#jobRequestCoverLetter',
        'width'         : '420px',
        'closeClick'    : false,
        'closeBtn'      : true,
        'closeExisting' : true
    });
};
function openMiniIntRequest(){
    $.fancybox({
        'wrapCSS'       : 'JobRequestPop',
        'href'          : '#jobRequestMiniInterview',
        'width'         : '420px',
        'closeClick'    : false,
        'closeBtn'      : true,
        'closeExisting' : true
    });
};

$( document ).ready(function() {

    $(document).on('click', '#jobRequestTrigger', function(){
        openJobRequests();
    });

    $(document).on('click', '.jobCoverLetterTrigger', function(){
        openCoverLetterRequest();

        var currentLanguages = $(this).attr('data-lang');

        if (currentLanguages !== undefined) {
            $('.JobRequestPop').prepend('<button onclick="openJobRequests()"  class="JobPopup__Back" id="goBackToRequests"></button>');
        } else {
            $('.JobRequestPop').prepend('<button onclick="openJobRequests()"  class="JobPopup__Back" id="goBackToRequests"><i class="JobPopup__BackIcon  material-icons">keyboard_arrow_left</i><span class="JobPopup__BackText">' + buttonBack[lang] + '</span></button>');
        }

    });

    $(document).on('click', '.jobMiniIntAnswersTrigger', function(){
        openMiniIntRequest();

        var currentLanguages = $(this).attr('data-lang');

        if (currentLanguages !== undefined) {
            $('.JobRequestPop').prepend('<button onclick="openJobRequests()"  class="JobPopup__Back" id="goBackToRequests"></button>');
        } else {
            $('.JobRequestPop').prepend('<button onclick="openJobRequests()"  class="JobPopup__Back" id="goBackToRequests"><i class="JobPopup__BackIcon  material-icons">keyboard_arrow_left</i><span class="JobPopup__BackText">' + buttonBack[lang] + '</span></button>');
        }

    });

});
