library(wordcloud)

setwd("E:/data_viz/major_vis/data_files")
count.all <- read.csv("major_key_tdm_all.csv", stringsAsFactors = FALSE)

findFreq <- function(df) {
    df$total <- rowSums(df[, 1:13])
    freqs <- df[, 14:15]
    freqs <- freqs[order( - freqs$total),]
    return(freqs)
}
freq1 <- findFreq(count.all)
cloud <- wordcloud(freq1$word, freq1$total, scale = c(2.5, 0.5), min.freq = 5, max.words = 250, random.order = FALSE)

dev.copy(png,'images/major_wordcloud.png')
dev.off()