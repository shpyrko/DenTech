function add_appointment(first_name, last_name, phone_no, appointment_datetime) {
    db = firebase.firestore();
    var patient_snapshot = db.collection("patients").get().then((snapshot) => {
        return snapshot.docs;
    });
    
    console.log(patient_snapshot);
    for (var patient_doc of patient_snapshot.docs) {
        patient_doc.ref.collection("forms").doc("basic_info").get().then((patient_info) => {
            var patient = patient_info.data();
            console.log(patient);
            if (first_name == patient.first_name && last_name == patient.last_name && phone_no == patient.phone) {
                patient_doc.ref.collection("appointments").add({
                    checkedIn: false,
                    date: appointment_datetime
                });
                return true;  
            }
        });
    }
    return false;
}

$(document).ready(function() {

    $("#add_appointment").click(function() {
        // Convert date and time to Date object
        // Query for patient, return error if not found
        // Add appointment to "appointments" collection

        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var phone_no = document.getElementById("phone_no").value;
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        var appointment_datetime = new Date(date + " " + time);
        
        var found = add_appointment(first_name, last_name, phone_no, appointment_datetime);
        console.log(found);
        
        if (found) {
            window.location = "dashboard.html";
        }
        else {
            window.alert("Patient not found");
        }
        
    });
    
});