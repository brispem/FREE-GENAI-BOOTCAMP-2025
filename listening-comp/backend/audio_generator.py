import os
import azure.cognitiveservices.speech as speechsdk
from typing import Optional

class AudioGenerator:
    def __init__(self):
        """Initialize Azure Speech Service"""
        # Use existing Azure Speech key and region
        self.speech_config = speechsdk.SpeechConfig(
            subscription=os.getenv("AZURE_SPEECH_KEY"),  # Use existing env var
            region=os.getenv("AZURE_SPEECH_REGION")     # Use existing env var
        )
        # Set Spanish voice
        self.speech_config.speech_synthesis_voice_name = "es-ES-ElviraNeural"
        
        # Create audio directory
        self.audio_dir = os.path.join("static", "audio")
        os.makedirs(self.audio_dir, exist_ok=True)

    def generate_audio(self, question: dict) -> Optional[str]:
        """Generate audio for a question"""
        try:
            # Create unique filename
            audio_file = os.path.join(self.audio_dir, f"question_{hash(str(question))}.wav")
            
            # Configure audio output
            audio_config = speechsdk.audio.AudioOutputConfig(filename=audio_file)
            
            # Create synthesizer
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=self.speech_config, 
                audio_config=audio_config
            )
            
            # Combine text to synthesize
            text = f"{question['Introducción']}\n\n{question['Conversación']}"
            print(f"Generating audio for text: {text[:100]}...")  # Debug log
            
            # Generate audio
            result = synthesizer.speak_text_async(text).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                print(f"Audio saved to: {audio_file}")
                return audio_file
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = speechsdk.CancellationDetails.from_result(result)
                print(f"Speech synthesis canceled: {cancellation_details.reason}")
                print(f"Error details: {cancellation_details.error_details}")
                return None
            else:
                print(f"Error synthesizing audio: {result.reason}")
                return None
                
        except Exception as e:
            print(f"Error generating audio: {str(e)}")
            print(f"Error type: {type(e)}")
            return None
