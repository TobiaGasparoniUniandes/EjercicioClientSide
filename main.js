/* eslint-disable no-console */
const url = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

function formatEvents(eventsArray) {
    let eventsStr = "";

    let index = 0;
    eventsArray.forEach(oneEvent => {
        eventsStr += oneEvent;
        if(index !== eventsArray.length - 1) {
            eventsStr += ", ";
        }
        index += 1;
    });

    return eventsStr;
}

fetch(url).then(res=>res.json()).then(logs=>{
    let logsBody = document.getElementById("logs-body");
    let dictionary = {};

    for(let i = 0; i < logs.length; i++) {
        let logObj = logs[i];

        let tr = document.createElement("tr");

        let number = i + 1;
        let numberTd = document.createElement("td");
        numberTd.style.fontWeight = "bold";
        numberTd.innerHTML = number;
        tr.appendChild(numberTd);

        let eventsStr = formatEvents(logObj.events);
        let eventsTd = document.createElement("td");
        eventsTd.innerHTML = eventsStr;
        tr.appendChild(eventsTd);

        let squirrel = logObj.squirrel;
        let squirrelTd = document.createElement("td");
        squirrelTd.innerHTML = squirrel;
        tr.appendChild(squirrelTd);

        if(squirrel) {
            tr.classList.add("table-danger");
        }

        for(let j = 0; j < logObj.events.length; j++) {
            let singleEvent = logObj.events[j];
            if(!(singleEvent in dictionary)) {
                dictionary[singleEvent] = {
                    "FN": 0,
                    "TP": 0,
                    "TN": 0,
                    "FP": 0
                };
            }
            if(squirrel) {
                dictionary[singleEvent]["TP"] += 1;
            } else {
                dictionary[singleEvent]["FN"] += 1;
            }
        }

        logsBody.appendChild(tr);
	}

    for(let i = 0; i < Object.keys(dictionary).length; i++) {
        let singleEvent = Object.keys(dictionary)[i];
        
        for(let j = 0; j < logs.length; j++) {
            let logObj = logs[j];
            let squirrel = logObj.squirrel;
            if(!logObj.events.includes(singleEvent)) {
                if(squirrel) {
                    dictionary[singleEvent]["FP"] += 1;
                } else {
                    dictionary[singleEvent]["TN"] += 1;
                }
            }
        }
        
        let correlationBody = document.getElementById("correlation-body");

        let tr = document.createElement("tr");

        let number = i + 1;
        let numberTd = document.createElement("td");
        numberTd.style.fontWeight = "bold";
        numberTd.innerHTML = number;
        tr.appendChild(numberTd);

        let eventStr = singleEvent;
        let eventsTd = document.createElement("td");
        eventsTd.innerHTML = eventStr;
        tr.appendChild(eventsTd);

        let TP = dictionary[singleEvent]["TP"];
        let TN = dictionary[singleEvent]["TN"];
        let FN = dictionary[singleEvent]["FN"];
        let FP = dictionary[singleEvent]["FP"];
        let correlation = (TP*TN-FP*FN)/Math.sqrt((TP+FP)*(TP+FN)*(TN+FP)*(TN+FN));
        let squirrelTd = document.createElement("td");
        squirrelTd.innerHTML = correlation;
        tr.appendChild(squirrelTd);

        correlationBody.appendChild(tr);
    }

    console.log(dictionary);
});