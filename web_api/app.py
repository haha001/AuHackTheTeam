from flask import Flask, request
from firebase import firebase
from random import randint
import geohash as Geohash
import json

firebase = firebase.FirebaseApplication('https://flaskplay.firebaseio.com', None)

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/put', methods=['POST', 'GET'])
def process_data():
    ph = request.args['ph']
    print ph
    bacteria = request.args['bacteria']
    lead = request.args['lead']
    latitude = float(request.args['latitude'])
    longitude = float(request.args['longitude'])
    water_index = calculate_water_index()
    print water_index
    geohash = Geohash.encode(latitude, longitude, 9)
    write_data(ph, bacteria, lead, longitude, latitude, water_index, geohash)
    return "Done!"


def write_data(ph, bacteria, lead, longitude, latitude, water_index, geohash):
    random_id = random_with_N_digits(20)

    data_j= {'bacteria': bacteria, 'lead': lead, 'ph': ph, 'water_index': water_index}
    data_l= {'g': geohash, 'l': {'0': latitude, '1': longitude}}
    firebase.put('/data/', random_id, data_j)
    firebase.put('/locations/', random_id, data_l)



def calculate_water_index():
    return randint(1, 101)


def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)


if __name__ == '__main__':
    app.run()
