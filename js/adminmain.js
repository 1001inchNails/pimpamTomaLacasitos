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
                        <p name="primero">Primer plato: ${obj.primero}</p>
                        <p name="segundo">Segundo plato: ${obj.segundo}</p>
                        <p name="postre">Postre: ${obj.postre}</p>
                        <p name="bebida">Bebida: ${obj.bebida}</p>
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

    async function cargarTarjetas(tipo,prefijoSelector) {   // carga de tarjetas segun tipo
        await $.ajax({    
            type: 'POST',
            url: '../php/cargarTarjetas.php',
            data: {"estadoproyecto":tipo},
            success: function(response) {
                response=JSON.parse(response);
                console.log(response);
                let contadorTarj=0;
                response.forEach(function(obj){
                    let propiaOcolab;
                    if(checkAutoriaTarjeta(obj.nombreuser)){
                        propiaOcolab='propias';
                    }else{
                        propiaOcolab='colab';
                    }
                    let tituloupper=obj.nombreproyecto.toUpperCase();
                    $(`#cont${prefijoSelector} .cont${prefijoSelector}s .${propiaOcolab}`).append(`
                        <div id="${tipo}tarj${contadorTarj}" class="tarjeta">
                        <input class="tarjnombreuser" type="hidden" name="nombreuser" value="${obj.nombreuser}">
                        <input class="tarjidunicaproyecto" type="hidden" name="idunicaproyecto" value="${obj.idunicaproyecto}">
                        <input class="tarjestadoproyecto" type="hidden" name="estadoproyecto" value="${obj.estadoproyecto}">
                        <input class="tarjnombreproyecto" type="hidden" name="nombreproyecto" value="${obj.nombreproyecto}">
                        <input class="tarjdescrip" type="hidden" name="descrip" value="${obj.descrip}">
                        <input class="tarjnotasproyecto" type="hidden" name="notasproyecto" value="${obj.notasproyecto}">
                        <input class="tarjfechacreacion" type="hidden" name="fechacreacion" value="${obj.fechacreacion}">
                        <input class="tarjfechaultmod" type="hidden" name="fechaultmod" value="${obj.fechaultmod}">
                        <p name="nombreproyecto">${tituloupper}</p>
                        <p name="nombreuser">Autor: ${obj.nombreuser}</p>
                        <p name="descrip">${obj.descrip}</p>
                        </div>
                        `);
                    obj.colaboradores.forEach(function(nombr){                        
                        $(`#${tipo}tarj${contadorTarj}`).append(`
                            <input class="tarjcolaborador" type="hidden" name="${nombr}" value=${nombr}>
                            `);
                    });
                    if(checkAutoriaTarjeta(obj.nombreuser)){// cambia background segun sean de creador o de colaborador

                        $(`#${tipo}tarj${contadorTarj}`).addClass('fondo1');
                        $(`#${tipo}tarj${contadorTarj} p[name="nombreuser"]`).hide(); // no hace falta, el fondo1 ya indica autoria propia
                        
                    }else{                        
                        $(`#${tipo}tarj${contadorTarj}`).addClass('fondo2');
                    }
                    contadorTarj++;
                });
                contadorTarj=0;
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>Error: ' + error + '</p>');
            }
        });
        checkearsiHayPropias(); // para que cuando no hay proyectos propios no deje ese pequeño espacio del div vacio
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

    $(document).on('click', '.tarjeta', function() { // para mostrar las tarjetas maximizadas
        $('#botoneraMax').css('display','none');    // por defecto, oculto
        $('#colaboradoresM').css('display','flex');    // por defecto, visible
        $('#tagColabs').css('display','flex');    // por defecto, visible
        let tarjeta=$(this);    
        let datosTarjeta={
            nombreuser: tarjeta.find('.tarjnombreuser').attr('value'),
            idunicaproyecto: tarjeta.find('.tarjidunicaproyecto').attr('value'),
            estadoproyecto: tarjeta.find('.tarjestadoproyecto').attr('value'),
            nombreproyecto: tarjeta.find('.tarjnombreproyecto').attr('value'),
            descrip: tarjeta.find('.tarjdescrip').attr('value'),
            notasproyecto: tarjeta.find('.tarjnotasproyecto').attr('value'),
            fechacreacion: tarjeta.find('.tarjfechacreacion').attr('value'),
            fechaultmod: tarjeta.find('.tarjfechaultmod').attr('value')
        };
        idActualProyecto=datosTarjeta.idunicaproyecto;
        $('#nombreProyectoM').text('Proyecto: ' + datosTarjeta.nombreproyecto);
        $('#creadorM').text('Autor: ' + datosTarjeta.nombreuser);
        $('#descripcionM').text('Descripcion: ' + datosTarjeta.descrip);
        $('#estadoproyectoM').text('Estado: ' + datosTarjeta.estadoproyecto);
        $('#notasProyectoM').text('Notas: ' + datosTarjeta.notasproyecto);
        $('#fechaCreacionM').text('Fecha de creación: ' + datosTarjeta.fechacreacion);
        $('#fechaUltimaModificacionM').text('Última modificación: ' + datosTarjeta.fechaultmod);
        
        // limpiar y actualizar colaboradores
        $('#colaboradoresM').empty();
        let listaColabs=[];
        let colaboradores = tarjeta.find('.tarjcolaborador');
        colaboradores.each(function() {
            $('#colaboradoresM').append(
                `<p> • ${$(this).val()}</p>`                
            );
            listaColabs.push($(this).val());
        });
        tarjetaActual=[datosTarjeta,listaColabs];  // guardar datos de tarjeta actual para usar en el formulario de modificacion

        if(listaColabs.length==0){  // ocultar si no hay ninguno, duh
            $('#colaboradoresM').css('display','none');
            $('#tagColabs').css('display','none'); 
        }

        if(checkAutoriaTarjeta(datosTarjeta.nombreuser)){
            $('#botoneraMax').css('display','flex');
        }
        
        if(estadoBotonPapelera){
            $('#botoneraMax').css('display','none');
        }
        else if(!estadoBotonPapelera  && datosTarjeta.nombreuser==nombreUserActual)
            {
            $('#botoneraMax').css('display','flex');
        }

        $('#tarjetaModal').modal('show');
    });

    $(document).on('click', '#modifTarj',async function(){   // proceso de formulario de modificacion
        $('#modalMaxi').css('display','none');
        $('#modificacionTarjeta').css('display','flex');

        
        $('#nombreproyectoMF').val(tarjetaActual[0].nombreproyecto);
        $('#idunicaproyectoMF').val(tarjetaActual[0].idunicaproyecto);
        $('#nombreuserMF').val(tarjetaActual[0].nombreuser);
        $('#descripMF').val(tarjetaActual[0].descrip);
        $('#notasproyectoMF').val(tarjetaActual[0].notasproyecto);
        $('#fechacreacionMF').val(tarjetaActual[0].fechacreacion);
        $('#fechaultmodMF').val(new Date().toISOString());
        let estadoActual=tarjetaActual[0].estadoproyecto;
        switch(estadoActual){   // asignacion de options al select de estado
            case 'idea':
                $("#estadoproyectoMF")[0].selectedIndex=0;
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'idea',
                    text: 'Idea'
                }));
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'todo',
                    text: 'To Do'
                }));
                break;
            case 'todo':
                $("#estadoproyectoMF")[0].selectedIndex=0;
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'todo',
                    text: 'To Do'
                }));
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'doing',
                    text: 'Doing'
                }));
                break;
            case 'doing':
                $("#estadoproyectoMF")[0].selectedIndex=0;
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'doing',
                    text: 'Doing'
                }));
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'todo',
                    text: 'To Do'
                }));
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'done',
                    text: 'Done'
                }));
                break;
            case 'done':
                $("#estadoproyectoMF")[0].selectedIndex=0;
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'done',
                    text: 'Done'
                }));
                $('#estadoproyectoMF').append($('<option>', {
                    value: 'doing',
                    text: 'Doing'
                }));
                break;
        }
        await $.ajax({    // mete lista de colaboradores para los checks, los que estaban antes aparecen marcados por defecto
            url: '../php/devolverlistacolaboradores.php',
            data: '',
            success: function(response) {
                response=JSON.parse(response);
                let marked=false;
                if(response.length>0){
                    $('#listacolaboradoresMF').append(`<label class="form-label">Colaboradores</label><br></br>`)
                }
                response.forEach(function(text) {
                    tarjetaActual[1].forEach(function(nombre){                        
                        if(nombre==text){
                            marked=true;                            
                        }                        
                    });   
                    if(marked){
                        $('#listacolaboradoresMF').append(`<input  checked="true" type="checkbox" id="${text}" name="listColabor[]" value="${text}"><label for="${text}">${text}</label><br>`);
                        marked=false;
                        return true;
                    }else{
                        $('#listacolaboradoresMF').append(`<input type="checkbox" id="${text}" name="listColabor[]" value="${text}"><label for="${text}">${text}</label><br>`);
                    }                 
                });
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>An error ocurred: ' + error + '</p>');
            }
        });
        
    });
    $(document).on('click','#cancelarModif',function(){ // cancelar formulario modif
        $('#modalMaxi').css('display','flex');
        $('#modificacionTarjeta').css('display','none');
        $('#estadoproyectoMF').empty();
        $('#listacolaboradoresMF').empty();
    });

    $('#formModif').submit(async function(e) {    // envio de formulario modificado
        e.preventDefault();
        let nombreuser = $('#nombreuserMF').val();
        let idunicaproyecto=$('#idunicaproyectoMF').val();
        let estadoproyecto=$('#estadoproyectoMF  option:selected').val();
        let nombreproyecto=$('#nombreproyectoMF').val();
        let descrip=$('#descripMF').val();
        let notasproyecto=$('#notasproyectoMF').val();
        let fechacreacion=$('#fechacreacionMF').val();
        let fechaultmod=$('#fechaultmodMF').val();

        let colabs = new Set(); // para evitar un bug que me duplicaba los usuarios a veces y no desaparecia hasta recargar la pagina, tuve que eliminarlos a la fuerza con un set
        $('input[type="checkbox"]:checked').each(function() {
            colabs.add($(this).val());
        });

        let uniqueColabs = Array.from(colabs);

        let datos={
            "nombreuser":nombreuser,
            "idunicaproyecto":idunicaproyecto,
            "estadoproyecto":estadoproyecto,
            "nombreproyecto":nombreproyecto,
            "descrip":descrip,
            "notasproyecto":notasproyecto,
            "fechacreacion":fechacreacion,
            "fechaultmod":fechaultmod,
            "colabs":uniqueColabs
        }
        await $.ajax({    
            type: 'POST',
            url: '../php/modificarTarjeta.php',
            data: {"datos":datos},
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                $('#result').html('<p>An error ocurred: ' + error + '</p>');
            }
        });

        $('#nombreproyectoMF').val('');
        $('#descripMF').val('');
        $('#notasproyectoMF').val('');
        $('#estadoproyectoMF').empty();
        $('#fechacreacionMF').val('');
        $('#fechaultmodMF').val('');
        $('#listacolaboradoresMF').empty();
        $('#nombreuserMF').val('');
        $('#idunicaproyectoMF').val('');


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
        e.preventDefault();        
        $.ajax({
            type: 'POST',
            url: '../php/nuevaIdea.php',
            data: $(this).serialize(),
            success: function(response) {
                console.log(response);
                updateNombreContSession();
                
                if(response=='YESYESYES'){
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

                }else{
                    $('#nuevaIdea').modal('hide');
                    resetInputsNuevaIdea();
                    mensaje("Error en la creacion de nueva idea");
                }
                
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

    $('#newIdea').on('click', function(){   // funcionalidad boton nueva idea
        let fecha=new Date().toISOString();
        $('#formNuevaIdea .mb-3 #nombreuser.form-control').val(nombreUserActual);
        $('#formNuevaIdea .mb-3 #idunicaproyecto.form-control').val(nombreUserActual+contadorUserActual);
        $('#formNuevaIdea .mb-3 #estadoproyecto.form-control').val('idea');
        $('#formNuevaIdea .mb-3 #fechacreacion.form-control').val(fecha);
        $('#formNuevaIdea .mb-3 #fechaultmod.form-control').val('/');
        
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