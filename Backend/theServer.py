from flask import Flask,jsonify,request
from flask_cors import CORS, cross_origin
import mysql.connector
from mysql.connector import Error, IntegrityError
import google.generativeai as genai

import random as ran
import math 
import pandas as pd

app = Flask(__name__)
CORS(app, 
     origins=["http://localhost:5173"],  
     methods=["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True
)

DB_CONFIG = {
    'host':'localhost',
    'user':'root',
    'password':'Password',
    'database':'DataBase'
}

# default
@app.route('/')
def home():
    return "Welcome to the Task Tracker API!"


# get all tasks
@app.route('/api/get_task',methods=['GET'])
def get_task():
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id, task, is_done, streak, created_at FROM DataBase")
    tasks = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(tasks),200


# get one task
@app.route('/api/get_one_task', methods=['GET'])
def getOneTask():
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor(dictionary=True)

    cursor.execute('''SELECT MAX(id) as max_id
                        FROM DataBase;''')
    data_jason = cursor.fetchone()
    max_id = data_jason['max_id']
    cursor.execute('''
                select * from DataBase where id = %s;
                ''',(max_id,))
    the_task = cursor.fetchone()
    print(the_task)
    cursor.close()
    connection.close()
    return the_task,200


# get any task
@app.route('/api/get_any_task/<int:task_id>', methods=['GET'])
def getAnyTask(task_id):
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor(dictionary=True)

    cursor.execute('''
                select * from DataBase where id = %s;
                ''',(task_id,))
    the_task = cursor.fetchone()
    print("theTask values:" ,the_task.values)
    cursor.close()
    connection.close()
    return the_task,200

# add a task
@app.route('/api/add_task', methods=['POST'])
def add_task():
    
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    data = request.get_json()
    task = data.get('task')
    if not task:
        return jsonify({'error':'Task name is required'}),400
    if request.method == 'POST':        
        try:
            cursor.execute("INSERT INTO DataBase (task) VALUES (%s)",(task,))
            connection.commit()
            cursor.close() 
            connection.close()           
            return jsonify({'message':'task added'}),201
        except IntegrityError as e:
        # Duplicate entry error
            if e.errno == 1062:  # MySQL error code for duplicate entry
                return jsonify({
                    "error": "Duplicate task",
                    "message": f"Task '{task}' already exists"
                }), 409  # 409 Conflict status code
            else:
                return jsonify({"error": "Database integrity error"}), 400
            
        except Exception as e:
               return jsonify({"error": str(e)}), 500


# delete a task
@app.route('/api/delete_task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM DataBase WHERE id = %s", ((task_id,)))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Error as e:
        print(f"❌ Error deleting task {task_id}: {e}")
        cursor.close()
        connection.close()
        return jsonify({'error': 'Failed to delete task'}), 500
    
#Edit a Task!
@app.route('/api/edit_task/<int:task_id>',methods=['PATCH'])
@cross_origin()
def EditTaskItem(task_id):
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    data = request.get_json()
    print("data ", data)
    new_task= data.get('task')
    print(task_id)
    if not new_task:
        return jsonify({'error':'Task name is required'}),400
    
    try:
        cursor.execute('''
                       UPDATE DataBase SET task = %s WHERE id = %s;
                       ''',(new_task,task_id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': f'task = {new_task} id = {task_id} Updated successfully'}), 200
    except Error as e:
        print(f"❌ Error updating task {task_id}: {e}")
        cursor.close()
        connection.close()
        return jsonify({'error': 'Failed to Update task'}), 500
    
 
# set Task is done! 
@app.route('/api/set_is_done/<int:task_id>',methods=['PATCH'])
@cross_origin()
def SetIsDone(task_id):
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    try:
        cursor.execute('''
                       UPDATE DataBase SET is_done = true WHERE id = %s;
                       ''',(task_id,))
        connection.commit()
        cursor.close()
        connection.close()
        setStreak(task_id)
        return jsonify({'message': 'Task Updated successfully'}), 200
    except Error as e:
        print(f"❌ Error updating task {task_id}: {e}")
        cursor.close()
        connection.close()
        return jsonify({'error': 'Failed to Update task'}), 500


# set score / Streak 🔥
# do it tomorrow
@app.route('/api/set_score',methods=['GET']) 
def setStreak(task_id):
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT is_done FROM DataBase WHERE id = %s',(task_id,))
        data = cursor.fetchone()
        print("data",data)
        if data[0] != 0:
            cursor.execute('SELECT streak FROM DataBase WHERE id = %s',(task_id,))
            val = cursor.fetchone()
            streak = val[0] + 1
            print("value: ",val[0])
            cursor.execute('UPDATE DataBase SET streak = %s WHERE id = %s;',(streak,task_id))
            connection.commit()
            print("streak ",streak)

        else:
            print("false: ",data)
        # do it tomorrow!
        cursor.close()
        connection.close()
        return jsonify({'message': 'Task Updated successfully'}), 200
    except Error as e:
        print("set streaj errir",e)
        return jsonify({'error': 'Failed to Update task'}), 500


# reset all the task to not Done at midnight 🌙✨
def resetIsDone():
    print("reset is done")
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    try:
        cursor.execute('''
                       DELIMITER $$
                       
                        CREATE EVENT IF NOT EXISTS `reset_my_is_done_column_daily`
                        ON SCHEDULE EVERY 1 MINUTE
                        STARTS CURRENT_DATE + INTERVAL 1 MINUTE
                        ON COMPLETION PRESERVE
                        ENABLE
                        DO
                        BEGIN
                            UPDATE DataBase SET is_done = false;
                        END$$

                        DELIMITER ;
                       ''')
        connection.commit()
        cursor.close()
        connection.close()
    except:
        print(f"❌ Error updating task ")
        cursor.close()
        connection.close()
        return jsonify({'error': 'Failed to Update task'}), 500


# set up the database
def setup_database():
    print("🔧 Setting up database...")
    
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='V07@Feb$&2006',
            database='TaskTrackerDatabase'
        )
        cursor = connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS TaskTrackerDatabase")
        print("✅ Database 'TaskTrackerDatabase' created!")
        cursor.close()
        connection.close()
        
        
        # the * in **DB_CONFIG unpacks the dictionary into key-value pairs
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        # LATER task CHANGE of DataBase
        cursor.execute("""
                       CREATE TABLE IF NOT EXISTS DataBase (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           task VARCHAR(100) NOT NULL UNIQUE,
                           is_done BOOLEAN DEFAULT FALSE,
                           streak INT DEFAULT 0, 
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                           
                       )
                       """)
        print("✅ Table 'DataBase' created!")
        connection.commit()
        cursor.close()
        connection.close()
    except:
        print("❌ Could not connect to MySQL server.")
        return
      
    
# get the connnection to database
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"❌ Error connecting to database: {e}")
        return None 
    
# @app.route('/api/get_remarks',methods=['GET'])    
def AiAnaylsis(): 
    connection = mysql.connector.connect(**DB_CONFIG)   
    sql_query = "SELECT * FROM DataBase"  
    df = pd.read_sql(sql_query, connection)
    print("Data loaded into Pandas DataFrame successfully.")
    print(df.to_markdown()) 


    connection.close()
    
    genai.configure(api_key="APIKEY")
    print('setip complete')
    # for model in genai.list_models():
    #     print(f"Model: {model.name}")
    #     print(f"Display Name: {model.display_name}")
    #     print(f"Description: {model.description}")
    #     print(f"Supported generation methods: {model.supported_generation_methods}")
    #     print("-" * 50)
    # creating AI model
   # Reset dataframe outside the system instruction
    df.reset_index(drop=True, inplace=True)

    model = genai.GenerativeModel('gemini-2.0-flash-exp',  # Note: gemini-2.5-pro may not exist
                                system_instruction=f'''
                                - Be helpful and concise. 
                                - Behave as one-time text prompt. no chat-like behaving 
                                - Speak like human, don't mention you are AI.
                                - Give response within 30 words.
                                - Give progress oriented advice
                                - Give motivational message if possible
                                - Use the data provided to respond
                                - If user is learning a language, trick them with simple sentences in that language
                                - Trick user with tiny questions based on data provided only! but only one task at a time
                                - Format the response with emojis and special days related theme!
                                ''')

    QuesList = ['what improvements i can make', 
                'Give an Analysis of the Data provided',
                'Provide Progress oriented Advice',
                'Provide Progress oriented Motivational message',
                'Urge to complete the task (provided in database) not done!',
                'Recap of overall progress']

    theRand = math.ceil(ran.random() * (len(QuesList) - 1))

    # Include the dataframe data in the prompt
    prompt = f"{QuesList[theRand]}\n\nData:\n{df.to_string()}"

    res = model.generate_content(prompt)
    print(res.text)

    try:
        return jsonify({'response': res.text})
    except Exception as e:
        return jsonify({'error': str(e)})
    
 
# call all functions to run automatically!⚙️
setup_database()
get_db_connection()
resetIsDone()    
AiAnaylsis()
if __name__ == "__main__":
    app.run(debug=True,port=5000)
