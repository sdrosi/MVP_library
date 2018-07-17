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
  
    if (url.indexOf("?request_id=") !== -1) {
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
            url: "/book/request/update/" + selectedRequest.id + "/DELIVERY_PENDING" ,
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
            url: "/book/request/update/" + selectedRequest.id + "/DECLINED" ,
            data: selectedRequest
          })
            .then(function() {
              window.location.href = "/home";
          });
    }

    // Gets data from db to pre-fill the newdream.html form
    // Works
    function getRequestData(book_id) {
        $.get("/view-request/" + book_id, function(data) {
            if (data) {
                console.log(data)
                requestObject = {
                    id: data.id,
                    title: data.title,
                    author: data.author,
                    thumbnail: data.thumbnail,
                    ISBN: data.ISBN,
                    respondingUser: data.respondingUser
                }
                console.log(requestObject)
                getUserInfo(requestObject);
            }
        })
    }

    function getUserInfo(book_object) {
        var user_id = book_object.respondingUser;
        $.ajax({
            method: "GET",
            url: "/user-info/" + user_id
          })
            .then(function(data) {
              console.log(data)
              respondingUserObject = {
                  id: data.id,
                  userName: data.userName,
                  address: data.preferredDropAddress,
                  lat: data.preferredDropLAT,
                  lng: data.preferredDropLNG 
              }
              console.log(respondingUserObject)
              buildRequestCard(requestObject, respondingUserObject)
          });
    }

    function buildRequestCard(book_info, user_info) {
        console.log("book_info")
        console.log(book_info)
        console.log("user_info")
        console.log(user_info)

        let initMap = () => {
            console.log("attempted to load!");

            
            let options = {
                zoom: 9,
                center: {lat: respondingUserObject.lat, lng: respondingUserObject.lng}
            }
            
            let myMap = new google.maps.Map(document.getElementById('myMapDiv'), options);
            
            let marker = new google.maps.Marker({ position: {lat: respondingUserObject.lat, lng: respondingUserObject.lng}, map: myMap});

        }
      
            var dataObj = {
              id: book_info.id,
              title: book_info.title,
              author: book_info.author,
              thumbnail: book_info.thumbnail,
              ISBN: book_info.ISBN,
              address: user_info.address,
              respondingUser: user_info.userName
              
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
          image.attr("src", book_info.thumbnail)
    
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
          title.text(book_info.title)
    
          var author = $("<p>");
          author.text("Author: " + book_info.author);
    
          var ISBN = $("<p>");
          ISBN.text("ISBN: " + book_info.ISBN);
    
          var offerer = $("<p>");
          offerer.text("Offerer: " + user_info.userName)
          
          var address = $("<blockquote>")
          address.text("Pick-Up Location: " + user_info.address);

            var address = $("<p>");
            address.addClass("subtitle is-6");
            address.text("Address: " + user_info.address)

            var bookMap = $("<div>");
            bookMap.attr("id", "myMapDiv");
            // bookMap.appendTo(initMap);
      
            var ISBN = $("<p>");
            ISBN.addClass("subtitle is-6");
            ISBN.text("ISBN: " + book_info.ISBN)
      
            var author = $("<p>");
            author.addClass("subtitle is-6");
            author.text("Author: " + book_info.author);
      
            var divider = $("<hr>")
      
            mediaContent.append(title);
            mediaContent.append(offerer);
            mediaContent.append(address);
            mediaContent.append(bookMap);
            mediaContent.append(ISBN);
            mediaContent.append(author);
            // mediaContent.append(bookDesc);
            mediaContent.append(divider);
      
            media.append(mediaLeft);
            media.append(mediaContent)
      
            cardContent.append(media)
            // cardContent.append(bookDesc);
      
            fullCard.append(cardContent);
      
            // Card Footer
            var footer = $("<footer>");
            footer.addClass("card-footer");
      
            var acceptLink = $("<a>")
            // requestLink.attr("href", "/request");
            acceptLink.addClass("card-footer-item accept");
            acceptLink.text("Accept Offer");
            acceptLink.data("book", dataObj)

          var declineLink = $("<a>")
          declineLink.addClass("reject_book");
          declineLink.text("Decline Offer");
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
    // $(document).on('load', '#result', function (event) {
    // })
});

// ********************************************************************************************************
  
//     // Getting jQuery references to the the form fields
//     var title = $("#title");
//     var mood = $("#mood");
//     var dream = $("#dream_input");
//     var postPrivacy = $("#privacy");
//     var cmsForm = $("#cms");
  
//     // Adding an event listener for when the form is submitted
//     $(cmsForm).on("submit", function handleFormSubmit(event) {
//       event.preventDefault();
//       if (!title.val().trim() || !dream.val().trim()) {
//         return;
//       }
//       // Building variable to be submitted to database
//       var newDream = {
//         title: title.val().trim(),
//         mood: mood.val(),
//         dream: dream.val(),
//         privacy: postPrivacy.val()
//       };
  
//       if (updating) {
//         console.log("Updating post")
//         newDream.id = dreamId;
//         updateDream(newDream);
//       }
//       else {
//         console.log("Submitting new post")
//         submitDream(newDream);
//       }
//     });
  
//     // Submits dream to database with a POST request
//     function submitDream(Dream) {
//       $.post("/add-dream/", Dream, function() {
//         window.location.href = "/my-dreams";
//       });
//     }
  

  
//     // Submits PUT request to update dream
//     function updateDream(dream) {
//       $.ajax({
//         method: "PUT",
//         url: "/add-dream",
//         data: dream
//       })
//         .then(function() {
//           window.location.href = "/my-dreams";
//         });
//     }
//   });
  