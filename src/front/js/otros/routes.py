import cloudinary,os
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
from flask import Flask, request, jsonify, Blueprint, current_app
from api.models import db, Newsletter, User, Parent, Teacher, Child, Class, Enrollment, Program, Contact, Subscription, ProgressReport, Event, Message, Task, Attendance, Grade, Payment, Schedule, Course, Notification, Getintouch, Client, Email, Video, Eventsuscriptions, InactiveAccount, Approval, AdminD, Activity, VirtualClass,Service , ParentActivity, ParentSchedule, ParentPayment, ParentSetting, ParentVirtualClass, MessageP
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash
import random


api = Blueprint('api', __name__)
CORS(api, resources={r"/api/*": {"origins": "*"}})
cloudinary.config( 
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME"), 
    api_key = os.environ.get("CLOUDINARY_API_KEY"), 
    api_secret = os.environ.get("CLOUDINARY_API_SECRET"), 
    
)
bcrypt = Bcrypt()
jwt = JWTManager()

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    print("Datos recibidos:", data)

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    user = User.query.filter_by(email=data['email']).first()
    print("Usuario encontrado:", user)

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    password_valid = user.check_password(data['password'])
    print("¿Contraseña válida?", password_valid)

    if not password_valid:
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    print("Token generado:", access_token)
    return jsonify({"token": access_token, "user": user.serialize()}), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
  
    if not data:
        raise APIException("No input data provided", status_code=400)

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    profile_picture = data.get('profilePicture')

  
    if not all([username, email, password, role]):
        raise APIException("Missing required fields", status_code=400)

    
    if User.query.filter_by(email=email).first():
        raise APIException("User already exists", status_code=400)

    if isinstance(profile_picture, dict) and 'url' in profile_picture:
        profile_picture = profile_picture['url']
    elif profile_picture and not isinstance(profile_picture, str):
        raise APIException("Invalid profile picture format", status_code=400)

    
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password, role=role, profile_picture=profile_picture)
    db.session.add(new_user)
    db.session.flush()

    
    if role == 'parent':
        child_name = data.get('childName')
        child_dob = data.get('childDateOfBirth')
        child_allergies = data.get('childAllergies')
        emergency_contact = data.get('emergencyContact')
        birth_certificate_url = data.get('birthCertificateUrl')
        immunization_records_url = data.get('immunizationRecordsUrl')

        if not all([child_name, child_dob, emergency_contact]):
            raise APIException("Missing child or parent required fields", status_code=400)

        if isinstance(birth_certificate_url, dict):
            birth_certificate_url = birth_certificate_url.get('url')

        if isinstance(immunization_records_url, dict):
            immunization_records_url = immunization_records_url.get('url')

        try:
            child_dob = datetime.strptime(child_dob, '%Y-%m-%d').date()
        except ValueError:
            raise APIException("Invalid date format for childDateOfBirth", status_code=400)

        new_parent = Parent(user_id=new_user.id, emergency_contact=emergency_contact)
        db.session.add(new_parent)
        db.session.flush()

        new_child = Child(
            parent_id=new_parent.id,
            name=child_name,
            date_of_birth=child_dob,
            allergies=child_allergies,
            birth_certificate=birth_certificate_url,
            immunization_records=immunization_records_url
        )
        db.session.add(new_child)

    elif role == 'teacher':
        qualifications = data.get('qualifications')
        teaching_experience = data.get('teachingExperience')
        certifications_url = data.get('certificationsUrl')
        background_check_url = data.get('backgroundCheckUrl')

        if not all([qualifications, teaching_experience]):
            raise APIException("Missing teacher required fields", status_code=400)

        certifications = certifications_url.get('url') if isinstance(certifications_url, dict) and 'url' in certifications_url else None
        background_check = background_check_url.get('url') if isinstance(background_check_url, dict) and 'url' in background_check_url else None

        if certifications is None:
            raise APIException("Certifications URL is required", status_code=400)
        if background_check is None:
            raise APIException("Background check URL is required", status_code=400)

        new_teacher = Teacher(
            user_id=new_user.id,
            qualifications=qualifications,
            teaching_experience=teaching_experience,
            certifications=certifications,
            background_check=background_check
        )
        db.session.add(new_teacher)

    elif role == 'admin':
        position = data.get('position')
        department = data.get('department')

        if not all([position, department]):
            raise APIException("Missing admin required fields", status_code=400)

        new_admin = AdminD(user_id=new_user.id, position=position, department=department)
        db.session.add(new_admin)

    else:
        raise APIException("Invalid role", status_code=400)

    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "User created successfully",
        "token": access_token,
        "user": new_user.serialize()
    }), 201

