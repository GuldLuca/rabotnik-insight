$(document).ready(() =>{

    $.ajax({
        url: "/api/tasks",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{

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
        console.log(employeeTasks);
        let employeeTasksLength = employeeTasks.length;
        console.log("length of employeeTasks: ", employeeTasksLength);

        let projectNames = {};
        let projectClientIds = {};

        let clientNames = {};

        let employeeFirstnames = {};
        let employeeLastnames = {};

        let employeesAndTasks = {};

        for(let i = 0; i<projectLength;i++){
            projectNames[[projects[i].id]] = projects[i].titel;
            projectClientIds[[projects[i].id]] = projects[i].clientId;
        };
        
        for(let i = 0; i<clientLength; i++){
            clientNames[[clients[i].id]] = clients[i].name;
        }

        for(let i = 0; i<employeeLength; i++){
            employeeFirstnames[[employees[i].id]] = employees[i].firstName;
            employeeLastnames[[employees[i].id]] = employees[i].lastName;            
        }


        for(let i = 0; i<employeeTasksLength; i++){
            console.log("employeeTasks og tasks ", [employeeTasks[i].tasks]);
            let taskLength = employeeTasks[i].tasks.length;
            for(let i = 0; i<taskLength; i++){
                console.log("id from task: ", tasks[i].id);
            }
            employeesAndTasks[[employeeTasks[i].taskId]] = employeeTasks[i].employeeId;
        }
        
        for(let i = 0; i < taskLength; i++){
            let employeeSelect = document.getElementById("select-employee");

            const tableRow = document.createElement("tr");

            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tTitel = document.createElement("td");
            const tDescription = document.createElement("td");
            const tTime = document.createElement("td");
            const tDone = document.createElement("td");
            const tProject = document.createElement("td");
            const tClient = document.createElement("td");
            const tEmployee = document.createElement("td");
            const hiddenId = document.getElementById("id");

            tTitel.innerText = tasks[i].titel;
            tDescription.innerText = tasks[i].description;
            tTime.innerText = tasks[i].time;
            tDone.innerText = tasks[i].done;

            const currentProjectId = tasks[i].projectId;

            if(currentProjectId in projectNames){
                tProject.innerText = projectNames[currentProjectId];
            }

            if(currentProjectId in projectClientIds){
                tClient.innerText = clientNames[projectClientIds[currentProjectId]];
            }

            for(employee in employeeLastnames){
                employeeSelect.options[employeeSelect.options.length] = new Option(employeeLastnames[employee], employee);
            }

            if(tasks[i].id in employeesAndTasks){
                tEmployee.innerText = employeeLastnames[tasks[i].id];
            }

            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Slet";
            
            $(editBtn).attr("class", "editBtn");
            $(deleteBtn).attr("class", "deleteBtn");

            $(editBtn).attr("id", tasks[i].id);
            $(deleteBtn).attr("id", tasks[i].id);

            tableRow.append(tTitel);
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

        const editButton = document.getElementsByClassName("editBtn");
        const deleteButton = document.getElementsByClassName("deleteBtn");

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
                            "titel" : $("input[id=edit-titel]").val(),
                            "description" : $("input[id=edit-description]").val(),
                            "time" : $("input[id=edit-price]").val(),
                            "done" : $("input[id=edit-deadline]").val(),
                            "project" : $("input[id=edit-project]").val(),
                            //"client" : $("input[id=edit-client]").val(), HVORDAN?
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
    })
})