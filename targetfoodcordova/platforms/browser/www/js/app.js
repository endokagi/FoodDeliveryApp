//////////////////////// Firebase //////////////////////////////////
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCNGyFiG2de8IyC0TUESCmiaqWhxWGTDKs",
  authDomain: "food-delivery-app-c4284.firebaseapp.com",
  databaseURL: "https://food-delivery-app-c4284.firebaseio.com",
  projectId: "food-delivery-app-c4284",
  storageBucket: "food-delivery-app-c4284.appspot.com",
  messagingSenderId: "704396540917",
  appId: "1:704396540917:web:265c9616397bfd760c7ebc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Use firestorengin
var db = firebase.firestore();

// Check Firebase Authentication
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    EMAIL = email;
    console.log(EMAIL + " sign in");
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    ons.notification.alert("Login Sucess !");
    $("#content")[0].load("foodCategory.html");
    // ...
  } else {

  }
});

function setFoodMenu(Ref) {
  selectedRef = Ref;
  // console.log(selectedRef);
  $("#content")[0].load('restaurantMenu.html');
}

function setSelectedCatagory(Catagory) {
  selectedCatagory = Catagory;
  // console.log(selectedCatagory);
  $("#content")[0].load('restaurantList.html');
}

// count Order & Item
var getitem = [];
var getprice = [];
var getdelivery = parseInt(0);
var prices = parseInt(0);
function getOrder(price, menu, delivery) {

  getitem.push(menu);
  getprice.push(price);
  getdelivery = parseInt(delivery);
  prices += parseInt(price);

  ons.notification.alert("Add 1 item !");
  // console.log("price have " + getprice);
  // console.log("menu have " + getitem);
  // console.log("count menu = " + getitem.length);
  // console.log("delivery = " + getdelivery);

  $("#show_price").empty();
  $("#show_price").append("Order " + prices + " ฿ " + getitem.length + " item");
}

