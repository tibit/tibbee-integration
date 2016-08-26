var Tibit = (function(Tibit){

    // Takes a JS object as a parameter

     var x = '';

    init = function(siteParams){  // TODO namespace closure

        // Initialising our params object as a property of our global Tibit object
        Tibit.params = {
            PAD : "",
            SUB : "",
            CBK : "",
            ASN : "",
            TIB : "",
            BTN : "",
            BTS : "",
            BTC : "",
            BTH : ""
        };

        // perform after-page-loaded actions
        // a siteParams objects gives default parameters for buttons.  Available params are:
        //   styled button injection: BTN, BTS, BTC, BTH  see TibButton constructor
        //   Tib initiator: PAD, ASN, SUB, TIB, CBK  see TibIniator Constructor
        for( param in Tibit.params ){
            if(siteParams[param]){
                Tibit.params[param] = siteParams[param];
            }
        }



        switch(document.readyState) {
            case 'loading':
                // When used as callback for a document event listener, "this" context will be the document, so we
                // override this using .bind(bd)
                document.addEventListener('DOMContentLoaded', afterLoad);  // do we need .bind()?
                break;
            case 'loaded': // for older Android
            case 'interactive':
            case 'complete':
                afterLoad();
        }

        function afterLoad() {
            sweepStorage();
            initButtons();
        }
    }




    /**********
     PAGE LOAD
    **********/

    initButtons = function() {

        // adds and instantiates a TibButton object for all DOM elements with the 'bd-tib-btn' class
        // settings are defaulted to matching items in the siteParams object, and data-bd-* attributes in the DOM element

        var buttons = document.getElementsByClassName('bd-tib-btn');
        for ( var i = 0, n = buttons.length; i < n; i++ ) {
            buttons[i].tibButton = new Tibit.Button( buttons[i]);
            // Construct tibHandler.Initiator for button, feeding in site default params + local params from element data-bd-*
        }
    }


    loadElementParams = function(params, e){
        // For each property in params, populate with data-bd-X attribute from e if present

        for ( var paramName in params ) {
            if ( e.getAttribute('data-bd-' + paramName) ){
                params[paramName] = e.getAttribute('data-bd-' + paramName);
            }
        }
        return params;
    };

    function sweepStorage() {

        // Remove expired Tib acknowledgements and subref counters from localStorage

        for(var key in localStorage){
            if ( key.substr( 0, Tibit.constants.SUBREF_PREFIX.length) === Tibit.constants.SUBREF_PREFIX ) {
                var item = JSON.parse( localStorage.getItem(key));
                var expiry = new Date(item.EXP).getTime();
                if ( Date.now() >  expiry) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    function isTestnet(PAD){

        // true if PAD set and first character not 'm', 'n', or '2'
        return PAD && ( "mn2".search(PAD.substr(0,1)) !== -1 );
    };


    Tibit.constants = {};
    Tibit.constants.SUBREF_PREFIX= 'bd-subref-';
    Tibit.constants.QTY_CACHE_DURATION= 20; // minutes



    Tibit.init = init;
    Tibit.isTestnet = isTestnet;
    Tibit.loadElementParams = loadElementParams;
    return Tibit;

})(Tibit || {});

/*
** MurmurHash3: Public Domain Austin Appleby http://sites.google.com/site/murmurhash/
** JS Implementation: Copyright (c) 2011 Gary Court MIT Licence http://github.com/garycourt/murmurhash-js
*/

function murmurhash3_32_gc(e,c){var h,r,t,a,o,d,A,C;for(h=3&e.length,r=e.length-h,t=c,o=3432918353,d=461845907,C=0;r>C;)A=255&e.charCodeAt(C)|(255&e.charCodeAt(++C))<<8|(255&e.charCodeAt(++C))<<16|(255&e.charCodeAt(++C))<<24,++C,A=(65535&A)*o+(((A>>>16)*o&65535)<<16)&4294967295,A=A<<15|A>>>17,A=(65535&A)*d+(((A>>>16)*d&65535)<<16)&4294967295,t^=A,t=t<<13|t>>>19,a=5*(65535&t)+((5*(t>>>16)&65535)<<16)&4294967295,t=(65535&a)+27492+(((a>>>16)+58964&65535)<<16);switch(A=0,h){case 3:A^=(255&e.charCodeAt(C+2))<<16;case 2:A^=(255&e.charCodeAt(C+1))<<8;case 1:A^=255&e.charCodeAt(C),A=(65535&A)*o+(((A>>>16)*o&65535)<<16)&4294967295,A=A<<15|A>>>17,A=(65535&A)*d+(((A>>>16)*d&65535)<<16)&4294967295,t^=A}return t^=e.length,t^=t>>>16,t=2246822507*(65535&t)+((2246822507*(t>>>16)&65535)<<16)&4294967295,t^=t>>>13,t=3266489909*(65535&t)+((3266489909*(t>>>16)&65535)<<16)&4294967295,t^=t>>>16,t>>>0}