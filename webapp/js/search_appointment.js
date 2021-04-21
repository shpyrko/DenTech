async function search_appointment(first_name, last_name, phone_no) {
    db = firebase.firestore();
    const patient_snapshot = await db.collection("patients").get();
    const all_patients = [];
    
    for (var patient_doc of patient_snapshot.docs) {
        const patient_info = await patient_doc.ref.collection("forms").doc("basic_info").get();
        var patient = patient_info.data();
        console.log(patient);
        
        if (first_name == patient.first_name && last_name == patient.last_name && phone_no == patient.phone) {
            const patient_appointments = await patient_doc.ref.collection("appointments").get();
            for (var appointment_doc of patient_appointments.docs) {
                const appointment_date = new Date(appointment_doc.get("date").seconds * 1000);
                console.log(appointment_date);
                const today = new Date();
                if (appointment_date > today) {
                    return [appointment_doc.id, patient_doc.id];
                }
            }
        }
    }
    return undefined;
}

$(document).ready(function() {

    $("#next_appointment").click(function() {
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var phone_no = document.getElementById("phone_no").value;
        
        const appointment = search_appointment(first_name, last_name, phone_no).then(result => {
            if (result == undefined) {
                window.alert("Patient or appointment not found");
            }
            else {
                window.location = "/edit_appointment.html?appointment_id=" + result[0] + "&patient_id=" + result[1];
            }
        });        
        
    });
    
});