@api.route('/users', methods=['GET'])
#@jwt_required()
def get_users():
    users = User.query.all()
    users = list(map(lambda x: x.serialize(), users))
    return jsonify(users), 200

@api.route('/users/<int:id>', methods=['GET'])
#@jwt_required()
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200

@api.route('/users/<int:id>', methods=['PUT'])
#@jwt_required()
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route('/users/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

@api.route('/parents', methods=['GET'])
#@jwt_required()
def get_parents():
    parents = Parent.query.all()
    parents = list(map(lambda x: x.serialize(), parents))
    return jsonify(parents), 200

@api.route('/parents/<int:id>', methods=['GET'])
#@jwt_required()
def get_parent(id):
    parent = Parent.query.get(id)
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    return jsonify(parent.serialize()), 200

@api.route('/parents', methods=['POST'])
#@jwt_required()
def create_parent():
    data = request.json
    new_parent = Parent(
        user_id=data['user_id'],
        full_name=data['full_name'],
        phone_number=data['phone_number'],
        emergency_contact=data.get('emergency_contact', ''),
        birth_certificate = data.get('birthCertificateUrl', {}).get('url'),
        immunization_records = data.get('immunizationRecordsUrl', {}).get('url')

    )
    db.session.add(new_parent)
    db.session.commit()
    return jsonify(new_parent.serialize()), 201

@api.route('/teachers', methods=['GET'])
def get_teachers():
    teachers = Teacher.query.all()
    teachers = list(map(lambda x: x.serialize(), teachers))
    return jsonify(teachers), 200

@api.route('/teachers/classes', methods=['GET'])
def get_teachers_classes():
    teachers = Teacher.query.all()
    teachers = list(map(lambda x: x.serialize_classes(), teachers))
    return jsonify(teachers), 200



@api.route('/teachers/<int:id>', methods=['GET'])
def get_teacher(id):
    teacher = Teacher.query.get(id)
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404
    return jsonify(teacher.serialize()), 200

@api.route('/teachers', methods=['POST'])
#@jwt_required()
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
        specialization=data['specialization'],
        qualifications=data.get('qualifications', ''),
        teaching_experience=data.get('teaching_experience', ''),
        certifications_url=data.get('certifications_url', ''),
        background_check_url=data.get('background_check_url', '')
    )
    db.session.add(new_teacher)
    db.session.commit()
    return jsonify(new_teacher.serialize()), 201

