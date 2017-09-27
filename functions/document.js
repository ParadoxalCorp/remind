module.exports = (notes, document, loadedNotes) => {
    document.loadNotes = async function() {
        return new Promise(async(resolve, reject) => {
            try {
                const convertToTime = function(timestamp) {
                    return {
                        hours: Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((timestamp % (1000 * 60)) / 1000)
                    }
                }
                notes.forEach(function(note) {
                    var convertedTime = convertToTime(JSON.parse(note).timestamp - Date.now());
                    document.getElementById("notesRow").appendChild(document.createElement("DIV")).setAttribute("id", `${JSON.parse(note).id}`);
                    var noteContainer = document.getElementById(`${JSON.parse(note).id}`);
                    noteContainer.setAttribute("class", `w3-quarter`);
                    var noteCard = document.createElement("DIV");
                    noteCard.setAttribute("class", "w3-card-4 w3-white");
                    var textContainer = noteCard.appendChild(document.createElement("DIV"));
                    textContainer.setAttribute("class", "w3-container");
                    textContainer.appendChild(document.createElement("h6")).setAttribute("class", "note-property note-name");
                    textContainer.getElementsByClassName("note-name")[0].innerHTML = `Name: ${JSON.parse(note).name}`;
                    textContainer.appendChild(document.createElement("h6")).setAttribute("class", "note-property note-date");
                    textContainer.getElementsByClassName("note-date")[0].innerHTML = `Date: ${new Date(JSON.parse(note).timestamp).toLocaleString()}`;
                    textContainer.appendChild(document.createElement("h6")).setAttribute("class", "note-property note-content");
                    textContainer.getElementsByClassName("note-content")[0].innerHTML = `Description: ${JSON.parse(note).content}`;
                    textContainer.appendChild(document.createElement("h6")).setAttribute("class", "note-property note-time-remaining");
                    textContainer.getElementsByClassName("note-time-remaining")[0].innerHTML = `Time remaining: ${convertedTime.hours}h ${convertedTime.minutes}m ${convertedTime.seconds}s`;
                    textContainer.appendChild(document.createElement("DIV")).setAttribute("class", "w3-button w3-block w3-red w3-padding-32 note-action note-delete");
                    textContainer.getElementsByClassName("note-delete")[0].innerHTML = `Delete`;
                    textContainer.getElementsByClassName("note-delete")[0].setAttribute("onclick", `note.delete(params, '${JSON.parse(note).id}')`);
                    noteContainer.appendChild(noteCard);
                    console.log(loadedNotes, "THEN", loadedNotes.filter(n => JSON.parse(n).timestamp > Date.now()));
                    if (loadedNotes.filter(n => JSON.parse(n).timestamp > Date.now()).get(`${JSON.parse(note).id}`)) {
                        console.log("triggered");
                        if (!loadedNotes.filter(n => JSON.parse(n).timestamp > Date.now()).get(`${JSON.parse(note).id}`).loaded) {
                            console.log("triggered x2");
                            var interval = setInterval(function() {
                                if (!notes.get(`${JSON.parse(note).id}`)) { //If the note has been deleted clear the interval
                                    clearInterval();
                                } else {
                                    textContainer.getElementsByClassName("note-time-remaining")[0].innerHTML = `Time remaining: ${convertToTime(JSON.parse(note).timestamp - Date.now()).hours}h ${convertToTime(JSON.parse(note).timestamp - Date.now()).minutes}m ${convertToTime(JSON.parse(note).timestamp - Date.now()).seconds}s`;
                                    var distance = JSON.parse(note).timestamp - Date.now();
                                    if (distance < 0) {
                                        stopInterval();
                                        textContainer.getElementsByClassName("note-time-remaining")[0].innerHTML = `Expired`;
                                        alert(`Its time for ${notes.get("" + JSON.parse(note).id + "").name} !`);
                                    }
                                }
                            }, 1000);

                            function stopInterval() {
                                clearInterval(interval);
                            }
                            loadedNotes.get(`${JSON.parse(note).id}`).loaded = true; //Dont load it two times or we'll get two intervals
                        }
                    }
                    resolve(true);
                });
            } catch (err) {
                reject("An error occured within the loadNotes() process: " + err.name + "\n" + err.stack);
            }
        });
    }
    document.unloadNotes = async function(document) {
        return new Promise(async(resolve, reject) => {
            try {
                var notesContainer = document.getElementById("notesRow");
                while (notesContainer.firstChild) {
                    notesContainer.removeChild(notesContainer.firstChild);
                }
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }
}