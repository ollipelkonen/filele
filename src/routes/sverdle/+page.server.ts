// CREATE TABLE file (id_file int NOT NULL AUTO_INCREMENT, name text, mime text, pos varchar(32), PRIMARY KEY (id_file));

import { Game } from './game';
import type { PageServerLoad, Actions } from './$types';
import * as fs from 'fs';
import { writeFile } from 'node:fs/promises';
import mysql from "mysql2/promise";



let mysqlconn = null;

function mysqlconnFn() {
  if (!mysqlconn) {
    mysqlconn = mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "files",
    });
  }
  return mysqlconn;
}


async function getFiles() {
	let mysqlconn = await mysqlconnFn();
  try {
    let results = await mysqlconn
      .query("SELECT * FROM files;")
      .then(function ([rows, fields]) {
				for (let i=0; i<rows.length; i++) {
					rows[i].pos = JSON.parse(rows[i].pos);
				}
        return rows;
      });

    return {
      files: results,
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}

export const load = (async({ cookies }) => {

	const game = new Game(cookies.get('sverdle'));

	return getFiles();
	return {
		guesses: undefined,
		answers: undefined,
		answer: game.answers.length >= 6 ? game.answer : null
	};
}) satisfies PageServerLoad;


async function dbStore(name,mime,pos) {
	let mysqlconn = await mysqlconnFn();
  try {
    mysqlconn
      .query("INSERT INTO files (name,mime,pos) VALUES (\"" + name + "\", \"" + mime + "\", '" + pos + "');")
      .then(function ([rows, fields]) {
				console.log("____ rows ", rows)
        return rows;
      });
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}

async function dbEdit(id,pos) {
	let mysqlconn = await mysqlconnFn();
  try {
    mysqlconn
      .query("UPDATE files SET pos='"+pos+"' WHERE id_file="+id+";")
      .then(function ([rows, fields]) {
				console.log("____ rows ", rows)
        return rows;
      });
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}


export const actions = {
	json: async ({ request, cookies }) => {
		console.log("___DROP",request);
    const formData = await request.formData();
		

		formData.entries().forEach( e => console.log("__entry",e) );
		formData.keys().forEach( e => console.log("__key",e) );
		formData.values().forEach( e => console.log("__value",e) );

		const pos = formData.get("pos");
		console.log("___pos",pos)

		const editId = formData.get("edit");
		if (editId) {
			dbEdit(editId,pos);
			return { success: true };	
		}

		const pf = formData.getAll("files[]");
		pf?.forEach( async (k,i) => {
			console.log("___k ", typeof k, k)
			
			dbStore(k.name,k.type, pos );

			writeFile(k.name, Buffer.from(await k.arrayBuffer()));

		});

    return { success: true };
	},

} satisfies Actions;
