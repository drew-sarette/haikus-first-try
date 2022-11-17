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

# What I learned
I found using callbacks, promises, and async/await all useful in this project. For a simple Fetch call, async/await makes everything easy to read and understand. Because of the differences between commonJS using require and module.exports, as opposed to the ES syntax, I ended up going with Axios on the server because node-fetch was incompatible with commonJS. As a beginner, I found that using callbacks for the logic made it easier to handle different outcomes since I could more easily see what functions would be called. I understand that chaining promises would ultimately be a better solution, and will be using those in the future.

# Credits
dcode Using Async/Await with the Fetch API https://youtu.be/Yp9KIcSKTNo
web dev simplified  Learn Express JS In 35 Minutes https://youtu.be/SccSCuHhOw0
Paul Sherrif JS REST APIs: Getting Started https://www.pluralsight.com/courses/javascript-rest-apis-getting-started