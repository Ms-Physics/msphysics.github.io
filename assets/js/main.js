/*
    Solid State by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    "use strict";

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large:  '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small:  '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $header = $('#header'),
            $banner = $('#banner');

        // Disable animations/transitions until the page has loaded.
        /* Disable the animations all together since they don't seem to work every time.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });
        */

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Header.
        if (skel.vars.IEVersion < 9)
            $header.removeClass('alt');

        if ($banner.length > 0
        &&  $header.hasClass('alt')) {

            $window.on('resize', function() { $window.trigger('scroll'); });

            $banner.scrollex({
                bottom:     $header.outerHeight(),
                terminate:  function() { $header.removeClass('alt'); },
                enter:      function() { $header.addClass('alt'); },
                leave:      function() { $header.removeClass('alt'); }
            });

        }

        // Menu.
        var $menu = $('#menu');

        $menu._locked = false;

        $menu._lock = function() {
            if ($menu._locked)
                return false;

            $menu._locked = true;

            window.setTimeout(function() {
                $menu._locked = false;
            }, 350);

            return true;
        };

        $menu._show = function() {
            if ($menu._lock()) {
                $body.addClass('is-menu-visible');
            }
        };

        $menu._hide = function() {
            if ($menu._lock()) {
                $body.removeClass('is-menu-visible');
            }
        };

        $menu._toggle = function() {
            if ($menu._lock()) {
                $body.toggleClass('is-menu-visible');
            }
        };

        $menu
        .appendTo($body)
        .on('click', function(event) {
            event.stopPropagation();

            // Hide.
            $menu._hide();
        })
        .find('.inner')
        .on('click', '.close', function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Hide.
            $menu._hide();

        })
        .on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', 'a', function(event) {
            var href = $(this).attr('href');

            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $menu._hide();

            // Redirect.
            window.setTimeout(function() {
                window.location.href = href;
            }, 350);

        });

        $body
        .on('click', 'a[href="#menu"]', function(event) {
            event.stopPropagation();
            event.preventDefault();

            // Toggle.
            $menu._toggle();
        })
        .on('keydown', function(event) {
            // Hide on escape.
            if (event.keyCode == 27) {
                $menu._hide();
            }
        });

        function validEmail(email) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
            return email.length > 0 && emailReg.test(email);
        }

        $("#msg-send").click(function(event) {
            var name = $("#msg-name").val();
            var email = $("#msg-email").val();
            var message = $("#msg-text").val();
            var inerror = false;

            // Check for valid email
            if (!validEmail(email)) {
                $("#msg-email").addClass("inputerror");
                inerror = true;
            } else {
                $("#msg-email").removeClass("inputerror");
            }

            // Check for message
            if (message.length < 5) {
                $("#msg-text").addClass("inputerror");
                inerror = true;
            } else {
                $("#msg-text").removeClass("inputerror");
            }

            if (inerror) {
                return false;
            }

            // Send message
            $("#msg-form").hide();
            $("#msg-processing").show();
            var url = "https://xy4toks6ha.execute-api.us-west-2.amazonaws.com/prod/contact";
            $.ajax({
                type: "POST",
                url: url,
                headers: {
                    "X-Api-Key": "tK8TTas3hp4eNW5CDYTMi5g2RXRngwQE5n2K3txv"
                },
                data: JSON.stringify({
                    "toaddress": "chelsey@msphysics.com",
                    "name": name,
                    "email": email,
                    "message": message
                }),
                crossDomain: true,
                contentType: 'application/json',
                dataType: 'json',
                success: function(data) {
                    //success stuff. data here is the response, not your original data
                    $("#msg-processing").hide();
                    $("#msg-success").show();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    //error handling stuff
                    $("#msg-processing").hide();
                    $("#msg-error").show();
                }
            });
        });

    });

})(jQuery);
