from boggle import Boggle
from flask import Flask, request, session, render_template, redirect, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = 'hyptoKrypto'
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def homepage():
    """starts the Game and saves random board_data"""
    board_data = boggle_game.make_board()
    session['board_data'] = board_data

    # session.pop('highscore', None)

    return render_template('homepage.html')

@app.route('/boggle')
def make_board():
    """makes boggle Board"""
   
    session.get('highscore', 0)
    board_data = session['board_data']
    return render_template('make_board.html', boggle_board=board_data)

@app.route("/check-word")
def check_word():
    """Check if word is in dictionary."""

    word = request.args["word"]

    board_data = session["board_data"]
    response = boggle_game.check_valid_word(board_data, word)
    print('RESPONSE', response)

    return jsonify({'result': response})

@app.route("/post-score", methods=["POST"])
def update_and_check_score():
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    game_counter = session.get('game-counter', 0)
    session["game-counter"] = game_counter + 1

    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)



