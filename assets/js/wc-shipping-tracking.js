/* global WC_SHIPPING_TRACKING_PARAMS */
jQuery( function( $ ) {

	if ( typeof WC_SHIPPING_TRACKING_PARAMS === 'undefined' ) {
		return false;
	}

	const KEYCODE_ENTER = 13;
	const KEYCODE_ESC = 27;

	/**
	 * WCOrdersTable class.
	 */
	function WC_Shipping_Tracking() {
		$( document )
			.on( 'blur',     '.wc_shipping_tracking_input', this.onInputBlur )
			.on( 'keyup',    '.wc_shipping_tracking_input', this.onInputKeyUp )
			.on( 'keypress', '.wc_shipping_tracking_input', this.onInputKeyPress )
			.on( 'click',    '.edit_wc_shipping_tracking',  this.onEditClick );
	};

	/**
	 * Cancel an input.
	 */
	WC_Shipping_Tracking.prototype.handle_cancel = function( $input ) {
		if( typeof($input) === 'undefined' )
			return false;

		$input.hide().val($input.data('original'));
		$input.prev( '.wc_shipping_tracking_value' ).show();
		$input.next( '.edit_wc_shipping_tracking' ).show();
	};

	/**
	 * Save an input.
	 */
	WC_Shipping_Tracking.prototype.handle_save = function( $input ) {
		if( typeof( $input ) === 'undefined' ) {
			return false;
		}

		// Related objects.
		var $display = $input.prev( '.wc_shipping_tracking_value' );
		var $edit = $input.next( '.edit_wc_shipping_tracking' );
		var $loader = $edit.next( '.wc_shipping_tracking_loader' );

		// Show loader and disable input.
		$loader.show().css( 'display', 'inline-block' );
		$input.prop( 'disabled', true );

		// Get some data.
		var order_id = $input.data( 'order_id' );
		var tracking_number = $input.val();

		// Send via ajax.
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: { 
				'action' : 'save_tracking_number',
				'order_id' : order_id,
				'wc_shipping_tracking' : tracking_number,
				'security' : WC_SHIPPING_TRACKING_PARAMS.security
			 },
		})

		.success( function( msg ) {

			// Re-enable the input, show value, hide input.
			$input.val( msg ).data( 'original', msg ).hide();
			$display.html( msg ).show();
			$edit.show();

		})

		.done( function( msg ){
		
			// Re-enable the input, show value, hide input.
			$input.prop( 'disabled', false );
			$loader.fadeOut( 'fast' );

		});
	}

	/**
	 * Blur an input.
	 */
	WC_Shipping_Tracking.prototype.onInputBlur = function( e ) {

		var $edit = $( e.target ).next( '.edit_wc_shipping_tracking' );
		var $loader = $edit.next( '.wc_shipping_tracking_loader' );

		if( $.trim( $( e.target ).val() ) != $( e.target ).data('original' ) ) {
			WC_Shipping_Tracking.prototype.handle_save( $( e.target ) );
		} else {
			WC_Shipping_Tracking.prototype.handle_cancel( $( e.target ) );
		}
	};

	/**
	 * Clear on ESC
	 */
	WC_Shipping_Tracking.prototype.onInputKeyUp = function( e ) {
		if( e.which == KEYCODE_ESC ){
			WC_Shipping_Tracking.prototype.handle_cancel( $( e.target ) );
		}
	};

	/**
	 * Save on enter.
	 */
	WC_Shipping_Tracking.prototype.onInputKeyPress = function( e ) {
		// Recommended to use e.which, it's normalized across browsers.
		if( e.which == KEYCODE_ENTER ){
			e.preventDefault();
			WC_Shipping_Tracking.prototype.handle_save( $( e.target ) );
		}
	};

	/**
	 * Show the input when edit is clicked.
	 */
	WC_Shipping_Tracking.prototype.onEditClick = function( e ) {
		$( e.target ).hide().prev( '.wc_shipping_tracking_input' ).show().focus().prev( '.wc_shipping_tracking_value' ).hide();
	};

	/*
	 * Initialize script.
	 */
	new WC_Shipping_Tracking();

});