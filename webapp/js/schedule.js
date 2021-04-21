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

function compare(a, b) {
    if (a.time_seconds < b.time_seconds) {
        return -1;
    }
    if (a.time_seconds > b.time_seconds) {
        return 1
    }
    return 0;
}

async function get_today_schedule() {
    var today = new Date();
    var full_appointment_date = new Date();    
    var patients_today = [];
    
    var db = firebase.firestore();
    var patient_snapshot = await db.collection("patients").get();
    for (var patient_doc of patient_snapshot.docs) {
        var appointment_snapshot = await patient_doc.ref.collection("appointments").get();
        for (var appointment_doc of appointment_snapshot.docs) {
            full_appointment_date = new Date(appointment_doc.get("date").seconds * 1000);
            var date_in_seconds = appointment_doc.get("date").seconds;
            var time = get_time(full_appointment_date);
            var simple_appointment_date = get_date_no_time(full_appointment_date);
            var simple_today_date = get_date_no_time(today);
            if (simple_appointment_date.valueOf() == simple_today_date.valueOf()) {
                var id = patient_doc.id;
                var email = patient_doc.get("email");
                var checked_in = "text-danger";
                if (appointment_doc.get("checkedIn")) {
                    console.log(appointment_doc.get("checkedIn"));
                    checked_in = "text-success";
                }
                var patient_info = {"id": id, "email": email, "time_seconds": date_in_seconds, "checked_in": checked_in, "time": time};
                patients_today.push(patient_info);
            }
        } 
    }
    
    return patients_today;
}

$(document).ready(function() {
    
    get_today_schedule().then(patients_today => {
        patients_today.sort(compare);
        var rowspan = patients_today.length + 1;
        
        document.getElementById("appointments").insertAdjacentHTML('afterbegin', '<td class="agenda-date" class="active" rowspan="' + rowspan.toString() + '"> <div class="dayofweek">' + get_weekday() + '</div> <div class="shortdate text-muted">' + new Date().toDateString() + '</div></td>');
        
        for (var patient in patients_today) {
            document.getElementById("appointments").insertAdjacentHTML('beforeend', '<tr> <td class="agenda-time"><p class="' + patients_today[patient]["checked_in"] + '">' + patients_today[patient]["time"] + '</p></td> <td class="agenda-events"> <div class="agenda-event"><a href="patient_profile.html?patient_id=' + patients_today[patient]["id"] + '"><p class="' + patients_today[patient]["checked_in"] + '">' + patients_today[patient]["email"] + '</p></a></div></td></tr>');
        }
        
    });

    
    
    
    // Add sorting for time in schedule

});


    
