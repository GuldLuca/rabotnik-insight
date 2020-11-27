$(document).ready(() =>{
    $.ajax({
        url: "/api/kunder",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{

        let clientTable = jQuery(".clientList");
        let clientTbody = clientTable.find("tbody");
        
        let clients = data.reponse;
        let clientLength = clients.length;
        
        for(let i = 0; i < clientLength; i++){
            const tableRow = document.createElement("tr");

            /*const deleteForm = document.createElement("form");
            const editForm = document.createElement("form");*/

            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tName = document.createElement("td");
            const tCvr = document.createElement("td");
            const tEmail = document.createElement("td");
            const tPhone = document.createElement("td");
            const tContact = document.createElement("td");

            tName.innerText = clients[i].name;
            tCvr.innerText = clients[i].cvr;
            tEmail.innerText = clients[i].email;
            tPhone.innerText = clients[i].phone;
            tContact.innerText = clients[i].contact;

            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Slet";

            $(deleteForm).attr("action", "/delete-client");
            $(deleteForm).attr("method", "POST");
            $(editForm).attr("action", "/edit-client");
            $(editForm).attr("method", "POST");

            deleteForm.appendChild(deleteBtn);
            editForm.appendChild(editBtn);

           /* $(editBtn).attr("id","editBtn" + clients[i].cvr);
            $(deleteBtn).attr("id","deleteBtn" + clients[i].cvr);
            
            $(editBtn).attr("onclick","edit-client()");
            $(deleteBtn).attr("onclick","delete-client()");*/

            tableRow.append(tName);
            tableRow.append(tCvr);
            tableRow.append(tEmail);
            tableRow.append(tPhone);
            tableRow.append(tContact);

            /*tableRow.append(editForm);
            tableRow.append(deleteForm);*/

            tableRow.append(editBtn);
            tableRow.append(deleteBtn);
            
            clientTbody.append(tableRow);
        }
    })
})