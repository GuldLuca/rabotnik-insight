$(document).ready(() =>{
    $.ajax({
        url: "/api/opgaver",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{
        
        let projectTable = $(".projectList");
        let projectTbody = projectTable.find("tbody");
        
        let projects = data.projects;
        let projectLength = projects.length;
        
        let clients = data.clients;
        let clientLength = clients.length;
        
        let clientNames = {};
        
        for(let i = 0; i<clientLength;i++){
            clientNames[[clients[i].id]] = clients[i].name;
        };
        
        //Fill table and create missing elements
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
            
            //Date format convertion
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
            
            //Add option from clients available in db
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
        
        //When table headers are clicked
        $(sortableHeader).click(function(){

            //Get table belonging to clicked table header
            var projectTable = $(this).parents("table").eq(0);

            //Get rows from table in an array which is sorted and compared with index
            var projectRows = projectTable.find("tr:gt(0)").toArray().sort(compareIt($(this).index()));

            //Change asc to desc
            this.asc = !this.asc;

            //If desc reverse rows
            if (!this.asc){
                projectRows = projectRows.reverse();
            }

            //Append rows to table
            for (var i = 0; i < projectRows.length; i++){
                projectTable.append(projectRows[i]);
            }
        })

        //Comparing function takes in an index
        //Returns a function that takes in two parameters
        function compareIt(index) {
            return function(a, b) {

                //Gets cellvalue of a and b parameters
                var valA = getCellValue(a, index);
                var valB = getCellValue(b, index);

                //Returns conditional operator. Condition + question mark + expression to be executed if condition is true + colon + expression to be executed if condition is false
                //If true return valA minus ValB
                //If false return valA as string compared to ValB
                //Locale is the current usersettings
                return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
            }
        }

        //Get value of cell
        //Takes  in row and index number
        function getCellValue(row, index){ 
            
            //Returns children (cells in this case) of row equal to passed index parameter and the text in it.
            return $(row).children("td").eq(index).text();
        }
        
        
        //Edit project
        $(".editBtn").on("click", (event) => {
            document.getElementById("modal-edit-project").style.display="block";
            
            //Current id
            const id = $(event.currentTarget).attr("id");
            
            //API get request
            $.ajax({
                url: "/api/opgaver/edit/" + id,
                type: "GET",
                data: {id: id}
            }).done(data=>{
                
                //When form is submitted
                $("form").submit(function(event){
                    event.preventDefault();

                    const id = data.response.id;
                    
                    //Data to send in put
                    var dataFromForm = {
                        "title" : $("input[id=edit-title]").val(),
                        "description" : $("input[id=edit-description]").val(),
                        "price" : $("input[id=edit-price]").val(),
                        "deadline" : $("input[id=edit-deadline]").val(),
                        "client" : $("select[id=select-client-edit]").val(),
                        "id" : data.response.id
                    }
                    
                    //API put request
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