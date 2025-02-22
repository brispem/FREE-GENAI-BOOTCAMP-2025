from get_transcript import TranscriptFetcher

def test_transcript():
    url = "https://www.youtube.com/watch?v=your_test_video_id"
    try:
        fetcher = TranscriptFetcher()
        transcript = fetcher.get_transcript(url)
        print("Successfully fetched transcript:")
        print(transcript[:500] + "...")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_transcript() 