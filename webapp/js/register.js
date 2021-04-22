var conditions_list = ["AIDS/HIV", "Anemia", "Arthritis", "Asthma", "Blood Disease", "Cancer", "Chemotherapy", "Circulatory Problems", "Diabetes", "Emphysema", "Epilepsy", "Fainting/Dizziness", "Glaucoma", "Heart Murmur", "Heart Problems", "Hepatitis", "Herpes", "High Blood Pressure", "Jaw Pain", "Kidney Disease", "Liver Disease", "Low Blood Pressure", "Pacemaker", "Respiratory Disease", "Shortness of Breath", "Sinus Trouble", "Skin Rash", "Stroke", "Thyroid Problems", "Ulcer", "Unexplained Weight Loss"];

$(document).ready(function() {

    var conditions = {Medications: ""};
    
    // Sets empty forms
    for (let condition of conditions_list) {
        conditions[condition] = false;
    }

    $("#register").click(function() {
        var db = firebase.firestore();
        
        // Get basic info
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var email = document.getElementById("email_address").value;
        var address = document.getElementById("home_address").value;
        var phone_no = document.getElementById("phone_no").value;
        
        db.collection("patients").add({
            email: email
        }).then((docRef) => {
            var id = docRef.id;
            
            docRef.collection("forms").doc("basic_info").set({
                address: address,
                first_name: first_name,
                last_name: last_name,
                phone: phone_no
            });
            
            docRef.collection("forms").doc("conditions").set(conditions);

            docRef.collection("forms").doc("insurance").set({
               company: "",
               memberID: "",
               group_code: ""
            });

            window.location = "dashboard.html";
        }).catch(error => {
            console.log(error);
        });
        
    });
    
});