$(document).ready(function () {

  $(document).on("click", ".offer_book", acknowledgeRequest);
  
  var logged_in_user_id;
  var book_requests;

  getUserId();
  getBookRequests();

  function getUserId() {
    $.get("/validate-user", function (data) {
      logged_in_user_id = data[0].id;
      console.log(logged_in_user_id)
    })
  }

  // This function grabs dreams from the database and updates the view
  function getBookRequests() {
    $.get("/books/offered", function (data) {
      console.log("Book requests", data);
      book_requests = data;
      if (!book_requests || !book_requests.length) {
        // displayEmpty();
      }
      else {
        console.log(book_requests)
        displayRequests(book_requests);
      }
    });
  }

  function displayRequests(results_list) {
    console.log(logged_in_user_id)

    for (i=0; i < results_list.length; i++) {
      console.log(results_list[i])

      if (results_list[i].UserId === logged_in_user_id) {
        console.log("They are equivalent")
        continue
      }

      else {

      var dataObj = {
        id: results_list[i].id,
        title: results_list[i].title,
        category: results_list[i].category,
        publishedDate: results_list[i].publishedDate,
        description: results_list[i].description,
        author: results_list[i].author,
        thumbnail: results_list[i].thumbnail,
        username: results_list[i].User.userName,
        zipcode: results_list[i].User.zipCode
        
    }

    // requestLink.addClass("card-footer-item");
    // requestLink.text("Have this book? Click to offer book!");
    // requestLink.data("book", dataObj)

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
      author.text("Author: " + results_list[i].author);

      var ISBN = $("<p>");
      ISBN.text("ISBN: " + results_list[i].ISBN);

      var offerer = $("<p>");
      offerer.text("Offerer: " + results_list[i].User.userName)
      
      var address = $("<p>")
      address.text("Address: " + results_list[i].User.preferredDropAddress)

      var description = $("<blockquote>");
      description.text(results_list[i].description)

      cardContent.append(title);
      cardContent.append(author);
      cardContent.append(ISBN);
      cardContent.append(offerer);
      cardContent.append(address);
      cardContent.append(description);
      // cardContent.append(zipCode);
      cardStacked.append(cardContent);

      var cardAction = $("<div>");
      cardAction.addClass("card-action center-align");

      var requestLink = $("<a>")
      requestLink.addClass("offer_book");
      requestLink.text("Have this book? Offer to this user");
      requestLink.data("book", dataObj)

      // var requestLink = $("<a>")
      // requestLink.addClass("request_book")
      // requestLink.text("Request this Book");
      // requestLink.data("book", dataObj)

      cardAction.append(requestLink);
      cardStacked.append(cardAction);
      cardHorizontal.append(cardStacked)
      fullCard.append(cardHorizontal)

      $("#offered_books").append(fullCard)

  }
  }
  }


  // This function does an API call to delete dreamss
  function acknowledgeRequest() {
    var selectedBook = $(this).data("book");
    console.log(selectedBook)
    $.ajax({
      method: "PUT",
      url: "/book/offer/update/" + selectedBook.id + "/PENDING",
      data: selectedBook
    })
      .then(function (data) {
        console.log(data);
        console.log("Update sent");
        getBookRequests();
        console.log("You have responded to the request.")
        window.location.href = "/home";
      });
  }

  // Getting the initial list of dreams
  // getDreams();
  // getBookRequests();

  // **********************************************************************************************************************

  

});

