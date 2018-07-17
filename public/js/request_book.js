$(document).ready(function() {

    var searchBtn = $("#searchBtn");
    var searchInput = $("#searchInput");
    
    $(document).on("click", ".request_book", handleBookRequest);
  
    // Adding an event listener for when the form is submitted
    $(searchBtn).on("click", function handleFormSubmit(event) {
      event.preventDefault();
      console.log("Search button clicked")
      if (!searchInput.val().trim()) {
        return;
      }
      // Building variable to be submitted to database
      var newQuery = searchInput.val().trim();
      console.log(newQuery)
      var searchURL = "/search/books/" + newQuery
      searchBooks(searchURL)
      
    });
  
    function searchBooks(query) {
        $.get(query, function(result) {
          console.log(result);
          buildSearchResults(result);
        });
    }

    function buildSearchResults(results_list) {
        $("#result").empty()
        for (i=0; i < results_list.length; i++) {

            var dataObj = {
                title: results_list[i].title,
                category: results_list[i].categories[0],
                publishedDate: results_list[i].publishedDate,
                description: results_list[i].description,
                author: results_list[i].authors[0],
                thumbnail: results_list[i].thumbnail,
                ISBN: results_list[i].industryIdentifiers[0].identifier
            }

            var fullCard = $("<div>");
            fullCard.addClass("col s12 m7");

            // Card Horizontal 
            var cardHorizontal = $("<div>");
            cardHorizontal.addClass("card horizontal");

            // Card Horizontal Components
            // Card Image div
            var cardImage = $("<div>");
            cardImage.addClass("card-image center-align valign-wrapper");

            var image = $("<img>");
            image.attr("src", results_list[i].thumbnail)

            cardImage.append(image);
            // vertAlign.append(cardImage)
            cardHorizontal.append(cardImage)

            // Card Stacked div
            var cardStacked = $("<div>");
            cardStacked.addClass("card-stacked");

            var cardContent = $("<div>");
            cardContent.addClass("card-content");

            var title = $("<h6>");
            title.addClass("header");
            title.text(results_list[i].title)

            var author = $("<p>");
            author.text("Author: " + results_list[i].authors[0]);

            var published = $("<p>");
            published.text("Publication Date: " + results_list[i].publishedDate);

            var ISBN = $("<p>");
            ISBN.text("ISBN: " + results_list[i].industryIdentifiers[0].identifier);

            var description = $("<blockquote>");
            description.text(results_list[i].description);

            cardContent.append(title);
            cardContent.append(author);
            cardContent.append(published);
            cardContent.append(ISBN);
            cardContent.append(description);
            cardStacked.append(cardContent);

            var cardAction = $("<div>");
            cardAction.addClass("card-action center-align");

            var requestLink = $("<a>")
            requestLink.addClass("request_book")
            requestLink.text("Request this Book");
            requestLink.data("book", dataObj)

            cardAction.append(requestLink);
            cardStacked.append(cardAction);
            cardHorizontal.append(cardStacked)
            fullCard.append(cardHorizontal)

            $("#result").append(fullCard)

        }
    }

    function handleBookRequest() {
        var selectedBook = $(this).data("book");
        console.log(selectedBook)
        $.post("/book/request", selectedBook, function(result) {
            console.log(result)
            console.log("Request submitted")
            window.location.href = "/home";
        })
    //   window.location.href = "/new-dream?dream_id=" + currentDream.id;
    }

    // **************************************************************************************

  });
  