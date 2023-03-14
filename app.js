///// set our current env to development
const env = process.env.NODE_ENV || 'development';

///// db access details
/////for app.js to connect to postgresQL
const config = require('./config.js')[env];
const express = require('express');
const app = express();
/// use bodyParser library 
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();

/////load NODE postgres library
const pg = require('pg');

app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
res.render('index');
})

	app.get('/booking',(req,res)=>{
	res.render('booking',{message: ""});
	})

		app.get('/reception',(req,res)=>{
		res.render('reception',{message: "",booking: "",roombooking: "",room: ""});
		})

		app.post('/receptionbooking',urlEncodedParser,[], async(req,res)=>{
			//const errors = validationResult(req);
			const bknum = req.body.bknum;

			const pool = new pg.Pool(config);
   const client = await pool.connect();
   //const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
   const q = `set search_path = hotelbooking,public;select * from booking where b_ref = '${bknum}' ;`

   const q2 = `set search_path = hotelbooking,public;select * from roombooking where b_ref = '${bknum}' ;`

  


   await client.query(q).then((results) => {
	client.release();
	//console.log(results); //
	   // get the results from the second query
	   
	    
		//find room number and dates 
	   
	   data = results[1].rows;
	  // console.log(data);
	   if(data[0].b_ref == undefined){
		return res.render('reception',{message: "Invalid booking reference"});
	   }
	   client.query(q2)
		.then(async(result2)=>{
			data2 = result2[1].rows;
			//console.log(result2[1]);

			const result3 = await client.query(`select * from room where r_no = '${data2[0].r_no}';`);
			const data3 =  result3.rows;
			//console.log(data3);

			res.render('reception',{message: "",booking: data[0],roombooking: data2[0],room: data3[0]});
		})
		.catch((err) => console.log(err));

	  

   })
   .catch((err)=>{
	console.log(err.stack);
	errors = err.stack.split(" at ");
	res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
   })


		});

		app.get('/receptioncheckin',urlEncodedParser,[], async(req,res)=>{
			let room = req.query.room;
			console.log(room);

			const pool = new pg.Pool(config);
			const client = await pool.connect();
			//const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
			const q = `set search_path = hotelbooking,public;update room set r_status = 'O' where r_no = ${room} ;`

			await client.query(q)
			.then(()=>{
				res.render('checkinsuccess',{roomnum:room});
			})
			.catch((err)=> console.log(err));

			//execute sql to change room availability
			

		});

		app.get('/receptioncheckout',urlEncodedParser,[], async(req,res)=>{
			let room = req.query.room;
			console.log(room);

			const pool = new pg.Pool(config);
			const client = await pool.connect();
			//const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
			const q = `set search_path = hotelbooking,public;update room set r_status = 'C' where r_no = ${room} ;`

			await client.query(q)
			.then(()=>{
				res.render('checkoutsuccess',{roomnum:room});
			})
			.catch((err)=> console.log(err));

			//execute sql to change room availability
			

		});

		app.get('/makeavailable',urlEncodedParser,[], async(req,res)=>{
			let room = req.query.room;
			console.log(room);

			const pool = new pg.Pool(config);
			const client = await pool.connect();
			//const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
			const q = `set search_path = hotelbooking,public;update room set r_status = 'A' where r_no = ${room} ;`

			await client.query(q)
			.then(()=>{
				res.render('roomchange',{message:" Room "+room+" is now available"});
			})
			.catch((err)=> console.log(err));

			//execute sql to change room availability
			

		});

		app.get('/makeunavailable',urlEncodedParser,[], async(req,res)=>{
			let room = req.query.room;
			console.log(room);

			const pool = new pg.Pool(config);
			const client = await pool.connect();
			//const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
			const q = `set search_path = hotelbooking,public;update room set r_status = 'X' where r_no = ${room} ;`

			await client.query(q)
			.then(()=>{
				res.render('roomchange',{message:" Room "+room+" is now unavailable"});
			})
			.catch((err)=> console.log(err));

			//execute sql to change room availability
			

		});

		app.get('/housekeeping',async (req,res)=>{
			const pool = new pg.Pool(config);
			const client = await pool.connect();
			//const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
			const q = `set search_path = hotelbooking,public;select * from room where r_status = 'C' ;`

			await client.query(q)
			.then((results)=>{
				data = results[1].rows;
				//console.log(data);
				res.render('housekeeping',{rooms:data, message: ""});
			})
			.catch((err)=> console.log(err));

			
			})

		app.get('/payment',(req,res)=>{
			res.render('receptionpayments');
		})

		app.post('/sendbooking',urlEncodedParser,[], async(req,res)=>{
				//const errors = validationResult(req);

				/*if(!errors.isEmpty()){
					const alert = errors.array();
					res.render('booking',{
						alert
					});
				}*/

   const name = req.body.fname+' '+req.body.lname;
   const email = req.body.email;
   const address = req.body.address;
   const room = req.body.room;
   const expdate = req.body.expdate;
   const cvv = req.body.cvv;
   const cnum = Math.floor(Math.random() * (10000 - 777) + 777);
   const bknum = Math.floor(Math.random() * (999999 - 222222) + 222222);
   const card = req.body.card;
   const cardnum = req.body.cardnum;
   const from = req.body.fromdate;
   const to = req.body.todate;
   function dateDiffInDays(a, b) {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  const a = new Date(from),
  b = new Date(to),
  days = dateDiffInDays(a, b);



   const pool = new pg.Pool(config);
   const client = await pool.connect();
   //const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
   const q = `set search_path = hotelbooking,public;insert into customer values ('${cnum}', '${name}', '${email}', '${address}', '${card}',
   '${expdate}', '${cardnum}');`

   const q2 = `set search_path = hotelbooking,public;insert into booking values ('${bknum}', '${cnum}','${days}'*(select rra.price from rates rra, room rm where rm.r_no = 101 and rm.r_class = rra.r_class ) , 0, '');`

   const q3 = `set search_path = hotelbooking,public;insert into roombooking values ('${room}', '${bknum}', '${from}', '${to}');`

   const q4 = `set search_path = hotelbooking,public;select r_status from room where r_no = '${room}';`

   const q5 = `select * from room where r_status = 'A';`
 
   await client.query(q4).then((results) => {
	client.release();
	//console.log(results); //
	   // get the results from the second query
	   data = results[1].rows;

	   console.log(data[0].r_status);

	   //redirect to alternative rooms page
	if(data[0].r_status != "A"){
		 client.query(q5)
		.then((results2)=>{
			//data2 = results2[1].rows;
			//console.log(data2);
			//console.log(results2.rows);
			return res.render('bookingfail',{
				rooms : results2.rows
					});
		})
		.catch((err) => console.log(err));
		
	}

}).then(async()=> {
	await client.query(q).catch((err) => console.log(err));
	await client.query(q2).catch((err) => console.log(err));
	await client.query(q3)
	.then(()=>{
		res.render('bookingsuccess',{
			message : "Booking reference is "+bknum,name: name
				});
	})
	.catch((err) => console.log(err));

})
.catch(err => {
	console.log(err.stack);
	errors = err.stack.split(" at ");
	res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
})


   /*await client.query(q).then(results => {
	client.release();
	console.log(results); //
	   // get the results from the second query
	   data = results[1].rows;
	   count = data.length;
	   res.render('bookingsuccess',{
		alert
	});
}).catch(err => {
	console.log(err.stack)
	errors = err.stack.split(" at ");
	res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
})*/
				
		});

		////// POST route, Add user JSON requests 
		/*
app.post('/adduser', jsonParser , async (req, res) => {
	console.log(req.body);
   const name = req.body.name;
   const email = req.body.email;

   const pool = new pg.Pool(config);
   const client = await pool.connect();
   const q = `insert into users ( id, name, email) values ((SELECT COALESCE(MAX(id),0) FROM users) + 1 , '${name}', '${email}');select * from users;`;
   
   await client.query(q).then(results => {
	   client.release();
	   console.log(results); //
		  // get the results from the second query
		  data = results[1].rows;
		  count = data.length;
	   res.json({ data, rows:count });
   }).catch(err => {
	   console.log(err.stack)
	   errors = err.stack.split(" at ");
	   res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
   })

});
*/

app.listen(3000, () => {
	console.log('Express app listening on port 3000...')
});