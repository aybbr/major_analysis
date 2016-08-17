install.packages('RWeka')
library(tm)
library(RWeka)
library(stringr)

# read in the data set
getwd()
setwd("E:/data_viz/major_vis")
if (file.exists("lyrics.csv")) {
    scripts <- read.csv("lyrics.csv",header = TRUE, sep = ";", stringsAsFactors = FALSE)
} else {
    message('file absent !')
}

# condense lyrics to get rid of tracks and numbers
by.singer <- NULL
for (singer in unique(scripts$Singer)) {
    subset <- scripts[scripts$Singer == singer,]
    text <- str_c(subset$Line, collapse = " ")
    row <- data.frame(singer, text)
    by.singer <- rbind(by.singer, row)
}

# condense low lyrics volume singers into one to create a manageable corpus
# this keeps 17 from 34
by.singer.important <- by.singer[nchar(as.character(by.singer$text)) > 1000,]

# save the rest of the lyrics into one important singer "All others"
kept.singers <- unique(as.character(by.singer.important$singer))
other.text <- by.singer[!(by.singer$singer %in% kept.singers),]
other.text <- str_c(other.text$text, collapse = " ")
other <- data.frame(singer = "All others", text = other.text)

# add it back in
by.singer <- rbind(by.singer.important, other);
rm(by.singer.important)

# create corpus
myReader <- readTabular(mapping = list(content = "text", id = "singer"))
corpus <- Corpus(DataframeSource(by.singer), readerControl = list(reader = myReader))

# pre-process text

swe <- stopwords("english")
rapstopwords <- c("gon", "got", "thats", "cant", "dont", "yeah", "just", "get")


i = 1
j = length(swe)
for (i in 1:length(rapstopwords)) {
swe[[j + i]] <- rapstopwords[i]  
}

corpus <- tm_map(corpus, content_transformer(function(x) iconv(x, to = 'UTF-8', sub = 'byte')), mc.cores = 1)
corpus <- tm_map(corpus, content_transformer(tolower))
corpus <- tm_map(corpus, content_transformer(removePunctuation), mc.cores = 1)
corpus <- tm_map(corpus, content_transformer(removeNumbers))
corpus <- tm_map(corpus, content_transformer(stripWhitespace))
corpus <- tm_map(corpus, removeWords, swe)

# create term document matrix
options(mc.cores = 1)
allTokenizer <- function(x) NGramTokenizer(x, Weka_control(min = 1, max = 3))
all.tdm <- TermDocumentMatrix(corpus, control = list(tokenize = allTokenizer))

# remove sparse terms
all.tdm.75 <- removeSparseTerms(all.tdm, 0.75) # 535 of 9669

# save as a simple data frame
count.all <- data.frame(inspect(all.tdm.75))
count.all$word <- row.names(count.all)
write.csv(count.all, "major_key_tdm_all.csv", row.names = FALSE)
