import os
from typing import Dict, List, Optional
import json
import chromadb
from chromadb.config import Settings
from azure.ai.inference import EmbeddingsClient
from azure.core.credentials import AzureKeyCredential

class QuestionVectorStore:
    def __init__(self):
        """Initialize ChromaDB client and Azure AI Inference"""
        self.client = chromadb.Client(Settings(
            persist_directory="static/vectordb",
            is_persistent=True
        ))
        
        # Initialize Azure AI Inference for embeddings
        self.embedding_client = EmbeddingsClient(
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            credential=AzureKeyCredential(os.getenv("AZURE_OPENAI_API_KEY"))
        )
        
        # Get or create collection with proper handling
        try:
            # Try to get existing collection
            self.transcript_collection = self.client.get_collection(name="transcripts")
            print("Using existing transcripts collection")
        except Exception:
            # Collection doesn't exist, create new one
            try:
                self.transcript_collection = self.client.create_collection(
                    name="transcripts",
                    metadata={"hnsw:space": "cosine", "dimension": 1536}  # text-embedding-ada-002 dimension
                )
                print("Created new transcripts collection")
            except Exception as e:
                print(f"Error creating collection: {str(e)}")
                # Ensure we have a collection one way or another
                self.transcript_collection = self.client.get_collection(name="transcripts")

    def add_transcript(self, text: str, metadata: Dict, video_id: str) -> bool:
        """Add transcript to vector store"""
        try:
            # Generate embedding using Azure AI Inference
            response = self.embedding_client.create(
                model="text-embedding-ada-002",
                input=text
            )
            embedding = response.data[0].embedding
            
            # Add to collection
            self.transcript_collection.add(
                embeddings=[embedding],
                documents=[text],
                metadatas=[metadata],
                ids=[video_id]
            )
            print(f"Successfully added transcript for video {video_id}")
            return True
        except Exception as e:
            print(f"Error adding transcript: {str(e)}")
            return False

    def search_similar_content(self, query: str, n_results: int = 2) -> Optional[Dict]:
        """Search for similar content using Azure embeddings"""
        try:
            # Check if collection has any documents
            if len(self.transcript_collection.get()['ids']) == 0:
                print("No content in vector store yet")
                return None
                
            # Generate embedding using Azure AI Inference
            response = self.embedding_client.embed(
                model="text-embedding-ada-002",
                input=query
            )
            query_embedding = response.data[0].embedding
            
            # Search using embeddings
            results = self.transcript_collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                include=["documents", "metadatas"]
            )
            return results
        except Exception as e:
            print(f"Error searching content: {str(e)}")
            return None

    def _fallback_store(self, text: str, metadata: Dict, video_id: str):
        """Fallback storage method using JSON"""
        storage_file = os.path.join("static/data", "transcripts.json")
        try:
            if os.path.exists(storage_file):
                with open(storage_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            else:
                data = {}
            
            data[video_id] = {
                'text': text,
                'metadata': metadata
            }
            
            with open(storage_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error in fallback storage: {str(e)}")

    def _fallback_search(self, query: str, n_results: int = 2) -> Optional[Dict]:
        """Fallback search method using simple text matching"""
        storage_file = os.path.join("static/data", "transcripts.json")
        try:
            if not os.path.exists(storage_file):
                return None
                
            with open(storage_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            matching_docs = []
            query = query.lower()
            
            for video_id, content in data.items():
                if query in content['text'].lower():
                    matching_docs.append(content['text'])
            
            if matching_docs:
                return {
                    'documents': [matching_docs[:n_results]],
                    'metadatas': [[]]
                }
            return None
        except Exception as e:
            print(f"Error in fallback search: {str(e)}")
            return None

    def add_question(self, question: Dict, topic: str):
        """Add generated question to vector store"""
        self.question_collection.add(
            documents=[str(question)],
            metadatas=[{"topic": topic}],
            ids=[f"q_{len(self.question_collection.get()['ids'])}"]
        )

    def search_similar_questions(self, topic: str, n_results: int = 3) -> List[Dict]:
        """Search for similar questions by topic"""
        results = self.question_collection.query(
            query_texts=[topic],
            n_results=n_results
        )
        return results

    def add_questions(self, section_num: int, questions: List[Dict], video_id: str):
        """Add questions to the vector store"""
        if section_num not in [2, 3]:
            raise ValueError("Only sections 2 and 3 are currently supported")
            
        collection = self.client.get_or_create_collection(
            name=f"section{section_num}_questions",
            embedding_function=self.embedding_function,
            metadata={"description": f"DELE listening comprehension questions - Section {section_num}"}
        )
        
        ids = []
        documents = []
        metadatas = []
        
        for idx, question in enumerate(questions):
            # Create a unique ID for each question
            question_id = f"{video_id}_{section_num}_{idx}"
            ids.append(question_id)
            
            # Store the full question structure as metadata
            metadatas.append({
                "video_id": video_id,
                "section": section_num,
                "question_index": idx,
                "full_structure": json.dumps(question)
            })
            
            # Create a searchable document from the question content
            if section_num == 2:
                document = f"""
                Situation: {question['Introduction']}
                Dialogue: {question['Conversation']}
                Question: {question['Question']}
                """
            else:  # section 3
                document = f"""
                Situation: {question['Situation']}
                Question: {question['Question']}
                """
            documents.append(document)
        
        # Add to collection
        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

    def search_similar_questions_in_collection(
        self, 
        section_num: int, 
        query: str, 
        n_results: int = 5
    ) -> List[Dict]:
        """Search for similar questions in a specific collection"""
        if section_num not in [2, 3]:
            raise ValueError("Only sections 2 and 3 are currently supported")
            
        collection = self.client.get_or_create_collection(
            name=f"section{section_num}_questions",
            embedding_function=self.embedding_function
        )
        
        results = collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Convert results to more usable format
        questions = []
        for idx, metadata in enumerate(results['metadatas'][0]):
            question_data = json.loads(metadata['full_structure'])
            question_data['similarity_score'] = results['distances'][0][idx]
            questions.append(question_data)
            
        return questions

    def get_question_by_id(self, section_num: int, question_id: str) -> Optional[Dict]:
        """Retrieve a specific question by its ID"""
        if section_num not in [2, 3]:
            raise ValueError("Only sections 2 and 3 are currently supported")
            
        collection = self.client.get_or_create_collection(
            name=f"section{section_num}_questions",
            embedding_function=self.embedding_function
        )
        
        result = collection.get(
            ids=[question_id],
            include=['metadatas']
        )
        
        if result['metadatas']:
            return json.loads(result['metadatas'][0]['full_structure'])
        return None

    def parse_questions_from_file(self, filename: str) -> List[Dict]:
        """Parse questions from a structured text file"""
        questions = []
        current_question = {}
        
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                
                if line.startswith('<question>'):
                    current_question = {}
                elif line.startswith('Introduction:'):
                    i += 1
                    if i < len(lines):
                        current_question['Introduction'] = lines[i].strip()
                elif line.startswith('Conversation:'):
                    i += 1
                    if i < len(lines):
                        current_question['Conversation'] = lines[i].strip()
                elif line.startswith('Situation:'):
                    i += 1
                    if i < len(lines):
                        current_question['Situation'] = lines[i].strip()
                elif line.startswith('Question:'):
                    i += 1
                    if i < len(lines):
                        current_question['Question'] = lines[i].strip()
                elif line.startswith('Options:'):
                    options = []
                    for _ in range(4):
                        i += 1
                        if i < len(lines):
                            option = lines[i].strip()
                            if option.startswith('1.') or option.startswith('2.') or option.startswith('3.') or option.startswith('4.'):
                                options.append(option[2:].strip())
                    current_question['Options'] = options
                elif line.startswith('</question>'):
                    if current_question:
                        questions.append(current_question)
                        current_question = {}
                i += 1
            return questions
        except Exception as e:
            print(f"Error parsing questions from {filename}: {str(e)}")
            return []

    def index_questions_file(self, filename: str, section_num: int):
        """Index all questions from a file into the vector store"""
        # Extract video ID from filename
        video_id = os.path.basename(filename).split('_section')[0]
        
        # Parse questions from file
        questions = self.parse_questions_from_file(filename)
        
        # Add to vector store
        if questions:
            self.add_questions(section_num, questions, video_id)
            print(f"Indexed {len(questions)} questions from {filename}")

    def view_stored_content(self):
        """View all stored content in the ChromaDB collection"""
        try:
            # Get all content from the collection
            content = self.transcript_collection.get()
            
            if content:
                print("\nStored Content in ChromaDB:")
                print(f"Total documents: {len(content['ids'])}\n")
                
                for i, (doc_id, doc, metadata) in enumerate(zip(content['ids'], content['documents'], content['metadatas'])):
                    print(f"\nDocument {i+1}:")
                    print(f"ID: {doc_id}")
                    print(f"Metadata: {metadata}")
                    print(f"Text Preview: {doc[:200]}...")  # Show first 200 characters
                    print("-" * 80)
                
                return content
            else:
                print("No content found in ChromaDB")
                return None
            
        except Exception as e:
            print(f"Error viewing content: {str(e)}")
            return None

if __name__ == "__main__":
    # Example usage
    store = QuestionVectorStore()
    
    # Index questions from files
    question_files = [
        ("backend/data/questions/sY7L5cfCWno_section2.txt", 2),
        ("backend/data/questions/sY7L5cfCWno_section3.txt", 3)
    ]
    
    for filename, section_num in question_files:
        if os.path.exists(filename):
            store.index_questions_file(filename, section_num)
    
    # Search for similar questions
    similar = store.search_similar_questions_in_collection(2, "誕生日について質問", n_results=1)
