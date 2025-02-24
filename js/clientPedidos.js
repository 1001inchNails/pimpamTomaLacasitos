$(document).ready(async function() {

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
