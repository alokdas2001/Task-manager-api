//CRUD create read update delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient //necc to connect the database to perform crud



const connectionURL = 'mongodb://127.0.0.1:27017' //url
const databaseName = 'task-manager'  // database name

MongoClient.connect(connectionURL , { useNewUrlParser : true} , (error , client) => {  // must be true to connect to the server
    if(error){
        return console.log('Unable to connect to database');
    }

    const db = client.db(databaseName) // setting up database name


 //----------------------------------------------------------create starts------------------------------------------------------------------   

    //creating one doc at once 

    // db.collection('user').insertOne({  // user is the folder name in collection
    //     name:'ALOK',                   // inserting data using insertOne or insertmany for many
    //     age:27
    // } , (error , result) => {
    //     if (error) {
    //         return console.log("unabele to create")
    //     }
    //     console.log(result.ops);  // array of documents instead of robo 3t it will show in console

    // })


      //creating many doc at once

    // db.collection('user').insertMany([  // inserting many documents at once
    //     {
    //         name:'LEE',
    //         age:19
    //     },
    //     {
    //         name:'xskull',
    //         age:18
    //     }
    // ], (error , result) => {
    //     if (error) {
    //         return console.log('unable to create')
    //     }
    //     console.log(result.ops);

    // })

 //----------------------------------------------------------create ends ------------------------------------------------------------------       


 //----------------------------------------------------------read starts------------------------------------------------------------------   

   // finding one data at once

    // db.collection('user').findOne({name:'LEE'} , (error , result) => {  // to find one match only...it doesnot matter about same data
    //     if (error) {
    //         console.log('Unable to read')
    //     }

    //     console.log(result);

    // })



    // finding many data at once

    // db.collection('user').find({name:'ALOK'}).toArray((error,result) => { // to find all posssible data that matches input....toArray to convert result into array only for read
    //     if (error) {
    //         console.log('Unable to read')
    //     }
    //     console.log(result);

    // })

  //----------------------------------------------------------read ends------------------------------------------------------------------ 
  
  //----------------------------------------------------------update starts--------------------------------------------------------------
//   var ObjectID = require('mongodb').ObjectID;  // it is necc only if you update by id


// for updating one things at a time

//   db.collection('user').updateOne({
//    //   _id:new ObjectID("5f144816db611029ec13f9cb")
//      name:'LEE'
   
//   }, {
//      $set:{
//         name:'adroczz'
//      }
//   }).then((result)=>{
//      console.log(result);
//   }).catch((error)=>{
//      console.log(error)
//   })


// for updating many things at a time

// db.collection('user').updateMany({
//    name:'adroczz' // updating things with name adroczz or any other data as given
// }, {
//    $set: {   // $set is used to change data....https://docs.mongodb.com/manual/reference/operator/update/ for more like that
//       name:'ALOK'  // updating adroczz to ALOK
//    }
// }).then((result) => {
//    console.log(result);
// }).catch((error) =>{
//    console.log(error);
// })
    
  //----------------------------------------------------------update ends--------------------------------------------------------------

    //----------------------------------------------------------deleting starts--------------------------------------------------------------
    
    // Using promises
    
    // delete one...deleteOne


  // delete many

  // db.collection('user').deleteMany({  // for deleting many data at once 
  //   name:'ALOK'   // deleting all data starting from ALOK
  // }).then((result) =>{
  //   console.log(result)
  // }).catch((error) =>{
  //   console.log(error);
  // })



      //----------------------------------------------------------deleting ends--------------------------------------------------------------
    
})

