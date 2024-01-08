require('dotenv').config({ path: 'pi-api.env' })

const eventModel = require('./Models');

async function readAllusers(req, res) {
    try {
        if (req.query.page && req.query.itemsPerPage) {
            // Pagination parameters provided, fetch paginated results
            const page = req.query.page || 1;
            const itemsPerPage = req.query.itemsPerPage || 10;

            let result = await eventModel.readAllUsersWithPagination(page, itemsPerPage);
            res.send(result);
        } else {
            // No pagination parameters provided, fetch all users
            let result = await eventModel.readAllusers();
            res.send(result);
        }
    } catch (err) {
        res.send("error: " + err);
    }
}

async function readUsers(req, res) {
    try {
        let result = await eventModel.readUsers(req.query.fnamn, req.query.enamn)
        res.send(result)
    } catch (err) {
        res.send("error: " + err)
    }
}


module.exports = {
    readAllusers,
    readUsers
};