/*global window:false,console:false*/
(function() {
    "use strict";

    // --------------------------------------------------------------------------------------------
    // CONFIGURABLE SETTINGS

    // the URL to your choice of error log (relative or absolute is fine)
    var logErrorURL = "/js-error-logs/logError.php";

    // --------------------------------------------------------------------------------------------

    window.onerror = function(msg, file, lineNum, colNum) {

        var errorInfo = {
            msg:        msg,
            file:       file,
            lineNum:    lineNum,
            colNum:     colNum,
            page:       window.location.href
        };

        if( typeof bowser === 'object' ) {
            errorInfo.browser = JSON.stringify(bowser);
        } else {
            errorInfo.browser = navigator.userAgent;
        }

        logError(logErrorURL, errorInfo);

        return false;

    };

    // Catches all jQuery ajax errors for all requests.
    //
    $(document).ajaxError(function(event, jqxhr, jqxhr_settings, thrown_error) {

        // pus aceasta regula pentru cazul de aborted request
        if ( jqxhr.statusText == 'abort' ) {
            return false;
        }

        var errorInfo = {
            status:     jqxhr.status,
            msg:        jqxhr.statusText,
            page:       window.location.href,
            ajax_settings:   JSON.stringify(jqxhr_settings)
        };

        if( typeof bowser === 'object' ) {
            errorInfo.browser = JSON.stringify(bowser);
        } else {
            errorInfo.browser = navigator.userAgent;
        }

        logError(logErrorURL, errorInfo);

    });


    function logError(url, postData) {

        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            global: false
        });

    }

})();