from flask import Flask, Blueprint, render_template, send_from_directory, request
import os
from flask_cors import CORS
import json
import base64
app = Blueprint("annapurna", __name__)
CORS(app)

BASE_FS = "/DATA/L1/"
BASE_LIC = "/DATA/License/"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/license/<licno>')
def license(licno):
    path = os.path.join(BASE_LIC, licno + ".json")
    return json.load(open(path))

@app.route('/<user>/wopi/files/<fileb64>/contents', methods=["GET", "POST"])
@app.route('/<user>/wopi/files/<fileb64>/ws/contents', methods=["GET", "POST"])
def wopi_files__contents(user, fileb64):
    file = base64.urlsafe_b64decode(fileb64).decode("utf-8")
    path = os.path.join(BASE_FS, user + "/" + file)
    if request.method == "POST":
        with open(path, "wb") as f:
            f.write(request.get_data())
    return send_from_directory(BASE_FS, user + "/" + file)

@app.route('/<user>/wopi/files/<fileb64>/ws', methods=["GET"])
@app.route('/<user>/wopi/files/<fileb64>', methods=["GET"])
def wopi_files(user, fileb64):
    file = base64.urlsafe_b64decode(fileb64).decode("utf-8")
    path = os.path.join(BASE_FS, user + "/" + file)
    return {"BaseFileName": file.split("/")[-1], "Size": os.stat(path).st_size}


@app.route('/<user>/fs', methods=["POST", "GET"])
def filesystem(user):
    command = request.args["cmd"]
    file = request.args.get("file")
    if command == "download":
        return send_from_directory(BASE_FS, user + "/" + file)
    elif command == "list":
        path = os.path.join(BASE_FS, user + "/" + file)
        f = [{
                "name": file,
                "isFolder": os.path.isdir(os.path.join(path, file))
            } for file in os.listdir(path)]
        return f
    elif command == "upload":
        path = os.path.join(BASE_FS, user + "/" + file)
        with open(path, "wb") as f:
            f.write(request.get_data())
        return "0;OK"
    elif command == "mkdir":
        path = os.path.join(BASE_FS, user + "/" + file)
        os.mkdir(path)
        return "0;OK"
    elif command == "rmfile":
        path = os.path.join(BASE_FS, user + "/" + file)
        os.remove(path)
        return "0;OK"
    elif command == "rmdir":
        path = os.path.join(BASE_FS, user + "/" + file)
        try:
            os.rmdir(path)
            return "0;OK"
        except Exception as e:
            return "24;Not empty"
if __name__ == '__main__':
    run = Flask(__name__)
    run.register_blueprint(app)
    app.run(host='0.0.0.0', port=8080, debug=False)
 
