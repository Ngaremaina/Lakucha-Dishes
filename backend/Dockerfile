# Use official Python image
FROM python:3.13-alpine

RUN apk update && \
    apk add --no-cache g++ gcc musl-dev
    
# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose the port your app runs on (e.g. 8000 for Django)
EXPOSE 8000

# Start the app (modify this based on your framework)
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:8000"]
