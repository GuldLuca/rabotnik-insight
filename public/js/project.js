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
        
        let clientNames = {};
        
        for(let i = 0; i<clientLength;i++){
            clientNames[[clients[i].id]] = clients[i].name;
        };
        
        //Fill table
        for(let i = 0; i < projectLength; i++){
            let clientSelect = document.getElementById("select-client");
            let clientSelectEdit = document.getElementById("select-client-edit");
            
            const tableRow = document.createElement("tr");
            
            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tTitle = document.createElement("td");
            const tDescription = document.createElement("td");
            const tPrice = document.createElement("td");
            const tDeadline = document.createElement("td");
            const tClient = document.createElement("td");
            
            const deadlineFromDb = projects[i].deadline;
            const jsDate = new Date(deadlineFromDb[0], deadlineFromDb[1] - 1, deadlineFromDb[2].substr(0, 2), deadlineFromDb[2].substr(3, 2), deadlineFromDb[2].substr(6, 2), deadlineFromDb[2].substr(9, 2));
            const readableDate = jsDate.getDate() + "/" + jsDate.getMonth() + "/" + jsDate.getFullYear();
            
            tTitle.innerText = projects[i].title;
            tDescription.innerText = projects[i].description;
            tPrice.innerText = projects[i].price;
            tDeadline.innerText = readableDate;
            
            const currentClientId = projects[i].clientId;
            
            if(currentClientId in clientNames){
                tClient.innerText = clientNames[currentClientId];
            }
            
            for(client in clientNames){
                clientSelect.options[clientSelect.options.length] = new Option(clientNames[client], client);
                clientSelectEdit.options[clientSelectEdit.options.length] = new Option(clientNames[client], client);
            }
            
            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Slet";
            
            $(editBtn).attr("class", "editBtn");
            $(deleteBtn).attr("class", "deleteBtn");
            
            $(editBtn).attr("id", projects[i].id);
            $(deleteBtn).attr("id", projects[i].id);
            
            tableRow.append(tTitle);
            tableRow.append(tDescription);
            tableRow.append(tPrice);
            tableRow.append(tDeadline);
            tableRow.append(tClient);
            
            tableRow.append(editBtn);
            tableRow.append(deleteBtn);
            
            projectTbody.append(tableRow);
        }
        
        //Sort table
        let sortableHeader = document.getElementsByClassName("sortable");
        
        $(sortableHeader).click(function(){
            var projectTable = $(this).parents('table').eq(0)
            var projectRows = projectTable.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
            this.asc = !this.asc
            if (!this.asc){projectRows = projectRows.reverse()}
            for (var i = 0; i < projectRows.length; i++){projectTable.append(projectRows[i])}
        })
        function comparer(index) {
            return function(a, b) {
                var valA = getCellValue(a, index), valB = getCellValue(b, index)
                return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
            }
        }
        function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
        
        
        //Edit project
        $(".editBtn").on("click", (event) => {
            document.getElementById("modal-edit-project").style.display="block";
            
            const id = $(event.currentTarget).attr("id");
            
            $.ajax({
                url: "/api/opgaver/edit/" + id,
                type: "GET",
                data: {id: id}
            }).done(data=>{
                
                $("form").submit(function(event){
                    event.preventDefault();
                    const id = data.response.id;
                    
                    var dataFromForm = {
                        "title" : $("input[id=edit-title]").val(),
                        "description" : $("input[id=edit-description]").val(),
                        "price" : $("input[id=edit-price]").val(),
                        "deadline" : $("input[id=edit-deadline]").val(),
                        "client" : $("select[id=select-client-edit]").val(),
                        "id" : data.response.id
                    }
                    
                    $.ajax({
                        url: "/edit-project",
                        type: "PUT",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(dataFromForm),
                        success: function (data){
                            window.location = window.location;
                        },
                        error: function(e){
                            console.log(e);
                        }
                    })
                })
                
            });
        })
        
        //Delete project
        $(".deleteBtn").on("click", (event) =>{
            event.preventDefault();
            const id = $(event.currentTarget).attr("id");
            
            if(confirm("Er du sikker på du vil slette denne opgave?")){
                $.ajax({
                    url: "/delete-project/" + id,
                    type: "DELETE",
                    success: function (data){
                        window.location = window.location;
                    },
                    error: function(e){
                        console.log(e);
                    }
                })
            }
        })
    })
})