// Main 
var EMAIL;
document.addEventListener('init', function (event) {
  var page = event.target;
  console.log("run " + page.id);

  if (page.id === "loginPage") {

    $("#loginbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();

      // console.log(username, password);

      firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode, errorMessage);
        ons.notification.alert("Incorrect, check your Email and Password");
      });
    });

    // login with google

    $("#googlebtn").click(function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      // popup
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        var email = user.email;
        EMAIL = email;
        ons.notification.alert("You are Logined !");
        console.log(EMAIL + " sign in");
        // $("#content")[0].load("foodCategory.html");
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
      // Check Firebase Authentication

    });

    $("#regist").click(function () {
      $("#content")[0].load("regist.html");
    });

  }

  if (page.id === "registPage") {

    $("#regist").click(function () {
      var username = $('#username').val();
      var email = $('#email').val();
      var phone = $('#phone').val();
      var password = $('#password').val();
      var Confirm_password = $('#Confirm_password').val();

      if (!(username === '' || email === '' || phone === '' || password === '' || Confirm_password === '')) {
        if (password == Confirm_password) {

          firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
              console.log("Can't add to database");
              ons.notification.alert("Password isn't secure");
            } else {
              console.log("Registation Success !");
              ons.notification.alert('Registation Complete!');
              $("#content")[0].load("login.html");

              // add to database 
              db.collection("user_info").doc().set({
                username: username,
                email: email,
                password: password,
                phone: phone
              })
                .then(function () {
                  console.log("Added in database!");

                }).catch(function (error) {
                  console.log("Error Writing document: ", error);
                });
            }
          });
        } else ons.notification.alert('Incorrect, please check or fill information.');

      } else {
        ons.notification.alert('Incorrect, please fill information.');
      }
    });

    $("#backBTN").click(function () {
      $("#content")[0].load("login.html");
    });

  }

  if (page.id === "menuPage") {

    $("#home").click(function () {
      $("#content")[0].load("foodCategory.html");
      $("#sidemenu")[0].close();
    });

    $("#logout").click(function () {
      console.log(EMAIL + " sign out");
      $("#sidemenu")[0].close();
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        ons.notification.alert("Logout Sucess !");
        $("#content")[0].load("login.html");
      }).catch(function (error) {
        // An error happened.
      });
    });

    $("#address").click(function () {
      $("#content")[0].load("address.html");
      $("#sidemenu")[0].close();
    });

  }

  if (page.id === "foodCategory") {

    $("#menubtn").click(function () {
      $("#sidemenu")[0].open();
    });

    db.collection("restaurant").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().star >= 4) {
          var carousel = `<ons-carousel-item modifier="nodivider" class="recomended_item" onclick="setFoodMenu('${doc.data().Ref}')">
          <div class="thumbnail" style="background-image: url(${doc.data().pic})">
          <div class="recomended_star"><ons-button class="recomended_btn">Rate ${doc.data().star}&#x2605;</ons-button></div>
          <div class="recomended_review"><ons-button class="recomended_btn">${doc.data().review} view</ons-button></div>
          </div><div class="recomended_item_title">${doc.data().name}</div>
          </ons-carousel-item>`;
          $('#carousel').append(carousel);
        }
      });
    });

    db.collection("category").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().color) {
          var category_orange = `<div class="card card--material" style="text-align: center; background-color: orangered; color: wheat;"
            onclick="setSelectedCatagory('${doc.data().category}')">
              <img src="${doc.data().pic}" style="width: 100px;">
              <b>${doc.data().name}</b>
          </div>`;
          $('#orange').append(category_orange);
        } else {
          var category_purple = `<div class="card card--material" style="text-align: center; background-color: rebeccapurple; color: wheat;"
            onclick="setSelectedCatagory('${doc.data().category}')">
              <img src="${doc.data().pic}" style="width: 100px;">
              <b>${doc.data().name}</b>
          </div>`;
          $('#purple').append(category_purple);
        }
      });
    });
  }

  if (page.id === "resListPage") {

    $("#backbtn").click(function () {
      $("#content")[0].load("foodCategory.html");
    });

    db.collection("restaurant").where("category", "==", selectedCatagory).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var show_resList = `<div class="card card--material" style="text-align: center;background-color: rebeccapurple; color: yellow"
          onclick="setFoodMenu('${doc.data().Ref}')">
          <ons-row><ons-col><img src='${doc.data().pic}' style="width: 80%">
            <b>${doc.data().name}</b>
            </ons-col><ons-col><br> ${doc.data().sh_star}
            <br>Delivery: ${doc.data().delivery} ฿<br>${doc.data().review} view</ons-col></ons-row></div>`;
        $('#show_resList').append(show_resList);


      });
    });
  }

  if (page.id === "resMenuPage") {

    $("#backbtn").click(function () {
      $("#content")[0].load("foodCategory.html");
    });

    db.collection("restaurant").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().Ref === selectedRef) {
          var show_res = `<ons-col><img src='${doc.data().pic}' style="width: 80%">
            <b>${doc.data().name}</b>
            </ons-col><ons-col><br> ${doc.data().sh_star}
        <br>Delivery: ${doc.data().delivery} ฿<br>review ${doc.data().review} view</ons-col>`;
          $('#show_res').append(show_res);

        }
      });
    });

    db.collection("restaurant").where("Ref", "==", selectedRef).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var menu = doc.data().menu;
        for (let index = 0; index < menu.length; index++) {
          var Menu = menu[index];
          var show_resMenu = `<ons-card><ons-row><ons-col>
              <img src='${Menu.pic}' style="width: 50%">
              </ons-col><ons-col style="text-align: center">
              ${Menu.name}<br>
              <ons-button style="background-color: purple" >${Menu.price} ฿</ons-button>&emsp;
              <ons-button style="width: 30%; background-color: rgba(0, 0, 0, 0.42);" 
              onclick="getOrder('${Menu.price}','${Menu.name}',${doc.data().delivery})">+</ons-button>
              </ons-col></ons-row></ons-card>`;
          $("#show_menu").append(show_resMenu);
        }
      });
    });

    $("#order").click(function () {
      if (getitem.length == 0) {
        ons.notification.alert("Can't pass, you have 0 menu in cart");
      } else
        $("#content")[0].load("order.html");
    });
  }

  if (page.id === "orderPage") {

    db.collection("restaurant").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().Ref === selectedRef) {
          var orderRes = `<img src="${doc.data().pic}" style="width: 20%">
          <br><b>${doc.data().name}</b><br>`;
          $('#orderRes').append(orderRes);
        }
      });
    });

    for (var i = 0; i < getitem.length; i++) {
      // var show_OrderMenu = `<ons-col width=20%>&emsp;` + (1) + `</ons-col>
      // <ons-col width=50%>- `+ getitem[i] + `</ons-col>&emsp;&emsp; 
      // <ons-col width=20%>`+ getprice[i] + `</ons-col>`;
      var show_OrderMenu = `
      <ons-col width=20%>&emsp;` + (1) + `</ons-col>
      <ons-col width=50%>- `+ getitem[i] + `</ons-col>&emsp;&emsp; 
      <ons-col width=20%>`+ getprice[i] + `</ons-col>`;

      $("#orderMenu").append(show_OrderMenu);
    }

    $("#show_delivery").append("Delivery is " + getdelivery + " ฿");
    var show_total = "Total: " + (prices + getdelivery) + " ฿";
    $("#show_total").append(show_total);

    $("#paybtn").click(function () {
      ons.notification.alert("Order Complete !");
      $("#cancelbtn").html('Back');
      $("#AllPay").empty();
      // $("#content")[0].load("address.html");
    });

    $("#cancelbtn").click(function () {
      prices = parseInt(0);
      getdelivery = parseInt(0);
      getitem = [];
      getprice = [];
      $("#content")[0].load("foodCategory.html");
    });

  }

  if (page.id === "addressPage") {
    var latitude, selectedLatitude;
    var longitude, selectedLongitude;

    var onSuccess = function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      mapboxgl.accessToken = 'pk.eyJ1IjoiZW5kb3pha2kiLCJhIjoiY2sybGExYWp0MDR5ZDNobHBqYmxlbXhkYyJ9.5B75D4Lwqh_gQk7Uj_vefw';
      var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [longitude, latitude], // starting position [lng, lat]
        zoom: 14 // starting zoom
      });

      // selectedLatitude = latitude;
      // selectedLongitude = longitude;

      var marker = new mapboxgl.Marker({
        draggable: true
      })
        .setLngLat([longitude, latitude])
        .addTo(map);
      onDragEnd();
      function onDragEnd() {
        var lngLat = marker.getLngLat();
        selectedLatitude = lngLat.lat;
        selectedLongitude = lngLat.lng;

        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
      }

      marker.on('dragend', onDragEnd);
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
      alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    $("#setAddress").click(function () {
      console.log("Latitude is " + selectedLatitude + " Longitude is " + selectedLongitude);

      // ons.notification.alert();
    });

    $("#backbtn").click(function () {
      $("#content")[0].load("foodCategory.html");
    });
  }

});