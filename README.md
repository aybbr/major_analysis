# Major 🔑 Analysis 

DJ Khaled ninth studio album text analysis. 

DJ Khaled has recently dropped his ninth studio album featuring 34 of the rap game biggest names. From from Jay Z, Nas, J. Cole, Drake, Kendrick Lamar, Big Sean, 2 Chainz, Nicki Minaj, Rick Ross, Chris Brown, August Alsina, Jeremih, Future, Betty Wright, Bryson Tiller, Kodak Black, Jeezy, French Montana, Yo Gotti, YG, Gucci Mane, Jadakiss, Fabolous, Busta Rhymes, Fat Joe,Kent Jones, Wale, Wiz Khalifa, Lil Wayne, Mavado to the american Pop singer, Meghan Trainor. This particular album has yield unprecedented success therefore I wanted to make this analysis to explore the album guests, lyrics share, most characteristic words or phrases, profanity rates per artist and then made an interactive visualization with D3.js illustrating lyrics per song per artist.


# Data
Album Tracklist and singers were scrapped from <a href="http://genius.com/albums/Dj-khaled/Major-key">Rap-Genius</a> as well as each song lyrics by artist.

# Methods and statistical approach
I used the stringr package to condense each rapper lyrics into one large unformatted string. Afterward, I used the tm package to pre-process the text (to lowercase, remove punctuation, numbers and white space, remove english stop words as well as the rap version of these stop words) which resulted in a lyrics corpus.
 
  #Exploration

    Words cloud

  <center><img src="https://cloud.githubusercontent.com/assets/3009041/17927943/124b29fa-69f0-11e6-864b-f31755674134.png"></center>

    Lyrics share
  
  <center><img src="https://cloud.githubusercontent.com/assets/3009041/17927922/fa06960e-69ef-11e6-98e5-04031b828994.png"></center>

    Swearing
  
  <center><img src="https://cloud.githubusercontent.com/assets/3009041/17927927/ffcab0a2-69ef-11e6-97f8-11d7cc355c22.png"></center>

    Characteristic words
  
  <center><img src="https://cloud.githubusercontent.com/assets/3009041/17927921/f632a70c-69ef-11e6-8b18-3a5a6b0829ea.png"></center>
  
# Chord diagram

For better interactivity and to add more visually appealing graphs I used D3.js to provide this chord diagram with inner titles.

<center><img src="https://cloud.githubusercontent.com/assets/3009041/17927906/e90ce470-69ef-11e6-8c90-aa4f008ab388.PNG"></center>

  interactive visualization <a href="http://ayoub.rocks/major_vis.html">here</a>.
