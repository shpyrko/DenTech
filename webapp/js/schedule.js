function get_date_no_time(full_date) {
    full_date.setHours(0,0,0,0);
    return full_date;
}

function get_weekday() {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[new Date().getDay()];
    return n;
}

function get_time(datetime) {
    var full_hours = datetime.getHours();
    var minutes = datetime.getMinutes();
    var suffix = " AM";
    if (full_hours > 11) {
        suffix = " PM";
    }
    var hours = full_hours % 12;
    console.log(full_hours);
    console.log(minutes);
    return hours + ":" + minutes + suffix;
}

$(document).ready(function() {
    var today = new Date();
    var full_appointment_date = new Date();
        
    document.getElementById("appointments").insertAdjacentHTML('afterbegin', '<td class="agenda-date" class="active" rowspan="0"> <div class="dayofweek">' + get_weekday() + '</div> <div class="shortdate text-muted">' + today.toDateString() + '</div></td>');
    
    var db = firebase.firestore();
    db.collection("patients").get().then((patient_snapshot) => {
        patient_snapshot.forEach((patient_doc) => {
            patient_doc.ref.collection("appointments").get().then((appointment_snapshot) => {
                appointment_snapshot.forEach((appointment_doc) => {
                    full_appointment_date = new Date(appointment_doc.get("date").seconds * 1000);
                    console.log(full_appointment_date.getHours());
                    var simple_appointment_date = get_date_no_time(full_appointment_date);
                    var simple_today_date = get_date_no_time(today);
                    if (simple_appointment_date.valueOf() == simple_today_date.valueOf()) {
                        var id = patient_doc.id;
                        var email = patient_doc.get("email");
                        var time = full_appointment_date.getHours();
                        console.log(full_appointment_date.getHours());
                        var patient_info = {id: id, email: email, time: time};
                        console.log(patient_info);
                        document.getElementById("appointments").insertAdjacentHTML('beforeend', '<tr> <td class="agenda-time">' + time + '</td> <td class="agenda-events"> <div class="agenda-event">' + email + '</div></td></tr>');
                    }
                }); 
            });  
        });
    });

    
    // Insert data into schedule
    // Get day of the week
    // Get checked in

});


    
