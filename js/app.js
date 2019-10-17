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

function setIDtoFoodMenu(ID) {
  selectedID = ID
  console.log(selectedID);
  document.querySelector('#myNavigator').pushPage('restaurantMenu.html');
}

function setSelectedCatagory(Catagory) {
  selectedCatagory = Catagory;
  console.log(selectedCatagory);
  document.querySelector('#myNavigator').pushPage('restaurantList.html');
}

// Main 
document.addEventListener('init', function (event) {
  var page = event.target;
  console.log("run " + page.id);

  if (page.id === 'tabbar') {
    $('#menubtn').click(function () {
      var menu = document.getElementById('menu');
      menu.open();
    });
  }

  if (page.id === "loginPage") {

    $("#loginbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();

      console.log(username, password);

      firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode, errorMessage);
      });
      // Check Firebase Authentication
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          console.log(email + " sign in");
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
        ons.notification.alert("Login Sucess !");
        console.log(email + " sign in");
        $("#content")[0].load("foodCategory.html");
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

    $("#back").click(function () {
      $("#content")[0].load("login.html");
    });
  }

  if (page.id === "registPage") {

    $("#regist").click(function () {
      var username = $('#username2').val();
      var email = $('#email').val();
      var phone = $('#phone').val();
      var password = $('#password2').val();

      if (!(username === '' || email === '' || phone === '' || password === '')) {
        ons.notification.alert('Registation Complete!');
        $("#Register").html('Back');
        $('#facebookbtn').attr("disabled", true);
        $('#googlebtn').attr("disabled", true);
        $("#Register").attr("onclick", "backtologin()");
      } else {
        ons.notification.alert('Incorrect please fill imformation.');
      }
    });

    $("#backbtn_regist").click(function () {
      document.querySelector('#myNavigator').pushPage('login.html');
      $("#sidemenu")[0].close();
    });

  }

  if (page.id === "menuPage") {

    $("#home").click(function () {
      $("#content")[0].load("foodCategory.html");
      $("#sidemenu")[0].close();
    });

    $("#logout").click(function () {
      console.log('logoutbtn pressed');
      $("#sidemenu")[0].close();
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        ons.notification.alert("Logout Sucess !");
        $("#content")[0].load("login.html");
      }).catch(function (error) {
        // An error happened.
      });
    });

  }

  if (page.id === "foodCategory") {
    
    $("#menubtn").click(function () {
    $("#sidemenu")[0].open();
    });

    db.collection("restaurant").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().star >= 4) {
          var carousel = `<ons-carousel-item modifier="nodivider" class="recomended_item" onclick="setIDtoFoodMenu('${doc.id}')">
      <div class="thumbnail" style="background-image: url(${doc.data().pic})"></div>
      <div class="recomended_item_title">${doc.data().name}</div>
      </ons-carousel-item>`;
          $('#carousel').append(carousel);
          $('#foodCategory').append(carousel);
        }
      });
    });

    db.collection("category").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().color) {
          var category_orange = `<div class="card card--material" style="text-align: center; background-color: orangered; color: wheat;"
            onclick="setSelectedCatagory('${doc.data().value}')">
              <img src="${doc.data().pic}" style="width: 100px;">
              <b>${doc.data().name}</b>
          </div>`;
          $('#orange').append(category_orange);
        } else {
          var category_purple = `<div class="card card--material" style="text-align: center; background-color: rebeccapurple; color: wheat;"
            onclick="setSelectedCatagory('${doc.data().value}')">
              <img src="${doc.data().pic}" style="width: 100px;">
              <b>${doc.data().name}</b>
          </div>`;
          $('#purple').append(category_purple);
        }
      });
    });
  }

});