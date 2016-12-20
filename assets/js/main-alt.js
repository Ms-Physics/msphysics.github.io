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
            var cursemester, curcourses, pastcourses;

            // Find current semester
            var cursemester = _.find(data.semesters, function(item) {
                var startdate = new Date(cdate);
                var enddate = new Date(cdate);

                startdate.setMonth(item.start.month-1);
                startdate.setDate(item.start.day);

                enddate.setMonth(item.end.month-1);
                enddate.setDate(item.end.day);

                return (startdate.getTime() <= cdate.getTime() && cdate.getTime() <= enddate.getTime());
            });

            // Find courses
            curcourses = _.where(data.courses, {"year": cdate.getFullYear(), "semester": cursemester.name});
            pastcourses = _.filter(data.courses, function(course) {
                if (course.year < cdate.getFullYear()) {
                    return true;
                } else if (course.year == cdate.getFullYear() &&
                    data.semester_order[course.semester] < data.semester_order[cursemester.name]) {
                    return true;
                }

                return false;
            });
            _.where(data.courses, {"year": cdate.getFullYear(), "semester": curcourses.name});

            console.log(curcourses);

            // current-courses-tiles
            if ($("#current-courses-tiles").length > 0) {
                load_current_courses_tiles("#current-courses-tiles", curcourses);
            }

            // current-courses
            if ($("#current-courses").length > 0) {
                load_courses_table("#current-courses", curcourses);
            }

            // past-courses
            if ($("#past-courses").length > 0) {
                load_courses_table("#past-courses", pastcourses);
            }
        });

        function load_current_courses_tiles(tagid, courses) {

        }

        function load_courses_table(tagid, courses) {
            if (Array.isArray(courses) && courses.length > 0) {
                $(tagid).find('tbody').html("");

                $.each(courses, function(idx, course) {
                    var row = $([
                        '<tr>',
                        '    <td>'+course.semester.toTitleCase()+' '+course.year+'</td>',
                        '    <td>'+course.college+'</td>',
                        '    <td>'+course.name+'</td>',
                        '    <td><a href="'+course.file+'">Course Description</a></td>',
                        '</tr>'
                    ].join("\n"));

                    $(tagid).find('tbody').append(row);
                });
            }
        }

        String.prototype.toTitleCase = function () {
            return this.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

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
