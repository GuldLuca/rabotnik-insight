$(document).ready(() =>{
    $.ajax({
        url: "/api/employee",
        type: "GET",
        dataType: "json"
    })
    .done(data=>{
        
        let infoTable = jQuery(".infoList");
        let infoTbody = infoTable.find("tbody");
        
        const employee = data.employee;
        
        //Fill info table
        const tableRow = document.createElement("tr");
        
        const tFirstName = document.createElement("td");
        const tLastName = document.createElement("td");
        const tEmail = document.createElement("td");
        
        tFirstName.innerText = employee.firstName;
        tLastName.innerText = employee.lastName;
        tEmail.innerText = employee.email;
        console.log(employee);
        console.log(employee.email);
        
        console.log(tFirstName);
        console.log(tLastName);
        console.log(tEmail);
        
        tableRow.append(tFirstName);
        tableRow.append(tLastName);
        tableRow.append(tEmail);
        
        infoTbody.append(tableRow);
        
        //Edit info
        $("form").submit(function(event){
            event.preventDefault();
            const currentEmail = employee.email;
            
            var dataFromForm = {
                "firstName" : $("input[id=edit-firstname]").val(),
                "lastName" : $("input[id=edit-lastname]").val(),
                "email" : $("input[id=edit-email]").val(),
                "currentEmail" : currentEmail
            }
            
            $.ajax({
                url: "/edit-info",
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
        
        //Fill task table
        const allEmployeeTasks = data.employeeTasks;
        let employeeTasks = [];

        const projects = data.projects;
        const clients = data.clients;

        const projectNames = {};
        let projectClientIds = {};
        const clientNames = {};

        for(let i = 0; i<projects.length; i++){
            projectNames[[projects[i].id]] = projects[i].title;
            projectClientIds[[projects[i].id]] = projects[i].clientId;
        }

        for(let i = 0; i<clients.length; i++){
            clientNames[[clients[i].id]] = clients[i].name;
        }
                
        let taskTable = jQuery(".taskList");
        let taskTbody = taskTable.find("tbody");
        
        const taskTableRow = document.createElement("tr");
        
        const tTitle = document.createElement("td");
        const tDescription = document.createElement("td");
        const tTime = document.createElement("td");
        const tDone = document.createElement("td");
        const tProject = document.createElement("td");
        const tClient = document.createElement("td");
        
        for(let i = 0; i<allEmployeeTasks.length; i++){
            if(allEmployeeTasks[i].lastName == employee.lastName){
                employeeTasks.push(allEmployeeTasks[i]);
                let tasks = allEmployeeTasks[i].tasks;
                let taskLength = allEmployeeTasks[i].tasks.length;
                
                for(let i = 0; i<taskLength; i++){
                    
                    tTitle.innerText = tasks[i].title;
                    tDescription.innerText = tasks[i].description;
                    tTime.innerText = tasks[i].time;
                    tDone.innerText = tasks[i].done;

                    if(tasks[i].projectId in projectNames){
                        tProject.innerText = projectNames[tasks[i].projectId];                   
                    }

                    if(tasks[i].projectId in projectClientIds){
                        tClient.innerText = clientNames[projectClientIds[tasks[i].projectId]];
                    }
                }
                
            }
        }
        
        taskTableRow.append(tTitle);
        taskTableRow.append(tDescription);
        taskTableRow.append(tTime);
        taskTableRow.append(tDone);
        taskTableRow.append(tProject);
        taskTableRow.append(tClient);
        
        
        taskTbody.append(taskTableRow);
        
        //Fill time table
        let timeTable = jQuery(".timeList");
        let timeTbody = timeTable.find("tbody");
        
        const timeTableRow = document.createElement("tr");
        
        const timeTask = document.createElement("td");
        const timeDate = document.createElement("td");
        const timeTime = document.createElement("td");

        for(let i = 0; i<allEmployeeTasks.length; i++){
            if(allEmployeeTasks[i].lastName == employee.lastName){
                employeeTasks.push(allEmployeeTasks[i]);
                let tasks = allEmployeeTasks[i].tasks;
                let taskLength = allEmployeeTasks[i].tasks.length;
                console.log("here");
                for(let i = 0; i<taskLength; i++){
                    
                    timeTask.innerText = tasks[i].title;
                    timeDate.innerText = tasks[i].updatedAt;
                    timeTime.innerText = tasks[i].time;
                }
                
            }
        }
        console.log(timeTask.innerText);
        
        timeTableRow.append(timeTask);
        timeTableRow.append(timeDate);
        timeTableRow.append(timeTime);

        timeTbody.append(timeTableRow);

        
    });
})