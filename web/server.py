import http.server
import os
import sys

port = int(os.environ.get('PORT', 8765))
directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(directory)

handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(('', port), handler) as httpd:
    print(f'Serving on port {port}')
    httpd.serve_forever()
