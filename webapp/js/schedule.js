function get_date_no_time(full_date) {
    full_date.setHours(0,0,0,0);
    return full_date;
}

$(document).ready(function(){
    var today_schedule = {}
    
    
    var db = firebase.firestore();
    db.collection("patients").get().then((querySnapshot) => {
        querySnapshot.forEach((patient_doc) => {
            doc.collection("appointments").get().then((querySnapshot) => {
                querySnapshot.forEach(appointment_doc) => {
                    var full_appointment_date = new Date(appointment_doc.get("date"));
                    var simple_appointment_date = get_date_no_time(full_appointment_date);
                    var simple_today_date = get_date_no_time(new Date());
                    if (simple_appointment_date.valueOf() == simple_today_date.valueOf()) {
                        var id = patient_doc.id;
                        var email = patient_doc.get("email");
                        var time = full_appointment_date.toTimeString();
                        let patient_info = {"email": email, "time": time};
                        today_schedule.setItem(id, patient_info);
                    }
                } 
            });
        });
    });
});


    
