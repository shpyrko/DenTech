async function add_appointment(first_name, last_name, phone_no, appointment_datetime) {
    try {
        db = firebase.firestore();
        const patient_snapshot = await db.collection("patients").get();
        var patient_data = "";

        for (var patient_doc of patient_snapshot.docs) {
            const patient_info = await patient_doc.ref.collection("forms").doc("basic_info").get();
            var patient = patient_info.data();
            if (first_name == patient.first_name && last_name == patient.last_name && phone_no == patient.phone) {
                await patient_doc.ref.collection("appointments").add({
                    checkedIn: false,
                    date: appointment_datetime
                }).then((docRef) => {
                    var patientEmail = patient_doc.data().email;
                    var appointmentID = docRef.id;
                    patient_data = JSON.stringify(
                        {
                            email: patientEmail,
                            appointmentID: appointmentID
                        }
                    );
                })

                return Promise.resolve(patient_data);
            }
        }
        return undefined;
        
    } catch (error) {
        console.log(error);
    }
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
            if (result == undefined) {
                window.alert("Patient not found");
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://35.212.90.92/sendEmail", true)
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        window.location = "dashboard.html";
                    }
                }
                xhr.send(result)
                
            }
        });        
        
    });
    
});