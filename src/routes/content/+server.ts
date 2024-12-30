import { json } from '@sveltejs/kit';
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

async function dbGetContent(id_file) {
	let mysqlconn = await mysqlconnFn();
  try {
    let results = await mysqlconn
      .query("SELECT F.mime, C.content FROM files F LEFT JOIN file_contents C ON C.id_file=F.id_file WHERE F.id_file="+id_file+";")
      .then(function ([rows, fields]) {
        return rows;
      });
		if ( results == null )
			return null;
    return results.pop();
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}

export async function GET( event ) {
  const id = event.url.searchParams.get('id');
  const data = await dbGetContent(id);
  console.log("___DATA",data);
  return new Response( data, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}