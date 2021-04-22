async function search_appointment(first_name, last_name, phone_no) {
    try {
        db = firebase.firestore();
        const patient_snapshot = await db.collection("patients").get();
        const all_patients = [];

        for (var patient_doc of patient_snapshot.docs) {
            const patient_info = await patient_doc.ref.collection("forms").doc("basic_info").get();
            var patient = patient_info.data();

            if (first_name == patient.first_name && last_name == patient.last_name && phone_no == patient.phone) {
                return patient_doc.id;
            }
        }
        return undefined;
        
    } catch (error) {
        console.log(error);
    }
}

$(document).ready(function() {

    $("#search_patient").click(function() {
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var phone_no = document.getElementById("phone_no").value;
        
        search_appointment(first_name, last_name, phone_no).then(patient_id => {
            if (patient_id == undefined) {
                window.alert("Patient not found");
            }
            else {
                window.location = "/patient_profile.html?patient_id=" + patient_id;
            }
        });        
        
    });
    
});