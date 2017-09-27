exports.create = async(params) => {
    return new Promise(async(resolve, reject) => {
        try {
            var name = params.document.getElementById("newName"),
                date = params.document.getElementById("newDate"),
                time = params.document.getElementById("newTime"),
                nameInput = params.document.getElementById("newNoteName"),
                dateInput = params.document.getElementById("newNoteDate"),
                timeInput = params.document.getElementById("newNoteTime");
            //Check the user input
            if (nameInput.value === "") {
                nameInput.style.borderColor = "red !important";
                return resolve(name.setAttribute('data-content', ' * This field is required'));
            } else if (dateInput.value === "") {
                dateInput.style.borderColor = "red !important";
                return resolve(date.setAttribute('data-content', ' * This field is required'));
            } else if (timeInput.value === "") {
                timeInput.style.borderColor = "red !important";
                return resolve(time.setAttribute('data-content', ' * This field is required'));
            }
            //Start date conversion and check if valid date
            date = dateInput.value.split("-"); //Split into an array
            var timestamp = new Date(`${date[1]}/${date[2]}/${date[0]} ${timeInput.value}`).getTime(); //Convert it to unix timestamp
            if (timestamp < Date.now()) {
                return resolve(alert("Sorry, we can't go back in time to remind you :v"));
            }
            //Acknowledge user input and animate stuff
            var createButton = params.document.getElementById("createNoteButton");
            var noteModal = params.document.getElementById("newNoteModal");
            var cancelButton = params.document.getElementById("newNoteCancel");
            var closeButton = params.document.getElementById("newNoteClose");
            //Disable the close buttons during the note creation
            cancelButton.setAttribute("disabled", "true"),
                closeButton.setAttribute("disabled", "true");
            //Animate stuff
            createButton.innerHTML = "Creating ";
            let i = 4;
            setInterval(function() {
                if (i === 9) {
                    clearInterval();
                } else {
                    noteModal.style.backgroundColor = `rgba(0, 0, 0, 0.${i++})`
                }
            }, 50);
            createButton.appendChild(params.document.createElement("I")).setAttribute("class", "fa fa-spinner fa-spin");
            var randomId = Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) + 100000000000;
            //Save the note into the db
            await params.notes.set(randomId, {
                id: randomId,
                name: nameInput.value,
                timestamp: timestamp,
                content: params.document.getElementById("newNoteContent").value,
                important: params.document.getElementById("isImportant").checked,
            });
            await params.loadedNotes.set(randomId, {
                id: randomId,
                name: nameInput.value,
                timestamp: timestamp,
                content: params.document.getElementById("newNoteContent").value,
                important: params.document.getElementById("isImportant").checked,
            });
            //Wait notes reload
            await params.document.unloadNotes(params.document);
            await params.document.loadNotes(params.notes, params.document, params.loadedNotes);
            noteModal.style.display = "none"; //Close the modal
            //Reset animations
            noteModal.getElementsByClassName("fa-spinner")[0].parentNode.removeChild(noteModal.getElementsByClassName("fa-spinner")[0]);
            createButton.innerHTML = "Create";
            noteModal.style.backgroundColor = `rgba(0, 0, 0, 0.4)`;
            cancelButton.setAttribute("disabled", "false"),
                closeButton.setAttribute("disabled", "false");
            resolve(params.notes.get(randomId)); //Return the new note object so we can maybe do things with it later
        } catch (err) {
            reject(err);
        }
    });
}
exports.delete = async(params, noteId) => {
    return new Promise(async(resolve, reject) => {
        try {
            await params.notes.delete(`${noteId}`);
            console.log(params.notes, noteId);
            await params.document.unloadNotes(params.document);
            resolve(await params.document.loadNotes(params.notes, params.document, params.loadedNotes));
        } catch (err) {
            reject(err);
        }
    });
}