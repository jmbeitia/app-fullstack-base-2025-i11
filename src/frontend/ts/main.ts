interface Mostrable{

    mostrarInfo(): string;
}

class Main implements Mostrable{

    public mostrarInfo(): string {
        console.log("Estoy en el MAIN!");
        return "";
    }
}

window.addEventListener("load", () => {
    let current_value = document.getElementById("textarea_1") as HTMLInputElement;
    let new_value = "Hola mundo !!!" + "\n" + current_value.value;
    document.getElementById("textarea_1").innerHTML = new_value;

    let per2: Persona = new Persona("Jose",245456);
    let per3: Persona = new Persona("Pedro", 123213);
    let usr1: Usuario = new Usuario("Matias", 32132,"mramos@asda.com");;
    let main: Main = new Main();
    let personas: Array<Persona> = new Array();
    personas.push(per2);
    personas.push(per3);
    personas.push(usr1);

   
    let mostrables: Array<Mostrable> = new Array();
    mostrables.push(per2);
    mostrables.push(main);
    mostrables.push(usr1);

        
    let btn = document.getElementById("btn_1");

    btn.addEventListener("click", main.mostrarInfo);
   
});

