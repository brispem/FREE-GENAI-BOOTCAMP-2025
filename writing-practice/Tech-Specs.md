# Technical Specs

## Initialization Step
When the app first initializes it needs to do the following:
Fetch from the GET localhost:5000/api/groups/:id/raw, this will return a collection of words in a JSON structure. It will have English words with their Spanish translations. We need to store this collection of words in memory.

## Page States
Page states describe the state the single-page application should behave from a user's perspective.

### Setup State
When a user first starts up the app:
- They will only see a button called "Generate Sentence"
- When they press the button, the app will generate a simple English sentence using the Sentence Generator LLM, and the state will move to Practice State

### Practice State
When a user is in the practice state:
- They will see an English sentence
- They will also see a text input field labeled "Translate to Spanish" under the English sentence
- They will see a button called "Submit for Review"
- When they press the "Submit for Review" button, their translation input will be passed to the Grading System and the state will transition to the Review State

### Review State
When a user is in the review state:
- The user will still see the English sentence
- The input field will be gone
- The user will now see a review of their translation from the Grading System:
  - The target Spanish translation
  - A grading response:
    - "Correct, well done!" if the translation matches the target
    - "That's not quite right – please try again." if the translation does not match
- There will be a button called "Next Question". When clicked:
  - It will generate a new English sentence
  - The app will transition back into Practice State

## Sentence Generator LLM Prompt
Generate a simple English sentence using the following word: {{word}}
The sentence should:
- Be in simple present or past tense
- Use basic vocabulary suitable for beginners, such as:
  - Simple objects (e.g., book, car, apple, cat)
  - Common verbs (e.g., to eat, to drink, to play, to go)
  - Basic time expressions (e.g., today, yesterday, tomorrow)

## Grading System
The Grading System will do the following:
- It will compare the user's Spanish translation with the target Spanish sentence
- It will grade the translation as follows:
  - If the translation is correct, it will return: "Correct, well done!"
  - If the translation is incorrect, it will return: "That's not quite right – please try again."
- It will then return this data to the frontend app
