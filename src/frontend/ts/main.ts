
declare const M: any;
class Main implements EventListenerObject{
    nombre: string = "Matias";
    per: Persona = new Persona("", 3);
    
    
    public mostrarEnConsola( mensaje: string) {
        console.log(mensaje);
    }
    handleEvent(object: Event): void{
        console.log(object)
        let elementoClick =<HTMLInputElement> object.target;

        if(elementoClick.id=="btn_1"){
            let tiluto = document.getElementById("titulo1");
            let texto =<HTMLInputElement> document.getElementById("texto1");
            
            tiluto.innerHTML = " titulo nuevo";
            let nombre = texto.value;
            texto.hidden = true;
            console.log(texto.setAttribute("otro","otro valor!"));
            alert("el usuario es " + nombre);
            let div = document.getElementById("lista");
            div.hidden = true;

            
        } else if(elementoClick.id=="btnMostrar" && object.type=="click"){
            this.consultarAlServidor();                                    
        } else if(elementoClick.id.startsWith("cb_")){                
                         // <input id='cb_1' type="checkbox"> // true //cb_1
            console.log("pase por el check!!", elementoClick.checked, elementoClick.id)
            console.log(elementoClick.id.substring(3, elementoClick.id.length));
            console.log(elementoClick)
            console.log(elementoClick.getAttribute("miIdBd"));
            const idDispositivo = elementoClick.getAttribute("miIdBd");
            const nuevoEstado = elementoClick.checked ? 1 : 0;
            const nombreDispositivo = elementoClick.closest("li")?.querySelector(".title")?.textContent || "Desconocido";

            if (idDispositivo !== null) {
                fetch(`/devices/${idDispositivo}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ state: nuevoEstado })
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Respuesta del servidor:", data);
                    M.toast({ 
                        html: `El estado del dispositivo "${nombreDispositivo}" se actualizó correctamente.`, 
                        classes: "green" 
                    });
                })
                .catch(error => {
                    console.error("Error al actualizar el estado:", error);
                    M.toast({ 
                        html: `Error actualizando el estado del dispositivo (${nombreDispositivo})`, 
                        classes: "red" 
                    });
                });
            }
        }

    }
    
    public consultarAlServidor() {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log(xmlReq.responseText);
                    
                    
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    let div = document.getElementById("lista");
                    div.innerHTML = "";
                    let listado: string = ""
                    
                    for (let o of devices) {
                        
                        listado += "<li class='collection-item avatar'>"
                        if (o.type == 1) {
                            
                            listado += `<img src="./static/images/lightbulb.png" alt="" class="circle">`
                        } else {
                            listado += `<img src="./static/images/window.png" alt="" class="circle">`
                        }
                        listado += `<span class="title">${o.name}</span>`
                        listado += ` <p>${o.description}</p>`
                        if (o.state) {
                            listado += `<a href="#!" class="secondary-content">
                            <div class="switch">
                                <label>
                                Off
                                <input id='cb_${o.id}' miIdBd='${o.id}' checked type="checkbox">
                                <span class="lever"></span>
                                On
                                </label>
                            </div>
                            </a>`
                        } else {
                            listado += `<a href="#!" class="secondary-content">
                            <div class="switch">
                                <label>
                                Off
                                <input id='cb_${o.id}' miIdBd='${o.id}' type="checkbox">
                                <span class="lever"></span>
                                On
                                </label>
                            </div>
                            </a>`
                        }
                        listado += '</li>';
             
                    }
                    div.innerHTML = listado;

                    for (let o of devices) {
                        let checkbox = document.getElementById("cb_" + o.id);
                        checkbox.addEventListener("click", this);
                    }
                } else {
                    
                    alert("fallo la consulta");
                }
            }
        }
   
        xmlReq.open("GET", "http://localhost:8000/devices", true);
        xmlReq.send();

    }
    
}

window.addEventListener("load", () => {
   let main: Main = new Main();
     
    let btn = document.getElementById("btn_1");
   // let o: EventListenerObject = main;
    btn.addEventListener("click", main);
    let btnM = document.getElementById("btnMostrar");

   // btnM.addEventListener("mouseover", main);
    btnM.addEventListener("click", main);


     let xmlReq = new XMLHttpRequest();

 
    xmlReq.onreadystatechange = () => {
        if (xmlReq.readyState == 4) {
            if (xmlReq.status == 200) {
                console.log(xmlReq.responseText);
            } else {
                alert(xmlReq.responseText);
            }
        }
    }
    let body = { 'nombre': "Matias!"}
    xmlReq.open("POST", "http://localhost:8000/algoInfoBody/", true);

    xmlReq.setRequestHeader("Content-Type", "application/json");

    xmlReq.send(JSON.stringify(body));
        
   
});

