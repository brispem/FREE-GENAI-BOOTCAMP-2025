from app import create_app

app = create_app()

if __name__ == '__main__':
    # Explicitly bind to 0.0.0.0 to accept connections from outside the container
    app.run(host='0.0.0.0', debug=True, port=5174) 