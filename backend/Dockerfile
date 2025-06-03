# Use official Python image
FROM python:3.13-alpine

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port and run app
EXPOSE 5000
CMD ["python", "app.py"]
