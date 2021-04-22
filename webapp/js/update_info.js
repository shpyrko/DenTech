async function fill_form(patient_id) {
    try {
        var db = firebase.firestore();
        
        // Get existing information
        const patient_doc = db.collection("patients").doc(patient_id);
        const patient_data = await patient_doc.get();
        const basic_info_doc = patient_doc.collection("forms").doc("basic_info");
        const basic_info_data = await basic_info_doc.get();
        
        const first_name = basic_info_data.get("first_name");
        const last_name = basic_info_data.get("last_name");
        const phone_no = basic_info_data.get("phone");
        const home_address = basic_info_data.get("address");
        const email = patient_data.get("email");
        
        // Pre-fill forms with existing info
        document.getElementById("first_name").setAttribute('value', first_name);
        document.getElementById("last_name").setAttribute('value', last_name);
        document.getElementById("email_address").setAttribute('value', email);
        document.getElementById("home_address").setAttribute('value', home_address);
        document.getElementById("phone_no").setAttribute('value', phone_no);
        
    } catch (error) {
        console.log(error);
    }

}

async function update_patient(patient_id, email, home, phone_no) {
    try {
        var db = firebase.firestore();

        // Updates appointment info
        const patient_doc = db.collection("patients").doc(patient_id);
        const basic_info = patient_doc.collection("forms").doc("basic_info");

        await patient_doc.update({
            email: email
        });
        
        await basic_info.update({
            address: home,
            phone_no: phone_no
        });

    } catch (error) {
        console.log(error);
    }
}

$(document).ready(function() {
    const query_string = window.location.search;
    const params = new URLSearchParams(query_string); 
    const patient_id = params.get("patient_id"); 
    
    fill_form(patient_id);
    
    $("#update_patient").click(function() {
        var email = document.getElementById("email_address").value;
        var home = document.getElementById("home_address").value;
        var phone = document.getElementById("phone_no").value;
        
        const appointment = update_patient(patient_id, email, home, phone).then(result => {
            window.location = "dashboard.html";
        });        
    });
    
});