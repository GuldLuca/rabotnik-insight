$(document).ready(() =>{
    $.ajax({
        url: "/api/kunder",
        type: "GET",
        dataType: "json"
    })
    .done(data =>{

        let clientTable = $(".clientList");
        let clientTbody = clientTable.find("tbody");
        
        let clients = data.response;
        let clientLength = clients.length;
        
        //Fill table rows
        for(let i = 0; i < clientLength; i++){
            const tableRow = document.createElement("tr");

            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            
            const tName = document.createElement("td");
            const tCvr = document.createElement("td");
            const tEmail = document.createElement("td");
            const tPhone = document.createElement("td");
            const tContact = document.createElement("td");

            tName.innerText = clients[i].name;
            tCvr.innerText = clients[i].cvr;
            tEmail.innerText = clients[i].email;
            tPhone.innerText = clients[i].phone;
            tContact.innerText = clients[i].contact;

            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Slet";

            $(editBtn).attr("class", "editBtn");
            $(deleteBtn).attr("class", "deleteBtn");

            $(editBtn).attr("id", clients[i].id);
            $(deleteBtn).attr("id", clients[i].id);

            $(tName).attr("id", "t-name");
            $(tCvr).attr("id", "t-cvr");
            $(tEmail).attr("id", "t-email");
            $(tPhone).attr("id", "t-phone");
            $(tContact).attr("id", "t-contact");

            tableRow.append(tName);
            tableRow.append(tCvr);
            tableRow.append(tEmail);
            tableRow.append(tPhone);
            tableRow.append(tContact);

            tableRow.append(editBtn);
            tableRow.append(deleteBtn);
            
            clientTbody.append(tableRow);
        }

        //Sort table
        let sortableHeader = document.getElementsByClassName("sortable");
        
        $(sortableHeader).click(function(){
            var clientTable = $(this).parents("table").eq(0);

            var clientRows = clientTable.find("tr:gt(0)").toArray().sort(comparer($(this).index()));

            this.asc = !this.asc;

            if (!this.asc){
                clientRows = clientRows.reverse();
            }
            for (var i = 0; i < clientRows.length; i++){
                clientTable.append(clientRows[i]);
            }
        })
        function comparer(index) {
            return function(a, b) {
                var valA = getCellValue(a, index), valB = getCellValue(b, index);

                return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
            }
        }
        function getCellValue(row, index){ return $(row).children("td").eq(index).text() }

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