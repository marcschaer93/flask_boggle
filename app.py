from boggle import Boggle
from flask import Flask, request, session, render_template, redirect, flash
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = 'hyptoKrypto'
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def start_game():
    return render_template('start_game.html')

@app.route('/boogle')
def make_board():
    return render_template('make_board.html')