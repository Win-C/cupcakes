"""Flask app for Cupcakes"""

from flask import Flask, jsonify, request
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///cupcakes"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connect_db(app)
db.create_all()


@app.route("/api/cupcakes")
def cupcakes_list_all():
    """ Return JSON like:
        {cupcakes: [{id, flavor, size, rating, image}, ...]} """

    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)


@app.route("/api/cupcakes/<int:cupcake_id>")
def cupcake_list_single(cupcake_id):
    """ Return JSON like:
        {cupcake: {id, flavor, size, rating, image}} """

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)


@app.route("/api/cupcakes", methods=["POST"])
def cupcake_create():
    """ Create a cupcake with flavor, size, rating and image data
        from the body of the request.

        Return JSON like:
        {cupcake: {id, flavor, size, rating, image}}"""

    new_cupcake = Cupcake(
                          flavor=request.json["flavor"],
                          size=request.json["size"],
                          rating=request.json["rating"],
                          image=request.json["image"]
    )

    db.session.add(new_cupcake)
    db.session.commit()

    serialized = new_cupcake.serialize()

    return (jsonify(cupcake=serialized), 201)


@app.route("/api/cupcakes/<int:cupcake_id>", methods=["PATCH"])
def cupcake_update(cupcake_id):
    """Update a cupcake with the id passed in the URL
    and flavor, size, rating and image data from the body of the request.
    return JSON like:
    {cupcake: {id, flavor, size, rating, image}}"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake.flavor = request.json["flavor"]
    cupcake.size = request.json["size"]
    cupcake.rating = request.json["rating"]
    cupcake.image = request.json["image"]
    db.session.commit()

    serialized = cupcake.serialize()
    return jsonify(cupcake=serialized)


@app.route("/api/cupcakes/<int:cupcake_id>", methods=["DELETE"])
def cupcake_delete(cupcake_id):
    """ Delete cupcake with the id passed in the URL.
     Return with JSON like {message: "Deleted"}. """

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify({"message": "Deleted"})
