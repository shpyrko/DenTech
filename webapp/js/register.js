function make_id(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

var conditions_list = ["AIDS/HIV", "Anemia", "Arthritis", "Asthma", "Blood Disease", "Cancer", "Chemotherapy", "Circulatory Problems, Diabetes", "Emphysema", "Epilepsy", "Fainting/Dizziness", "Glaucoma", "Heart Murmur", "Heart Problems", "Hepatitis", "Herpes", "High Blood Pressure", "Jaw Pain", "Kidney Disease", "Liver Disease", "Low Blood Pressure", "Pacemaker", "Respiratory Disease", "Shortness of Breath", "Sinus Trouble", "Skin Rash", "Stroke", "Thyroid Problems", "Ulcer", "Unexplained Weight Loss"];



$(document).ready(function() {
    
    var conditions = {};

    for (var condition in conditions_list) {
        conditions[condition] = false;
    }

    $("#register").click(function() {
        var db = firebase.firestore();
        var id = make_id(20);
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var email = document.getElementById("email_address").value;
        var address = document.getElementById("home_address").value;
        var phone_no = document.getElementById("phone_no").value;
    
        db.collection("patients").doc(id).set({
            email: email
        });
        
        db.collection("patients").doc(id).collection("forms").doc("basic_info").set({
            address: address,
            first_name: first_name,
            last_name: last_name,
            phone: phone_no
        });
        
        console.log(conditions);
        db.collection("patients").doc(id).collection("forms").doc("conditions").set(conditions);
        
        db.collection("patients").doc(id).collection("forms").doc("conditions").set({
            medications: ""
        });
    
        db.collection("patients").doc(id).collection("forms").doc("insurance").set({
           company: "" 
        });
        
        alert("Patient registered succesfully");
        window.location = "dashboard.html";
        
    });
    
});