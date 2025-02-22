def get_shared_styles():
    return """
    <style>
        /* Custom fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        /* Root variables to match portal theme */
        :root {
            --spanish-red: #AA151B;
            --spanish-yellow: #F1BF00;
            --text-primary: #1a1a1a;
            --text-secondary: #666666;
            --bg-primary: #ffffff;
            --bg-secondary: #f9fafb;
        }

        /* Global styles */
        .stApp {
            font-family: 'Inter', sans-serif !important;
            background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary)) !important;
        }

        /* ... rest of your styles ... */
    </style>
    """ 