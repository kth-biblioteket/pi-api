const database = require('./db');

//Hämta alla användare
const readAllusers = () => {
  return new Promise(function (resolve, reject) {
    const sql = `SELECT p.KTH_id,CONCAT(p.Enamn,', ',p.Fnamn) AS Namn,
                (SELECT DISTINCT ok.ORCIDid FROM orcid_kthid ok WHERE ok.KTH_id = p.KTH_id) AS ORCIDid,
                (SELECT DISTINCT o1.Orgnamn FROM organisation o1 WHERE o1.Orgkod = p.Orgkod) AS Orgnamn,
                (SELECT DISTINCT o2.Orgnamn FROM organisation o2 WHERE o2.Orgkod = p.Skol_kod) AS Skola,
                p.Bef_ben AS Befattning,p.Anst_nuv_bef AS Fr,p.Bef_t_o_m AS Till,p.Fil_datum AS Datum 
                FROM personal p
                ORDER BY p.KTH_id, p.Anst_nuv_bef, p.Fil_datum`;
    database.db.query(database.mysql.format(sql, []), (err, result) => {
      if (err) {
        console.error(err);
        reject(err.message)
      }
      resolve(result);
    });
  })
};

// Hämta alla användare med paginering
const readAllUsersWithPagination = (page, itemsPerPage) => {
  return new Promise(async function (resolve, reject) {
    try {
      const offset = (page - 1) * itemsPerPage;

      itemsPerPage = parseInt(itemsPerPage, 10);

      const totalCountQuery = 'SELECT COUNT(*) as total FROM personal';
      const totalCountResult = await queryAsync(totalCountQuery);
      const totalItems = totalCountResult[0].total;

      const totalPages = Math.ceil(totalItems / itemsPerPage);

      if (page < 1 || page > totalPages) {
        reject(new Error(`Invalid page. Page must be between 1 and ${totalPages}.`));
        return;
      }

      const sql = `SELECT p.KTH_id,CONCAT(p.Enamn,', ',p.Fnamn) AS Namn,
                  (SELECT ok.ORCIDid FROM orcid_kthid ok WHERE ok.KTH_id = p.KTH_id) AS ORCIDid,
                  (SELECT DISTINCT o1.Orgnamn FROM organisation o1 WHERE o1.Orgkod = p.Orgkod) AS Orgnamn,
                  (SELECT o2.Orgnamn FROM organisation o2 WHERE o2.Orgkod = p.Skol_kod) AS Skola,
                  p.Bef_ben AS Befattning,p.Anst_nuv_bef AS Fr,p.Bef_t_o_m AS Till,p.Fil_datum AS Datum 
                  FROM personal p
                  ORDER BY p.KTH_id, p.Anst_nuv_bef, p.Fil_datum
                  LIMIT ?, ?`;

      const result = await queryAsync(database.mysql.format(sql, [offset, itemsPerPage]));
      const response = {
        totalItems,
        data: result,
        totalPages,
        currentPage: page
      };

      resolve(response);
    } catch (err) {
      console.error(err);
      reject(err.message);
    }
  });
};

//Hämta alla användare
const readUsers = (fnamn, enamn) => {
  return new Promise(function (resolve, reject) {
    const sql = `SELECT p.KTH_id,CONCAT(p.Enamn,', ',p.Fnamn) AS Namn,
                (SELECT ok.ORCIDid FROM orcid_kthid ok WHERE ok.KTH_id = p.KTH_id) AS ORCIDid,
                o1.Orgnamn AS Orgnamn,
                (SELECT o2.Orgnamn FROM organisation o2 WHERE o2.Orgkod = p.Skol_kod) AS Skola,
                p.Bef_ben AS Befattning,p.Anst_nuv_bef AS Fr,p.Bef_t_o_m AS Till,p.Fil_datum AS Datum 
                FROM personal p, organisation o1 WHERE 
                p.Fnamn LIKE ?
                AND 
                p.Enamn LIKE ?
                AND o1.Orgkod = p.Orgkod ORDER BY p.Enamn, p.Fnamn, p.Anst_nuv_bef, p.Fil_datum`

                console.log(database.mysql.format(sql, [fnamn, enamn]))
    database.db.query(database.mysql.format(sql, [fnamn, enamn]), (err, result) => {
      if (err) {
        console.error(err);
        reject(err.message)
      }
      resolve(result);
    });
  })
};

// Utility function to promisify database.db.query
const queryAsync = (query) => {
  return new Promise((resolve, reject) => {
    database.db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};



module.exports = {
  readAllusers,
  readAllUsersWithPagination,
  readUsers
};