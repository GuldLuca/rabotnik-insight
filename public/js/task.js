
$(document).ready(() =>{
    
    $.ajax({
        url: "/api/tasks",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{
        

        //Return key connected to value
        function getKeyByValue(obj, val){
            return Object.keys(obj).find(key => obj[key] === val);
        }
        
        let taskTable = $(".taskList");
        let taskTbody = taskTable.find("tbody");
        
        //data from response
        let tasks = data.tasks;
        let taskLength = tasks.length;

        let projects = data.projects;
        let projectLength = projects.length;

        let clients = data.clients;
        let clientLength = clients.length;

        let employees = data.employees;
        let employeeLength = employees.length;

        let employeeTasks = data.employeeTasks;
        let employeeTasksLength = employeeTasks.length;

        //Objetcs
        let projectNames = {};
        let projectClientIds = {};
        let projectArray = [];
        
        let clientNames = {};
        
        let employeeFirstnames = {};
        let employeeLastnames = {};
        
        let employeesAndTasks = {};
        
        //Fill objects from data reponse
        for(let i = 0; i<projectLength;i++){
            projectNames[[projects[i].id]] = projects[i].title;
            projectClientIds[[projects[i].id]] = projects[i].clientId;
            projectArray.push(projects[i].title);
        };
        
        for(let i = 0; i<clientLength; i++){
            clientNames[[clients[i].id]] = clients[i].name;
        }
        
        for(let i = 0; i<employeeLength; i++){
            employeeFirstnames[[employees[i].id]] = employees[i].firstName;
            employeeLastnames[[employees[i].id]] = employees[i].lastName;            
        }
        
        for(let i = 0; i<employeeTasksLength; i++){
            let taskLength = employeeTasks[i].tasks.length;

            for(let i = 0; i<taskLength; i++){
                employeesAndTasks[[employeeTasks[i].id]] = tasks[i].id;
            }
            
        }
        
        // Fill table
        for(let i = 0; i < taskLength; i++){

            //Get elements from DOM
            let employeeSelect = document.getElementById("select-employee");
            let projectSelect = document.getElementById("select-project");
            
            let clientFromEdit = document.getElementById("edit-client");

            let projectSelectAdd = document.getElementById("select-project-add");
            let employeeSelectAdd = document.getElementById("select-employee-add");
            let clientFromAdd = document.getElementById("add-client");
            
            //Create missing elements
            const tableRow = document.createElement("tr");
            
            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tTitle = document.createElement("td");
            const tDescription = document.createElement("td");
            const tTime = document.createElement("td");
            const tDone = document.createElement("td");
            const tProject = document.createElement("td");
            const tClient = document.createElement("td");
            const tEmployee = document.createElement("td");
            
            //Insert correct data values
            tTitle.innerText = tasks[i].title;
            tDescription.innerText = tasks[i].description;
            tTime.innerText = tasks[i].time;
            
            //If done then insert font-awesome symbol
            if(tasks[i].done == true){
                const i = document.createElement("i");

                $(i).attr("class","fa fa-check");
                $(i).attr("aria-hidden", "true");

                tDone.append(i);
            }
            else{
                tDone.innerText = "";
            }
            
            const currentProjectId = tasks[i].projectId;
            
            //Fill data from objects
            if(currentProjectId in projectNames){
                tProject.innerText = projectNames[currentProjectId];
            }
            
            if(currentProjectId in projectClientIds){
                tClient.innerText = clientNames[projectClientIds[currentProjectId]];
            }
            
            for(employee in employeeLastnames){
                employeeSelect.options[employeeSelect.options.length] = new Option(employeeLastnames[employee], employee);
                employeeSelectAdd.options[employeeSelectAdd.options.length] = new Option(employeeLastnames[employee], employee);
            }
            
            for(project in projectNames){
                projectSelect.options[projectSelect.options.length] = new Option(projectNames[project], project);
                projectSelectAdd.options[projectSelectAdd.options.length] = new Option(projectNames[project], project);
            }
            
            //If project is chosen, get the correposnding client
            $(projectSelect).on("change", (event)=>{
                event.preventDefault();

                let selectedProject = projectSelect.options[projectSelect.selectedIndex].text;
                let currentProjectId = getKeyByValue(projectNames, selectedProject);

                if(projectArray.includes(selectedProject)){
                    clientFromEdit.value = clientNames[currentProjectId];
                }
                else{
                    console.log("not in projectNames");
                }
            })
            
            //If project is chosen get the corresponding client
            $(projectSelectAdd).on("change", (event)=>{
                event.preventDefault();

                let selectedProject = projectSelectAdd.options[projectSelectAdd.selectedIndex].text;
                let currentProjectId = getKeyByValue(projectNames, selectedProject);

                if(projectArray.includes(selectedProject)){
                    clientFromAdd.value = clientNames[currentProjectId];
                }
                else{
                    console.log("not in projectNames");
                }
            })
            
            
            if(tasks[i].id in employeesAndTasks){
                tEmployee.innerText = employeeLastnames[tasks[i].id];
            }
            
            editBtn.innerText = "Rediger";
            deleteBtn.innerText = "Slet";
            
            $(editBtn).attr("class", "editBtn");
            $(deleteBtn).attr("class", "deleteBtn");
            
            $(editBtn).attr("id", tasks[i].id);
            $(deleteBtn).attr("id", tasks[i].id);
            
            tableRow.append(tTitle);
            tableRow.append(tDescription);
            tableRow.append(tTime);
            tableRow.append(tDone);
            tableRow.append(tProject);
            tableRow.append(tClient);
            tableRow.append(tEmployee);
            
            tableRow.append(editBtn);
            tableRow.append(deleteBtn);
            
            taskTbody.append(tableRow);
        }
        
        //Sort table
        let sortableHeader = document.getElementsByClassName("sortable");
        
        //When table headers are clicked
        $(sortableHeader).click(function(){

            //Get table belonging to clicked table header
            var clientTable = $(this).parents("table").eq(0);

            //Get rows from table in an array which is sorted and compared with index
            var clientRows = clientTable.find("tr:gt(0)").toArray().sort(compareIt($(this).index()));

            //Change asc to desc
            this.asc = !this.asc;

            //If desc reverse rows
            if (!this.asc){
                clientRows = clientRows.reverse();
            }

            //Append rows to table
            for (var i = 0; i < clientRows.length; i++){
                clientTable.append(clientRows[i]);
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
        
        //Edit task
        $(".editBtn").on("click", (event) => {
            document.getElementById("modal-edit-task").style.display="block";
            
            //Current id
            const id = $(event.currentTarget).attr("id");
            

            //API get request
            $.ajax({
                url: "/api/tasks/edit/" + id,
                type: "GET",
                data: {id: id}
            }).done(data=>{
                
                //On form submit
                $("form").submit(function(event){
                    event.preventDefault();

                    const id = data.response.id;
                  
                    //Data to be send
                    var dataFromForm = {
                        "title" : $("input[id=edit-title]").val(),
                        "description" : $("input[id=edit-description]").val(),
                        "time" : $("input[id=edit-time]").val(),
                        "done" : $("input[id=edit-done]").val(),
                        "project" : $("select[id=select-project]").val(),
                        "client" : $("input[id=edit-client]").val(),
                        "employee" : $("select[id=select-employee]").val(),
                        "id" : data.response.id
                    }
                    
                    //API put request
                    $.ajax({
                        url: "/edit-task",
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
        
        //Delete task
        $(".deleteBtn").on("click", (event) =>{
            event.preventDefault();
            
            const id = $(event.currentTarget).attr("id");
            
            //Confirmation on deletion
            if(confirm("Er du sikker på du vil slette denne task?")){
                $.ajax({
                    url: "/delete-task/" + id,
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