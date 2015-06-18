
function goToByScroll(id){
    $('html,body').animate({scrollTop: $("#"+id).offset().top-78},'slow')
}

$(document).ready(function(){

    // Links
    // https://github.com/twbs/bootstrap/issues/9013
    $(document).on('click.nav', '.navbar-collapse.in', function(e) {
        if($(e.target).is('a') || $(e.target).is('button')) {
            $(this).collapse('hide');
        }
    });

    $("#requestLink").click('on',function(e) {
        e.preventDefault();
        goToByScroll('request-invitation')
    })
    $("#movieLink").click('on',function(e) {
        e.preventDefault();
        goToByScroll('movie')
    })
    $("#topLink").click('on',function(e) {
        e.preventDefault();
        goToByScroll('top')
    })
    $("#loginLink").click('on',function(e) {
        console.log('loginRequest')
        $('#loginModal').modal('show')
        //window.location.href = $(this).attr('href')
    })

    // AjaxChimp
    /*
    $('#mc-form').ajaxChimp({
        url: 'http://thebloop.us10.list-manage.com/subscribe/post?u=78a5dcee0d0ced83a7351f8cf&amp;id=744967139b'
    });

    function callbackFunction (resp) {
        if (resp.result === 'success') {
            // Do stuff
            console.log('success')
            $('mc_embed_signup').slideUp()
            $('mc_success').slideDown()
        }
    }
    */

    // Carousel
    $('#carousel').carousel();

    'use strict';

    // E-mail validation via regular expression
    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    };

    // Ajax mailchimp

    /** http://stackoverflow.com/a/15120409/477958 **/
    $(function () {
        var $form = $('#mc-embedded-subscribe-form');

        $('#mc-embedded-subscribe').on('click', function(event) {
            if(event) event.preventDefault();
            register($form);
        });
    });

    function register($form) {
        $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            cache       : false,
            dataType    : 'json',
            contentType: "application/json; charset=utf-8",
            error       : function(err) { $('#notification_container').html('<span class="text-danger text-center col-lg-10 col-lg-offset-2">Could not connect to server. Please try again later.</span>'); },
            success     : function(data) {

                if (data.result != "success") {
                    var message = data.msg.substring(4);
                    $('#notification_container').html('<span class="text-warning col-lg-10 col-lg-offset-2">'+message+'</span>');
                }

                else {
                    var message = data.msg;
                    $('#mc_embed_signup').slideUp()
                    $('#notification_container').html('<span class="text-success">' +
                        '<h4><span class="fa fa-paper-plane"></span> Hurray! Almost ready to hug the other monkeys!</h4> ' +
                        '<p class="lead">Please, confirm your email with the link in the mail we just sent you!</p></span>');

                }
            }
        });
    }

    // Signin / Join Modal
    // ------------------------------

    // init
    var $authmodal = $('#modal-auth');
    var authmodalPanes = $authmodal.find('.auth-box');

    // start on the right pane
    // defaults to "join"
    // options "signin" | "join" | "password"

    // MAKESHIFT WAY TO EXPOSE JQUERY AUTH LOGIC TO REACT
    window.signinModalTrigger = function signinModalTrigger(e) {

        e.preventDefault();

        var initial = $(this).data("initial") || 'join';
        var initialPane = $authmodal.find('.modal-pane-' + initial);
        var from = $(this).data("from");

        $authmodal.modal('show');

        authmodalPanes.addClass('hidden');
        initialPane.removeClass('hidden');

        // only focus the first field on large devices where showing
        // the keyboard isn't a jarring experience
        if ($(window).width() >= 768) {
            initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
        }

        if (from) {
            $authmodal.find('[name="from"]').val(from);
        }
    }

    $("[href='#modal-auth'], [data-modal='auth'], .js-auth-trigger").on('click', signinModalTrigger);

    // move between panes
    $("[rel='modal-pane']").click( function() {

        var switchTo = $authmodal.find('.modal-pane-' + $(this).data("modal-pane"));

        authmodalPanes.addClass('hidden');
        switchTo.removeClass('hidden');


        // only focus the first field on large devices where showing
        // the keyboard isn't a jarring experience
        if ($(window).width() >= 768) {
            switchTo.find('input[type!=hidden],textarea').eq(0).click().focus();
        }

    });


})
