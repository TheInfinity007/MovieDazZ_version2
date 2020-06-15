let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", function(event){
	event.preventDefault();
	let title = $("#search-value").val();
	$("#search-form").attr("action", "/search/movie/" + title + "/1/");
	searchForm.submit();
});

  $(".fa-heart").click(function(){
    $(this).toggleClass("active");
  });

$(document).ready(function() {
	var pathname = window.location.pathname;
	$('.navbar-nav > li > a[href="'+pathname+'"]').parent().addClass('active');

	// show hide button on scroll
	$(window).scroll(function(){
		if($(this).scrollTop() > 200){
			$('.scrollToTop').fadeIn();
		}else{
			$('.scrollToTop').fadeOut();
		}
	});

	// smooth scrolling to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop: 0	}, 500);
	})

});