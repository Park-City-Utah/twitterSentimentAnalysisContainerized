import tweepy
import os as os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from textblob import TextBlob
from keys import *

# Authentical with tweepy OAuth and Twitter API
auth = tweepy.OAuthHandler(apiKey, apiSecret)
auth.set_access_token(accessToken, accessTokenSecret)
api = tweepy.API(auth)


def remove_all_values(myList, valueForRemoval):
    while(valueForRemoval in myList):
        myList.remove(valueForRemoval)
    return myList


def main():
    # Get user input for Sentiment analysis text
    keyword = input("Enter text for Twitter Sentiment Analaysis: ")

    # Pull Tweets on keyword
    tweets = api.search(keyword, count=1000)

    polarity = []
    subjectivity = []

    # Perform analysis and create lists for manipulation (polarity/subjectivity)
    for tweet in tweets:
        analysis = TextBlob(tweet.text)

        # Create list of polarity & subjectivity for mean
        polarity.append(analysis.sentiment.polarity)
        subjectivity.append(analysis.sentiment.subjectivity)

    # Remove 0.0 (neutral) polarity & subjectivity
    polarity = remove_all_values(polarity, 0.0)
    subjectivity = remove_all_values(subjectivity, 0.0)

    # Output
    print("Sentiment average Polarity: " + str(np.mean(polarity)))
    print("Sentiment average Subjectivity: " + str(np.mean(subjectivity)))

    # Generate histograms
    polarityDf = pd.DataFrame(
        polarity, columns=["Polarity - '" + keyword + "'"])
    subjectivityDf = pd.DataFrame(
        subjectivity, columns=["Subjectivity - '" + keyword + "'"])

    # Sentiment (both polarity and subjectivity) in single DataFrame - scatter plot
    #sentimentDF = pd.DataFrame({"Polarity": polarity, "Subjectivity": subjectivity})
    #sentimentDF.plot.scatter(x="Polarity", y="Subjectivity", color="blue")

    polarityDf.hist(color="blue")
    plt.savefig('polarity_' + keyword + '.pdf')
    subjectivityDf.hist(color="orange")
    plt.savefig('subjectivity_' + keyword + '.pdf')

    file1 = os.getcwd() + 'polarity_' + keyword + '.pdf'
    file2 = os.getcwd() + 'subjectivity_' + keyword + '.pdf'

    # File names for return data
    files = [file1, file2]

    #showHistograms = input("Show Historgrams? Y or N ")
    # if(showHistograms.lower() == ("y" or "yes")):
    # plt.show()
    # else:
    # exit()

    return files


main()
