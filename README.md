# Major 🔑 Analysis 

DJ Khaled ninth studio album text analysis. 

DJ Khaled has recently dropped his ninth studio album featuring 34 of the rap game biggest names. From from Jay Z, Nas, J. Cole, Drake, Kendrick Lamar, Big Sean, 2 Chainz, Nicki Minaj, Rick Ross, Chris Brown, August Alsina, Jeremih, Future, Betty Wright, Bryson Tiller, Kodak Black, Jeezy, French Montana, Yo Gotti, YG, Gucci Mane, Jadakiss, Fabolous, Busta Rhymes, Fat Joe,Kent Jones, Wale, Wiz Khalifa, Lil Wayne, Mavado to the american Pop singer, Meghan Trainor. This particular album has yield unprecedented success therefore I wanted to make this analysis to explore the album guests, lyrics share, most characteristic words or phrases, profanity rates per artist and then made an interactive visualization with D3.js illustrating lyrics per song per artist.


# Data
Album Tracklist and singers were scrapped from <a href="http://genius.com/albums/Dj-khaled/Major-key">Rap-Genius</a> as well as each song lyrics by artist.

# Methods and statistical approach
I used the stringr package to condense each rapper lyrics into one large unformatted string. Afterward, I used the tm package to pre-process the text (to lowercase, remove punctuation, numbers and white space, remove english stop words as well as the rap version of these stop words) which resulted in a lyrics corpus.
