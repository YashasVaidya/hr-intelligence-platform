from textblob import TextBlob

class SentimentModel:
    def analyze_sentiments(self, communication_data):
        sentiments = []
        for entry in communication_data:
            blob = TextBlob(entry['message'])
            sentiments.append({
                "timestamp": entry['timestamp'],
                "polarity": blob.sentiment.polarity,
                "subjectivity": blob.sentiment.subjectivity
            })
        return sentiments

    def detect_trends(self, sentiments):
        # Implement trend detection logic
        # Placeholder for simplicity
        return {"trend": "Increasing Positive Sentiment"} 