import sqlite3

def seed_vocabulary():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Core Verbs (group_id = 1)
    core_verbs = [
        ("ser", None, "to be (permanent)", "verb", None, "er", False, None, 1),
        ("estar", None, "to be (temporary)", "verb", None, "ar", False, None, 1),
        ("tener", None, "to have", "verb", None, "er", True, None, 1),
        ("hacer", None, "to do/make", "verb", None, "er", True, None, 1),
        ("ir", None, "to go", "verb", None, "ir", True, None, 1),
        ("venir", None, "to come", "verb", None, "ir", True, None, 1),
        ("decir", None, "to say/tell", "verb", None, "ir", True, None, 1),
        ("hablar", None, "to speak", "verb", None, "ar", False, None, 1),
        ("comer", None, "to eat", "verb", None, "er", False, None, 1),
        ("beber", None, "to drink", "verb", None, "er", False, None, 1)
    ]
    
    # Common Phrases (group_id = 2)
    common_phrases = [
        ("¿Cómo estás?", None, "How are you?", "phrase", None, None, False, None, 2),
        ("Buenos días", None, "Good morning", "phrase", None, None, False, None, 2),
        ("Buenas tardes", None, "Good afternoon", "phrase", None, None, False, None, 2),
        ("Buenas noches", None, "Good night", "phrase", None, None, False, None, 2),
        ("Por favor", None, "Please", "phrase", None, None, False, None, 2),
        ("Gracias", None, "Thank you", "phrase", None, None, False, None, 2),
        ("De nada", None, "You're welcome", "phrase", None, None, False, None, 2),
        ("Mucho gusto", None, "Nice to meet you", "phrase", None, None, False, None, 2),
        ("¿Qué tal?", None, "How's it going?", "phrase", None, None, False, None, 2),
        ("Hasta luego", None, "See you later", "phrase", None, None, False, None, 2)
    ]
    
    # Travel Vocabulary (group_id = 3)
    travel_vocabulary = [
        ("el hotel", None, "hotel", "noun", "masculine", None, False, None, 3),
        ("el aeropuerto", None, "airport", "noun", "masculine", None, False, None, 3),
        ("el tren", None, "train", "noun", "masculine", None, False, None, 3),
        ("el autobús", None, "bus", "noun", "masculine", None, False, None, 3),
        ("el taxi", None, "taxi", "noun", "masculine", None, False, None, 3),
        ("el restaurante", None, "restaurant", "noun", "masculine", None, False, None, 3),
        ("la playa", None, "beach", "noun", "feminine", None, False, None, 3),
        ("el museo", None, "museum", "noun", "masculine", None, False, None, 3),
        ("el mapa", None, "map", "noun", "masculine", None, False, None, 3),
        ("la maleta", None, "suitcase", "noun", "feminine", None, False, None, 3)
    ]
    
    try:
        # Clear existing vocabulary
        cursor.execute('DELETE FROM vocabulary')
        
        # Insert vocabulary for each group
        cursor.executemany('''
            INSERT INTO vocabulary (
                spanish, pronunciation, english, type, gender,
                conjugation_group, is_irregular, notes, group_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', core_verbs + common_phrases + travel_vocabulary)
        
        conn.commit()
        print("Vocabulary seeded successfully")
    except sqlite3.Error as e:
        print(f"Error seeding vocabulary: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_vocabulary() 