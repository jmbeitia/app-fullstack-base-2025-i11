
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
        } else {
            console.log("pase por el boton!")
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
                        listado+="<div class='col s12 m6 l6 xl4'>"
                        listado += `<h3>${o.name}</h3><p>${o.description}</p>`
                        listado += "<input type='button' value='On/OFF'>"
                        listado += "</div>";
             
                    }
                    div.innerHTML = listado;

                    
                    /**
                     * Aca deberian  mostra la lista de dispositivos utilizando 
                     * etiquetas <h1> <p> <li> <ul>
                     * 
                     */
                  
                    
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
   
});

