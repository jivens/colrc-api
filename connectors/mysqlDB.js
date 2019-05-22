// store config variables in dotenv
require('dotenv').config();
// ORM (Object-Relational Mapper library)
const Sequelize = require('sequelize');

// ****** Set up default MYSQL connection START ****** //
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    //operatorsAliases: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true
    },
    //logging:false
  });

sequelize
.authenticate()
.then(() => {
  console.log('connected to MYSQL- COLRC database');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
// ****** Set up default MYSQL connection END ****** //

//
// Root model for sequelize
//
const Root = sequelize.define('root', {
  root: { type: Sequelize.STRING },
  number: { type: Sequelize.INTEGER },
  salish: { type: Sequelize.STRING },
  nicodemus: { type: Sequelize.STRING },
  english: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const User = sequelize.define('user', {
  first: { type: Sequelize.STRING },
  last: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  roles: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});
async function makeRootTable(){
	await Root.sync({force: true});
	var fs = require('fs');
	var contents = fs. readFileSync('/Users/avf/OneDrive - University of Arizona/Desktop/entries.txt', 'utf8');
	var rows = contents.split("\n");
	rows.forEach(async function (row, index) {
		columns = row.split(":::");
		await Root.create({
			root: columns[2],
			number: parseInt(columns[3]),
			salish: columns[4],
			nicodemus: columns[5],
			english: columns[6]
		});
	});
	console.log("I have a roots table");
}


// force: true will drop the table if it already exists
//Root
//.sync({force: true});

module.exports = {
  Root,
  User
};
