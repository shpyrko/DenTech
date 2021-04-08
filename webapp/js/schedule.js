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
    var hours = datetime.getHours();
    var minutes = datetime.getMinutes();
    var suffix = " AM";
    return datetime.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute:'2-digit'
  });
}

$(document).ready(function() {
    var today = new Date();
    var full_appointment_date = new Date();
    var rowspan = 0;
    
    var db = firebase.firestore();
    db.collection("patients").get().then((patient_snapshot) => {
        patient_snapshot.forEach((patient_doc) => {
            patient_doc.ref.collection("appointments").get().then((appointment_snapshot) => {
                appointment_snapshot.forEach((appointment_doc) => {
                    full_appointment_date = new Date(appointment_doc.get("date").seconds * 1000);
                    var time = get_time(full_appointment_date);
                    var simple_appointment_date = get_date_no_time(full_appointment_date);
                    var simple_today_date = get_date_no_time(today);
                    if (simple_appointment_date.valueOf() == simple_today_date.valueOf()) {
                        var id = patient_doc.id;
                        var email = patient_doc.get("email");
                        var checked_in = '"text-danger"';
                        if (patient_doc.get("checkedIn")) {
                            checked_in = '"text-success"';
                        }
                        var patient_info = {"id": id, "email": email, "time": time};
                        document.getElementById("appointments").insertAdjacentHTML('beforeend', '<tr> <td class="agenda-time"><p class=' + checked_in + '>' + time + '</p></td> <td class="agenda-events"> <div class="agenda-event"><p class=' + checked_in + '>' + email + '</p></div></td></tr>');
                    }
                }); 
            });  
        });
    });
    
    document.getElementById("appointments").insertAdjacentHTML('afterbegin', '<td class="agenda-date" class="active" rowspan="' + rowspan.toString() + '"> <div class="dayofweek">' + get_weekday() + '</div> <div class="shortdate text-muted">' + today.toDateString() + '</div></td>');
    
    // Add sorting for time in schedule

});


    
