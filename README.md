# haikus

The site will have two main components. The page where users enter their haiku will get the number of syllables for each entered word from wordsAPI. If the user selects a word, up to four synonyms with different syllables will be presented. The total number of syllables per line will be tracked to verify that it is a valid 5-7-5 haiku. The haiku will be stored as an array of objects, each object storing the word, its syllable count, and what line it is on. When submitted, the haiku will be stored in a MongoDB cloud instance.  

On the back-end, previously submitted haikus will be served by an express server, which will retrieve them from the db.

# Features
1. Create a node.js server using Express.js
2. Use arrays/objects to store/retrieve info that is displayed in the app
    - haiku array is used to store objects with the word, syllables, and a list of synonyms
    - list of words is stored as a json file in the server
3. Retrieve data from a 3rd party API and use it to display something in your app
    - WordsAPI is used to verify the input of each word, get a list of synonyms, and the number of syllables.
4. Analyze data that is stored in an array of objects
    - WordsAPI data is parsed to filter out any synonyms that are more than one word, and consolidate them into one array 
5. API key is stored in .env file on the server for evaluation


# Instructions for review
- ```cd server && node index.js```
- open haikus/server/index.html in browser (Live Server does not work!)
- Write a haiku!