@api.route('/add_simple_data_user', methods=['POST'])
def add_simple_data_user():
    try:
        # Verificar si ya existen datos en la tabla User
        if User.query.count() > 0:
            return jsonify({"message": "La tabla User ya contiene datos."}), 200

        # Crear datos simples de usuarios
        simple_users = [
            {
                "id": 1,
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password_hash": "hashed_password_1"
            },
            {
                "id": 2,
                "username": "janesmith",
                "email": "janesmith@example.com",
                "password_hash": "hashed_password_2"
            },
            {
                "id": 3,
                "username": "alicejohnson",
                "email": "alicejohnson@example.com",
                "password_hash": "hashed_password_3"
            }
        ]

        # Insertar los datos en la base de datos
        for user_data in simple_users:
            new_user = User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                password_hash=user_data["password_hash"]
            )
            db.session.add(new_user)

        db.session.commit()

        return jsonify({"message": "Datos simples de usuarios agregados exitosamente."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@api.route('/add_simple_data_teacher', methods=['POST'])
def add_simple_data_teacher():
    print("dd")
    try:
        # Verificar si ya existen datos en la tabla Teacher
        if Teacher.query.count() > 0:
            return jsonify({"message": "La tabla Teacher ya contiene datos."}), 200

        # Crear datos simples de profesores
        simple_teachers = [
            {
                "user_id": 1,
                "full_name": "John Doe",
                "specialization": "Mathematics",
                "qualifications": "PhD in Mathematics",
                "teaching_experience": "10 years",
                "certifications_url": "https://example.com/certifications/johndoe",
                "background_check_url": "https://example.com/background/johndoe"
            },
            {
                "user_id": 2,
                "full_name": "Jane Smith",
                "specialization": "Physics",
                "qualifications": "MSc in Physics",
                "teaching_experience": "5 years",
                "certifications_url": "https://example.com/certifications/janesmith",
                "background_check_url": "https://example.com/background/janesmith"
            },
            {
                "user_id": 3,
                "full_name": "Alice Johnson",
                "specialization": "Chemistry",
                "qualifications": "BSc in Chemistry",
                "teaching_experience": "3 years",
                "certifications_url": "https://example.com/certifications/alicejohnson",
                "background_check_url": "https://example.com/background/alicejohnson"
            }
        ]

        # Insertar los datos en la base de datos
        for teacher_data in simple_teachers:
            # Verificar si el usuario existe
            user = User.query.get(teacher_data["user_id"])
            print(user)
            if not user:
                return jsonify({"error": f"User with ID {teacher_data['user_id']} not found."}), 404

            new_teacher = Teacher(
                user_id=teacher_data["user_id"],
                full_name=teacher_data["full_name"],
                specialization=teacher_data["specialization"],
                qualifications=teacher_data["qualifications"],
                teaching_experience=teacher_data["teaching_experience"],
                certifications_url=teacher_data["certifications_url"],
                background_check_url=teacher_data["background_check_url"]
            )
            db.session.add(new_teacher)

        db.session.commit()

        return jsonify({"message": "Datos simples de profesores agregados exitosamente."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
#@jwt_required()
def create_class():
    data = request.json
    new_class = Class(
        teacher_id=data['teacher_id'],
        name=data['name'],
        description=data.get('description', ''),
        capacity=data['capacity'],
        price=data['price'],
        age=data['age'],
        time=data['time'],
        image=data.get('image', '')
    )
    db.session.add(new_class)
    db.session.commit()
    return jsonify(new_class.serialize()), 201

@api.route('/classes/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_class(id):
    classes = Class.query.get(id)
    if not classes:
        return jsonify({"error": "Class not found"}), 404

    db.session.delete(classes)
    db.session.commit()
    return jsonify({"message": "class deleted"}), 200

@api.route('/classes/<int:id>', methods=['PUT'])
#@jwt_required()
def update_class(id):
    classes = Class.query.get(id)
    if classes is None:
        return jsonify({"error": "Class not found"}), 404
    
    data = request.json
    classes.teacher_id = data.get('teacher_id', classes.teacher_id)
    classes.name = data.get('name', classes.name)
    classes.description = data.get('description', classes.description)
    classes.capacity = data.get('capacity', classes.capacity)
    classes.price = data.get('price', classes.price)
    classes.age = data.get('age', classes.age)
    classes.time = data.get('time', classes.time)
    classes.image = data.get('image', classes.image)
    
    db.session.commit()
    return jsonify(classes.serialize()), 200


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
#@jwt_required()
def create_event():
    data = request.json
    new_event = Event(
        name=data['name'],
        description=data.get('description', ''),
        start_time=datetime.fromisoformat(data['start_time']),
        end_time=datetime.fromisoformat(data['end_time']),
        image=data.get('image','')
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.serialize()), 201

@api.route('/events/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_event(id):
    event = Event.query.get(id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"}), 200

@api.route('/events/<int:id>', methods=['PUT'])
#@jwt_required()
def update_event(id):
    events = Event.query.get(id)
    if events is None:
        return jsonify({"error": "Event not found"}), 404
    
    data = request.json
    events.name = data.get('name', events.name)
    events.description = data.get('description', events.description)
    events.start_time = data.get('start_time', events.start_time)
    events.end_time = data.get('end_time', events.end_time)
    events.image = data.get('image', events.image)

    db.session.commit()
    return jsonify(events.serialize()), 200

@api.route('/progress_reports', methods=['GET'])
#@jwt_required()
def get_progress_reports():
    progress_reports = ProgressReport.query.all()
    progress_reports = list(map(lambda x: x.serialize(), progress_reports))
    return jsonify(progress_reports), 200

@api.route('/progress_reports/<int:id>', methods=['GET'])
#@jwt_required()
def get_progress_report(id):
    report = ProgressReport.query.get(id)
    if not report:
        return jsonify({"error": "Progress report not found"}), 404
    return jsonify(report.serialize()), 200

@api.route('/progress_reports', methods=['POST'])
#@jwt_required()
def create_progress_report():
    data = request.json
    new_report = ProgressReport(
        child_id=data['child_id'],
        teacher_id=data['teacher_id'],
        report_date=datetime.fromisoformat(data['report_date']),
        content=data['content']
    )
    db.session.add(new_report)
    db.session.commit()
    return jsonify(new_report.serialize()), 201

@api.route('/children', methods=['GET'])
#@jwt_required()
def get_children():
    children = Child.query.all()
    children = list(map(lambda x: x.serialize(), children))
    return jsonify(children), 200

@api.route('/children/<int:id>', methods=['GET'])
#@jwt_required()
def get_child(id):
    child = Child.query.get(id)
    if not child:
        return jsonify({"error": "Child not found"}), 404
    return jsonify(child.serialize()), 200

@api.route('/children', methods=['POST'])
#@jwt_required()
def create_child():
    data = request.json
    new_child = Child(
        parent_id=data['parent_id'],
        full_name=data['full_name'],
        date_of_birth=datetime.fromisoformat(data['date_of_birth']),
        allergies=data.get('allergies', ''),
        medical_conditions=data.get('medical_conditions', '')
    )
    db.session.add(new_child)
    db.session.commit()
    return jsonify(new_child.serialize()), 201

@api.route('/enrollments', methods=['GET'])
#@jwt_required()
def get_enrollments():
    enrollments = Enrollment.query.all()
    enrollments = list(map(lambda x: x.serialize(), enrollments))
    return jsonify(enrollments), 200

@api.route('/enrollments/<int:id>', methods=['GET'])
#@jwt_required()
def get_enrollment(id):
    enrollment = Enrollment.query.get(id)
    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404
    return jsonify(enrollment.serialize()), 200

@api.route('/enrollments', methods=['POST'])
#@jwt_required()
def create_enrollment():
    data = request.json
    new_enrollment = Enrollment(
        child_id=data['child_id'],
        class_id=data['class_id'],
        enrollment_date=datetime.now().date()
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
#@jwt_required()
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
        time=data['time'],
        teacher_id=data.get('teacher_id')
    )
    db.session.add(new_program)
    db.session.commit()
    return jsonify(new_program.serialize()), 201

@api.route('/subscriptions', methods=['GET'])
#@jwt_required()
def get_subscriptions():
    subscriptions = Subscription.query.all()
    subscriptions = list(map(lambda x: x.serialize(), subscriptions))
    return jsonify(subscriptions), 200

@api.route('/contacts', methods=['GET'])
#@jwt_required()
def get_contacts():
    contacts = Contact.query.all()
    contacts = list(map(lambda x: x.serialize(), contacts))
    return jsonify(contacts), 200

@api.route('/contacts/<int:id>', methods=['GET'])
#@jwt_required()
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
    if 'file' not in request.files:
        raise APIException("No file part", status_code=400)
    
    file = request.files['file']
    if file.filename == '':
        raise APIException("No selected file", status_code=400)
    
    if file:
        upload_result = cloudinary.uploader.upload(file)
        return jsonify({"url": upload_result['secure_url']}), 200

@api.route('/upload/img', methods=['POST'])
def upload_img():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        upload_result = upload(file)
        return jsonify({"url": upload_result['secure_url']}), 200

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
#@jwt_required()
def get_contactus():
    getintouch = Getintouch.query.all()
    getintouch = list(map(lambda x: x.serialize(), getintouch))
    return jsonify(getintouch), 200

@api.route('/getintouch/<int:id>', methods=['GET'])
#@jwt_required()
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
#@jwt_required()
def get_clients():
    clients = Client.query.all()
    return jsonify(list(map(lambda x: x.serialize(), clients))), 200

@api.route('/clients', methods=['POST'])
#@jwt_required()
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
#@jwt_required()
def get_client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(client.serialize()), 200

@api.route('/clients/<int:id>', methods=['PUT'])
#@jwt_required()
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
#@jwt_required()
def delete_client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted successfully"}), 200

@api.route('/schedules', methods=['GET'])
#@jwt_required()
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify([schedule.serialize() for schedule in schedules]), 200

@api.route('/schedules', methods=['POST'])
#@jwt_required()
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
#@jwt_required()
def get_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    return jsonify(schedule.serialize()), 200

@api.route('/schedules/<int:id>', methods=['PUT'])
#@jwt_required()
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
#@jwt_required()
def delete_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully"}), 200

@api.route('/emails', methods=['GET'])
#@jwt_required()
def get_emails():
    emails = Email.query.all()
    return jsonify([email.serialize() for email in emails]), 200

@api.route('/emails', methods=['POST'])
#@jwt_required()
def create_email():
    data = request.json
    if data.get('scheduledDate'):
        data['scheduledDate'] = datetime.fromisoformat(data['scheduledDate'])
    new_email = Email(
        to_name=data['to_name'],
        user_email=data['user_email'],
        message=data['message'],
        date=datetime.now(),
        scheduled_date=data.get('scheduledDate')
    )
    db.session.add(new_email)
    db.session.commit()
    return jsonify(new_email.serialize()), 201

@api.route('/emails/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_email(id):
    email = Email.query.get(id)
    if email is None:
        return jsonify({"error": "Email not found"}), 404
    db.session.delete(email)
    db.session.commit()
    return jsonify({"message": "Email deleted successfully"}), 200

@api.route('/eventsuscription', methods=['POST'])
def new_suscriptor_event():
    data = request.json
    new_event_suscriptor = Eventsuscriptions(
        full_name=data['full_name'],
        events_selection=data['events_selection'],
        parent_name=data['parent_name'],
        special_request= data.get('special_request'),
    )
    db.session.add(new_event_suscriptor)
    db.session.commit()
    return jsonify(new_event_suscriptor.serialize()), 201

@api.route('/videos', methods=['GET'])
def get_videos():
    videos = Video.query.all()
    Video = list(map(lambda x: x.serialize(), videos))
    return jsonify(Video), 200

@api.route('/videos', methods=['POST'])
def upload_video():

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        upload_result = upload(file, resource_type="video")
        new_video = Video(
            title=request.form.get('title'),
            url=upload_result['secure_url'],
            user_id=request.form.get('user_id')
        )
        db.session.add(new_video)
        db.session.commit()
        return jsonify(new_video.serialize()), 201

@api.route('/videos/<int:id>', methods=['DELETE'])
# #@jwt_required()
def delete_video(id):
    video = Video.query.get(id)
    if video is None:
        return jsonify({"error": "Video not found"}), 404
    
    db.session.delete(video)
    db.session.commit()
    return jsonify({"message": "Video deleted successfully"}), 200

@api.route('/inactive-accounts', methods=['GET'])
def get_inactive_accounts():
    accounts = InactiveAccount.query.all()
    account = list(map(lambda x: x.serialize(), accounts))
    return jsonify(account), 200

@api.route('/inactive-accounts/<int:id>/reactivate', methods=['POST'])
def reactivate_account(id):
    try:
        inactive_account = InactiveAccount.query.get_or_404(id)
        user = User.query.filter_by(email=inactive_account.email).first()
        
        if user:

            user.name = inactive_account.name
            user.last_active = datetime.utcnow()
            user.is_active = True
        else:
            user = User(
                name=inactive_account.name,
                email=inactive_account.email,
                type=inactive_account.type,
                last_active=datetime.utcnow(),
                is_active=True
            )
            db.session.add(user)
        
        

        db.session.delete(inactive_account)
        db.session.commit()
        return jsonify(user.to_dict()), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/inactive-accounts/<int:id>/send-reminder', methods=['POST'])
def send_reminder(id):
    account = InactiveAccount.query.get_or_404(id)
    return jsonify({'message': f'Reminder sent to {account.email}'}), 200

@api.route('/inactive-accounts/<int:id>', methods=['DELETE'])
def delete_inactive_account(id):
    account = InactiveAccount.query.get_or_404(id)
    db.session.delete(account)
    db.session.commit()
    return '', 204

    # Add sample data to the InactiveAccount table, for testing purposes, do in postman
@api.route('/add-sample-data', methods=['POST'])
def add_sample_data():
    sample_data = [
        {
            'name': "Juan Pérez",
            'email': "juan@example.com",
            'last_active': datetime(2023, 1, 15),
            'type': "Padre",
            'reason': "No completó registro",
        },
        {
            'name': "María García",
            'email': "maria@example.com",
            'last_active': datetime(2023, 2, 20),
            'type': "Profesor",
            'reason': "Baja temporal",
        },
        {
            'name': "Carlos Rodríguez",
            'email': "carlos@example.com",
            'last_active': datetime(2023, 3, 10),
            'type': "Padre",
            'reason': "Inactividad prolongada",
        },
    ]

    for data in sample_data:
        account = InactiveAccount(**data)
        db.session.add(account)

    db.session.commit()
    return jsonify({'message': 'Sample data added successfully'}), 201

@api.route('/approvals', methods=['GET'])
def get_approvals():
    approvals = Approval.query.all()
    approval = list(map(lambda x: x.serialize(), approvals))
    return jsonify(approval), 200


@api.route('/approvals/<int:id>', methods=['PATCH'])
def update_approval_status(id):
    try:
        approval = Approval.query.filter_by(id=id).first()
        if not approval:
            return jsonify({'error': f'Approval with id {id} not found'}), 404

        data = request.json

        if 'status' not in data:
            return jsonify({'error': 'Status field is required'}), 400

        
        if data['status'] not in ['pending', 'approved', 'rejected']:
            return jsonify({'error': 'Invalid status value'}), 400

        approval.status = data['status']
        db.session.commit()

        return jsonify(approval.serialize()), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('approvals/data', methods=['POST'])
def add_sample_approvals_data():
    sample_data = [
        {
            'type': 'Inscripción',
            'name': 'Ana Martínez',
            'details': 'Solicitud de inscripción para el programa de verano',
            'status': 'pending',
            'date': datetime(2025, 10, 1).date(),
        },
        {
            'type': 'Cambio de Horario',
            'name': 'Luis Sánchez',
            'details': 'Solicitud de cambio de horario de tarde a mañana',
            'status': 'pending',
            'date': datetime(2025, 10, 1).date(),
        },
        {
            'type': 'Actividad Especial',
            'name': 'Sofía Rodríguez',
            'details': 'Propuesta de actividad de pintura al aire libre',
            'status': 'pending',
            'date': datetime(2025, 10, 1).date(),
        },
    ]

    for data in sample_data:
        approval = Approval(**data)
        db.session.add(approval)

    db.session.commit()
    return jsonify({'message': 'Sample approvals data added successfully'}), 201




@api.route('/activities', methods=['GET'])
def get_activities():
    activities = Activity.query.all()
    return jsonify([activity.serialize() for activity in activities]), 200

@api.route('/activities/<int:id>', methods=['GET'])
def get_activity(id):
    activity = Activity.query.get_or_404(id)
    return jsonify(activity.serialize()), 200

@api.route('/activities', methods=['POST'])
# #@jwt_required()
def create_activity():
    try:
        image = None  
        if 'image' in request.files:
            file = request.files['image']
            if file:
                upload_result = cloudinary.uploader.upload(file)
                image = upload_result['secure_url']

        data = request.form.to_dict()
        
        required_fields = ['name', 'description', 'age_range', 'time', 'capacity', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        new_activity = Activity(
            
            name=data['name'],
            description=data['description'],
            image=image,
            age_range=data['age_range'],
            time=data['time'],
            capacity=int(data['capacity']),
            price=float(data['price']),
        )
        
        db.session.add(new_activity)
        db.session.commit()
        return jsonify(new_activity.serialize()), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/activities/<int:id>', methods=['PUT'])
# #@jwt_required()
def update_activity(id):
    try:
        
        activity = Activity.query.get_or_404(id)
        
        
        data = request.get_json()  
        print("Data received:", data)

        if 'image' in request.files:
            file = request.files['image']
            if file:
                upload_result = cloudinary.uploader.upload(file)
                activity.image = upload_result['secure_url']

        activity.name = data.get('name', activity.name)
        activity.description = data.get('description', activity.description)
        activity.age_range = data.get('age_range', activity.age_range)
        activity.time = data.get('time', activity.time)
        activity.capacity = int(data.get('capacity', activity.capacity))
        activity.price = float(data.get('price', activity.price))

        
        db.session.commit()
        return jsonify(activity.serialize()), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/activities/<int:id>', methods=['DELETE'])
# #@jwt_required()
def delete_activity(id):
    activity = Activity.query.get_or_404(id)
    try:
        db.session.delete(activity)
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Virtual Class routes
@api.route('/virtual-classes', methods=['GET'])
# @jwt_required()
def get_virtual_classes():
    virtual_classes = VirtualClass.query.all()
    return jsonify([vc.serialize() for vc in virtual_classes]), 200

@api.route('/virtual-classes/<int:id>', methods=['GET'])
@jwt_required()
def get_virtual_class(id):
    virtual_class = VirtualClass.query.get_or_404(id)
    return jsonify(virtual_class.serialize()), 200

@api.route('/virtual-classes', methods=['POST'])
# @jwt_required()
def create_virtual_class():
   
    try:
        data = request.json
        print(data)
        new_virtual_class = VirtualClass(
            name=data['name'],
            description=data['description'],
            date=datetime.fromisoformat(data['date']),
            time=data['time'],
            duration=data['duration'],
            teacher=data['teacher'],
            capacity=data['capacity'],
            price=data['price']
        )
        db.session.add(new_virtual_class)
        db.session.commit()
        return jsonify(new_virtual_class.serialize()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/virtual-classes/<int:id>', methods=['PUT'])
@jwt_required()
def update_virtual_class(id):
    try:
        virtual_class = VirtualClass.query.get_or_404(id)
        data = request.json
        virtual_class.name = data.get('name', virtual_class.name)
        virtual_class.description = data.get('description', virtual_class.description)
        virtual_class.date = datetime.fromisoformat(data.get('date', str(virtual_class.date)))
        virtual_class.time = data.get('time', virtual_class.time)
        virtual_class.duration = data.get('duration', virtual_class.duration)
        virtual_class.teacher = data.get('teacher', virtual_class.teacher)
        virtual_class.capacity = data.get('capacity', virtual_class.capacity)
        virtual_class.price = data.get('price', virtual_class.price)
        db.session.commit()
        return jsonify(virtual_class.serialize()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/virtual-classes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_virtual_class(id):
    virtual_class = VirtualClass.query.get_or_404(id)
    try:
        db.session.delete(virtual_class)
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/virtual-classes/sample-data', methods=['POST'])
def add_sample_virtual_classes():
    sample_data = [
                {
                    'name': 'Yoga for Kids',
                    'description': 'A fun and engaging yoga class for children.',
                    'date': '2023-11-01',
                    'time': '10:00',
                    'duration': '1',
                    'teacher': 'John Doe',
                    'capacity': 20,
                    'price': 15.0
                },
                {
                    'name': 'Art and Craft',
                    'description': 'Creative art and craft activities for kids.',
                    'date': '2023-11-02',
                    'time': '14:00',
                    'duration': '2 hours',
                    'teacher': 'Jane Smith',
                    'capacity': 15,
                    'price': 20.0
                },
                {
                    'name': 'Science Experiments',
                    'description': 'Exciting science experiments for young minds.',
                    'date': '2023-11-03',
                    'time': '16:00',
                    'duration': '1.5 hours',
                    'teacher': 'Albert Einstein',
                    'capacity': 25,
                    'price': 25.0
                }
            ]

    for data in sample_data:
        new_virtual_class = VirtualClass(
            name=data['name'],
            description=data['description'],
            date=datetime.fromisoformat(data['date']),
            time=data['time'],
            duration=data['duration'],
            teacher=data['teacher'],
            capacity=data['capacity'],
            price=data['price']
        )
        db.session.add(new_virtual_class)

    db.session.commit()
    return jsonify({'message': 'Sample virtual classes added successfully'}), 201

@api.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    services = list(map(lambda x: x.serialize(), services))
    return jsonify(services), 200

@api.route('/services/<int:id>', methods=['GET'])
def get_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service.serialize()), 200

@api.route('/services', methods=['POST'])
#@jwt_required()
def create_service():
    data = request.json
    new_service = Service(
        name=data['name'],
        description=data.get('description', ''),
        image=data.get('image','')
    )
    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.serialize()), 201

@api.route('/services/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted"}), 200

@api.route('/services/<int:id>', methods=['PUT'])
#@jwt_required()
def update_services(id):
    service = Service.query.get(id)
    if service is None:
        return jsonify({"error": "Service not found"}), 404
    
    data = request.json
    service.name = data.get('name', service.name)
    service.description = data.get('description', service.description)
    service.image = data.get('image', service.image)

    db.session.commit()
    return jsonify(service.serialize()), 200






@api.route('/parent-data', methods=['GET'])
@jwt_required()
def get_parent_data():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    return jsonify(parent.serialize()), 200

@api.route('/parent-children', methods=['GET'])
@jwt_required()
def get_parent_children():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    children = Child.query.filter_by(parent_id=parent.id).all()
    return jsonify([child.serialize() for child in children]), 200

@api.route('/parent-activities', methods=['GET'])
def get_parent_activities():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    activities = ParentActivity.query.filter_by(parent_id=parent.id).all()
    return jsonify([activity.serialize() for activity in activities]), 200

@api.route('/add-parent-activity', methods=['POST'])
def add_parent_activity():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404

    data = request.json
    new_activity = ParentActivity(
        parent_id=parent.id,
        name=data['name'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time=datetime.strptime(data['time'], '%H:%M:%S').time(),
        duration=data['duration'],
        status=data['status'],
        location=data['location']
    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.serialize()), 201

@api.route('/parent-schedule', methods=['GET'])
@jwt_required()
def get_parent_schedule():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    schedule = ParentSchedule.query.filter_by(parent_id=parent.id).all()
    return jsonify([s.serialize() for s in schedule]), 200

@api.route('/parent-payments', methods=['GET'])
@jwt_required()
def get_parent_payments():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    payments = ParentPayment.query.filter_by(parent_id=parent.id).all()
    return jsonify([payment.serialize() for payment in payments]), 200

@api.route('/parent-settings', methods=['GET', 'PUT'])
@jwt_required()
def parent_settings():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404

    if request.method == 'GET':
        settings = ParentSetting.query.filter_by(parent_id=parent.id).first()
        return jsonify(settings.serialize() if settings else {}), 200
    
    elif request.method == 'PUT':
        data = request.json
        settings = ParentSetting.query.filter_by(parent_id=parent.id).first()
        if not settings:
            settings = ParentSetting(parent_id=parent.id)
        
        settings.notifications = data.get('notifications', settings.notifications)
        settings.language = data.get('language', settings.language)
        
        db.session.add(settings)
        db.session.commit()
        return jsonify(settings.serialize()), 200

@api.route('/parent-virtual-classes', methods=['GET'])
@jwt_required()
def get_parent_virtual_classes():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    virtual_classes = ParentVirtualClass.query.filter_by(parent_id=parent.id).all()
    return jsonify([vc.serialize() for vc in virtual_classes]), 200

@api.route('/parent-messages', methods=['GET', 'POST'])
@jwt_required()
def parent_messages():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404

    if request.method == 'GET':
        messages = MessageP.query.filter_by(parent_id=parent.id).order_by(Message.timestamp.desc()).all()
        return jsonify([message.serialize() for message in messages]), 200
    
    elif request.method == 'POST':
        data = request.json
        new_message = MessageP(
            parent_id=parent.id,
            content=data['content'],
            sender='parent',
            timestamp=datetime.utcnow()
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify(new_message.serialize()), 201

@api.route('/populate-database', methods=['POST'])
def populate_database():
    try:
        # Create sample users and parents
        for i in range(5):
            user = User(
                username=f"parent{i+1}",
                email=f"parent{i+1}@example.com",
                password_hash=generate_password_hash("password123"),
                role="parent"
            )
            db.session.add(user)
            db.session.commit()

            parent = Parent(
                user_id=user.id,
                emergency_contact=f"123-456-{7890+i}"
            )
            db.session.add(parent)
            db.session.commit()

            # Create children for each parent
            for j in range(random.randint(1, 3)):
                child = Child(
                    parent_id=parent.id,
                    name=f"Child{j+1} of Parent{i+1}",
                    date_of_birth=datetime.now() - timedelta(days=random.randint(3*365, 10*365)),
                    allergies="None" if random.choice([True, False]) else "Peanuts, Milk",
                    birth_certificate="BC12345",
                    immunization_records="IR67890"
                )
                db.session.add(child)

            # Create activities
            activities = ["Swimming", "Art Class", "Music Lesson", "Story Time", "Outdoor Play"]
            for _ in range(random.randint(3, 7)):
                activity = ParentActivity(
                    parent_id=parent.id,
                    name=random.choice(activities),
                    date=datetime.now() + timedelta(days=random.randint(1, 30)),
                    time=datetime.strptime(f"{random.randint(8,17)}:00", "%H:%M").time(),
                    duration=f"{random.randint(1, 3)} hours",
                    status=random.choice(["Scheduled", "Completed", "Cancelled"]),
                    location=random.choice(["Main Hall", "Playground", "Room A", "Room B"])
                )
                db.session.add(activity)

            # Create schedule
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            for day in days:
                schedule = ParentSchedule(
                    parent_id=parent.id,
                    day=day,
                    activities=", ".join(random.sample(activities, 3))
                )
                db.session.add(schedule)

            # Create payments
            for _ in range(random.randint(2, 5)):
                payment = ParentPayment(
                    parent_id=parent.id,
                    amount=round(random.uniform(50, 500), 2),
                    concept=random.choice(["Monthly Fee", "Activity Fee", "Material Cost", "Field Trip"]),
                    status=random.choice(["Paid", "Pending", "Overdue"]),
                    due_date=datetime.now() + timedelta(days=random.randint(-10, 30))
                )
                db.session.add(payment)

            # Create settings
            settings = ParentSetting(
                parent_id=parent.id,
                notifications=random.choice([True, False]),
                language=random.choice(["en", "es"])
            )
            db.session.add(settings)

            # Create virtual classes
            for _ in range(random.randint(1, 4)):
                virtual_class = ParentVirtualClass(
                    parent_id=parent.id,
                    name=random.choice(["English Class", "Math Tutoring", "Science Experiment", "Storytelling"]),
                    date=datetime.now() + timedelta(days=random.randint(1, 14)),
                    time=datetime.strptime(f"{random.randint(8,17)}:00", "%H:%M").time(),
                    link=f"https://meet.example.com/class{random.randint(1000,9999)}"
                )
                db.session.add(virtual_class)

            # Create messages
            for _ in range(random.randint(3, 10)):
                message = MessageP(
                    parent_id=parent.id,
                    content=random.choice([
                        "Hello, how is my child doing today?",
                        "Can you please provide more information about the upcoming field trip?",
                        "I'll be late for pickup today, my apologies.",
                        "Is there anything special my child needs to bring tomorrow?",
                        "Thank you for taking care of my child!",
                        "Could you please update me on my child's progress in reading?",
                        "I have a question about the new school policy.",
                        "Just wanted to inform you that we'll be on vacation next week."
                    ]),
                    sender=random.choice(["parent", "staff"]),
                    timestamp=datetime.now() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))
                )
                db.session.add(message)

        db.session.commit()
        return jsonify({"message": "Database populated successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

