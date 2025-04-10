FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8081

# Set environment variables
ENV PORT=8081

# Run the application
CMD ["streamlit", "run", "app.py", "--server.port=8081", "--server.address=0.0.0.0"] 