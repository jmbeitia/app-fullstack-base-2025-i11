
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
                        listado += "<li class='collection-item avatar'>";
                        listado += o.type == 1
                            ? `<img src="./static/images/lightbulb.png" alt="" class="circle">`
                            : `<img src="./static/images/window.png" alt="" class="circle">`;
                        listado += `<span class="title">${o.name}</span>`;
                        listado += `<p>${o.description}</p>`;                        // Botones alineados a la derecha
                        listado += `<div class="secondary-content" style="display: flex; gap: 10px; align-items: center;">`;
                        listado += `
                            <div class="switch">
                                <label>
                                    Off
                                    <input id='cb_${o.id}' miIdBd='${o.id}' ${o.state ? "checked" : ""} type="checkbox">
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>
                        `;
                        listado += `
                            <a class="btn-floating btn-small blue edit-btn" data-id="${o.id}" title="Editar">
                                <i class="material-icons">edit</i>
                            </a>
                        `;
                        listado += `</div>`; 
                        listado += "</li>";
                    }

                    div.innerHTML = listado;

                    const editButtons = document.querySelectorAll(".edit-btn");
                    editButtons.forEach(btn => {
                        btn.addEventListener("click", (event) => {
                            const id = (btn as HTMLElement).getAttribute("data-id");
                            const li = btn.closest("li");
                            const name = li?.querySelector(".title")?.textContent?.trim() || "";
                            const description = li?.querySelector("p")?.textContent?.trim() || "";
                            const isLamp = li?.querySelector("img")?.getAttribute("src")?.includes("lightbulb") || false;

                            (document.getElementById("editName") as HTMLInputElement).value = name;
                            (document.getElementById("editDescription") as HTMLInputElement).value = description;
                            (document.getElementById("editType") as HTMLSelectElement).value = isLamp ? "1" : "2";

                            M.updateTextFields();
                            M.FormSelect.init(document.querySelectorAll("select"));

                            document.getElementById("btnGuardarEdicion")?.setAttribute("data-id", id!);

                            const modal = document.getElementById("modalEditar");
                            M.Modal.getInstance(modal!).open();
                        });
                    });

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
    
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    const selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    let btn = document.getElementById("btn_1");
   // let o: EventListenerObject = main;
    btn.addEventListener("click", main);
    let btnM = document.getElementById("btnMostrar");

   // btnM.addEventListener("mouseover", main);
    btnM.addEventListener("click", main);

    document.getElementById("btnGuardarEdicion")?.addEventListener("click", function (event) {
        event.preventDefault();
        const id = this.getAttribute("data-id");

        const name = (document.getElementById("editName") as HTMLInputElement).value;
        const description = (document.getElementById("editDescription") as HTMLInputElement).value;
        const type = parseInt((document.getElementById("editType") as HTMLSelectElement).value);
        console.log("Guardando edición:", { id, name, description, type });
        if (id) {
            fetch(`/devices/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, description, type })
            })
            .then(res => res.json())
            .then(data => {
                M.toast({ html: `Dispositivo "${name}" actualizado`, classes: "green" });

                const modal = document.getElementById("modalEditar");
                M.Modal.getInstance(modal!).close();

                main.consultarAlServidor();
            })

            .catch(err => {
                M.toast({ html: `Error al actualizar dispositivo "${name}"`, classes: "red" });
                console.error(err);
            });
        }
    });

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

