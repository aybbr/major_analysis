# requires major_key_tdm_all.csv, generated in corpus_singer.R
# generates plots/ranked_words.png

library(ggplot2)
library(RColorBrewer)
library(png)
library(grid)

setwd("E:/data_viz/major_vis/data_files")
count.all <- read.csv("major_key_tdm_all.csv", stringsAsFactors = FALSE)

# function to get the log likelihood of each of a 
# singer's words vs. the rest of the dataframe
LL <- function(df, threshold, sig.level) {

    LL.df <- NULL

    df <- df[rowSums(df[, - length(df[1,])]) > threshold,]

    singers <- colnames(df[, - length(df[1,])])

    for (singer in singers) {

          # subset the data frame to hold one singer's data
        temp.p <- subset(df, select = singer)
        temp.count <- subset(df, select = word)
        temp.w <- cbind(temp.p, temp.count)

          # loop through their words
        for (k in seq_along(temp.w[, 1])) {

            word <- temp.w$word[k]

            singer.sums <- data.frame(singer = names(colSums(df[, - length(df[1,])])), total = colSums(df[, - length(df[1,])]), row.names = NULL)
            word.sums <- data.frame(word = df$word, total = rowSums(df[, - length(df[1,])]), row.names = NULL)
            all.words.total <- sum(singer.sums$total)

            word.total <- word.sums[word.sums$word == word, 2]

            singer.total <- singer.sums[singer.sums$singer == singer, 2]
            if (singer.total == 0) singer.total <- 0.0001
            other.total <- all.words.total - singer.total

            singer.word <- df[df$word == word,]
            singer.word <- data.frame(singer = names(singer.word), count = t(singer.word), row.names = NULL)
            singer.word <- as.numeric(as.character(singer.word[singer.word$singer == singer, 2]))
            other.word <- word.total - singer.word

            if (singer.word == 0) singer.word <- 0.0001
            E1 <- (singer.total * word.total) / all.words.total
            E2 <- (other.total * word.total) / all.words.total
            LL <- 2 * (singer.word * log(singer.word / E1) + other.word * log(other.word / E2))

            if (abs(LL) > sig.level) {
                if (E1 > singer.word) LL <- -1 * LL
                singer.word <- round(singer.word)
                singer.total <- round(singer.total)
                row <- data.frame(singer, word, word.total, singer.total, singer.word, E1, E2, LL)
                LL.df <- rbind(LL.df, row)
            }

        }
    }
    LL.df <- LL.df[order(LL.df$singer, - LL.df$LL),]
    return(LL.df)
}

# pass the words through the log likelihood function


allLL <- LL(count.all, threshold = 10, sig.level = 10.83)

### save the file for easy later access.

write.csv(allLL, "major_keys_ngrams.csv", row.names = FALSE)
allLL <- read.csv("major_keys_ngrams.csv", stringsAsFactors = FALSE)

# for each ngram, keep only the highest and lowest LL  
n.unique <- function(df) {
    ngrams.unique <- NULL
    words <- unique(df$word)
    for (h in seq_along(words)) {
        subset <- df[df$word == words[h],]
        if (length(subset[, 1]) > 1) subset <- subset[order( - abs(subset$LL)),]
        ngrams.unique <- rbind(ngrams.unique, subset[1,])
    }
    return(ngrams.unique)
}
ngrams.unique <- rbind(n.unique(allLL[allLL$LL >= 0,]),
                       n.unique(allLL[allLL$LL < 0,]))


# keep just main singers 
main.singers <- c("DJ.Khaled", "Future", "Big.Sean", "Chris.Brown", "Jay.Z", "Nas", "Bryston.Tiller", "Drake", "Travis.Scott")
plot <- allLL[allLL$singer %in% main.singers,]

# remove phrases like 'ha ha' and 'you you'
plot <- plot[!grepl("\\b(\\w+)\\s\\1\\b", plot$word, perl = TRUE),]

