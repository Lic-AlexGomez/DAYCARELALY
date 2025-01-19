import cloudinary
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Newsletter,User, Parent, Teacher, Child, Class, Enrollment, Program, Contact, Subscription, ProgressReport, Event, Message, Task, Attendance, Grade, Payment, Schedule, Course, Notification,Getintouch
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)
CORS(api, resources={r"/api/*": {"origins": "*"}})
bcrypt = Bcrypt()


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.serialize()}), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid payload"}), 400

   
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        role=data.get('role', 'user') 
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201



@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users = list(map(lambda x: x.serialize(), users))
    return jsonify(users), 200


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200


@api.route('/parents', methods=['GET'])
def get_parents():
    parents = Parent.query.all()
    parents = list(map(lambda x: x.serialize(), parents))
    return jsonify(parents), 200


@api.route('/parents/<int:id>', methods=['GET'])
def get_parent(id):
    parent = Parent.query.get(id)
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    return jsonify(parent.serialize()), 200


@api.route('/parents', methods=['POST'])
def create_parent():
    data = request.json
    new_parent = Parent(
        user_id=data['user_id'],
        full_name=data['full_name'],
        phone_number=data['phone_number']
    )
    db.session.add(new_parent)
    db.session.commit()
    return jsonify(new_parent.serialize()), 201


@api.route('/teachers', methods=['GET'])
def get_teachers():
    teachers = Teacher.query.all()
    teachers = list(map(lambda x: x.serialize(), teachers))
    return jsonify(teachers), 200

@api.route('/teachers/<int:id>', methods=['GET'])
def get_teacher(id):
    teacher = Teacher.query.get(id)
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404
    return jsonify(teacher.serialize()), 200


@api.route('/teacher', methods=['POST'])
def create_teacher():
    data = request.json
    print(data)
    if not data or 'user_id' not in data or 'full_name' not in data or 'specialization' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_teacher = Teacher(
        user_id=data['user_id'],
        full_name=data['full_name'],
        specialization=data['specialization']
    )
    db.session.add(new_teacher)
    db.session.commit()
    return jsonify(new_teacher.serialize()), 201


@api.route('/classes', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    classes = list(map(lambda x: x.serialize(), classes))
    return jsonify(classes), 200


@api.route('/classes/<int:id>', methods=['GET'])
def get_class(id):
    class_instance = Class.query.get(id)
    if not class_instance:
        return jsonify({"error": "Class not found"}), 404
    return jsonify(class_instance.serialize()), 200


@api.route('/classes', methods=['POST'])
def create_class():
    data = request.json
    new_class = Class(
        teacher_id=data['teacher_id'],
        name=data['name'],
        description=data.get('description', ''),
        capacity=data['capacity'],
        price=data['price'],
        age=data['age'],
        time=data['time']
    )
    db.session.add(new_class)
    db.session.commit()
    return jsonify(new_class.serialize()), 201

@api.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    events = list(map(lambda x: x.serialize(), events))
    return jsonify(events), 200


@api.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get(id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(event.serialize()), 200


@api.route('/events', methods=['POST'])
def create_event():
    data = request.json
    new_event = Event(
        name=data['name'],
        description=data.get('description', ''),
        start_time=data['start_time'],
        end_time=data['end_time']
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.serialize()), 201

# @api.route("/private", methods=["GET"])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()

#     if current_user is None:
#         return jsonify({"msg": "Missing Authorization Header"}), 401
#     return jsonify(current_user), 200

# @api.route("/admin", methods=["GET"])
# @jwt_required()
# def protected_admin():
#     current_user = get_jwt_identity()

#     if current_user is None:
#         return jsonify({"msg": "Missing Authorization Header"}), 401
#     return jsonify(current_user), 200

@api.route('/progress_reports', methods=['GET'])
def get_progress_reports():
    progress_reports = ProgressReport.query.all()
    progress_reports = list(map(lambda x: x.serialize(), progress_reports))
    return jsonify(progress_reports), 200

        

@api.route('/children', methods=['GET'])
def get_children():
    children = Child.query.all()
    children = list(map(lambda x: x.serialize(), children))
    return jsonify(children), 200

    
@api.route('/children/<int:id>', methods=['GET'])
def get_child(id):
    child = Child.query.get(id)
    if not child:
        return jsonify({"error": "Child not found"}), 404
    return jsonify(child.serialize()), 200


<<<<<<< HEAD
    def __repr__(self):
        return f'<Class {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "teacher_id": self.teacher_id,
            "name": self.name,
            "description": self.description,
            "capacity": self.capacity,
            "price": self.price,
            "age": self.age,
            "time": self.time,
        }

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<Enrollment {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "child_id": self.child_id,
            "class_id": self.class_id,
            "enrollment_date": self.enrollment_date,
        }

class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    age = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(50), nullable=False)


    def __repr__(self):
        return f'<Program {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "teacher_id": self.teacher_id,
            "name": self.name,
            "description": self.description,
            "capacity": self.capacity,
            "price": self.price,
            "age": self.age,
            "time": self.time,
        }
    
    
class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    plan_type = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<Subscription {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "plan_type": self.plan_type,
            "start_date": self.start_date,
            "end_date": self.end_date,
        }

class ProgressReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=False)
    report_date = db.Column(db.Date, nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<ProgressReport {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "child_id": self.child_id,
            "teacher_id": self.teacher_id,
            "report_date": self.report_date,
            "content": self.content,
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Event {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "start_time": self.start_time,
            "end_time": self.end_time,
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Message {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "content": self.content,
            "timestamp": self.timestamp,
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Task {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "teacher_id": self.teacher_id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date,
            "status": self.status,
        }
=======
@api.route('/children', methods=['POST'])
def create_child():
    data = request.json
    new_child = Child(
        parent_id=data['parent_id'],
        full_name=data['full_name'],
        age=data['age'],
        allergies=data.get('allergies', ''),
        medical_conditions=data.get('medical_conditions', '')
    )
    db.session.add(new_child)
    db.session.commit()
    return jsonify(new_child.serialize()), 201
>>>>>>> 4d3fa9e087e88e2b14e97e5b136f19a957afe17e


@api.route('/enrollments', methods=['GET'])
def get_enrollments():
    enrollments = Enrollment.query.all()
    enrollments = list(map(lambda x: x.serialize(), enrollments))
    return jsonify(enrollments), 200


@api.route('/enrollments/<int:id>', methods=['GET'])
def get_enrollment(id):
    enrollment = Enrollment.query.get(id)
    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404
    return jsonify(enrollment.serialize()), 200


@api.route('/enrollments', methods=['POST'])
def create_enrollment():
    data = request.json
    new_enrollment = Enrollment(
        child_id=data['child_id'],
        class_id=data['class_id']
    )
    db.session.add(new_enrollment)
    db.session.commit()
    return jsonify(new_enrollment.serialize()), 201


@api.route('/programs', methods=['GET'])
def get_programs():
    programs = Program.query.all()
    programs = list(map(lambda x: x.serialize(), programs))
    return jsonify(programs), 200


@api.route('/programs/<int:id>', methods=['GET'])
def get_program(id):
    program = Program.query.get(id)
    if not program:
        return jsonify({"error": "Program not found"}), 404
    return jsonify(program.serialize()), 200


@api.route('/programs', methods=['POST'])
def create_program():
    data = request.json
    required_fields = ['name', 'capacity', 'price', 'age', 'time']
    for field in required_fields:
        if field not in data or data[field] is None:
            return jsonify({"error": f"'{field}' is required"}), 400
    new_program = Program(
        name=data['name'],
        description=data.get('description', ''),
        capacity=data['capacity'],
        price=data['price'],
        age=data['age'],
        time=data['time']
    )
    db.session.add(new_program)
    db.session.commit()
    return jsonify(new_program.serialize()), 201

@api.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    subscriptions = Subscription.query.all()
    subscriptions = list(map(lambda x: x.serialize(), subscriptions))
    return jsonify(subscriptions), 200


@api.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    contacts = list(map(lambda x: x.serialize(), contacts))
    return jsonify(contacts), 200

@api.route('/contacts/<int:id>', methods=['GET'])
def get_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404
    return jsonify(contact.serialize()), 200

@api.route('/contacts', methods=['POST'])
def create_contact():
    data = request.json
    new_contact = Contact(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        subject= data.get('subject', ''),
        phone_number=data.get('phone_number', ''),
        message=data['message']
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.serialize()), 201

@api.route('/upload', methods=['POST'])
def upload_file():
    try:
        # Obtén el archivo desde la solicitud
        file_to_upload = request.files['file']

        # Sube el archivo a Cloudinary
        upload_result = cloudinary.uploader.upload(file_to_upload)

        # Devuelve la URL del archivo cargado
        return jsonify({
            "message": "File uploaded successfully",
            "url": upload_result['secure_url']
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

        
@api.route('/newsletter', methods=['POST'])
def create_newsletter():
    data = request.json
    new_subscription = Newsletter(
        email=data['email']
    )
    db.session.add(new_subscription)
    db.session.commit()
    return jsonify(new_subscription.serialize()), 201

@api.route('/getintouch', methods=['GET'])
def get_contactus():
    getintouch = Getintouch.query.all()
    getintouch = list(map(lambda x: x.serialize(), getintouch))
    return jsonify(getintouch), 200

@api.route('/getintouch/<int:id>', methods=['GET'])
def get_contactu(id):
    getintouch = Getintouch.query.get(id)
    if not getintouch:
        return jsonify({"error": "Contact not found"}), 404
    return jsonify(getintouch.serialize()), 200

<<<<<<< HEAD
    def __repr__(self):
        return f'<Newsletter {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }
    
class Getintouch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Getintouch {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "phone_number": self.phone_number,
            "message": self.message,
        }
    
    
=======
@api.route('/getintouch', methods=['POST'])
def create_contactus():
    data = request.json
    new_contactus = Getintouch(
        name=data['name'],
        email=data['email'],
        subject= data.get('subject', ''),
        phone_number=data.get('phone_number', ''),
        message=data['message']
    )
    db.session.add(new_contactus)
    db.session.commit()
    return jsonify(new_contactus.serialize()), 201
>>>>>>> 4d3fa9e087e88e2b14e97e5b136f19a957afe17e
