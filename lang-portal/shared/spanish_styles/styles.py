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

        /* Global Streamlit Overrides */
        .stApp {
            font-family: 'Inter', sans-serif !important;
            background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary)) !important;
        }

        /* Main container styling */
        .main .block-container {
            padding-top: 2rem !important;
            max-width: 1200px !important;
        }

        /* Headers */
        h1 {
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            background: linear-gradient(90deg, var(--spanish-red), var(--spanish-yellow)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            text-align: center !important;
            padding: 1rem 0 !important;
        }

        /* Buttons */
        .stButton > button {
            background: linear-gradient(90deg, var(--spanish-red), var(--spanish-yellow)) !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            padding: 0.75rem 1.5rem !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
            width: 100% !important;
        }

        .stButton > button:hover {
            opacity: 0.9 !important;
            transform: translateY(-1px) !important;
        }

        /* Cards */
        .card {
            background: white !important;
            border-radius: 0.5rem !important;
            border: 1px solid rgba(170, 21, 27, 0.1) !important;
            padding: 2rem !important;
            margin: 1rem 0 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        /* Text inputs and textareas */
        .stTextInput > div > div {
            border-radius: 0.5rem !important;
            border: 1px solid rgba(170, 21, 27, 0.2) !important;
        }

        /* Sidebar */
        .css-1d391kg {
            background: var(--bg-secondary) !important;
        }

        /* Custom classes */
        .hero-text {
            color: var(--text-secondary) !important;
            font-size: 1.2rem !important;
            text-align: center !important;
            margin-bottom: 2rem !important;
        }

        .section-title {
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            color: var(--text-primary) !important;
            margin: 1.5rem 0 !important;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --text-primary: #ffffff;
                --text-secondary: #a0aec0;
                --bg-primary: #1a202c;
                --bg-secondary: #2d3748;
            }

            .card {
                background: var(--bg-primary) !important;
            }
        }
    </style>
    """ 