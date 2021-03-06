const express = require('express')
const Twitter = require('twitter')
const cors = require('cors')
//const Router = express.Router
const socket = require('socket.io');
const app = express()
app.use(cors())

const port = 3060
app.use(express.json())

var client = new Twitter({
    consumer_key: 'key-1',
    consumer_secret: 'key-2',
    access_token_key: 'key-3',
    access_token_secret: 'key-4'
    }); 

const server= app.listen(port, ()=>{
    console.log( 'server is running on port ', port )
})


const io = socket(server);

app.get('/twitterSearch/:name', (req,res)=>{
        const name = req.params.name
        const params = {q:name, count:500}
        client.get('search/tweets', params , tweets )
            function tweets(err, data, response){
                var tweetsArray =[]
                if(!err){
                    for(let i=0;i<data.statuses.length;i++){
                        const tweet = data.statuses[i]
                        var tweeetBody = {
                            text:tweet.text,
                            id:tweet.id_str,
                            name:tweet.user.name,
                            userScreenName: "@" + tweet.user.screen_name,
                            time:tweet.created_at.slice(4,19)
                        }
                        tweetsArray.push(tweeetBody)
                    }
                    res.send(tweetsArray)
                } 
                else{
                    res.send(err)
                }
            } 
    });
    io.on('connection',(socket)=>{
       console.log('new user connected..', socket.id);
         socket.on('getTweets', (name)=>{
       client.stream('statuses/filter', {track:name}, (stream)=>{
             stream.on('data', function(event) {
                //console.log(event && event.text);
                io.emit('getTweets', event )
              });
           })
          // io.emit('getTweets','hi');
        })
      
       
    });
    
    
   
