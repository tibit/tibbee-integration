/*************************************/
// TIB BUTTON MODULE
/*************************************/
/*
*
* Module containing the tibit.Button constructor, which instantiates a tibit.Initiator and optionally a
* tibit.ButtonStyle on a given DOM element, which the Button can then use to dispatch tibs on click, fetch and set
* counters, and import/style a button. Also manages some classes/ID's attached to the DOM element.
*
* */

var TIBIT= (function(tibit){

    // Create our buttons object which will contain our buttons sub-namespace
    var buttons= {};

    var initButtons= function() {

        // instantiates and attaches a TibButton object to all DOM elements with the 'bd-tib-btn' class
        // settings are defaulted to matching items in the siteParams object, and data-bd-* attributes in the DOM element

        var buttons= document.getElementsByClassName(tibit.CONSTANTS.BUTTON_CLASS);
        for ( var i= 0, n= buttons.length; i < n; i++ ) {
            buttons[i].tibButton= new TibButton( buttons[i]);
            // Construct tibHandler.Initiator for button, feeding in site default params + local params from element data-bd-*
        }
    };



    var TibButton= function( domElement) {

        // constructor for Button class, invoked by initButtons, 


        this.params = {};
        tibit.copyParams(buttons.params, this.params);

        this.tibbed= false;

        this.domElement = domElement;
        tibit.loadElementParams(this.params, this.domElement);

        this.domElement.tibInitiator= new tibit.initiators.Initiator(this.domElement);

        //window.addEventListener('storage', storageUpdate.bind(this)); // handles tibbed events and counter updates
        this.domElement.addEventListener("click", this.domElement.tibInitiator.dispatch.bind(this.domElement.tibInitiator));
        window.addEventListener('tibstate', storageUpdate.bind(this));

        this.counterElement= this.domElement.getElementsByClassName('bd-btn-counter')[0] || null;
        if (this.counterElement) {
            if(!this.domElement.tibInitiator.qty()){
                tibit.initiators.getQty(this.domElement.tibInitiator);
            }
            else{
                this.writeCounter(this.domElement.tibInitiator.qty());
            }
        }

        // CSS/HTML Class Assignments
        if ( tibit.isTestnet(this.domElement.tibInitiator.params.PAD) ) this.domElement.classList.add("testnet");
        this.domElement.classList.add( tibit.CONSTANTS.SUBREF_PREFIX + this.domElement.tibInitiator.params.SUB );  // Add subref class for easier reference later

        // Acknowledge tibbed state if persisted through localStorage
        if ( localStorage.getItem(tibit.CONSTANTS.SUBREF_PREFIX + this.domElement.tibInitiator.params.SUB + '-TIBBED') ) {
            acknowledgeTib(this.domElement);
        }

        if( this.domElement.classList.contains('bd-dynamic')){
            console.log(this.domElement);
            this.style();
        }

        if ( this.domElement.tagName === 'BUTTON' && !this.domElement.getAttribute('type') ) {
            // TODO determine if button being overwritted by TibButtonStyle.writeButton affects this
            this.domElement.setAttribute('type','button'); // prevents default submit type/action if within <form>
        }
    };




    var writeCounter= function( QTY) {
        if ( this.counterElement && !isNaN(QTY) && QTY !== '' && QTY !== null) { // isNaN('') will return false
            this.counterElement.textContent= parseInt(QTY, 10);
        }
    };



    var acknowledgeTib= function(e) {

        // set the button to tibbed state

        e.tibbed= true;
        e.classList.add('tibbed');
    };



    var storageUpdate= function(e) {

        // localStorage/tibstate listener to update the buttons counter
        // used as the callback for tibHandler.tibInitiator, and when a Tib is acknowledged
        // for tibstate custom event, detail attribute contains the localStorage key

        if(e.type === 'tibstate'){
            e.key= e.detail;
            e.newValue= localStorage[e.key];
        }

        if ( e.newValue && e.key === tibit.CONSTANTS.SUBREF_PREFIX + this.domElement.tibInitiator.params.SUB + "-QTY" ) {
            // TODO: if a value is set from params, do we overwrite it after a Tib?  YES
            this.writeCounter( JSON.parse(e.newValue).QTY);
            }

        if ( e.newValue && e.key === tibit.CONSTANTS.SUBREF_PREFIX + this.domElement.tibInitiator.params.SUB + "-TIBBED" ) {
            acknowledgeTib(this.domElement);
        }
    };







    TibButton.prototype.writeCounter= writeCounter;

    var params= {};

    // Expose public buttons methods/variables
    buttons.TibButton= TibButton;
    buttons.initButtons= initButtons;
    buttons.params= params;

    tibit.buttons= buttons;


    console.log( 'TIBIT: successfully loaded button module');

    return tibit;


})(TIBIT || {});