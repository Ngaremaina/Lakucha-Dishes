from server import app, route
from werkzeug.serving import run_simple

if __name__ == '__main__':
    run_simple(
        hostname='localhost',
        port=5555,
        application=app
    )