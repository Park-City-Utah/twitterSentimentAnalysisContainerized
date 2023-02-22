import sys
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
    keyword = sys.argv[1]
    # Pull Tweets on keyword
    tweets = api.search(keyword, count=1000)
    polarity = []

    # Perform analysis and create lists for manipulation (polarity/subjectivity)
    for tweet in tweets:
        analysis = TextBlob(tweet.text)

        # Create list of polarity & subjectivity for mean
        polarity.append(analysis.sentiment.polarity)
        # subjectivity.append(analysis.sentiment.subjectivity)

    # Remove 0.0 (neutral) polarity & subjectivity
    polarity = remove_all_values(polarity, 0.0)

    # Generate polarity istogram
    polarityDf = pd.DataFrame(
        polarity, columns=["Polarity - '" + keyword + "'"])
    polarityDf.hist(color="orange")
    plt.savefig('./assets/polarity_' + keyword + '.pdf')

    file = 'polarity_' + keyword + '.pdf'

    print(file)


main()
