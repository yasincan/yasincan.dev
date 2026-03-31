(function ($) {
    "use strict";




    // Header Sticky
    $(window).on('scroll', function () {
        var stickytop = $('#header.sticky-top .bg-transparent');
        var stickytopslide = $('#header.sticky-top-slide');

        if ($(this).scrollTop() > 1) {
            stickytop.addClass("sticky-on-top");
            stickytop.find(".logo img").attr('src', stickytop.find('.logo img').data('sticky-logo'));
        }
        else {
            stickytop.removeClass("sticky-on-top");
            stickytop.find(".logo img").attr('src', stickytop.find('.logo img').data('default-logo'));
        }

        if ($(this).scrollTop() > 180) {
            stickytopslide.find(".primary-menu").addClass("sticky-on");
            stickytopslide.find(".logo img").attr('src', stickytopslide.find('.logo img').data('sticky-logo'));
        }
        else {
            stickytopslide.find(".primary-menu").removeClass("sticky-on");
            stickytopslide.find(".logo img").attr('src', stickytopslide.find('.logo img').data('default-logo'));
        }
    });


    // Sections Scroll
    if ($("body").hasClass("side-header")) {
        $('.smooth-scroll').on('click', function () {
            event.preventDefault();
            var sectionTo = $(this).attr('href');
            if (sectionTo === '#blog') {
                window.location.href = '/blog';
            } else {
                $('html, body').stop().animate({
                    scrollTop: $(sectionTo).offset().top
                }, 800, 'swing');
            }
        });
    } else {
        $('.smooth-scroll').on('click', function () {
            event.preventDefault();
            var sectionTo = $(this).attr('href');
            if (sectionTo === '#blog') {
                window.location.href = '/blog';
            }
            else {
                $('html, body').stop().animate({
                    scrollTop: $(sectionTo).offset().top - 50
                }, 800, 'swing');
            }
        });
    }

    // Mobile Menu
    $('.navbar-toggler').on('click', function () {
        $(this).toggleClass('show');
    });
    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse, .navbar-toggler").removeClass("show");
    });

    // Overlay Menu & Side Open Menu
    $('.navbar-side-open .collapse, .navbar-overlay .collapse').on('show.bs.collapse hide.bs.collapse', function (e) {
        e.preventDefault();
    }),
        $('.navbar-side-open [data-bs-toggle="collapse"], .navbar-overlay [data-bs-toggle="collapse"]').on('click', function (e) {
            e.preventDefault();
            $($(this).data('target')).toggleClass('show');
        })



    /*------------------------------------
        Typed
    -------------------------------------- */

    $(".typed").each(function () {
        var typed = new Typed('.typed', {
            stringsElement: '.typed-strings',
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1500,
        });
    });




    /*------------------------
       tooltips
    -------------------------- */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })


    /*------------------------
       Scroll to top
    -------------------------- */
    $(function () {
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 400) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
    });
    $('#back-to-top').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        return false;
    });

    $.ajax({
    url: "https://ap.yasincan.dev/Network/Age",
    headers: {
        'X-Page-Referrer': document.referrer || ''
    },
    success: function (result) {
        $("#yc-year").html(result.year);
        $("#yc-birthYear").html(result.birthYear);
        $("#yc-yearsExperience").html(result.yearsExperience);
    },
    error: function () {
        var fallbackYear = new Date().getFullYear();
        $("#yc-year").html(fallbackYear);
        $("#yc-birthYear").html("");
        $("#yc-yearsExperience").html("7");
    }
});

    /*------------------------
       Contact Form
    -------------------------- */
    var form = $('#contact-form');
    var submit = $('#submit-btn');
    form.on('submit', function (e) {
        e.preventDefault();
        if (!form.valid()) {
            return;
        }
        grecaptcha.ready(function () {
            var site_key = $('#google-recaptcha-v3').attr('src').split("render=")[1];
            grecaptcha.execute(site_key, { action: 'contact' }).then(function (token) {
                var formData = form.serializeArray();
                var postData = {};
                formData.forEach(function (item) {
                    postData[item.name] = item.value;
                });
                postData['g-recaptcha-response'] = token;
                $.ajax({
                    url: 'https://ap.yasincan.dev/Network/Contact',
                    type: 'POST',
                    //dataType: 'json',
                    data: JSON.stringify(postData),
                    contentType: 'application/json',
                    beforeSend: function () {
                        submit.attr("disabled", "disabled");
                        var loadingText = '<span role="status" aria-hidden="true" class="spinner-border spinner-border-sm align-self-center me-2"></span>Sending.....';
                        if (submit.html() !== loadingText) {
                            submit.data('original-text', submit.html());
                            submit.html(loadingText);
                        }
                    },
                    success: function (data) {
                        submit.before(data.message).fadeIn("slow");
                        submit.html(submit.data('original-text'));
                        submit.removeAttr("disabled", "disabled");
                        if (data.response == 'success') {
                            form.trigger('reset');
                        }
                        setTimeout(function () {
                            $('.alert-dismissible').fadeOut('slow', function () {
                                $(this).remove();
                            });
                        }, 3000);
                    },
                    error: function (e) {
                        console.log(e)
                    }
                });
            });
        });
    });

})(jQuery)