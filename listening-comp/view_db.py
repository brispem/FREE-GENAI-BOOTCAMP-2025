from backend.vector_store import QuestionVectorStore
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def main():
    # Initialize and view content
    store = QuestionVectorStore()
    store.view_stored_content()

if __name__ == "__main__":
    main() 