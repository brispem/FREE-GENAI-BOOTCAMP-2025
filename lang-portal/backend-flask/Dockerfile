FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements (use relative to build context root!)
COPY lang-portal/backend-flask/requirements.txt ./requirements.txt
COPY song-vocab/requirements.txt ./song-vocab/requirements.txt

# Install all requirements
RUN pip install --upgrade pip wheel setuptools
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r song-vocab/requirements.txt

# Copy backend code
COPY lang-portal/backend-flask ./lang-portal/backend-flask

# Copy song-vocab module
COPY song-vocab ./song-vocab

# Set env vars
ENV FLASK_APP=lang-portal/backend-flask/run_server.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1
ENV HOST=0.0.0.0
ENV PORT=5174

# Expose the port
EXPOSE 5174

# Run the app
WORKDIR /app/lang-portal/backend-flask
CMD ["python", "run_server.py"]
