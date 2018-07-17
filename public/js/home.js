$(document).ready(function () {
    $('.modal').modal();
    var inputUser = $("#user_name_input");
    var inputZip = $("#zip_code_input");
    var nameHelpText = $("#user_help_text");
    var formattedAddress = $("#formatted_address");
    var inputAddress = $("#address_input");
    var welcomeMessage = $("#welcome_message");
    var displayedUser;
    var loggedUser;
    $(document).on("click", "#check_user", checkUserName);
    $(document).on("click", ".remove-dashboard", archiveRequest);
    $(document).on("click", ".exchange-action", viewOffer);
    $(document).on("click", ".delete-book", deleteRequest);
    $(document).on("click", ".confirm-book", viewRequest);
    $(document).on("click", ".delivered-book", deliveryConfirmed);
    $(document).on("click", ".cancel-delivery", cancelOffer);
    $("#save_user").on("click", checkUsernames);
    $("#confirm_address").on("click", searchAddress);
    $(".delete").click(function() {
      $(".modal").removeClass("is-active");
   });
    
    var book_requests;

    function searchAddress() {
      var inputtedAddress = {
        address: inputAddress.val().trim()
      };
      console.log(inputtedAddress)
      $.post("/check-address", inputtedAddress, function(data) {
        console.log(data)
        formattedAddress.text("Your Formatted Address: " + data[0].formatted_address)
        var addressObject = {
          address: data[0].formatted_address,
          lat: data[0].location.lat,
          lng:data[0].location.lng, 
        }
        console.log("vvv Address Object vvv")
        console.log(addressObject)
        
      })

    }

    function saveAddress() {
      var inputtedAddress = {
        address: inputAddress.val().trim()
      };
      console.log(inputtedAddress)
      $.ajax({
        method: "PUT",
        url: "/save-address",
        data: inputtedAddress
      })
        .then(function() {
          window.location.href = "/home";
      });
    }

    // Checks if logged in user has a set user name
    function validateUserName() {
      $.get("/validate-user", function(data) {
        console.log("User", data);
        user = data;
        loggedUser = data;
        
        if (!user[0].userName) {
          console.log("username needed");
          renderModal();
        }

        else {
          displayedUser = user[0].userName;
          welcomeMessage.text("Welcome " + displayedUser)
          getBookRequests()
          getBookOffers()
          getPendingRequests()
          getPendingOffers()
        }
      })
    }

    // If no userName info was found for the logged in user, it will generate the modal
    function renderModal(new_user) {
      // $(".modal").addClass("is-active");
      // $('#modal1').modal('open');
      // $('#modal1').openModal();
      $('.modal').modal('open');

    }

    // Used whenever user clicks the button to check username
    function checkUserName() {
      var inputtedUser = inputUser.val().trim();
      var inputtedZip = inputZip.val().trim();
      console.log("Username input: " + inputtedUser);
      var userString = "/" + inputtedUser;

      $.get("/check-user" + userString, function(data) {
        console.log(data);
        if (data === null) {
          nameHelpText.text("Username available!")
        }

        else {
          nameHelpText.text("Sorry. That user exists. Please try again")
        }
      })
    }

    // When the user clicks "Save User" on the modal, it will check to see if that user name is already being used
    function checkUsernames() {
      var inputtedUser = inputUser.val().trim();
      var inputtedZip = inputZip.val().trim();
      console.log("Username input: " + inputtedUser);
      var userString = "/" + inputtedUser;

      $.get("/check-user" + userString, function(data) {
        console.log(data);
        if (data === null) {
          updateUsername(inputtedUser, inputtedZip)
        }

        else {
          nameHelpText.text("Sorry. That user exists. Please try again")
          console.log("User exists. Try a different username")
          renderModal();
        }
      })
    }

    function updateUsername(user_input, zip_input) {
      displayedUser = user_input;
      welcomeMessage.text("Welcome " + displayedUser);
        $.ajax({
          method: "PUT",
          url: "/update-user/" + user_input + "/" + zip_input
        })
          .then(function() {
            saveAddress();
          });
    }
  
    // This function grabs dreams from the database and updates the view
    function getBookRequests() {
      $.get("/profile/requests", function (data) {
        console.log("Book requests", data);
        book_requests = data;
        if (!book_requests || !book_requests.length) {
          displayEmpty();
        }
        else {
          displayRequests(book_requests);
        }
      });
    }

    function getBookOffers() {
      $.get("/profile/offers", function (data) {
        console.log("Book offers", data);
        book_offers = data;
        if (!book_offers || !book_offers.length) {
          displayEmpty();
        }
        else {
          displayOffers(book_offers);
        }
      });
    }

    function displayOffers(results_list) {
      for (i=0; i < results_list.length; i++) {

        var dataObj = {
          id: results_list[i].id,
          title: results_list[i].title,
          category: results_list[i].category,
          publishedDate: results_list[i].publishedDate,
          description: results_list[i].description,
          author: results_list[i].author,
          thumbnail: results_list[i].thumbnail,
          address: results_list[i].User.preferredDropAddress,
          username: results_list[i].User.userName
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
      author.text("Author: " + results_list[i].author);

      var status = $("<blockquote>");
      status.text("Status: " + results_list[i].postStatus)

      cardContent.append(title);
      cardContent.append(author);
      cardContent.append(status)
      cardStacked.append(cardContent);

      var cardAction = $("<div>");
      cardAction.addClass("card-action center-align");

      var requestLink = $("<a>")

      if (results_list[i].postStatus === "OFFERED") {
        requestLink.addClass("delete-book");
        requestLink.text("Remove from community offerings");
        requestLink.data("book", dataObj)
      }

      else if (results_list[i].postStatus === "PENDING") {
        requestLink.addClass("exchange-action");
        requestLink.text("Accept / Decline Book Offer");
        requestLink.data("book", dataObj)
      }

      else {
        requestLink.addClass("delete-book");
        requestLink.text("Remove from community offerings");
        requestLink.data("book", dataObj)
      }

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

    function getBookOffers() {
      $.get("/profile/offers", function (data) {
        console.log("Book offers", data);
        book_offers = data;
        if (!book_offers || !book_offers.length) {
          displayEmpty();
        }
        else {
          displayOffers(book_offers);
        }
      });
    }

    function getPendingRequests() {
      $.get("/requests/pending", function (data) {
        console.log("Pending Book Requests", data);
        book_requests = data;
        if (!book_requests || !book_requests.length) {
          displayEmpty();
        }
        else {
          displayPending(book_requests);
        }
      });
    }

    function getPendingOffers() {
      $.get("/offers/pending", function (data) {
        console.log("Pending Book Offers", data);
        book_offers = data;
        if (!book_offers || !book_offers.length) {
          displayEmpty();
        }
        else {
          displayPendingOffers(book_offers);
        }
      });
    }

    function displayPending(results_list) {
      for (i=0; i < results_list.length; i++) {

        var dataObj = {
          id: results_list[i].id,
          title: results_list[i].title,
          category: results_list[i].category,
          publishedDate: results_list[i].publishedDate,
          description: results_list[i].description,
          author: results_list[i].author,
          thumbnail: results_list[i].thumbnail,
          respondingUser: results_list[i].respondingUser,
          ISBN: results_list[i].ISBN
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
      author.text("Author: " + results_list[i].author);

      var ISBN = $("<p>");
      ISBN.text("ISBN: " + results_list[i].ISBN);

      var status = $("<blockquote>");

      console.log(displayedUser)

      if (results_list[i].postStatus === "PENDING") {
        status.text("Status: Pending requester response to your offer")
        cardContent.append(title);
        cardContent.append(author);
        cardContent.append(ISBN);
        cardContent.append(status)
        cardStacked.append(cardContent);
      }

      else if (results_list[i].postStatus === "DELIVERY PENDING") {
        status.text("Status: Requester accepted your offer. Please drop off book to the following location: " + loggedUser[0].preferredDropAddress)
        // var address = $("<p>");
        // address.text(displayedUser.preferredDropAddress)
        cardContent.append(title);
        cardContent.append(author);
        cardContent.append(ISBN);
        cardContent.append(status)
        // cardContent.append(address)
        cardStacked.append(cardContent);
      }

      else {
        status.text("Status: " + results_list[i].postStatus)
        cardContent.append(title);
        cardContent.append(author);
        cardContent.append(ISBN);
        cardContent.append(status)
        cardStacked.append(cardContent);
      }


      var cardAction = $("<div>");
      cardAction.addClass("card-action center-align");

      if (results_list[i].postStatus === "PENDING") {
        var cancelLink = $("<a>")
        cancelLink.addClass("cancel-delivery");
        cancelLink.text("Cancel Offer");
        cancelLink.data("book", dataObj);
      } 

      else if (results_list[i].postStatus === "DELIVERY PENDING") {

      var deliveredLink = $("<a>")
      deliveredLink.addClass("delivered-book");
      deliveredLink.text("Book Delivered");
      deliveredLink.data("book", dataObj);

      var cancelLink = $("<a>")
      cancelLink.addClass("cancel-delivery");
      cancelLink.text("Cancel Delivery");
      cancelLink.data("book", dataObj);
      
      }

      else if (results_list[i].postStatus === "DELIVERED") {

        var deliveredLink = $("<a>")
        deliveredLink.addClass("remove-dashboard");
        deliveredLink.text("Delete from Dashboard");
        deliveredLink.data("book", dataObj);
        
        }
      // var requestLink = $("<a>")
      // requestLink.addClass("request_book")
      // requestLink.text("Request this Book");
      // requestLink.data("book", dataObj)

      cardAction.append(deliveredLink);
      cardAction.append(cancelLink);
      cardStacked.append(cardAction);
      cardHorizontal.append(cardStacked)
      fullCard.append(cardHorizontal)

      $("#pending_delivery").append(fullCard)
    }
  }

  function displayPendingOffers(results_list) {
    for (i=0; i < results_list.length; i++) {

      var dataObj = {
        id: results_list[i].id,
        title: results_list[i].title,
        category: results_list[i].category,
        publishedDate: results_list[i].publishedDate,
        description: results_list[i].description,
        author: results_list[i].author,
        thumbnail: results_list[i].thumbnail,
        respondingUser: results_list[i].respondingUser,
        ISBN: results_list[i].ISBN
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
    author.text("Author: " + results_list[i].author);

    var ISBN = $("<p>");
    ISBN.text("ISBN: " + results_list[i].ISBN);

    var status = $("<blockquote>");

    console.log(displayedUser)

    if (results_list[i].postStatus === "PENDING") {
      status.text("Status: A user has requested this book.")
      cardContent.append(title);
      cardContent.append(author);
      cardContent.append(ISBN);
      cardContent.append(status)
      cardStacked.append(cardContent);
    }

    // else if (results_list[i].postStatus === "DELIVERY PENDING") {
    //   status.text("Status: Requester accepted your offer. Please drop off book to the following location: " + loggedUser[0].preferredDropAddress)
    //   // var address = $("<p>");
    //   // address.text(displayedUser.preferredDropAddress)
    //   cardContent.append(title);
    //   cardContent.append(author);
    //   cardContent.append(ISBN);
    //   cardContent.append(status)
    //   // cardContent.append(address)
    //   cardStacked.append(cardContent);
    // }

    // else {
    //   status.text("Status: " + results_list[i].postStatus)
    //   cardContent.append(title);
    //   cardContent.append(author);
    //   cardContent.append(ISBN);
    //   cardContent.append(status)
    //   cardStacked.append(cardContent);
    // }


    var cardAction = $("<div>");
    cardAction.addClass("card-action center-align");

    if (results_list[i].postStatus === "PENDING") {
      var cancelLink = $("<a>")
      cancelLink.addClass("exchange-action");
      cancelLink.text("Confirm/Decline Exchange");
      cancelLink.data("book", dataObj);
    } 

    else if (results_list[i].postStatus === "DELIVERY PENDING") {

    var deliveredLink = $("<a>")
    deliveredLink.addClass("delivered-book");
    deliveredLink.text("Book Delivered");
    deliveredLink.data("book", dataObj);

    var cancelLink = $("<a>")
    cancelLink.addClass("cancel-delivery");
    cancelLink.text("Cancel Delivery");
    cancelLink.data("book", dataObj);
    
    }

    else if (results_list[i].postStatus === "DELIVERED") {

      var deliveredLink = $("<a>")
      deliveredLink.addClass("remove-dashboard");
      deliveredLink.text("Delete from Dashboard");
      deliveredLink.data("book", dataObj);
      
      }
    // var requestLink = $("<a>")
    // requestLink.addClass("request_book")
    // requestLink.text("Request this Book");
    // requestLink.data("book", dataObj)

    cardAction.append(deliveredLink);
    cardAction.append(cancelLink);
    cardStacked.append(cardAction);
    cardHorizontal.append(cardStacked)
    fullCard.append(cardHorizontal)

    $("#pending_delivery").append(fullCard)
  }
}

    function displayRequests(results_list) {
      for (i=0; i < results_list.length; i++) {

        var dataObj = {
          id: results_list[i].id,
          title: results_list[i].title,
          category: results_list[i].category,
          publishedDate: results_list[i].publishedDate,
          description: results_list[i].description,
          author: results_list[i].author,
          thumbnail: results_list[i].thumbnail,
          respondingUser: results_list[i].respondingUser
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
      author.text("Author: " + results_list[i].author);

      var status = $("<blockquote>");
      status.text("Status: " + results_list[i].postStatus)

      cardContent.append(title);
      cardContent.append(author);
      cardContent.append(status)
      cardStacked.append(cardContent);

      var cardAction = $("<div>");
      cardAction.addClass("card-action center-align");

      var requestLink = $("<a>")

      if (results_list[i].postStatus === "REQUESTED") {
        requestLink.addClass("delete-book");
        requestLink.text("Cancel this Request");
        requestLink.data("book", dataObj)
      }

      else if (results_list[i].postStatus === "PENDING") {
        requestLink.addClass("confirm-book");
        requestLink.text("Accept / Decline Book Offer");
        requestLink.data("book", dataObj)
      }

      else {
        requestLink.addClass("delete-book");
        requestLink.text("Delete this Request");
        requestLink.data("book", dataObj)
      }

      // var requestLink = $("<a>")
      // requestLink.addClass("request_book")
      // requestLink.text("Request this Book");
      // requestLink.data("book", dataObj)

      cardAction.append(requestLink);
      cardStacked.append(cardAction);
      cardHorizontal.append(cardStacked)
      fullCard.append(cardHorizontal)

      $("#requested_books").append(fullCard)

    }
  }

    function viewRequest() {
      var selectedRequest = $(this).data("book");
      window.location.href = "/view_request?request_id=" + selectedRequest.id;

    }

    function viewOffer() {
      var selectedRequest = $(this).data("book");
      window.location.href = "/view_offer?offer_id=" + selectedRequest.id;

    }
  
  
    // This function does an API call to delete dreamss
    function deleteRequest() {
      var selectedBook = $(this).data("book");
      console.log(selectedBook)
      $.ajax({
        method: "DELETE",
        url: "/book/request/delete/" + selectedBook.id
      })
        .then(function () {
          getBookRequests();
        });
    }

    function cancelOffer() {
      var selectedBook = $(this).data("book");
      console.log(selectedBook)
      $.ajax({
        method: "PUT",
        url: "/book/request/update/" + selectedBook.id + "/DECLINED"
      })
        .then(function () {
          window.location.href = "/home";
        });
    }

    function deliveryConfirmed() {
      var selectedBook = $(this).data("book");
      console.log(selectedBook)
      $.ajax({
        method: "PUT",
        url: "/book/request/update/" + selectedBook.id + "/DELIVERED"
      })
        .then(function () {
          window.location.href = "/home";
        });
    }

    function archiveRequest() {
      var selectedBook = $(this).data("book");
      console.log(selectedBook)
      $.ajax({
        method: "PUT",
        url: "/book/request/update/" + selectedBook.id + "/ARCHIVE"
      })
        .then(function () {
          window.location.href = "/home";
        });
    }
  
    // Getting the initial list of dreams
    // getDreams();
    validateUserName();

    // **********************************************************************************************************************

  
  });
  
  