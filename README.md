# **ACTIVIDAD GIT: RESTAURANTE**
## *Despliegue 2ºCS DAW 24/25*  
>Creación de una aplicacion de gestion de un restaurante en grupo.
## Propuesta de práctica

    Aplicación para administrar un restaurante, back y front por separado, trabajando en grupo mediante Git, con el objetivo de practicar el uso de commits, pulls, ramas, merges y demás conceptos básicos del control de versiones
	
Caracteristicas generales:

- Landing: con seccion para solicitar. pedidos y reservas. Modal para acceso a modo admin mediante login.

- Modo admin: administra los menus, los horas de reserva, los pedidos y reservas y da acceso a historial de menus, pedidos y reservas. Los menus se pueden modificar, borrar o introducir nuevos.

    Los horas de reserva se pueden cambiar de estado. Los pedidos y reservas se pueden aceptar y rechazar.  

    En el historial se pueden ver los menus que se hayan borrado y los pedidos y reservas y el estado con el que se han tramitado.

- API: se encarga de todas las interacciones entre el front y la BBDD (MongoDB). Se ha usado dotenv para las variables importantes, como el uri de mongoDB, contraseñas, etc.

- En cuanto a la página en si, representa un restaurante de ultra-lujo-deluxe, no se reserva una mesa sino el restaurante en si, con un maximo de 5 slots de una hora al dia. 

  Los pedidos que se pueden hacer en la web no representarian lo que se puede pedir con una reserva, que ya sería una experiencia gastronómica en 4D.  

    Para hacer una reserva o pedido se requoere un código de identificación de cliente que sólo se podría obtener en persona en el restaurante, después de pasar una entrevista donde dejaría todos sus datos personales en un archivo físico, para asegurar su privacidad. 
  
  Las solicitudes se aceptan una por una por el manager web del restaurante, que llamaría al cliente en caso de aceptar la solicitud.

## **Flujo de trabajo**
En la parte de front se empezó creando un proyecto con los html's vacios de index, pedidos, reservas y admin.

A partir de este main se crearon dos ramas, para admin y cliente, ocupandose cada miembro del grupo de una de ellas.

En el back no se crearon ramas al ser un trabajo bastante sencillo de creación de endpoints, de manera que fué realizado por una sola persona.

Al finalizar el trabajo en cada una de las ramas de front se aplicaron los endpoints después de desplegar la API y se mergearon las ramas en el main.

## **Archivos:**

```
Front
==================================================
├── css/
│   ├── adminIndex.css
│   ├── adminmain.css
│   ├── style.css
│   ├── style2.css
│   └── style3.css
├── fonts/
│   ├── FuturaCondensedMedium.otf
│   └── Inter.ttf
├── html/
│   ├── adminMain.html
│   ├── clientPedidos.html
│   ├── clientReservas.html
│   └── index.html
├── img/
│   ├── carne.jpg
│   ├── logo.png
│   ├── menu.png
│   ├── res.png
│   ├── reserva.jpg
│   ├── restaurante.png
│   ├── risoto.png
│   └── tarta.jpg
├── js/
│   ├── adminmain.js
│   ├── clientPedidos.js
│   ├── clientReservas.js
│   └── js.js
├── README.md
└── vercel.json
==================================================

Back
==================================================

├── api/
│   ├── app.js
│   └── index.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── vercel.json

```

    

## Tecnologías
+ Front: HTML, CSS, Bootstrap, Jquery.

+ Back: Js, Express, MongoDB.


## Notas
Password de administrador: admin/admin.