
## Sistema de Gestion de Proyectos - UDB

Proyecto desarrollado para la materia de **Diseño y Programación de Software Multiplataforma (DPS)**.  
Es una aplicación web robusta para la gestión de tareas y proyectos, implementando autenticación por roles y consumo de una API REST local.

##Links del proyecto
* ** Vercel: https://sistema-gestion-proyectos-udb.vercel.app 
* ** Repositorio: https://github.com/MayoraLuis/SistemaGestionProyectos-UDB

Integrantes:
1. **Luis Ernesto Mayora Claros**     - (Owner / Branch: `luis-mayora`)


## Tecnologias que se utilizaron 
* **Frontend:** Next.js 15+, React 19.
* **Estilos:** Tailwind CSS (Diseño Responsivo).
* **Gestión de Datos:** Axios para consumo de API.
* **Backend Simulado:** JSON Server (Puerto 4000).
* **Despliegue:** Vercel.

## Ejecucion a nivel Local

1. Clonar Repositorio
git clone [https://github.com/MayoraLuis/SistemaGestionProyectos-UDB.git](https://github.com/MayoraLuis/SistemaGestionProyectos-UDB.git)
cd sistema-gestion-proyectos

2. Instalacion de dependencias
 **npm install**

3. Levantamos el backend ( es importante hacer este paso para que pueda funcionar el login y el CRUD) Ejecutamos el siguiente comando 
**npx json-server --watch db.json --port 4000**

4. Ejecutamos el Frontend
   
**npm run dev**
La aplicacion estara disponible en http://localhost:3000


Notas importantes:

El sistema incluye roles de Gerente (Admin) y Usuario (Visualización).
El despliegue en Vercel funciona como espejo del Frontend, requiriendo el servidor local para la persistencia de datos en esta fase.


En la siguiente pantalla podemos observar el formulario de registro en donde se debe de completar los campos nombre, correo institucional (cabe recalcar que el dominio debe ser @ubd.edu.sv) contraseña, y el rol.

<img width="560" height="745" alt="image" src="https://github.com/user-attachments/assets/aa6ac410-8243-4522-ade1-9f6a938bfb25" />


Podemos ver la pantalla principal de logueo donde se permitira ingresar dos tipos de user como Admin Gerente y Usuario estudiante

<img width="195" height="279" alt="image" src="https://github.com/user-attachments/assets/b8902244-96a0-422b-8cf7-e311dbafb2fb" />


Podemos ver la pantalla de usuario gerente en donde como admin puede crear el proyecto y asignar tarea a su vez podra eliminarla si lo desea y marcarla como completa 

<img width="356" height="252" alt="image" src="https://github.com/user-attachments/assets/ff6aa5e9-63b5-44d5-99ea-7d383ca957cb" />


En la siguiente pantalla podemos ver la interfaz de Usuario estudiante, en ella se limitara al usuario a que solo pueda observar el proyecto como tambien las tareas asignadas y a su vez solo podra marcarla como completada cuando esta se finalice

<img width="310" height="205" alt="image" src="https://github.com/user-attachments/assets/c69837a2-e860-4938-a58d-bf35af2c5658" />










