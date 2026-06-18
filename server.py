"""
Balangkas – tiny dev server
Run: python server.py
"""
import os, json, urllib.request, urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# ── load .env ──
env = Path(".env")
if env.exists():
    for line in env.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

GROQ_KEY = os.environ.get("GROQ_API_KEY", "")
PORT = int(os.environ.get("PORT", 8000))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} {fmt % args}")

    def send_json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            page = Path("index.html").read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", len(page))
            self.end_headers()
            self.wfile.write(page)
        else:
            self.send_json(404, {"error": "not found"})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/generate":
            return self.send_json(404, {"error": "not found"})

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))

        if not GROQ_KEY:
            return self.send_json(500, {"error": "GROQ_API_KEY not set in .env"})

        payload = json.dumps({
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": body["prompt"]}],
            "response_format": {"type": "json_object"},
            "temperature": 0.8,
            "max_tokens": 1500,
        }).encode()

        req = urllib.request.Request(
            "https://api.groq.com/openai/v1/chat/completions",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GROQ_KEY}",
            },
        )

        try:
            with urllib.request.urlopen(req) as r:
                data = json.loads(r.read())
            text = data["choices"][0]["message"]["content"]
            self.send_json(200, json.loads(text))
        except urllib.error.HTTPError as e:
            err = json.loads(e.read()).get("error", {})
            self.send_json(e.code, {"error": err.get("message", str(e))})
        except Exception as e:
            self.send_json(500, {"error": str(e)})


if __name__ == "__main__":
    print(f"\n  Balangkas running → http://localhost:{PORT}\n")
    HTTPServer(("", PORT), Handler).serve_forever()
