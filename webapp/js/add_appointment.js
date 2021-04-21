async function add_appointment(first_name, last_name, phone_no, appointment_datetime) {
    db = firebase.firestore();
    const patient_snapshot = await db.collection("patients").get();
    console.log(patient_snapshot);
    const all_patients = [];
    
    for (var patient_doc of patient_snapshot.docs) {
        const patient_info = await patient_doc.ref.collection("forms").doc("basic_info").get();
        var patient = patient_info.data();
        console.log(patient);
        all_patients.push(patient_info);
        if (first_name == patient.first_name && last_name == patient.last_name && phone_no == patient.phone) {
            await patient_doc.ref.collection("appointments").add({
                checkedIn: false,
                date: appointment_datetime
            });
            return Promise.all(all_patients);
        }
    }
    return undefined;
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
        
        const found = add_appointment(first_name, last_name, phone_no, appointment_datetime).then(result => {
            console.log(result);
            if (result == undefined) {
                window.alert("Patient not found");
            }
            else {
                window.location = "dashboard.html";
            }
        });        
        
    });
    
});