$(document).ready(function(){
    var login = document.getElementById("login");
    var username_input = document.getElementById("#username_input");
    var password_input = document.getElementById("#password_input");
    
    $("#login").click(function(){
       $.post("http://127.0.0.1:5000/webapp/loginAuth", {
           username: username_input,
           password: password_input
       },
        function(data){
           window.location.replace(data);
       }),
           "text"
    });

});