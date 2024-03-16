import os
import http.server
import socketserver

PORT = 9000
ROOT_DIR = '.'  # 指定目录

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 每次GET请求都重新读取文件或目录
        file_path = os.path.join(ROOT_DIR, self.path[1:])
        if os.path.exists(file_path):
            if os.path.isdir(file_path):
                # 如果是文件夹，返回文件列表
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'<html><head><title>Directory Listing</title></head><body>')
                for item in os.listdir(file_path):
                    self.wfile.write(f'<a href="{self.path}/{item}">{item}</a><br>'.encode())
                self.wfile.write(b'</body></html>')
            else:
                # 如果是文件，返回文件内容
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
        else:
            # 如果文件或目录不存在，则返回404错误
            self.send_error(404)

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
