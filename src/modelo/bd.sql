create table proyecto(
    id int AUTO_INCREMENT,
    numero int,
    codigo varchar(5),
    nombre varchar(200),
    nombrecompleto varchar(400),
    montocontrato float,
    montomodificado float,
    montofinal float,
    montopagado float,
    saldocobrar float,
    fechainicio date,
    plazoincio int,
    ampliacion int,
    fechaconclusion date,
    estado varchar(200),
    eliminado boolean default false,
    creado datetime,
    modificado datetime,
    usuario int,
    primary key(id)
) create table planilla(
    id int AUTO_INCREMENT,
    idproyecto int,
    fechapresentacion date,
    estado boolean,
    fechapago date,
    numero int,
    monto float,
    descuento float,
    creado datetime,
    modificado datetime,
    usuario int,
    primary key(id),
    foreign key(idproyecto) REFERENCES proyecto(id)
) 
create table estado(
    id int AUTO_INCREMENT,
    nombre varchar(200),
    primary key(id)
)
 create table clasificacion(
    id int AUTO_INCREMENT,
    clasificacion varchar(200),
    creado datetime,
    eliminado boolean default false,
    modificado datetime,
    usuario int,
    primary key(id)
) create table tipo(
    id int AUTO_INCREMENT,
    descripcion varchar(200),
    tipo varchar(200),
    eliminado boolean default false,
    creado datetime,
    modificado datetime,
    usuario int,
    primary key(id)
) create table rol(
    id int AUTO_INCREMENT,
    rol varchar(200),
    numero varchar(200),
    primary key(id)
);

create table rolusuario(
    id int AUTO_INCREMENT,
    idrol int,
    idpersonal int,
    nivel int,
    creado datetime,
    modificado datetime,
    usuario int,
    primary key(id),
    foreign key (idrol) REFERENCES rol(id),
    foreign key (idpersonal) REFERENCES personal(id)
) 
create table personal(
    id int AUTO_INCREMENT,
    username varchar(20),
    pass varchar(700) idproyecto int,
    ci varchar(15),
    nombre varchar(200),
    apellido1 varchar(200),
    apellido2 varchar(200),
    celular varchar(30),
    sueldo float,
    modificado datetime,
    validar boolean default false,
    eliminado boolean default false,
    primary key(id),
    FOREIGN key(idproyecto) REFERENCES proyecto(id)
) create table sesion(
    id int AUTO_INCREMENT PRIMARY key,
    idpersonal int not null,
    fecha datetime not null,
    token text not null,
    FOREIGN key(idpersonal) REFERENCES personal(id)
) 

create table asignacion(
    id int AUTO_INCREMENT,
    idpersonal int,
    descripcion varchar(400),
    fecha date,
    monto float,
    tipo int,
    estado int,
    fecharendicion datetime,
    fechaaprobacion datetime,
    comprobante text,
    diferencia float,
    eliminado boolean default false,
    creado datetime,
    modificado datetime,
    usuario int,
    
    primary key(id),
    foreign key(idpersonal) REFERENCES personal(id)
) 

create table proveedor(
    id int AUTO_INCREMENT primary key,
    nombre varchar (400),
    nit varchar(100),
    telefono varchar(20),
    direccion varchar(400),
    pais varchar(100),
    cuenta varchar(100),
    eliminado boolean default false,
    creado datetime,
    modificado datetime, 
    usuario int
)

create table gasto(
    id int AUTO_INCREMENT,
    idtipo int,
    idclasificacion int,
    idasignacion int,
    idpersonal int,
    fecha date,
    descripcion varchar(400),
    egreso float,
    tipo int,
    comprobante varchar(200),
    factura boolean,
    idproveedor int,
    img text,
    creado datetime,
    modificado datetime,
    primary key(id),
    foreign key(idtipo) REFERENCES tipo(id),
    foreign key(idclasificacion) REFERENCES clasificacion(id),
    foreign key(idasignacion) REFERENCES asignacion(id),
    foreign key(idpersonal) REFERENCES personal(id),
    foreign key(idproveedor) REFERENCES proveedor(id)
) 


create table empresa(
    id int AUTO_INCREMENT,
    nombre varchar(100) NOT null,
    telefono varchar(20) NOT null,
    direccion varchar(60) NOT NULL,
    correo text NOT NULL,
    creado datetime,
    modificado datetime,
    usuario int,
    sello text not null,
    PRIMARY key(id)
)