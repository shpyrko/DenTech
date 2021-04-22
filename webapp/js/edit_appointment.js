function get_date_no_time(full_date) {
    var month = (full_date.getMonth() + 1).toString();
    var day = full_date.getDate().toString();
    const year = full_date.getFullYear().toString();
    
    if (full_date.getDate() < 10) {
        day = "0" + day;
    }
    
    if (full_date.getMonth() + 1 < 10) {
        month = "0" + month;
    }
    
    const date = year + "-" + month + "-" + day;
    return date;
}

function get_time(datetime) {
    var hours = datetime.getHours().toString();
    var minutes = datetime.getMinutes().toString();
    return hours + ":" + minutes
}

async function fill_form(patient_id, apppointment_id) {
    try {
        var db = firebase.firestore();
        
        // Get existing information
        const patient_doc = db.collection("patients").doc(patient_id);
        const basic_info = patient_doc.collection("forms").doc("basic_info");
        const patient_data = await basic_info.get();
        const first_name = patient_data.get("first_name");
        const last_name = patient_data.get("last_name");
        const phone_no = patient_data.get("phone");


        const appointment_doc = patient_doc.collection("appointments").doc(apppointment_id);
        const appointment_data = await appointment_doc.get();
        const appointment_full_date = new Date(appointment_data.get("date").seconds * 1000);

        const date = get_date_no_time(appointment_full_date);
        const time = get_time(appointment_full_date);
        
        // Pre-fill forms with existing info
        document.getElementById("first_name").setAttribute('value', first_name);
        document.getElementById("last_name").setAttribute('value', last_name);
        document.getElementById("phone_no").setAttribute('value', phone_no);
        document.getElementById("date").setAttribute('value', date);
        document.getElementById("time").setAttribute('value', time);
        
    } catch (error) {
        console.log(error);
    }

}

async function edit_appointment(patient_id, appointment_id, appointment_datetime) {
    var db = firebase.firestore();
    
    // Updates appointment info
    const appointment_doc = db.collection("patients").doc(patient_id).collection("appointments").doc(appointment_id);
    const update_time = await appointment_doc.update({
        date: appointment_datetime
    });
    
    return update_time;
}

async function delete_appointment(patient_id, appointment_id) {
    var db = firebase.firestore();
    
    // Deletes appointment from patient
    const appointment_doc = db.collection("patients").doc(patient_id).collection("appointments").doc(appointment_id);
    const delete_appointment_doc = await appointment_doc.delete();
    return delete_appointment_doc;
}

$(document).ready(function() {
    const query_string = window.location.search;
    const params = new URLSearchParams(query_string); 
    const appointment_id = params.get("appointment_id");
    const patient_id = params.get("patient_id"); 
    
    fill_form(patient_id, appointment_id);
    
    $("#edit_appointment").click(function() {
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        var appointment_datetime = new Date(date + " " + time);
        
        const appointment = edit_appointment(patient_id, appointment_id, appointment_datetime).then(result => {
            window.location = "dashboard.html";
        });        
    });
    
    $("#delete_appointment").click(function() {
        const appointment = delete_appointment(patient_id, appointment_id).then(result => {
            alert("Appointment successfully deleted!")
            window.location = "dashboard.html";
        });        
    });
    
});