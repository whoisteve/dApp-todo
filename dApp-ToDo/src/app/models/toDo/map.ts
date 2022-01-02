import { element } from "protractor";
import { ToDo, _ToDo } from "./toDo";


    function addMapElement(elements:[string]): ToDo[] {
        var toDos: ToDo[]=[];
        for (var element of elements) {
            var toDoKey = element.substring(0, element.indexOf('/')); 
            var toDoTitle = element.substring(1, element.indexOf('/'));
            toDos.push(new ToDo(toDoTitle, toDoKey));
            if (toDos.length == elements.entries.length) {
                return toDos;
            }
        }
    }
