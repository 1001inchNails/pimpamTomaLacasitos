$(document).ready(async function() {

     // Al hacer clic en el botón "Admin", se muestra el modal
     $(document).on('click','.admin-btn',function(){
        $("#adminModal").fadeIn(); // Muestra el modal con una animación
    });

    $(".listaDeMenus").hide(); // Oculta las tarjetas al inicio

        await $.ajax({    
            type: 'GET',
            url: 'https://pimpam-toma-lacasitos-api.vercel.app/api/menus',
            data: '',
            success: function(response) {
                //console.log(response);
                response.forEach(function(obj){
                    $(`.listaDeMenus`).append(`
                        <section class="tarjeta-menu">
                            <h3>Menú ${obj.id}</h3>
                            <ul>
                                <li><strong>Menu:</strong>${obj.titulo}</li>
                                <li><strong>Primero:</strong>${obj.primero}</li>
                                <li><strong>Segundo:</strong>${obj.segundo}</li>
                                <li><strong>Bebida:</strong>${obj.bebida}</li>
                                <li><strong>Postre:</strong>${obj.postre}</li>
                            </ul>
                        </section>
                        `);
                    $('#menu').append($('<option>', {
                        value: obj.id,
                        text: obj.titulo
                    }));

                });
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>Error: ' + error + '</p>');
            }
        });
    
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



        function mensaje(texto){     // funcion mensaje aviso
            $('#contenedorMensaje').fadeIn();
            $('#mensaje').text(texto);        
        }

        $('#enviarNuevoPedido').submit(async function(e) {
            e.preventDefault();
            let idPedido=$('#menu').val();
            let codigoClientePersonal=$('#nombre').val();
    
            //{"idPedido":"valorDelIdDelMenuPedidoDeseado","codigoClientePersonal":"valorCCP"}
            await $.ajax({    
                type: 'POST',
                url: 'https://pimpam-toma-lacasitos-api.vercel.app/api/nuevoPedido',
                contentType: 'application/json', // Especifica que el contenido es JSON porque AJAX es el producto de una mente enferma
                data: JSON.stringify({
                    "idPedido": idPedido,
                    "codigoClientePersonal": codigoClientePersonal
                }),
                success: function(response) {
                    console.log(response);
                }
            });
            
            mensaje("Pedido solicitado");
        });

   

    // Al hacer clic en el botón de cerrar (X), se cierra el modal
    $(document).on('click','#closeBtn',function(){
        $("#adminModal").fadeOut(); // Oculta el modal con una animación
    });

    $(document).on('click','#buttMenus',function(){
        $(".listaDeMenus").fadeIn(); // Muestra/Oculta con animación
    });

    
});
