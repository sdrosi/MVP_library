$(document).ready(function() {
    // Gets an optional query string from our url (i.e. ?post_id=23)
    var url = window.location.search;
    var requestId;
    var updating = false;
    var requestObject;
    var respondingUserObject;
    // var respondingUser;

    $(document).on("click", ".accept_book", acceptRequest);
    $(document).on("click", ".reject_book", rejectRequest);
  
    if (url.indexOf("?offer_id=") !== -1) {
      requestId = url.split("=")[1];
    //   getUserInfo()
      getRequestData(requestId);
    //   buildRequestCard(requestObject, respondingUserObject)
    }

    function acceptRequest() {
        var selectedRequest = $(this).data("book");
        console.log(selectedRequest)
        $.ajax({
            method: "PUT",
            url: "/book/offer/update/" + selectedRequest.id + "/DELIVERY_PENDING" ,
            data: selectedRequest
          })
            .then(function() {
              window.location.href = "/home";
          });
    }

    function rejectRequest() {
        var selectedRequest = $(this).data("book");
        console.log(selectedRequest)
        $.ajax({
            method: "PUT",
            url: "/book/offer/update/" + selectedRequest.id + "/DECLINED" ,
            data: selectedRequest
          })
            .then(function() {
              window.location.href = "/home";
          });
    }

    // Gets data from db to pre-fill the newdream.html form
    // Works
    function getRequestData(book_id) {
        $.get("/view-offer/" + book_id, function(data) {
            if (data) {
                console.log(data)
                requestObject = {
                    id: data.id,
                    title: data.title,
                    author: data.author,
                    thumbnail: data.thumbnail,
                    ISBN: data.ISBN,
                    offerUsername: data.User.userName,
                    address: data.User.preferredDropAddress,
                    origin: data.UserId
                }
                console.log(requestObject)
                buildRequestCard(requestObject);
            }
        })
    }

    // function getUserInfo(book_object) {
    //     var user_id = book_object.respondingUser;
    //     $.ajax({
    //         method: "GET",
    //         url: "/user-info"
    //       })
    //         .then(function(data) {
    //           console.log(data)
    //           offeringUserObject = {
    //               id: data.id,
    //               userName: data.userName,
    //               address: data.preferredDropAddress, 
    //           }
    //           console.log(offeringUserObject)
    //           buildRequestCard(requestObject, respondingUserObject)
    //       });
    // }

    function buildRequestCard(offer_info) {
        console.log("offer_info")
        console.log(offer_info)
        // console.log("user_info")
        // console.log(user_info)
      
            var dataObj = {
              id: offer_info.id,
              title: offer_info.title,
              author: offer_info.author,
              thumbnail: offer_info.thumbnail,
              ISBN: offer_info.ISBN,
              address: offer_info.address,
              respondingUser: offer_info.offerUserName
              
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
          image.attr("src", offer_info.thumbnail)
    
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
          title.text(offer_info.title)
    
          var author = $("<p>");
          author.text("Author: " + offer_info.author);
    
          var ISBN = $("<p>");
          ISBN.text("ISBN: " + offer_info.ISBN);
    
        //   var offerer = $("<p>");
        //   offerer.text("Offerer: " + offer_info.offerUserName)
          
          var address = $("<blockquote>")
          address.text("Your Drop Off Location: " + offer_info.address);

    
          cardContent.append(title);
          cardContent.append(author);
          cardContent.append(ISBN);
        //   cardContent.append(offerer);
          cardContent.append(address);
          cardStacked.append(cardContent);
    
          var cardAction = $("<div>");
          cardAction.addClass("card-action center-align");
    
          var acceptLink = $("<a>")
          acceptLink.addClass("accept_book");
          acceptLink.text("Confirm Exchange");
          acceptLink.data("book", dataObj)

          var declineLink = $("<a>")
          declineLink.addClass("reject_book");
          declineLink.text("Decline Exchange");
          declineLink.data("book", dataObj)
    
          // var requestLink = $("<a>")
          // requestLink.addClass("request_book")
          // requestLink.text("Request this Book");
          // requestLink.data("book", dataObj)
    
          cardAction.append(acceptLink);
          cardAction.append(declineLink);
          cardStacked.append(cardAction);
          cardHorizontal.append(cardStacked)
          fullCard.append(cardHorizontal)
    
          $("#result").append(fullCard)

    }
});

// ********************************************************************************************************

  