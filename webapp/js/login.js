$(document).ready(function(){
    var login = document.getElementById("login");
    var username_input = document.getElementById("username_input");
    var password_input = document.getElementById("password_input");
    
    $(login).click(function(){
       $.post("/login", {
           username: username_input,
           password: password_input
       },
             function(){
           // do something if request successful
       }) 
    });

});