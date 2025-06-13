import "./Task.css"

export default function Task(props){
    "use client"
    return <div className="task d-flex my-2" 
        onMouseDown={(e) => {
            let div = e.target;
            
            if(!div.classList.contains("btn")){
                while(!div.classList.contains("task"))
                    div = div.parentElement;
                div.style.width = div.clientWidth + "px";
                div.classList.add("drag")
                div.style.borderWidth = e.pageX - div.offsetLeft + "px";
                
            }
        }}
        onMouseUp={(e) => {
            function isInList(x, y){
                const lists = document.getElementsByClassName("list");
                for(let list of lists){
                    if(x >= list.offsetLeft && 
                        x <= list.offsetLeft + list.clientWidth &&
                        y >= list.offsetTop && 
                        y <= list.offsetTop + list.clientHeight)
                        return list;
                }
            }
            let div = e.target;
            

            if(!div.classList.contains("btn")){
                while(!div.classList.contains("task"))
                    div = div.parentElement;
                div.classList.remove("drag");                
                
                if(isInList(e.pageX, e.pageY)){
                    console.log("to: ", isInList(e.pageX, e.pageY).classList[1].at(-1));
                    props.stageAction(props.id, parseInt(isInList(e.pageX, e.pageY).classList[1].at(-1)));
                }
                
                div.style.width = "";
                div.style.position = "";
                    
            }
        }}
        onMouseMove={(e) => {
            let div = e.target;

            while(!div.classList.contains("task"))
                div = div.parentElement;
            
            if(div.classList.contains("drag")){           
                div.style.position = "absolute";
                div.style.left = (e.pageX - parseInt(div.style.borderWidth.replace("px", ""))) + "px";
                div.style.top = (e.pageY - (div.clientHeight / 2)) + "px";
            }
        }}
        >
        <div className="d-flex flex-column text-start">
            <div className="ps-2 h2 text-break">{props.id + 1}. {props.taskData.zadanie}</div>
            <div className="ps-4 text-break">{props.taskData.tresc}</div>
        </div>
        <div className="d-flex flex-column ms-auto justify-content-center" >
            <input className="btn btn-danger mb-1" type="button" value="Usuń" onMouseUp={(e) => props.deleteAction(props.id, e)}/>
            <input className="btn btn-warning" type="button" value="Edytuj" onMouseUp={() => props.editAction(props.id)}/>
        </div>
    </div>
}