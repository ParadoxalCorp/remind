module.exports = (notes) => {
    notes.deleteAll = async function() {
        return new Promise(async(resolve, reject) => {
            try {
                notes.forEach(function(note) {
                    notes.delete(`${JSON.parse(note).id}`);
                });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }
}