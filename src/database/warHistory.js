const { Pool } = require("pg");
const chalk = require("chalk");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

module.exports.addWar = async (clan_1, clan_2, format) => {
	const query_string = `INSERT INTO war_history
	( matched_at, clan_1,  clan_2, format)
	VALUES(NOW(), $1, $2, $3)`;

	const values = [clan_1, clan_2, format];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("addWar")} - ${err.message}`);
	}
};

module.exports.getWar = async (server_id) => {
	const query_string = `SELECT * FROM war_history
	WHERE clan_1 = $1
	OR clan_2 = $1`;

	const values = [server_id];

	try {
		const res = await pool.query(query_string, values);
		return res.rows;
	} catch (err) {
		console.log(`${chalk.red("getWar")} - ${err.message}`);
	}
};
