$(document).ready(function() {


    function mensaje(texto){     // funcion mensaje aviso
        $('#contenedorMensaje').fadeIn();
        $('#mensaje').text(texto);        
    }

    $('#adminCheckM').submit(async function(e) {
        e.preventDefault();
        let nombre=$('#inputNombre').val();
        let password=$('#inputPassword').val();

        //{"horaReserva":"idDeHoraReservaDeseada","codigoClientePersonal":"valorCCP"}
        await $.ajax({    
            type: 'POST',
            url: 'https://pimpam-toma-lacasitos-api.vercel.app/api/checkAdmin',
            contentType: 'application/json', // Especifica que el contenido es JSON porque AJAX es el producto de una mente enferma
            data: JSON.stringify({
                "nombre": nombre,
                "password": password
            }),
            success: function(response) {
                //console.log(response);
                if(response.mensaje=="FUCK YEAH"){
                    window.location.href = "adminMain.html"
                }else{
                    $("#adminModal").fadeOut();
                    mensaje("Login Erroneo");
                }
            }
        });
        
    });

    // Al hacer clic en el botón "Admin", se muestra el modal
    $(".admin-btn").click(function() {
        $("#adminModal").fadeIn(); // Muestra el modal con una animación
    });

    // Al hacer clic en el botón de cerrar (X), se cierra el modal
    $("#closeBtn").click(function() {
        $("#adminModal").fadeOut(); // Oculta el modal con una animación
    });


    $(document).ready(function () {
        $(".listaDeMenus").hide(); // Oculta las tarjetas al inicio
    
        $(".Lista-menus").click(function () {
            $(".listaDeMenus").slideToggle(300); // Muestra/Oculta con animación
        });
    });
    
});
