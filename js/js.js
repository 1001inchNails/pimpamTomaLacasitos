$(document).ready(function() {
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
