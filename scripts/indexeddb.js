// Alamacenar el api en una variable
export const indexedDb = window.indexedDB;

//Crear la variable que almacenarsá la instancia de la base de datos
let db

//Crear la conexión a la base de datos e indicar la versión
const conexion = indexedDb.open('mesesListado', 1)

//Evento que se dispara cuando la base de datos se abré
conexion.onsuccess = () =>{
    db = conexion.result  
    console.log('Base de datos abierta', db)
}

//Evento que se dispara cuando la base de datos se crea o se actualiza
conexion.onupgradeneeded = (e) =>{
    db = e.target.result
    console.log('Base de datos creada', db)
    const coleccionObjetos = db.createObjectStore('meses',{
        keyPath: 'clave'/* Nombre del campo, dentro del registro, qué será la identificación única */
    })
}



//Evento que se dispara cuando la base de datos no se puede abrir
conexion.onerror = (error) =>{
    console.log('Error ', error)
}

/*
    Funciones para manejar la base de datos indexedDB
*/

//Función que permite agregar un registro a la colección, enviándole un objeto con el fomato { clave : int, ... }
export const agregar = (data) => {
    //Definir el tipo de transaccion y sobre que colección se realizará
    const transaccion = db.transaction(['meses'],'readwrite')
    //Obtener la colección de la transacción
    const coleccionObjetos = transaccion.objectStore('meses')
    //Ejecutar el método deseado sobre la colección obtenida
    const conexion = coleccionObjetos.add(data)
    //Llamada a la función que lee toda la colección
    consultar()
}

//Función que permite obtener un registro, enviándele la clave del registro
export const obtener = (clave) =>{
    const transaccion = db.transaction(['meses'],'readonly')
    const coleccionObjetos = transaccion.objectStore('meses')
    const conexion = coleccionObjetos.get(clave)

    conexion.onsuccess = () =>{
        console.log(conexion.result)
    }
    conexion.onerror = (error) =>{
        console.log('Error ', error)
    }
}

//Función que permite actulizar un registro de la colección, enviándole un objeto con el fomato { clave : clave_registro int, ... }
export const actualizar = (data) =>{    
    const transaccion = db.transaction(['meses'],'readwrite')
    const coleccionObjetos = transaccion.objectStore('meses')
    const conexion = coleccionObjetos.put(data)
    
    conexion.onsuccess = () =>{
        consultar()
    }
}

//Función que permite eliminar un registro a la colección, enviándele la clave del registro
export const eliminar = (clave) =>{      
    const transaccion = db.transaction(['meses'],'readwrite')
    const coleccionObjetos = transaccion.objectStore('meses')
    const conexion = coleccionObjetos.delete(clave)
}

//Función que permite obtener todos los registros de la colección
export const consultar = () =>{
    const transaccion = db.transaction(['meses'],'readonly')
    const coleccionObjetos = transaccion.objectStore('meses')
    const conexion = coleccionObjetos.openCursor()

    console.log('Lista de meses')
    
    //Escuchar el evento onsuccess del método openCursor()
    conexion.onsuccess = (e) =>{
        //Obtener el cursor de la colección
        const cursor = e.target.result
        //Si el cursor es falso imprimir mensaje de lista vacía o recorrido terminado
        if(cursor){
            //Mostrar por consola el valor del cursor (registro en esa posición del cursor)
            //*console.log(cursor.value)
            //Avanzar detro del cursor
            cursor.continue()
        }else{
            console.log('No hay meses en la lista')
        }
    }
}


/*
    Formato general de transacciones:

    const transaccion = instancia_bd.transaction([nombre_coleccion],tipo_transaccion)
        tipo_transaccion utilizado acá
            readwrite = Leer y escribir
            readonly = Consultar o leer

    const coleccionObjetos = transaccion.objectStore(nombre_coleccion)
        
    const conexion = coleccionObjetos.método_transaccion(parámetros)
        método_transaccion utilizado acá
            add = Agregar registro a la colección
                registro (OBJETO) que se agregará a la colección
            get = Obtener un registro de la colección
                Llave de identificación del registro 
            put = Actualizar un registro de la colección
                registro (OBJETO) que se agregará a la colección, que contenga la llave de identificación del registro (si la llave es distinta se crea un nuevo registro)
            delete = Eliminar un registro de la colección
                Llave de identificación del registro 
            openCursor = Abrir un cursor que recorre la colección | Sin parámetros
                Método que lanza el evento onsuccess dentro del que está disponible el cursor de la coleción
*/