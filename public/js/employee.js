$(document).ready(() =>{
    $.ajax({
        url: "/api/employee",
        type: "GET",
        dataType: "json"
    })
    .done(data=>{

        const employees = data.employees;
        const employeeLength = employees.length;

        for(i=0; i<employeeLength; i++){
            const tableRow = document.createElement("tr");

            const tFirstName = document.createElement("td");
            const tLastName = document.createElement("td");
            const tEmail = document.createElement("td");

            tFirstName = employee

        }
    })

})