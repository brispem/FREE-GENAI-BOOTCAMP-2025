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
        }

        /* Headers */
        h1 {
            background: linear-gradient(90deg, var(--spanish-red), var(--spanish-yellow)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            font-weight: 700 !important;
        }

        /* Buttons */
        .stButton button {
            background: linear-gradient(90deg, var(--spanish-red), var(--spanish-yellow)) !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            padding: 0.5rem 1rem !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }

        .stButton button:hover {
            opacity: 0.9 !important;
            transform: translateY(-1px) !important;
        }

        /* Cards */
        .card {
            background: white !important;
            border-radius: 0.5rem !important;
            border: 1px solid rgba(170, 21, 27, 0.1) !important;
            padding: 1.5rem !important;
            margin: 1rem 0 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        /* Text inputs */
        .stTextInput input {
            border-radius: 0.5rem !important;
            border: 1px solid rgba(170, 21, 27, 0.2) !important;
        }

        /* Sidebar */
        .css-1d391kg {
            background: var(--bg-secondary) !important;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --text-primary: #ffffff;
                --text-secondary: #a0aec0;
                --bg-primary: #1a202c;
                --bg-secondary: #2d3748;
            }
        }
    </style>
    """ 