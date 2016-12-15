"use strict";

if (!window.console) console = {log: function() {}};

(function($) {
    $(function() {
        var $window = $(window),
            $body   = $('body'),
            $header = $('#header'),
            $banner = $('#banner'),
            cdate   = new Date();

        // Load Menu
        if ($('#menu').length) {
            $('#menu').load('/assets/html/menu.html');
        }

        // Load Footer
        if ($('#footer').length) {
            $('#footer').load('/assets/html/footer.html', function() {
                // Add year to copyright
                $('.year').html(new Date().getFullYear());

                // Hook contact submit button to function
                $("#msg-send").click(msgSend);
            });
        }

        // Load course info
        $.getJSON("/courses/alist.json", function(data) {
            var ccourses;

            //console.log(data);
            var csemester = _.find(data.semesters, function(item) {
                var startdate = new Date(cdate);
                var enddate = new Date(cdate);

                startdate.setMonth(item.start.month-1);
                startdate.setDate(item.start.day);

                enddate.setMonth(item.end.month-1);
                enddate.setDate(item.end.day);

                return (startdate.getTime() <= cdate.getTime() && cdate.getTime() <= enddate.getTime());
            });

            console.log(csemester);

            ccourses = _.where(data.courses, {"year": cdate.getFullYear(), "semester": csemester.name});

            console.log(ccourses);

        });

        function validEmail(email) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
            return email.length > 0 && emailReg.test(email);
        }

        function msgSend(event) {
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
        }
    });

})(jQuery);
