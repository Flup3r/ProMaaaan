from flask import Flask, render_template, request, redirect, session, escape, url_for
import flask_login
from data_manager import data_manager_user_operations
from util import json_response
import data_handler

app = Flask(__name__)
app.secret_key = 'xxs'
login_manager = flask_login.LoginManager()
login_manager.init_app(app)




@app.route("/")
def index():
    login = None
    if 'username' in session:
        login = session['username']
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', login=login)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the names boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route('/login', methods=['POST', 'GET'])
def login():
    if 'username' in session:
        return redirect('/my_page')
    else:
        if request.method == 'POST':
            data = request.form
            if data_manager_user_operations.verify_login(data):
                return render_template("login.html", message="Oops login or password is not correct")
            else:
                session['username'] = request.form['username']
                return redirect('/my_page')
    return render_template("login.html")

@app.route('/logout')
def logout():
    # remove the username from the session if it is there
    session.pop('username', None)
    return redirect('/login')


@app.route('/register', methods=['POST', 'GET'])
def register():
    if 'username' in session:
        return redirect('/my_page')
    else:
        if request.method == 'POST':
            data = request.form
            if data_manager_user_operations.verify_credentials(data):
                return render_template('register.html', message=data_manager_user_operations.verify_credentials(data))
            else:
                data_manager_user_operations.register(data)
                session['username'] = request.form['username']
                session['email'] = request.form['email']
                return redirect('/my_page')
    return render_template("register.html")


@app.route('/my_page')
def my_page():
    if 'username' in session:
        info = data_manager_user_operations.get_email(session['username'])
        session['email'] = info[0]['user_email']
        return render_template('my_page.html', username=session['username'], email=session['email'])
    return redirect("/login")


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