# split by singer, rank by log likelihood  * ngram length, keep the top 25
rankbysinger <- function(df, direction) {
    rank <- NULL
    singers <- unique(df$singer)
    for (j in singers) {
        subset <- df[df$singer == j,]
        subset$ngram <- sapply(subset$word, function(x) length(strsplit(as.character(x), " ")[[1]]))
        subset$rank <- subset$LL * subset$ngram
        subset <- subset[order( - subset$rank),]
        if (length(subset[, 1]) > 25) subset <- subset[1:25,]
        row.names(subset) <- NULL
        subset$rank2 <- as.numeric(row.names(subset))
        rank <- rbind(rank, subset)
    }
    return(rank)
}

ranked <- rankbysinger(plot)
ranked <- ranked[order( - ranked$singer.total),]
ranked$singer <- factor(ranked$singer, levels = c("DJ.Khaled", "Future", "Big.Sean", "Chris.Brown", "Jay.Z", "Nas", "Bryston.Tiller", "Drake", "Travis.Scott"))

# generate plot
djkhaled <- readPNG("../images/dj_khaled.png");
djkhaled <- rasterGrob(djkhaled, interpolate = TRUE)
drake <- readPNG("../images/drake.png");
drake <- rasterGrob(drake, interpolate = TRUE)
jayz <- readPNG("../images/jay_z.png");
jayz <- rasterGrob(jayz, interpolate = TRUE)
bigsean <- readPNG("../images/big_sean.png");
bigsean <- rasterGrob(bigsean, interpolate = TRUE)
nas <- readPNG("../images/nas.png");
nas <- rasterGrob(nas, interpolate = TRUE)
future <- readPNG("../images/future.png");
future <- rasterGrob(future, interpolate = TRUE)
brysontiller <- readPNG("../images/bryson_tiller.png");
brysontiller <- rasterGrob(brysontiller, interpolate = TRUE)
travisscott <- readPNG("../images/travis_scott.png");
travisscott <- rasterGrob(travisscott, interpolate = TRUE)
chrisbrown <- readPNG("../images/chris_brown.png");
chrisbrown <- rasterGrob(chrisbrown, interpolate = TRUE)


mycolors <- c("#3B6AA0", "#7AA9DD", "#0276FD", "#003F87", "#1D7CF2", "#344152", "#50729F", "#4973AB","#88ACE0")

ggplot(ranked, aes(singer, ((rank2 * -2) - 4))) +
     geom_point(color = "white") +
     geom_label(aes(label = ranked$word, fill = ranked$singer), color = 'white', fontface = 'bold', size = 5) +
     scale_fill_manual(values = mycolors) +
     theme_classic() +
     theme(legend.position = 1, plot.title = element_text(size = 18), axis.title.y = element_text(margin = margin(0, 30, 0, 0))) +
     labs(title = "Most characteristic words per person") +
     xlab("") + ylab("Ranking") +
     scale_y_continuous(limits = c(-15, -1), breaks = c(-24, -14, -4.5), labels = c("#10", "#5", "#1")) +
     annotation_custom(djkhaled, xmin = .5, xmax = 1.5, ymin = 0, ymax = -4) +
     annotation_custom(future, xmin = 1.5, xmax = 2.5, ymin = 0, ymax = -4) +
     annotation_custom(bigsean, xmin = 2.5, xmax = 3.5, ymin = 0, ymax = -4) +
     annotation_custom(chrisbrown, xmin = 3.5, xmax = 4.5, ymin = 0, ymax = -4) +
     annotation_custom(jayz, xmin = 4.5, xmax = 5.5, ymin = 0, ymax = -4) +
    annotation_custom(nas, xmin = 5.5, xmax = 6.5, ymin = 0, ymax = -4) +
    annotation_custom(brysontiller, xmin = 6.5, xmax = 7.5, ymin = 0, ymax = -4) +
     annotation_custom(drake, xmin = 7.5, xmax = 8.5, ymin = 0, ymax = -4) +
     annotation_custom(travisscott, xmin = 8.5, xmax = 9.5, ymin = 0, ymax = -4) 

dev.copy(png, 'plots/major_key_ranked_plot.png')
dev.off()
