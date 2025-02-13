@app.route('/api/import/words', methods=['POST'])
@cross_origin()
def import_words():
    data = request.get_json()
    cursor = app.db.cursor()
    try:
        for word in data['words']:
            cursor.execute("""
                INSERT INTO words (spanish, english, group_id) 
                VALUES (?, ?, ?)
            """, (word['spanish'], word['english'], word['group_id']))
        app.db.commit()
        return jsonify({'success': True})
    except Exception as e:
        app.db.rollback()
        return jsonify({'error': str(e)}), 500 