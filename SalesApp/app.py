#import libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request)

# # # # # # #
# FLASK SETUP
# # # # # # #
app = Flask(__name__)

# # # # # # # # #
# DATABASE SETUP
# # # # # # # # #

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///salesdb.sqlite"

# remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create database variable
db = SQLAlchemy(app)

# import function
from .forecast import get_region, get_mlregion, get_mlcategory

# create route that renders home page
@app.route("/")
def index():
     
    return render_template("index.html")

# create route that renders data page
@app.route("/data")
def data():
     
    return render_template("data.html")

# Create api route that returns raw sales data
@app.route("/api/data", methods=["GET"])
def api():
      
    region = request.args.get("region", type=str)
    
    return jsonify(get_region(region))

# Create api route for ml data by REGION
@app.route("/api/region", methods=["GET"])
def apiml():
      
    region = request.args.get("region", type=str)
    
    return jsonify(get_mlregion(region))

# Create api route for ml data by CATEGORY
@app.route("/api/cat", methods=["GET"])
def apimlc():
      
    category = request.args.get("category", type=str)
    
    return jsonify(get_mlcategory(category))
  
        
if __name__ == "__main__":
    app.run(debug=True)