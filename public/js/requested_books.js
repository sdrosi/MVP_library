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
    $.get("/books/requested", function (data) {
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

      var requester = $("<blockquote>");
      requester.text("Requester: " + results_list[i].User.userName + "; Zip Code: " + results_list[i].User.zipCode)

      var zipCode = $("<blockquote>");
      zipCode.text("Zip Code: " + results_list[i].User.zipCode)

      cardContent.append(title);
      cardContent.append(author);
      cardContent.append(ISBN);
      cardContent.append(requester);
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

      $("#requested_books").append(fullCard)

  }
  }
  }


  // This function does an API call to delete dreamss
  function acknowledgeRequest() {
    var selectedBook = $(this).data("book");
    console.log(selectedBook)
    $.ajax({
      method: "PUT",
      url: "/book/request/update/" + selectedBook.id + "/PENDING",
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

  // InitializeRows handles appending all of our constructed post HTML inside
  function initializeRows() {
    dreamContainer.empty();
    var dreamsToAdd = [];
    var positiveDreams = 0;
    var negativeDreams = 0;
    var neutralDreams = 0;
    for (var i = 0; i < dreams.length; i++) {
      dreamsToAdd.push(createNewRow(dreams[i]));
      console.log(dreams[i])
      if(dreams[i].polarity === "positive") {
        positiveDreams++;
      }

      else if (dreams[i].polarity === "negative") {
        negativeDreams++;
      }

      else if (dreams[i].polarity === "neutral") {
        neutralDreams++;
      }

      else {
        continue
      }
    }
    createChart(positiveDreams, negativeDreams, neutralDreams);
    dreamContainer.append(dreamsToAdd);
  }

  // This function constructs a dream's HTML
  function createNewRow(dream) {
    console.log(dream.polarity);
    var dreamPrivacy;
    if (dream.privacy === true) {
      dreamPrivacy = "Private"
    }
    else if (dream.privacy === false) {
      dreamPrivacy = "Public"
    }
    var polcon = dream.polarity_confidence;
    var formattedPolCon = (parseFloat(polcon)*100).toFixed(1)
    console.log(typeof(dream.polarity_confidence));
    
  //   Building the container column
    var newDreamColumn = $("<div>");
    newDreamColumn.addClass("columns is-mobile");

    var actualColumn = $("<div>");
    actualColumn.addClass("column dream-column");

  //   Top header of the card
    var topHeader = $("<header>");
    topHeader.addClass("card-header");

    var topTitleHeader = $("<p>");
    topTitleHeader.text(dream.title);
    topTitleHeader.addClass("card-header-title has-text-centered");

  //   Bottom header of the card
    var bottomHeader = $("<header>");
    bottomHeader.addClass("card-header");

    var bottomSentimentHeader = $("<p>");
    bottomSentimentHeader.text("Sentiment: " + dream.polarity);
    bottomSentimentHeader.addClass("card-header-title");

    var bottomConfidenceHeader = $("<p>");
    bottomConfidenceHeader.text("Sentiment Confidence: " + formattedPolCon);
    bottomConfidenceHeader.addClass("card-header-title");

    var bottomPrivacyHeader = $("<p>");
    bottomPrivacyHeader.text("Status: " + dreamPrivacy);
    bottomPrivacyHeader.addClass("card-header-title");

    var bottomMoodHeader = $("<p>");
    bottomMoodHeader.text("Mood: " + dream.mood);
    bottomMoodHeader.addClass("card-header-title");

  //   Dream content container
    var dreamContentContainer = $("<div>");
    dreamContentContainer.addClass("card-content");

    var dreamContent = $("<div>");
    dreamContent.text(dream.dream)
    dreamContent.addClass("content");

    var timeSpace = $("<br>")

    var timeDiv = $("<time>");
    var formattedDate = new Date(dream.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    timeDiv.text(formattedDate)

  //   Card footer with edit and delete button
  var cardFooter = $("<footer>");
  cardFooter.addClass("card-footer");

  var editButton = $("<a>");
  editButton.text("Edit");
  editButton.addClass("button-edit card-footer-item");

  var deleteButton = $("<a>");
  deleteButton.text("Delete");
  deleteButton.addClass("button-delete card-footer-item");

  // Bringing all of the dream card components together 

  // Add top header sections to top header
  topHeader.append(topTitleHeader);

  // Add bottom header sections to bottom header
  bottomHeader.append(bottomSentimentHeader);
  bottomHeader.append(bottomConfidenceHeader);
  bottomHeader.append(bottomPrivacyHeader);
  bottomHeader.append(bottomMoodHeader);

  // Add dream content sections to dream container
  dreamContentContainer.append(dreamContent);
  dreamContentContainer.append(timeSpace);
  dreamContentContainer.append(timeDiv);

  // Add card footer sections to card footer
  cardFooter.append(editButton);
  cardFooter.append(deleteButton);

  // Bring together the top header, bottom header, content container, and footer under one column
  actualColumn.append(topHeader);
  actualColumn.append(bottomHeader);
  actualColumn.append(dreamContentContainer);
  actualColumn.append(cardFooter);

  // Finish building the full dream card and send data with it
  newDreamColumn.append(actualColumn);
  newDreamColumn.data("dream", dream);

  // Send the full dream card back for further use
    return newDreamColumn;
  }

  // This function figures out which dream we want to delete and then calls
  // deletePost
  function handleDreamsDelete() {
    var currentDream = $(this)
    .parent()
    .parent()
    .parent()
    .data("dream");
    deleteDream(currentDream.id);
    window.location.href = "/my-dreams";
  }
  // This function figures out which dream we want to edit and takes it to the
  // Appropriate url
  function handleDreamsEdit() {
    var currentDream = $(this)
      .parent()
      .parent()
      .parent()
      .data("dream");
    window.location.href = "/new-dream?dream_id=" + currentDream.id;
  }

  // This function displays a message when there are no dreams
  // function displayEmpty() {
  //   chartContainer.empty();
  //   dreamContainer.empty();
  //   var messageH2 = $("<h2>");
  //   messageH2.css({ "text-align": "center", "margin-top": "50px" });
  //   messageH2.html("No posts yet for this category, navigate <a href='/cms'>here</a> in order to create a new dream.");
  //   dreamContainer.append(messageH2);
  // }

  // This function handles reloading new dreams when the category changes
  function handlePrivacyChange() {
    var newDreamCategory = $(this).val();
    getDreams(newDreamCategory);
  }

});

