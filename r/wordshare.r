library(ggplot2)
library(RColorBrewer)

getwd()
setwd("E:/data_viz/major_vis/data_files")
count.all <- read.csv("major_key_tdm_all.csv", stringsAsFactors = FALSE)

totals <- rbind(names(count.all[, 1:13]), colSums(count.all[, 1:13]))
total <- data.frame(t(totals))

colnames(total) <- c("speaker", "total")
total$total <- as.numeric(as.character(total$total))
small <- total[total$total < 1200 | total$speaker == "All.others",]
row <- data.frame(speaker = "All.others", total = sum(small$total))
total <- rbind(total[total$total >= 10 & total$speaker != "All.others",], row)

# get the average words per episode, assuming that the main speakers are in each
total$per.Track <- round(as.numeric(as.character(total$total)) / 14, 2)
total <- total[order( - total$per.Track),]

total$share <- round(total$per.Track / sum(total$per.Track), 3) * 100

# make the plot
total$speaker <- factor(total$speaker, levels = c("All.others", "Future", "Big.Sean", "Chris.Brown", "Jay.Z", "Nas", "Drake", "Bryston.Tiller", "Jeezy", "DJ.Khaled", "J.Cole", "Jadakiss", "Kendrick.Lamar", "Rick.Ross"))
total$group <- " "
mycolors <- c("#3B6AA0", "#7AA9DD", "#0276FD", "#003F87", "#1D7CF2", "#344152", "#50729F", "#4973AB","#88ACE0","#5993E5","#3A66A7","#3579DC", "#5190ED", "#42526C" )
wordshare <- ggplot(total, aes(group, share)) +
     geom_bar(stat = "identity", aes(fill = speaker)) +
     theme_classic() + labs(title = "Future sings the most") +
     ylab("% of words sung by artist") +
     scale_fill_manual(values = mycolors[1:14]) + xlab("") +
     theme(legend.position = 1, plot.title = element_text(size = 18),
           axis.title.y = element_text(margin = margin(0, 10, 0, 0)),
           axis.title = element_text(size = 16)) +
     geom_text(aes(x = group, y = cumsum(share) - share *0.5,
                   label = paste(speaker, ": ", share, "%", sep = "")),
               color = "white", size = 2.7)

wordshare
dev.copy(png, 'images/major_keyy_wordshare_plot.png')

dev.off()