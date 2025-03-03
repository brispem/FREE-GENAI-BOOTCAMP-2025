from pathlib import Path
import json

# Define the paths
lyrics_path = Path("outputs/lyrics/luis-fonsi-despacito.txt")
vocab_path = Path("outputs/vocabulary/luis-fonsi-despacito.json")

# Check if the files exist
print(f"Lyrics file exists: {lyrics_path.exists()}")
print(f"Vocabulary file exists: {vocab_path.exists()}")

# Print the content of the lyrics file
if lyrics_path.exists():
    lyrics_content = lyrics_path.read_text(encoding='utf-8')
    print(f"\nLyrics file content ({len(lyrics_content)} characters):")
    print("-" * 40)
    print(lyrics_content[:500] + "..." if len(lyrics_content) > 500 else lyrics_content)
    print("-" * 40)
else:
    print("\nLyrics file does not exist.")

# Print the content of the vocabulary file
if vocab_path.exists():
    try:
        vocab_content = vocab_path.read_text(encoding='utf-8')
        vocab_data = json.loads(vocab_content)
        print(f"\nVocabulary file content ({len(vocab_data)} items):")
        print("-" * 40)
        for i, item in enumerate(vocab_data[:5]):  # Print first 5 items
            print(f"{i+1}. {item}")
        if len(vocab_data) > 5:
            print(f"... and {len(vocab_data) - 5} more items")
        print("-" * 40)
    except json.JSONDecodeError:
        print("\nVocabulary file is not valid JSON.")
        print(f"Raw content: {vocab_content}")
else:
    print("\nVocabulary file does not exist.") 