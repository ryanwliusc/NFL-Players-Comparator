from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/prospect", methods=["POST"])
def prospect():
    name = request.form['playerName']
    college = request.form['college']
    position = request.form['position']
    ras = request.form['ras']

    #select from db where position matches

    #for each element calculate distance and return 5 closest think .1 * college + .9 * ras
    return jsonify({"name": name, "college": college, "position": position, "ras": ras, })

@app.route("/similar")
def similar():
    return {"members": ["Member1", "Member2", "Member3"]}

if __name__ == "__main__":
    app.run(debug=True)