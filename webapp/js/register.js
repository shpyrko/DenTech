var conditions_list = ["AIDS/HIV", "Anemia", "Arthritis", "Asthma", "Blood Disease", "Cancer", "Chemotherapy", "Circulatory Problems", "Diabetes", "Emphysema", "Epilepsy", "Fainting/Dizziness", "Glaucoma", "Heart Murmur", "Heart Problems", "Hepatitis", "Herpes", "High Blood Pressure", "Jaw Pain", "Kidney Disease", "Liver Disease", "Low Blood Pressure", "Pacemaker", "Respiratory Disease", "Shortness of Breath", "Sinus Trouble", "Skin Rash", "Stroke", "Thyroid Problems", "Ulcer", "Unexplained Weight Loss"];

$(document).ready(function() {

    var conditions = {Medications: ""};

    for (let condition of conditions_list) {
        conditions[condition] = false;
    }

    $("#register").click(function() {
        var db = firebase.firestore();
        // Add verification to add id that doesn't exist yet
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var email = document.getElementById("email_address").value;
        var address = document.getElementById("home_address").value;
        var phone_no = document.getElementById("phone_no").value;
        
        var new_patient = db.collection("patients").add({
            email: email
        }).then((docRef) => {
            var id = docRef.id;
            console.log(id);
            
            docRef.collection("forms").doc("basic_info").set({
                address: address,
                first_name: first_name,
                last_name: last_name,
                phone: phone_no
            });
            
            console.log(conditions);
            docRef.collection("forms").doc("conditions").set(conditions);

            docRef.collection("forms").doc("insurance").set({
               company: "" 
            });

            window.location = "dashboard.html";
        });
//        
//        db.collection("patients").doc(new_patient.id).collection("forms").add("basic_info").set({
//            address: address,
//            first_name: first_name,
//            last_name: last_name,
//            phone: phone_no
//        });
//        
//        //console.log(conditions);
//        //new_patient.collection("forms").doc("conditions").set(conditions);
//        db.collection("patients").doc(new_patient.id).collection("forms").doc("conditions").add({
//            medications: ""
//        });
//    
//        db.collection("patients").doc(new_patient.id).collection("forms").doc("insurance").add({
//           company: "" 
//        });
//        
//        window.location = "dashboard.html";
        
    });
    
});