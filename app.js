const PersistentCollection = require("djs-collection-persistent");
const note = require("./functions/note");

const notes = new PersistentCollection({ //Create or load the notes database
    name: "notes"
});
var loadedNotes = notes;
require("./functions/document")(notes, document, loadedNotes);
require("./functions/notes")(notes);

const params = {
    notes: notes,
    document: document,
    loadedNotes: loadedNotes
}
setTimeout(function() {
    document.loadNotes(params.notes, params.document, params.loadedNotes);
}, 2000); //Wait for the notes to be properly loaded into memory

setTimeout(function() {
    document.getElementById("deleteAllNotesButton").onclick = async function() {
        await notes.deleteAll(params.notes);
        await document.unloadNotes(params.document);
        await document.loadNotes(params.notes, params.document, params.loadedNotes);
    }
}, 2000);