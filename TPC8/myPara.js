$(function(){
    $.get('http://localhost:3000/paras', function(data){
        data.forEach(p => {
            $("#paraList").append('<p>' + p.para + ' <input id="'+ p._id+'" type="button" value="Editar" class="botao"/> <input id="'+ p._id+'" type="button" value="Apagar" class="botao"/>  </p>')
            //console.log('<p>' + p.para + '<input id="'+ p._id+'" type="button" value="Editar" class="input"/> <input id="'+ p._id+'" type="button" value="Apagar"/> </p>')
        });
    })

    
    $("#paraList").on('click', '.botao', function(){
        //var id = $(this).attr('id');
        if(this.value == "Editar"){
            console.log("ID = ", this.id)
            //$.get('http://localhost:3000/paras/'+this.id, function(){
            //    console.log("mandei apagar: ", this.id)
            //})
        }
        if(this.value == "Apagar"){
            console.log("ID = ", this.id)
            $.get('http://localhost:3000/paras/'+this.id, function(){
           console.log("mandei apagar: ", this.id)
            })
        }
    })

    $("#addPara").click(function(){
        new_value = $("#paraText").val()
        $("#paraList").append("<p>" + new_value + '<button id="editar"> Editar </button> <button id="delete"> Apagar </button> </p>');
        $.post("http://localhost:3000/paras", $("#myParaForm").serialize())
        alert('Record inserted: ' + JSON.stringify($("#myParaForm").serialize()))
        $("#paraText").val("");
    })
})

// JSON.stringify($("#myParaForm").serialize())