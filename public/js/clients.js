$(document).ready(() =>{
    $.ajax({
        url: "/api/kunder",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{

        //Getting elements from DOM
        let clientTable = $(".clientList");
        let clientTbody = clientTable.find("tbody");
        
        //Defining clients from api data response
        let clients = data.response;
        let clientLength = clients.length;
        
        //Fill table rows
        for(let i = 0; i < clientLength; i++){

            //Create elements in DOM
            const tableRow = document.createElement("tr");

            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tName = document.createElement("td");
            const tCvr = document.createElement("td");
            const tEmail = document.createElement("td");
            const tPhone = document.createElement("td");
            const tContact = document.createElement("td");

            //Set innerText value to attributes from current client
            tName.innerText = clients[i].name;
            tCvr.innerText = clients[i].cvr;
            tEmail.innerText = clients[i].email;
            tPhone.innerText = clients[i].phone;
            tContact.innerText = clients[i].contact;

            //Set button text
            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Slet";

            //Set button attributes class and id
            $(editBtn).attr("class", "editBtn");
            $(deleteBtn).attr("class", "deleteBtn");

            $(editBtn).attr("id", clients[i].id);
            $(deleteBtn).attr("id", clients[i].id);

            //Set elements attributes id
            $(tName).attr("id", "t-name");
            $(tCvr).attr("id", "t-cvr");
            $(tEmail).attr("id", "t-email");
            $(tPhone).attr("id", "t-phone");
            $(tContact).attr("id", "t-contact");

            //Append elements to table row
            tableRow.append(tName);
            tableRow.append(tCvr);
            tableRow.append(tEmail);
            tableRow.append(tPhone);
            tableRow.append(tContact);

            tableRow.append(editBtn);
            tableRow.append(deleteBtn);
            
            //Append table row to table body
            clientTbody.append(tableRow);
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

        //Edit table row
        $(".editBtn").on("click", (event) => {
            //Display modal edit-elements
            document.getElementById("modal-edit-client").style.display="block";
            
            //prevent default handling of requests by browser
            event.preventDefault();

            //Id is the current event clicked
            const id = $(event.currentTarget).attr("id");

            const inputName = document.getElementById("edit-name");
            const inputCvr = document.getElementById("edit-cvr");
            const inputEmail = document.getElementById("edit-email");
            const inputPhone = document.getElementById("edit-phone");
            const inputContact = document.getElementById("edit-contact");

            const tName = document.getElementById("t-name");
            const tCvr = document.getElementById("t-cvr");
            const tEmail = document.getElementById("t-email");
            const tPhone = document.getElementById("t-phone");
            const tContact = document.getElementById("t-contact");

            inputName.value = tName.innerHTML;
            inputCvr.value = tCvr.innerHTML;
            inputEmail.value = tEmail.innerHTML;
            inputPhone.value = tPhone.innerHTML;
            inputContact.value = tContact.innerHTML;
        
            //Ajax API call
            $.ajax({
                url: "/api/kunder/edit/" + id,
                type: "GET",
                data: {id: id}
            }).done(data=>{

                //When form is submitted
                $("form").submit(function(event){

                    //Prevent default handling of requests by browser
                    event.preventDefault();

                    const id = data.response.id;

                    //What to send in PUT request
                    var dataFromForm = {
                            "name" : $("input[id=edit-name]").val(),
                            "cvr" : $("input[id=edit-cvr]").val(),
                            "email" : $("input[id=edit-email]").val(),
                            "phone" : $("input[id=edit-phone]").val(),
                            "contact" : $("input[id=edit-contact]").val(),
                            "id" : data.response.id
                    }

                    //Api put request   
                    $.ajax({
                        url: "/edit-client",
                        type: "PUT",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(dataFromForm),
                        success: function (data){
                            //When success refresh page
                            window.location = window.location;
                        },
                        error: function(e){
                            console.log(e);
                        }
                     })
                })
                
            });
        })

        //Delete table row
        $(".deleteBtn").on("click", (event) =>{
            event.preventDefault();
            
            const id = $(event.currentTarget).attr("id");
            
            //Confirm deletion
            if(confirm("Er du sikker på du vil slette denne kunde?")){
                $.ajax({
                    url: "/delete-client/" + id,
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