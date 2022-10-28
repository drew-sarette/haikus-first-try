# haikus

The site will have two main components. The page where users enter their haiku will get the number of syllables for each entered word from wordsAPI. If the user selects a word, up to four synonyms with different syllables will be presented. The total number of syllables per line will be tracked to verify that it is a valid 5-7-5 haiku. The haiku will be stored as an array of objects, each object storing the word, its syllable count, and what line it is on. When submitted, the haiku will be stored in a MongoDB cloud instance.  

On the back-end, previously submitted haikus will be served by an express server, which will retrieve them from the db.
