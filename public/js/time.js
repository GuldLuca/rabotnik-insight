$(document).ready(() =>{
    
    $.ajax({
        url: "/api/timer",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{
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

        let timeTable = $(".timeList");
        let timeTbody = timeTable.find("tbody");

        for(i = 0; i<taskLength;i++){

            const tableRow = document.createElement("tr");
                        
            const tTask = document.createElement("td");
            const tProject = document.createElement("td");
            const tClient = document.createElement("td");
            const tEmployee = document.createElement("td");
            const tDate = document.createElement("td");
            const tTime = document.createElement("td");

            tTask.innerText = tasks[i].title;

            tableRow.append(tTask);
            tableRow.append(tProject);
            tableRow.append(tClient);
            tableRow.append(tEmployee);
            tableRow.append(tDate);
            tableRow.append(tTime);
                        
            timeTbody.append(tableRow);

        }


    })

})