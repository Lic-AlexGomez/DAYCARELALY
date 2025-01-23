import cloudinary
from flask import Flask, request, jsonify, Blueprint,current_app
from api.models import db, Newsletter,User, Parent, Teacher, Child, Class, Enrollment, Program, Contact, Subscription, ProgressReport, Event, Message, Task, Attendance, Grade, Payment, Schedule, Course, Notification,Getintouch, Client, Email
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from datetime import datetime

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



# Admin Dashboard routes
@api.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    return jsonify(list(map(lambda x: x.serialize(), clients))), 200

@api.route('/clients', methods=['POST'])
def create_client():
    data = request.json
    new_client = Client(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        status=data.get('status', 'Activo')
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.serialize()), 201

@api.route('/clients/<int:id>', methods=['GET'])
def get_client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(client.serialize()), 200

@api.route('/clients/<int:id>', methods=['PUT'])
def update_client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    
    data = request.json
    client.name = data.get('name', client.name)
    client.email = data.get('email', client.email)
    client.phone = data.get('phone', client.phone)
    client.status = data.get('status', client.status)
    
    db.session.commit()
    return jsonify(client.serialize()), 200

@api.route('/clients/<int:id>', methods=['DELETE'])
def delete_client(id):

    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted successfully"}), 200


@api.route('/schedules', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify([schedule.serialize() for schedule in schedules]), 200

@api.route('/schedules', methods=['POST'])
def create_schedule():
    data = request.json
    new_schedule = Schedule(
        class_name=data['class'],
        teacher=data['teacher'],
        dayOfWeek=data['dayOfWeek'],
        startTime=data['startTime'],
        endTime=data['endTime'],
        capacity=data['capacity'],
        enrolled=data['enrolled']
    )
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify(new_schedule.serialize()), 201

@api.route('/schedules/<int:id>', methods=['GET'])
def get_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    return jsonify(schedule.serialize()), 200

@api.route('/schedules/<int:id>', methods=['PUT'])
def update_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    
    data = request.json
    schedule.class_name = data.get('class', schedule.class_name)
    schedule.teacher = data.get('teacher', schedule.teacher)
    schedule.dayOfWeek = data.get('dayOfWeek', schedule.dayOfWeek)
    schedule.startTime = data.get('startTime', schedule.startTime)
    schedule.endTime = data.get('endTime', schedule.endTime)
    schedule.capacity = data.get('capacity', schedule.capacity)
    schedule.enrolled = data.get('enrolled', schedule.enrolled)
    
    db.session.commit()
    return jsonify(schedule.serialize()), 200

@api.route('/schedules/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully"}), 200

@api.route('/emails', methods=['GET'])
def get_emails():
    emails = Email.query.all()
    return jsonify([email.serialize() for email in emails]), 200

@api.route('/emails', methods=['POST'])
def create_email():
    data = request.json
    if data.get('scheduledDate'):
        data['scheduledDate'] = datetime.fromisoformat(data['scheduledDate'])
    new_email = Email(
        to=data['to'],
        subject=data['subject'],
        content=data['content'],
        date=datetime.now(),
        scheduled_date=data.get('scheduledDate')
    )
    db.session.add(new_email)
    db.session.commit()
    return jsonify(new_email.serialize()), 201

@api.route('/emails/<int:id>', methods=['DELETE'])
def delete_email(id):
    email = Email.query.get(id)
    if email is None:
        return jsonify({"error": "Email not found"}), 404
    db.session.delete(email)
    db.session.commit()
    return jsonify({"message": "Email deleted successfully"}), 200

