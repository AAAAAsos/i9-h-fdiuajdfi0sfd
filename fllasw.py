from flask import Flask, request, jsonify

app = Flask(__name__)

# Эндпоинт для получения данных о бонусах и рефералах
@app.route('/referral-data', methods=['GET'])
def referral_data():
    user_id = request.args.get('user_id')

    # Получите бонус и список рефералов из базы данных (условный код)
    bonus = get_user_bonus(user_id)
    referrals = get_user_referrals(user_id)

    # Возвращаем данные в формате JSON
    return jsonify({
        "bonus": bonus,
        "referrals": referrals
    })

def get_user_bonus(user_id):
    # Логика получения бонуса пользователя из базы данных
    return 2500  # Замените на реальную логику

def get_user_referrals(user_id):
    # Логика получения списка рефералов пользователя
    return [{"id": "12345"}, {"id": "67890"}]  # Замените на реальную логику

if __name__ == "__main__":
    app.run(port=5000)
