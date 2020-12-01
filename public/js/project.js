$(document).ready(() =>{
    $.ajax({
        url: "/api/opgaver",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{

        let projectTable = jQuery(".projectList");
        let projectTbody = projectTable.find("tbody");
        
        let projects = data.projects;
        let projectLength = projects.length;
        let clients = data.clients;
        let clientLength = clients.length;
        
        for(let i = 0; i < projectLength; i++){
            const tableRow = document.createElement("tr");

            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tTitel = document.createElement("td");
            const tDescription = document.createElement("td");
            const tPrice = document.createElement("td");
            const tDeadline = document.createElement("td");
            const tClient = document.createElement("td");

            tTitel.innerText = projects[i].titel;
            tDescription.innerText = projects[i].description;
            tPrice.innerText = projects[i].price;
            tDeadline.innerText = projects[i].deadline;

            console.log("clientID ----- ", projects[i].clientId);

            let currentProject = projects[i];

            for(let i = 0; i<clientLength;i++){
                console.log("Current client id ----- ", currentProject.clientId);
                console.log("Client [i] id ------ ", clients[i].id);
                console.log("client name ---- ", clients[i].name);
                let currentClient = clients[i];
                console.log("Current client  ", currentClient);
                if(currentProject.clientId == currentClient.id){
                    tClient.innerText = currentClient.name;
                }
                else{
                    tClient.innerText = currentClient.id;
                }
            }

            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Slet";

            /*$(deleteForm).attr("action", "/delete-client");
            $(deleteForm).attr("method", "POST");
            $(editForm).attr("action", "/edit-client");
            $(editForm).attr("method", "POST");

            deleteForm.appendChild(deleteBtn);
            editForm.appendChild(editBtn);*/

            $(editBtn).attr("id","editBtn" + projects[i].cvr);
            $(deleteBtn).attr("id","deleteBtn" + projects[i].cvr);
            
            /*$(editBtn).attr("onclick","edit-client()");
            $(deleteBtn).attr("onclick","delete-client()");*/

            tableRow.append(tTitel);
            tableRow.append(tDescription);
            tableRow.append(tPrice);
            tableRow.append(tDeadline);
            tableRow.append(tClient);

            /*tableRow.append(editForm);
            tableRow.append(deleteForm);*/

            tableRow.append(editBtn);
            tableRow.append(deleteBtn);
            
            projectTbody.append(tableRow);
        }
    })
})