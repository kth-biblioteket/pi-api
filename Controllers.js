require('dotenv').config({ path: 'pi-api.env' })

const eventModel = require('./Models');

async function readAllusers(req, res) {
    try {
        if (req.query.page && req.query.per_page) {
            // Pagination parameters provided, fetch paginated results
            const page = req.query.page || 1;
            const perPage = req.query.per_page || 10;

            let result = await eventModel.readAllUsersWithPagination(page, perPage);
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
        console.log(req.query)
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
