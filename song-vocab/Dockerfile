FROM python:3.11-slim

WORKDIR /song-vocab

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application
COPY . .

# Expose the port
EXPOSE 8000

# Set environment variables
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV SERP_API_KEY=${SERP_API_KEY}

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 