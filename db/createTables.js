#! /usr/bin/env node

const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const host = process.env.DBHOST;
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const port = process.env.DBPORT;
const name = process.env.DBNAME;


const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR ( 255 ),
  lastname VARCHAR ( 255 ),
  username VARCHAR ( 255 ) UNIQUE,
  password VARCHAR ( 255 ),
  is_Member BOOLEAN,
  is_Admin BOOLEAN
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  title TEXT,
  time TIMESTAMP,
  message TEXT
);
`;

async function main () {
  console.log("seeding...")
  try {
    const client = new Client({
      connectionString: `postgresql://${user}:${password}@${host}:${port}/${name}`
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("Completed")
  } catch (error) {
    console.error("Populate DB Connection Error: ", error)
  }
}

main()