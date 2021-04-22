function convert_to_yes_no(value) {
    if (value == false) {
        return "No";
    }
    else if (value == true) {
        return "Yes";
    }
}


async function get_patient(patient_id) {
    
    try {
        // Returns array of all patient information
        // First, last, phone, email, next appointment date, and form info
        var patient_info = {};

        // Regular info
        var db = firebase.firestore();
        const patient_doc = db.collection("patients").doc(patient_id);
        const patient_snapshot = await patient_doc.get();

        const basic_info = patient_doc.collection("forms").doc("basic_info");
        const patient_data = await basic_info.get();
        patient_info["First Name"] = patient_data.get("first_name");
        patient_info["Last Name"] = patient_data.get("last_name");
        patient_info["Phone Number"] = patient_data.get("phone");
        patient_info["Email"] = patient_snapshot.get("email");
        patient_info["Next Appointment"] = "No upcoming appointments";


        // Next appointment
        var appointment_date = new Date();
        const today = new Date();
        const patient_appointments = await patient_doc.collection("appointments").get();
        for (var appointment_doc of patient_appointments.docs) {
            appointment_date = new Date(appointment_doc.get("date").seconds * 1000);
            if (appointment_date > today) {
                patient_info["Next Appointment"] = appointment_date.toDateString();
                break;
            }
        }

        // Conditions
        const patient_conditions = await patient_doc.collection("forms").doc("conditions").get();
        patient_info["Conditions"] = patient_conditions.data();

        // Insurance
        const patient_insurance_doc = await patient_doc.collection("forms").doc("insurance").get();
        patient_info["Insurance Company"] = patient_insurance_doc.get("company");
        patient_info["Member ID"] = patient_insurance_doc.get("memberID");
        patient_info["Group Code"] = patient_insurance_doc.get("group_code");

        return patient_info;
    
    } catch (error) {
        console.log(error);
    }
}

$(document).ready(function() {
    const query_string = window.location.search;
    const params = new URLSearchParams(query_string); 
    const patient_id = params.get("patient_id"); 
    
    document.getElementById("update_info").setAttribute('href', 'update_info.html?patient_id=' + patient_id);

    
    get_patient(patient_id).then(patient_info => {    
        // Insert patient info to html
        for (var item in patient_info) {
            if (typeof patient_info[item] === "object") {
                for (var condition in patient_info[item]) {
                    document.getElementById("conditions").insertAdjacentHTML('beforeend', '<h3 class="text-primary">' + condition +  ': </h3> <h3> ' + convert_to_yes_no(patient_info[item][condition]) + '</h3><br />');
                }
            }
            else {
                document.getElementById("basic_info").insertAdjacentHTML('beforeend', '<h3 class="text-primary">' + item + ': </h3> <h3>' + patient_info[item] + '</h3><br />');
            }
        }
        
    }).catch(error => {
        console.log(error);
    });
    
    $("#update_info").click(function() {
       window.location = "update_info.html?patient_id=" + patient_id; 
    });
    
});