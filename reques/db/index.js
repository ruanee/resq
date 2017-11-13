const { Pool} = require('pg')
//const copy = require('pg-copy-streams')
const globals = require('../globals');
//const copyTo = copy.to
//const copyFrom = copy.from
var fs = require('fs')

/** postgresql */
const connectionString = globals.connectionString

const pool = new Pool({
  connectionString: connectionString,
})
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
module.exports = {
  pool: pool,
  query: async (text, params) => {
	  const client = await pool.connect()
	  try {
		const res = await client.query(text, params)
		//console.log(res.rows)
		return res;
	  } finally {
		client.release()
	  }
	  return null;
  },
  querySync: (text, params) => {
	  var rows = null;
	  pool.connect()
	  .then(client => {
	    return client.query(text, params)
	      .then(res => {
	        client.release()
	        console.log(res.rows[0])
	        rows = res.rows;
	      })
	      .catch(e => {
	        client.release()
	        console.log(err.stack)
	      })
	  })
	  return rows;
  },
  querySync2: (text, params) => {
	  pool.connect((err, client, done) => {
		  if (err) throw err
		  client.query(text, params, (err, res) => {
		    done()

		    if (err) {
		      console.log(err.stack)
		    } else {
//		      console.log(res.rows[0])
		      return res.rows;
		    }
		  })
		})
	  
	  return null;
  },
  asyncInsert: (text, params) => {
	  (async () => {
		  const client = await pool.connect()
			  try {
				await client.query('BEGIN')
				await client.query(text, params,
					function(err, result) {
					  if(err)  {
						  
					  } else {
//						  console.log(result.rowCount)
					  }
					}
				)
				await client.query('COMMIT')
				
			  } catch (e) {
				    await client.query('ROLLBACK')
				    throw e
			  } finally {
				client.release()
			  }
		})().catch(e => console.error(e.stack))
	},
//	copyTo:(text, params) => {
//		pool.connect((err, client, done) => {
//			  if (err) throw err
//			  console.log(new Date())
//			  var stream = client.query(copyTo("COPY (select * from product.catelog limit "+params+") TO STDOUT "));
//			  stream.pipe(process.stdout);
//			  stream.on('end', done)
//			  stream.on('error', done);
//			  var writerStream  = fs.createWriteStream(globals.outputFolder + 'out.dat')
//			  stream.pipe(writerStream)
//			  console.log("query end")
//			  console.log(new Date())
//		})
//	},
	copyFile:(source, target, cb) => {
		var cbCalled = false;

		var rd = fs.createReadStream(source);
		rd.on("error", function(err) {
		  done(err);
		});
		var wr = fs.createWriteStream(target);
		wr.on("error", function(err) {
		  done(err);
		});
		wr.on("close", function(ex) {
		  done();
		});
		rd.pipe(wr);

		function done(err) {
		  if (!cbCalled && cb) {
		    cb(err);
		    cbCalled = true;
		  }
		}
	}
}