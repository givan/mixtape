# mixtape

## Pre-requisites:
1/ You will need to install node 10.x or above. Run the following command to verify what version you have:

```
$ node -v
v10.16.2
```
I'm using 10.16.2 for my development.

2/ Run ```npm install``` in the project root folder to download all depedent node modules.

3/ Run the functional tests to make sure your setup is in a good state:

```
npm test
```

## Running the app
To run the app, inside the root repo folder, execute the followign command:
```
$ npm start <input-file> <changes-file> <output-file>
```

The original mixtape.json file from the problem definition is stored under data folder as data/mixtape-data.json. There multiple changes.json files you can use - the data/changes.json file contains the 3 operations - first creating a new list (we specify the id as 777), then adding a new song to it (song id 1) and finally is deleting the newly created playlist with id 777. So at the end, when you compare the original mixtape-data.json and the output.json these will be the same. Note that if you run the app agains the same output.json file, it'll be completely overridden. 

To run the app with the data/changes.json file, which creates a new playlist 777, then adds a song to it and finally deletes it (all the supported commands by this app - add new playlist, add song to a playlist and delete a playlist), run this:
```
$ npm start data/mixtape-data.json data/changes.json data/output.json
```
Now if you use any text comparisson tool, you will see that there are no differences in the entities (songs, users and playlists). There are whitespace differences, since I'm using the human readable JSON formatting on the JSON.stringify() which adds a bit more whitespaces compared to the original mixtape-data.json.

To generate a new playlist with id 777 for user 2 with song id 8 in it (one command only):
```
$ npm start data/mixtape-data.json test/data/changes-addnewplaylist.json data/output.json
```

To generate a new playlist with id 777 for user 2 with song id 8 in it and then add a new song with id 1 to it (two commands):
```
$ npm start data/mixtape-data.json test/data/changes-addnewplaylist-addsong.json data/output.json
```

## changes.json structure
For adding a new playlist:
```
{ 
  "type": "createNewPlaylist",
  "input" : {
    "playlist" : {
      "id" : "777",
      "user_id" : "2",
      "song_ids" : [
        "8",
        "32"
      ]
    }
  } 
}
```
We  need to specify a new non-existing playlist.id here - the code doesn't generate a new id for us (future optimization). I created it this way so subsequent operations can use the newly created playlist.

For adding a song to an existing playlist:
```
{ 
  "type": "addSongToPlaylist",
  "input" : {
    "song_id" : "1",
    "playlist_id": "777"
  }
}
```

For deleting an existing playlist:
```
{ 
  "type": "deletePlaylist",
  "input" : {
    "playlist_id": "777"
  }
}
```

## MixtapeChanges business logic
The MistapeChanges class uses an array of operations and executes them in a serial manner, starting from the top element in the changes.json file going down. The code will run the operations even if one of them fails. Future improvement can be to support complete rollback if any operation has a interdepency to a previous that failed. 

## Operations classes
There are 3 classes that implement the 3 required operations. All of them have execute() method that I implemented with a callback since in normal implementations I'll not keep the data in memory and do heavy CPU intensive work in the node app itself. Node is best used for heavy IO workloads, not for CPU bound tasks (it's single threaded). For that reason, I simulate callbacks with setTimeout() in the execute() methods. In the future, these classes can use a data layer which will talk to some sort of persitstent storage where we'll store the mixtape data and do queries against it.
Another improvement will be for the AddNewPlaylistOperation class to auto generate the new playlist id (currently it expects this to be passed in). I kept it simple for now since i wanted to be able to manipulate the newly created playlist in the same change set for which we need to have a way to identify the newly created playlist from a previous operation. This could be solved with moving to async.waterfall() where one function can pass data to another (the createPlaylist operation will pass the newly created playlist id to the addSong operatoin).

## Reading the mixtape.json file
Currently the Mixtape class reads synchronously the file contents (for simplicity). This will be a memory and performance concern if the input mixtape.json file gets pretty large. One way to scale our app is to store the data in a persistant storage (MongoDB, Redis, Postgres) and scale the data layer. 

## Changes to the app to support large mixtape and changes files
As mentioned above, there two ideas to purpuse in this regard:
1/ store the mixtape contents into a persistant storage (SQL or NoSQL) - such as MongoDB, Postgres, MySQL, etc. These can be sharded and scalled horizontally with the increase of mixtape data.
2/ The array of changes can be analyzed and paralleized if there are no dependencies between them. This will allow to break down a changes file into indepdent set of operatoins that can run in parallel (since they're working on non overlapping resources);
 