let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", function(event){
	event.preventDefault();
	let title = $("#search-value").val();
	$("#search-form").attr("action", "/search/" + title + "/1/");
	searchForm.submit();
})