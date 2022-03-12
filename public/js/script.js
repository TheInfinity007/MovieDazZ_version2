const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = $('#search-value').val();
    $('#search-form').attr('action', `/search/movie/${title}/1/`);
    searchForm.submit();
});

$('.fa-heart').click(function () {
    $(this).toggleClass('active');
});

$(document).ready(() => {
    const { pathname } = window.location;
    $(`.navbar-nav > li > a[href="${pathname}"]`).parent().addClass('active');

    // show hide button on scroll
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    // smooth scrolling to top
    $('.scrollToTop').click(() => {
        $('html, body').animate({ scrollTop: 0	}, 500);
    });
});
