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
            var clientRows = clientTable.find("tr:gt(0)").toArray().sort(comparer($(this).index()));

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
        function comparer(index) {

            return function(a, b) {

                //Gets cellvalue of a and b parameters
                var valA = getCellValue(a, index), valB = getCellValue(b, index);

                //Returns 
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
            document.getElementById("modal-edit-client").style.display="block";
            
            event.preventDefault();

            const id = $(event.currentTarget).attr("id");

            const currentRow = event.currentTarget.parentNode.rowIndex;
            console.log(currentRow);

            const inputName = document.getElementById("edit-name");
            const inputCvr = document.getElementById("edit-cvr");
            const inputEmail = document.getElementById("edit-email");
            const inputPhone = document.getElementById("edit-phone");
            const inputContact = document.getElementById("edit-contact");

            inputName.value = "";
            inputCvr.value = "";
            inputEmail.value = "";
            inputPhone.value = "";
            inputContact.value = "";

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

        

            $.ajax({
                url: "/api/kunder/edit/" + id,
                type: "GET",
                data: {id: id}
            }).done(data=>{

                $("form").submit(function(event){

                    event.preventDefault();

                    const id = data.response.id;

                    var dataFromForm = {
                            "name" : $("input[id=edit-name]").val(),
                            "cvr" : $("input[id=edit-cvr]").val(),
                            "email" : $("input[id=edit-email]").val(),
                            "phone" : $("input[id=edit-phone]").val(),
                            "contact" : $("input[id=edit-contact]").val(),
                            "id" : data.response.id
                    }
                       
                    $.ajax({
                        url: "/edit-client",
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

        //Delete table row
        $(".deleteBtn").on("click", (event) =>{
            event.preventDefault();
            
            const id = $(event.currentTarget).attr("id");
            
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