$(document).ready(async function(){

    function mensaje(texto){     // funcion mensaje aviso
        $('#contenedorMensaje').fadeIn();
        $('#mensaje').text(texto);        
    }

    $('#contMens').click(function(e){   // cierre menu mensaje
        e.preventDefault();
        $('#contenedorMensaje').fadeOut();
        $('#mensaje').val('');
    });

    function resetInputsNuevaIdea(){ // resetea inputs de nueva idea cuando se meten datos erroneos
        $('#formNuevaIdea').find('input:text, input:hidden').val('');
    }

    function checkearsiHayPropias(){    // chequea si el div para proyectos propios esta vacio
        if ($('.contIdeas .propias').is(':empty')) {
            $('.contIdeas .propias').css('display','none');
        } else {
            $('.contIdeas .propias').css('display','flex');
        }
        if ($('.contTodos .propias').is(':empty')) {
            $('.contTodos .propias').css('display','none');
        } else {
            $('.contTodos .propias').css('display','flex');
        }
        if ($('.contDoings .propias').is(':empty')) {
            $('.contDoings .propias').css('display','none');
        } else {
            $('.contDoings .propias').css('display','flex');
        }
        if ($('.contDones .propias').is(':empty')) {
            $('.contDones .propias').css('display','none');
        } else {
            $('.contDones .propias').css('display','flex');
        }
    }

    async function cargarMenus() {   // carga de tarjetas segun tipo
        await $.ajax({    
            type: 'GET',
            url: 'https://pimpam-toma-lacasitos-api.vercel.app/api/menus',
            data: '',
            success: function(response) {
                //console.log(response);
                let contadorTarj=0;
                response.forEach(function(obj){
                    $(`#contIdea .contIdeas`).append(`
                        <div id="menu${contadorTarj}" class="tarjeta">
                        <input class="tarjidunica" type="hidden" name="tarjidunica" value="${obj.id}">
                        <input class="tarjtitulo" type="hidden" name="titulo" value="${obj.titulo}">
                        <input class="tarjprimero" type="hidden" name="primero" value="${obj.primero}">
                        <input class="tarjsegundo" type="hidden" name="segundo" value="${obj.segundo}">
                        <input class="tarjpostre" type="hidden" name="postre" value="${obj.postre}">
                        <input class="tarjbebida" type="hidden" name="bebida" value="${obj.bebida}">
                        <p name="tarjidunica">Id: ${obj.id}</p>
                        <p name="titulo">Descripcion: ${obj.titulo}</p>
                        </div>
                        `);

                    $(`#menu${contadorTarj}`).addClass('fondo1');

                    contadorTarj++;
                });
                contadorTarj=0;
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>Error: ' + error + '</p>');
            }
        });
    }

    function borrarContenedor(tipo) { // vaciado de contenedores segun tipo
        $(`#cont${tipo} .cont${tipo}s`).empty();
    }

    function checkEstatusConts() {    // necesario para la interaccion entre toggles
        if(estadoBotonIdea && estadoBotonTodo && estadoBotonDone && estadoBotonDoing){
            estadoBotonAll=true;
        }
        else if(!estadoBotonIdea && !estadoBotonTodo && !estadoBotonDone && !estadoBotonDoing){
            estadoBotonAll=false;
        }
    }

    // estados para los toggles
    let estadoBotonIdea=false;
    let estadoBotonTodo=false;
    let estadoBotonDoing=false;
    let estadoBotonDone=false;
    let estadoBotonPapelera=false;
    let estadoBotonStats=false;
    let estadoBotonAll=false;

    let tarjetaActual;  // guardar datos de tarjeta actual para usar en el formulario de modificacion
    let idActualProyecto;

    $(document).on('click', '.tarjeta', function() { // para mostrar las tarjetas maximizadas (menus)
        $('#botoneraMax').css('display','flex');    // por defecto, oculto
        let tarjeta=$(this);    
        let datosTarjeta={
            tarjidunica: tarjeta.find('.tarjidunica').attr('value'),
            tarjtitulo: tarjeta.find('.tarjtitulo').attr('value'),
            tarjprimero: tarjeta.find('.tarjprimero').attr('value'),
            tarjsegundo: tarjeta.find('.tarjsegundo').attr('value'),
            tarjpostre: tarjeta.find('.tarjpostre').attr('value'),
            tarjbebida: tarjeta.find('.tarjbebida').attr('value')
        };
        idActualProyecto=datosTarjeta.tarjidunica;
        $('#idM').text('Id: ' + datosTarjeta.tarjidunica);
        $('#tarjtituloM').text('Descripcion: : ' + datosTarjeta.tarjtitulo);
        $('#primeroM').text('Primero: ' + datosTarjeta.tarjprimero);
        $('#segundoM').text('Segundo: ' + datosTarjeta.tarjsegundo);
        $('#postreM').text('Postre: ' + datosTarjeta.tarjpostre);
        $('#bebidasM').text('Bebidas: ' + datosTarjeta.tarjbebida);
        

        tarjetaActual=[datosTarjeta];  // guardar datos de tarjeta actual para usar en el formulario de modificacion

        $('#tarjetaModal').modal('show');
    });

    $(document).on('click', '#modifTarj',async function(){   // proceso de formulario de modificacion (tarjeta menus)
        $('#modalMaxi').css('display','none');
        $('#modificacionTarjeta').css('display','flex');

        
        $('#idMF').val(tarjetaActual[0].tarjidunica);
        $('#tarjtituloMF').val(tarjetaActual[0].tarjtitulo);
        $('#primeroMF').val(tarjetaActual[0].tarjprimero);
        $('#segundoMF').val(tarjetaActual[0].tarjsegundo);
        $('#postreMF').val(tarjetaActual[0].tarjpostre);
        $('#bebidasMF').val(tarjetaActual[0].tarjbebida);
        
    });
    $(document).on('click','#cancelarModif',function(){ // cancelar formulario modif
        $('#modalMaxi').css('display','flex');
        $('#modificacionTarjeta').css('display','none');
    });

    $('#formModif').submit(async function(e) {    // envio de formulario modificado (menus)
        e.preventDefault();
        let idunica=$('#idMF').val();
        let titulo=$('#tarjtituloMF').val();
        let primero=$('#primeroMF').val();
        let segundo=$('#segundoMF').val();
        let postre=$('#postreMF').val();
        let bebida=$('#bebidasMF').val();

        let colabs = new Set(); // para evitar un bug que me duplicaba los usuarios a veces y no desaparecia hasta recargar la pagina, tuve que eliminarlos a la fuerza con un set
        $('input[type="checkbox"]:checked').each(function() {
            colabs.add($(this).val());
        });

        //{"idvalue":"idvalueDeMenuACambiar","primero":"primerPlato","segundo":"segundoPlato","postre":"postre","bebida":"bebida","titulo":"descripcionDelMenu"}
        await $.ajax({    
            type: 'POST',
            url: 'https://pimpam-toma-lacasitos-api.vercel.app/api/modifMenu',
            contentType: 'application/json', // Especifica que el contenido es JSON porque AJAX es el producto de una mente enferma
            data: JSON.stringify({
                "idvalue": idunica,
                "primero": primero,
                "segundo": segundo,
                "postre": postre,
                "bebida": bebida,
                "titulo": titulo
            }),
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>An error ocurred: ' + error + '</p>');
            }
        });

        $('#idMF').val('');
        $('#tarjtituloMF').val('');
        $('#primeroMF').val('');
        $('#segundoMF').empty();
        $('#postreMF').val('');
        $('#bebidasMF').val('');


        $('#modalMaxi').css('display','flex');
        $('#modificacionTarjeta').css('display','none');
        $('#tarjetaModal').modal('hide');

        borrarContenedor("Idea");
        borrarContenedor("Todo");
        borrarContenedor("Doing");
        borrarContenedor("Done");
        estadoBotonIdea=false;
        estadoBotonTodo=false;  
        estadoBotonDoing=false;
        estadoBotonDone=false;
        
        mensaje("Tarjeta modificada");
    });

    // CAMBIAR CUANDO EL LOGIN ESTE OPERATIVO
    /*
    async function updateNombreContSession(){   // devuelve nombre y contador
        await $.ajax({    
            type: 'POST',
            url: '../php/devolverNombreContador.php',
            data: '',
            success: function(response) {
                console.log(response);
                response=JSON.parse(response);
                nombreUserActual=response.nombre;
                contadorUserActual=response.contador;
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>An error ocurred: ' + error + '</p>');
            }
        });
    }

    await updateNombreContSession(nombreUserActual);

    if(nombreUserActual==undefined){    // para que si se intenta ir a main sin loguear te devuelva al login
        window.location.replace("../html/index.html");
    }
    */
    
    $('#formNuevaIdea').submit(function(e) {    // envio de nueva idea a bbdd
        let titulo = $('#titulo').val();
        let primero = $('#primero').val();
        let segundo = $('#segundo').val();
        let postre = $('#postre').val();
        let bebida = $('#bebida').val();
        //console.log(titulo,primero,segundo,postre,bebida);
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'https://pimpam-toma-lacasitos-api.vercel.app/api/nuevoMenu',
            contentType: 'application/json', // Especifica que el contenido es JSON porque AJAX es el producto de una mente enferma
            data: JSON.stringify({
                "titulo": titulo,
                "primero": primero,
                "segundo": segundo,
                "postre": postre,
                "bebida": bebida
            }),
            success: function(response) {
                console.log(response);                

                $('#nuevaIdea').modal('hide');
                resetInputsNuevaIdea();
                borrarContenedor("Idea");
                borrarContenedor("Todo");
                borrarContenedor("Doing");
                borrarContenedor("Done");
                estadoBotonIdea=false;
                estadoBotonTodo=false;  
                estadoBotonDoing=false;
                estadoBotonDone=false; 
                mensaje("Nueva idea creada");
  
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>An error ocurred: ' + error + '</p>');
            }
        });
    });
    
    $('#deleteTarj').on('click', async function(){  // borrado de tarjeta
        let idP=idActualProyecto;
        await $.ajax({    
            type: 'POST',
            url: '../php/exterminatus.php',
            data: {"datos":idP},
            success: function(response) {
                console.log(response);
                $('#tarjetaModal').modal('hide');
                borrarContenedor("Idea");
                borrarContenedor("Todo");
                borrarContenedor("Doing");
                borrarContenedor("Done");
                estadoBotonIdea=false;
                estadoBotonTodo=false;  
                estadoBotonDoing=false;
                estadoBotonDone=false;
                if(response=="YESYESYES"){
                    mensaje("Tarjeta eliminada");
                }else{
                    mensaje("Fallo al eliminar tarjeta");
                }
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>An error ocurred: ' + error + '</p>');
            }
        });
    });
    
    $('#ideaButt').on('click',async function(){ // funcionalidad toggle para boton de mostrar tareas, estado idea
        if(estadoBotonIdea){
            borrarContenedor("Idea");
            estadoBotonIdea=false;
        }else{
            cargarMenus();
            estadoBotonIdea=true;
        }
        
    });

    $('#todoButt').on('click',async function(){ // funcionalidad toggle para boton de mostrar tareas, estado to do
        if(estadoBotonTodo){
            borrarContenedor("Todo");
            estadoBotonTodo=false;
        }else{
            cargarTarjetas("todo","Todo");
            estadoBotonTodo=true;
        }
        
    });

    $('#doingButt').on('click',async function(){ // funcionalidad toggle para boton de mostrar tareas, estado doing
        if(estadoBotonDoing){
            borrarContenedor("Doing");
            estadoBotonDoing=false;
        }else{
            cargarTarjetas("doing","Doing");
            estadoBotonDoing=true;
        }
        
    });

    $('#doneButt').on('click',async function(){ // funcionalidad toggle para boton de mostrar tareas, estado done
        if(estadoBotonDone){
            borrarContenedor("Done");
            estadoBotonDone=false;
        }else{
            cargarTarjetas("done","Done");
            estadoBotonDone=true;
        }
        
    });

    $('#cerrarSesion').on('click',async function(){
        url="index.html";  // para volver al login
                setTimeout(function() { // necesario en firefox
                    window.location.href = url;      
                }, 1000);
    });

    $('#toggleAll').on('click',async function(){
        checkEstatusConts();    // checkea si todos los estados individuales estan en true, entonces cambia el global a true
        if(estadoBotonAll){ // si estan todos mostrados, borra todos
            borrarContenedor("Idea");
            borrarContenedor("Todo");
            borrarContenedor("Doing");
            borrarContenedor("Done");
            estadoBotonAll=false;
            estadoBotonIdea=false;
            estadoBotonTodo=false;
            estadoBotonDoing=false;
            estadoBotonDone=false; 
        }
        else if(estadoBotonIdea || estadoBotonTodo || estadoBotonDoing || estadoBotonDone){ // si alguno de ellos tiene tarjetas, comprueba los que falten
            if(!estadoBotonIdea){
                cargarTarjetas("idea","Idea");
                estadoBotonIdea=true;
            }
            if(!estadoBotonTodo){
                cargarTarjetas("todo","Todo");
                estadoBotonTodo=true;
            }
            if(!estadoBotonDoing){
                cargarTarjetas("doing","Doing");
                estadoBotonDoing=true;
            }
            if(!estadoBotonDone){
                cargarTarjetas("done","Done");
                estadoBotonDone=true;
            }
        }
        else{   // si faltan todos, muestra todos
            cargarTarjetas("idea","Idea");
            cargarTarjetas("todo","Todo");
            cargarTarjetas("doing","Doing");
            cargarTarjetas("done","Done");
            estadoBotonAll=true;
            estadoBotonIdea=true;
            estadoBotonTodo=true;
            estadoBotonDoing=true;
            estadoBotonDone=true; 
        }

    });

    $('#verDeleted').on('click',async function(){
        if(estadoBotonPapelera){
            $('#contIdea').css('display','flex');
            $('#contTodo').css('display','flex');
            $('#contDoing').css('display','flex');
            $('#contDone').css('display','flex');
            $('#contPapel').css('display','none');
            estadoBotonPapelera=false;
            borrarContenedor("Papel");
            $('#newIdea').css('visibility','visible');
            $('#toggleAll').css('visibility','visible');
            $('#cerrarSesion').css('visibility','visible');
            $('#verStats').css('visibility','visible');
        }else{            
            $('#contIdea').css('display','none');
            $('#contTodo').css('display','none');
            $('#contDoing').css('display','none');
            $('#contDone').css('display','none');
            $('#contPapel').css('display','flex');
            estadoBotonPapelera=true;
            cargarTarjetas("all","Papel");
            $('#newIdea').css('visibility','hidden');
            $('#toggleAll').css('visibility','hidden');
            $('#cerrarSesion').css('visibility','hidden');
            $('#verStats').css('visibility','hidden');
        }
        
    });

    $('#verStats').on('click',async function(){
        if(estadoBotonStats){
            $('#contIdea').css('display','flex');
            $('#contTodo').css('display','flex');
            $('#contDoing').css('display','flex');
            $('#contDone').css('display','flex');
            $('#contStat').css('display','none');
            estadoBotonStats=false;
            borrarContenedor("Stat");
            $('#newIdea').css('visibility','visible');
            $('#toggleAll').css('visibility','visible');
            $('#cerrarSesion').css('visibility','visible');
            $('#verDeleted').css('visibility','visible');
        }else{            
            $('#contIdea').css('display','none');
            $('#contTodo').css('display','none');
            $('#contDoing').css('display','none');
            $('#contDone').css('display','none');
            $('#contStat').css('display','flex');
            estadoBotonStats=true;
            $('#newIdea').css('visibility','hidden');
            $('#toggleAll').css('visibility','hidden');
            $('#cerrarSesion').css('visibility','hidden');
            $('#verDeleted').css('visibility','hidden');
            await $.ajax({    
                type: 'POST',
                url: '../php/verStats.php',
                data:'',
                success: function(response) {
                    response=JSON.parse(response);
                    //console.log(response);
                    let tituloupper=nombreUserActual.toUpperCase();
                    $('#contStat .contStats .propias').append(`
                        <h1>${tituloupper}</h1>
                        <p>Total: ${response.proyectosCreadosPorUser}</p>
                        <p>Ideas: ${response.proyectosIdeaPorUser}</p>
                        <p>To Dos: ${response.proyectosToDoPorUser}</p>
                        <p>Doings: ${response.proyectosDoingPorUser}</p>
                        <p>Dones: ${response.proyectosDonePorUser}</p>
                        <p>Total eliminados: ${response.proyectosEliminadosporUser}</p>
                        <p>Ideas eliminadas: ${response.proyectosEliminadosIdeaUser}</p>
                        <p>To Dos eliminados: ${response.proyectosEliminadosToDOUser}</p>
                        <p>Doings eliminados: ${response.proyectosEliminadosDoingUser}</p>
                        <p>Dones eliminados: ${response.proyectosEliminadosDoneUser}</p>
                        `)
                        $('#contStat .contStats .colab').append(`
                            <h1>TOTAL</h1>
                            <p>Total Proyectos creados: ${response.proyectosCreadosTotal}</p>
                            <p>Total Ideas: ${response.proyectosIdeaTotal}</p>
                            <p>Total To Dos: ${response.proyectosToDoTotal}</p>
                            <p>Total Doings: ${response.proyectosDoingTotal}</p>
                            <p>Total Dones: ${response.proyectosDoneTotal}</p>
                            <p>Total proyectos eliminados: ${response.proyectosEliminadosTotal}</p>
                            <p>Total Ideas eliminadas: ${response.proyectosEliminadosIdea}</p>
                            <p>Total To Dos eliminados: ${response.proyectosEliminadosToDO}</p>
                            <p>Total Doings eliminados: ${response.proyectosEliminadosDoing}</p>
                            <p>Total Dones eliminados: ${response.proyectosEliminadosDone}</p>
                            `)
                },
                error: function(xhr, status, error) {
                    $('#result').html('<p>An error ocurred: ' + error + '</p>');
                }
            });
        }
    });
});