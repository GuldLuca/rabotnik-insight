$(document).ready(() =>{
    
    $.ajax({
        url: "/api/tasks",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{
        
        function getKeyByValue(obj, val){
            return Object.keys(obj).find(key => obj[key] === val);
        }
        
        let taskTable = jQuery(".taskList");
        let taskTbody = taskTable.find("tbody");
        
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
        console.log(employeeTasks);
        let projectNames = {};
        let projectClientIds = {};
        let projectArray = [];
        
        let clientNames = {};
        
        let employeeFirstnames = {};
        let employeeLastnames = {};
        
        let employeesAndTasks = {};
        
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
            console.log(taskLength);
            for(let i = 0; i<taskLength; i++){
                employeesAndTasks[[employeeTasks[i].id]] = tasks[i].id;
            }
            
        }
        
        // Fill table
        for(let i = 0; i < taskLength; i++){
            let employeeSelect = document.getElementById("select-employee");
            let projectSelect = document.getElementById("select-project");
            let clientFromEdit = document.getElementById("edit-client");
            let projectSelectAdd = document.getElementById("select-project-add");
            let clientFromAdd = document.getElementById("add-client");
            
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
            
            tTitle.innerText = tasks[i].title;
            tDescription.innerText = tasks[i].description;
            tTime.innerText = tasks[i].time;
            
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
            
            if(currentProjectId in projectNames){
                tProject.innerText = projectNames[currentProjectId];
                console.log(tProject.innerText);
            }
            
            if(currentProjectId in projectClientIds){
                tClient.innerText = clientNames[projectClientIds[currentProjectId]];
                console.log(tClient.innerText);
            }
            
            for(employee in employeeLastnames){
                employeeSelect.options[employeeSelect.options.length] = new Option(employeeLastnames[employee], employee);
            }
            
            for(project in projectNames){
                projectSelect.options[projectSelect.options.length] = new Option(projectNames[project], project);
                projectSelectAdd.options[projectSelectAdd.options.length] = new Option(projectNames[project], project);
            }
            
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
        
        $(sortableHeader).click(function(){
            var clientTable = $(this).parents('table').eq(0)
            var clientRows = clientTable.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
            this.asc = !this.asc
            if (!this.asc){clientRows = clientRows.reverse()}
            for (var i = 0; i < clientRows.length; i++){clientTable.append(clientRows[i])}
        })
        function comparer(index) {
            return function(a, b) {
                var valA = getCellValue(a, index), valB = getCellValue(b, index)
                return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
            }
        }
        function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
        
        //Edit task
        $(".editBtn").on("click", (event) => {
            document.getElementById("modal-edit-task").style.display="block";
            
            const id = $(event.currentTarget).attr("id");
            
            $.ajax({
                url: "/api/tasks/edit/" + id,
                type: "GET",
                data: {id: id}
            }).done(data=>{
                
                $("form").submit(function(event){
                    event.preventDefault();
                    const id = data.response.id;
                    
                    var dataFromForm = {
                        "title" : $("input[id=edit-title]").val(),
                        "description" : $("input[id=edit-description]").val(),
                        "time" : $("input[id=edit-time]").val(),
                        "done" : $("input[id=edit-done]").val(),
                        "project" : $("select[id=select-project]").val(),
                        "client" : $("input[id=edit-client]").val(),
                        "id" : data.response.id
                    }
                    
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