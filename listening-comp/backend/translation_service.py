import os
import requests
import uuid
from typing import Optional

class TranslationService:
    def __init__(self):
        """Initialize Azure Translator service"""
        self.key = os.getenv("TRANSLATOR_TEXT_RESOURCE_KEY")
        self.region = os.getenv("TRANSLATOR_TEXT_REGION")
        self.endpoint = os.getenv("AZURE_COGNITIVE_SERVICES_ENDPOINT", "https://api.cognitive.microsofttranslator.com/")
        
        if not all([self.key, self.region, self.endpoint]):
            raise Exception("Missing Azure Translator credentials in environment variables")

    def translate(self, text: str, from_lang: str = 'en', to_lang: str = 'es') -> Optional[str]:
        """Translate text from one language to another"""
        try:
            path = '/translator/text/v3.0/translate'  # Updated path for Azure AI Services
            constructed_url = self.endpoint + path
            
            params = {
                'api-version': '3.0',
                'from': from_lang,
                'to': to_lang
            }

            headers = {
                'Ocp-Apim-Subscription-Key': self.key,
                'Ocp-Apim-Subscription-Region': self.region,
                'Content-type': 'application/json',
                'X-ClientTraceId': str(uuid.uuid4())
            }

            body = [{
                'text': text
            }]

            print(f"Making request to: {constructed_url}")
            print(f"Headers: {headers}")
            print(f"Body: {body}")

            response = requests.post(constructed_url, params=params, headers=headers, json=body)
            print(f"Response status: {response.status_code}")
            print(f"Response text: {response.text}")
            
            response.raise_for_status()  # Raise exception for bad status codes
            
            translations = response.json()
            if translations and len(translations) > 0:
                return translations[0]['translations'][0]['text']
            return None
            
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return None 