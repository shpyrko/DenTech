$(document).ready(function(){

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            window.location = 'dashboard.html'; //user is logged in
        }
    });
    
    $("#login").click(function(){

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
            var username_input = document.getElementById("username_input").value;
            var password_input = document.getElementById("password_input").value;
            firebase.auth().signInWithEmailAndPassword(username_input, password_input)
                .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if(errorCode == 'auth/wrong-password'){
                        alert('wrong password');
                    }
                    else{
                        console.log(error.message);
                    }
                });
            });
        });

});