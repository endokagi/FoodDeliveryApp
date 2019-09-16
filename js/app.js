// Login
var login = function () {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username === 'thewlip' && password === '0000') {
    // ons.notification.alert('Congratulations!');
    window.location.replace("main.html");}
  else if (username === 'w' && password === 'w') {
    window.location.replace("main.html");
  } else {
    ons.notification.alert('Incorrect username or password.');
  }
};

// Regist
var regist = function () {
  var username = document.getElementById('username2').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var password = document.getElementById('password2').value;

  if (!(username === '' || email === '' || phone === '' || password === '')) {
    ons.notification.alert('Registation Complete!');
    $("#Register").html('Back');
    $('#facebookbtn').attr("disabled", true);
    $('#googlebtn').attr("disabled", true);
    $("#Register").attr("onclick", "backtologin()");
  } else {
    ons.notification.alert('Incorrect please fill imformation.');
  }
};

// backtologin
var backtologin = function () {
  $("#Register").click(function () {
    window.location.replace("index.html");
  });
}

// main
document.addEventListener('init', function (event) {
  var page = event.target;
  console.log(page.id);

  if (page.id === 'tabbar') {
    $('#menubtn').click(function () {
      var menu = document.getElementById('menu');
      menu.open();
    });
  }
});

