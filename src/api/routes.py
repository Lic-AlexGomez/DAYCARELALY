import cloudinary,os # type: ignore
from cloudinary.uploader import upload# type: ignore
from cloudinary.utils import cloudinary_url# type: ignore
from flask import Flask, request, jsonify, Blueprint, current_app # type: ignore
from api.models import db, Newsletter, User, Parent, Teacher, Child, Class, Enrollment, Program, Contact, Subscription, ProgressReport, Event, Message, Task, Attendance, Grade, Payment, Schedule, Course, Notification, Getintouch, Client, Email, Video, Eventsuscriptions, InactiveAccount, Approval, AdminD, Activity, VirtualClass,Service,Gallery, ParentVirtualClass,ParentActivity,ParentAttendance,ParentGrade,ParentCourse,ParentEvent,ParentPayment,ParentNotification,ParentPaymentHistory,ParentSchedule,ParentService,ParentSetting,ParentSubscription,ParentTask,MessageP,Settings
from api.utils import APIException
from flask_cors import CORS# type: ignore
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager# type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash # type: ignore
from sqlalchemy.exc import SQLAlchemyError # type: ignore
from werkzeug.security import generate_password_hash # type: ignore
from faker import Faker # type: ignore
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
fake = Faker()
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

    # Creación del token de acceso
    access_token = create_access_token(identity=str(user.id))
    print("Token generado:", access_token)
    
    # Almacenamiento de los datos importantes
    response = {
        "token": access_token,
        "user": user.serialize()
    }

    # Verificación y registro de lo que se ha almacenado en la respuesta
    print("Datos de la respuesta:", response)

    return jsonify(response), 200


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
@jwt_required()
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
def create_child():
    data = request.json
    print(data)
    new_child = Child(
        parent_id=data['parent_id'],
        name=data['name'],
        date_of_birth=datetime.fromisoformat(data['date_of_birth']),
        allergies=data.get('allergies', ''),
        immunization_records=data.get('immunization_records', ''),
        birth_certificate=data.get('birth_certificate', ''),
       
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
def get_subscriptions():
    subscriptions = Subscription.query.all()
    return jsonify([subscription.serialize() for subscription in subscriptions]), 200

@api.route('/subscriptions/<int:id>', methods=['GET'])
def get_subscription(id):
    subscription = Subscription.query.get_or_404(id)
    return jsonify(subscription.serialize()), 200

@api.route('/subscriptions', methods=['POST'])
# #@jwt_required()
def create_subscriptions():
    
        data = request.json

        new_subscription = Subscription(
            student_name=data['student_name'] ,
            class_name= data['class_name'],
            start_date=data['start_date'],
            
            
        )
        
        db.session.add(new_subscription)
        db.session.commit()
        return jsonify(new_subscription.serialize()), 201

    
@api.route('/subscriptions/<int:id>', methods=['PUT'])
# #@jwt_required()
def update_subscription(id):
    
        
        subscription = Subscription.query.get_or_404(id)
        
        
        data = request.get_json() 

        subscription.class_name = data.get('class_name', subscription.class_name)
        subscription.student_name = data.get('student_name', subscription.student_name)
        subscription.parent_id = data.get('parent_id', subscription.parent_id)
        subscription.plan_type = data.get('plan_type', subscription.plan_type)
        subscription.start_date = data.get('start_date', subscription.start_date)
        subscription.end_date = data.get('end_date', subscription.end_date)
    
        
        db.session.commit()
        return jsonify(subscription.serialize()), 200
        

@api.route('/subscriptions/<int:id>', methods=['DELETE'])
# #@jwt_required()
def delete_subscription(id):
    subscription = Subscription.query.get_or_404(id)
    try:
        db.session.delete(subscription)
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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


@api.route('/gallery', methods=['GET'])
def get_images():
    images = Gallery.query.all()
    images = list(map(lambda x: x.serialize(), images))
    return jsonify(images), 200

@api.route('/gallery/<int:id>', methods=['GET'])
def get_image(id):
    images = Gallery.query.get(id)
    if not images:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(images.serialize()), 200

@api.route('/gallery', methods=['POST'])
#@jwt_required()
def create_image():
    data = request.json
    new_image = Gallery(
        name=data['name'],
        image=data.get('image','')
    )
    db.session.add(new_image)
    db.session.commit()
    return jsonify(new_image.serialize()), 201

@api.route('/gallery/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_image(id):
    image = Gallery.query.get(id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted"}), 200

@api.route('/gallery/<int:id>', methods=['PUT'])
#@jwt_required()
def update_image(id):
    image = Gallery.query.get(id)
    if image is None:
        return jsonify({"error": "image not found"}), 404
    
    data = request.json
    image.name = data.get('name', image.name)
    image.image = data.get('image', image.image)

    db.session.commit()
    return jsonify(image.serialize()), 200

# PARENT ROUTES CRUD
# ParentActivity, ParentCourse,ParentAttendance,ParentEvent,ParentGrade,ParentNotification,ParentPayment,ParentPaymentHistory,ParentSchedule,ParentService,ParentSubscription,ParentSetting,ParentTask,ParentVirtualClass,MessageP
@api.route('/parent_activities', methods=['GET'])
def get_parent_activities():
    activities = ParentActivity.query.all()
    return jsonify([activity.serialize() for activity in activities]), 200

@api.route('/parent_activities/<int:id>', methods=['GET'])
def get_parent_activity(id):
    activity = ParentActivity.query.get(id)
    if activity is None:
        return jsonify({"error": "Activity not found"}), 404
    return jsonify(activity.serialize()), 200

@api.route('/parent_activities', methods=['POST'])
def create_parent_activity():
    data = request.get_json()
    new_activity = ParentActivity(
        parent_id=data['parent_id'],
        name=data['name'],
        date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
        time=datetime.strptime(data['time'], "%H:%M:%S").time(),
        duration=data['duration'],
        status=data['status'],
        location=data['location']
    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.serialize()), 201

@api.route('/parent_activities/<int:id>', methods=['PUT'])
def update_parent_activity(id):
    activity = ParentActivity.query.get(id)
    if activity is None:
        return jsonify({"error": "Activity not found"}), 404
    data = request.get_json()
    activity.parent_id = data.get('parent_id', activity.parent_id)
    activity.name = data.get('name', activity.name)
    activity.date = datetime.strptime(data.get('date', activity.date.isoformat()), "%Y-%m-%d").date()
    activity.time = datetime.strptime(data.get('time', activity.time.isoformat()), "%H:%M:%S").time()
    activity.duration = data.get('duration', activity.duration)
    activity.status = data.get('status', activity.status)
    activity.location = data.get('location', activity.location)
    db.session.commit()
    return jsonify(activity.serialize()), 200

@api.route('/parent_activities/<int:id>', methods=['DELETE'])
def delete_parent_activity(id):
    activity = ParentActivity.query.get(id)
    if activity is None:
        return jsonify({"error": "Activity not found"}), 404
    db.session.delete(activity)
    db.session.commit()
    return jsonify({"message": "Activity deleted"}), 200

@api.route('/parent_schedules', methods=['GET'])
def get_parent_schedules():
    schedules = ParentSchedule.query.all()
    return jsonify([schedule.serialize() for schedule in schedules]), 200

@api.route('/parent_schedules/<int:id>', methods=['GET'])
def get_parent_schedule(id):
    schedule = ParentSchedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    return jsonify(schedule.serialize()), 200

@api.route('/parent_schedules', methods=['POST'])
def create_parent_schedule():
    data = request.get_json()
    new_schedule = ParentSchedule(
        parent_id=data['parent_id'],
        day=data['day'],
        activities=", ".join(data['activities'])
    )
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify(new_schedule.serialize()), 201

@api.route('/parent_schedules/<int:id>', methods=['PUT'])
def update_parent_schedule(id):
    schedule = ParentSchedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    data = request.get_json()
    schedule.parent_id = data.get('parent_id', schedule.parent_id)
    schedule.day = data.get('day', schedule.day)
    schedule.activities = ", ".join(data.get('activities', schedule.activities.split(', ')))
    db.session.commit()
    return jsonify(schedule.serialize()), 200

@api.route('/parent_schedules/<int:id>', methods=['DELETE'])
def delete_parent_schedule(id):
    schedule = ParentSchedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted"}), 200

@api.route('/parent_payments', methods=['GET'])
def get_parent_payments():
    payments = ParentPayment.query.all()
    return jsonify([payment.serialize() for payment in payments]), 200

@api.route('/parent_payments/<int:id>', methods=['GET'])
def get_parent_payment(id):
    payment = ParentPayment.query.get(id)
    if payment is None:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify(payment.serialize()), 200

@api.route('/parent_payments', methods=['POST'])
def create_parent_payment():
    data = request.get_json()
    new_payment = ParentPayment(
        parent_id=data['parent_id'],
        amount=data['amount'],
        concept=data['concept'],
        status=data['status'],
        due_date=datetime.strptime(data['due_date'], "%Y-%m-%d").date()
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify(new_payment.serialize()), 201

@api.route('/parent_payments/<int:id>', methods=['PUT'])
def update_parent_payment(id):
    payment = ParentPayment.query.get(id)
    if payment is None:
        return jsonify({"error": "Payment not found"}), 404
    data = request.get_json()
    payment.parent_id = data.get('parent_id', payment.parent_id)
    payment.amount = data.get('amount', payment.amount)
    payment.concept = data.get('concept', payment.concept)
    payment.status = data.get('status', payment.status)
    payment.due_date = datetime.strptime(data.get('due_date', payment.due_date.isoformat()), "%Y-%m-%d").date()
    db.session.commit()
    return jsonify(payment.serialize()), 200

@api.route('/parent_payments/<int:id>', methods=['DELETE'])
def delete_parent_payment(id):
    payment = ParentPayment.query.get(id)
    if payment is None:
        return jsonify({"error": "Payment not found"}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({"message": "Payment deleted"}), 200

@api.route('/parent_settings', methods=['GET'])
def get_parent_settings():
    settings = ParentSetting.query.all()
    return jsonify([setting.serialize() for setting in settings]), 200

@api.route('/parent_settings/<int:id>', methods=['GET'])
def get_parent_setting(id):
    setting = ParentSetting.query.get(id)
    if setting is None:
        return jsonify({"error": "Setting not found"}), 404
    return jsonify(setting.serialize()), 200

@api.route('/parent_settings', methods=['POST'])
def create_parent_setting():
    data = request.get_json()
    new_setting = ParentSetting(
        parent_id=data['parent_id'],
        notifications=data.get('notifications', True),
        language=data.get('language', 'es')
    )
    db.session.add(new_setting)
    db.session.commit()
    return jsonify(new_setting.serialize()), 201

@api.route('/parent_settings/<int:id>', methods=['PUT'])
def update_parent_setting(id):
    setting = ParentSetting.query.get(id)
    if setting is None:
        return jsonify({"error": "Setting not found"}), 404
    data = request.get_json()
    setting.parent_id = data.get('parent_id', setting.parent_id)
    setting.notifications = data.get('notifications', setting.notifications)
    setting.language = data.get('language', setting.language)
    db.session.commit()
    return jsonify(setting.serialize()), 200

@api.route('/parent_settings/<int:id>', methods=['DELETE'])
def delete_parent_setting(id):
    setting = ParentSetting.query.get(id)
    if setting is None:
        return jsonify({"error": "Setting not found"}), 404
    db.session.delete(setting)
    db.session.commit()
    return jsonify({"message": "Setting deleted"}), 200

@api.route('/parent_virtual_classes', methods=['GET'])
def get_parent_virtual_classes():
    classes = ParentVirtualClass.query.all()
    return jsonify([cls.serialize() for cls in classes]), 200

@api.route('/parent_virtual_classes/<int:id>', methods=['GET'])
def get_parent_virtual_class(id):
    cls = ParentVirtualClass.query.get(id)
    if cls is None:
        return jsonify({"error": "Virtual class not found"}), 404
    return jsonify(cls.serialize()), 200

@api.route('/parent_virtual_classes', methods=['POST'])
def create_parent_virtual_class():
    data = request.get_json()
    new_class = ParentVirtualClass(
        parent_id=data['parent_id'],
        name=data['name'],
        date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
        time=datetime.strptime(data['time'], "%H:%M:%S").time(),
        link=data['link']
    )
    db.session.add(new_class)
    db.session.commit()
    return jsonify(new_class.serialize()), 201

@api.route('/parent_virtual_classes/<int:id>', methods=['PUT'])
def update_parent_virtual_class(id):
    cls = ParentVirtualClass.query.get(id)
    if cls is None:
        return jsonify({"error": "Virtual class not found"}), 404
    data = request.get_json()
    cls.parent_id = data.get('parent_id', cls.parent_id)
    cls.name = data.get('name', cls.name)
    cls.date = datetime.strptime(data.get('date', cls.date.isoformat()), "%Y-%m-%d").date()
    cls.time = datetime.strptime(data.get('time', cls.time.isoformat()), "%H:%M:%S").time()
    cls.link = data.get('link', cls.link)
    db.session.commit()
    return jsonify(cls.serialize()), 200

@api.route('/parent_virtual_classes/<int:id>', methods=['DELETE'])
def delete_parent_virtual_class(id):
    cls = ParentVirtualClass.query.get(id)
    if cls is None:
        return jsonify({"error": "Virtual class not found"}), 404
    db.session.delete(cls)
    db.session.commit()
    return jsonify({"message": "Virtual class deleted"}), 200
# fill data virtual class
@api.route('/parent_virtual_classes/sample-data', methods=['POST'])
def add_sample_parent_virtual_classes():
    sample_data = [
                {
                    'parent_id': 1,
                    'name': 'Yoga for Kids',
                    'date': '2023-11-01',
                    'time': '10:00:00',
                    'link': 'https://example.com/yoga'
                },
                {
                    'parent_id': 2,
                    'name': 'Art and Craft',
                    'date': '2023-11-02',
                    'time': '14:00:00',
                    'link': 'https://example.com/art'
                },
                {
                    'parent_id': 1,
                    'name': 'Science Experiments',
                    'date': '2023-11-03',
                    'time': '16:00:00',
                    'link': 'https://example.com/science'
                }
            ]

    for data in sample_data:
        new_class = ParentVirtualClass(
            parent_id=data['parent_id'],
            name=data['name'],
            date=datetime.fromisoformat(data['date']),
            time=datetime.strptime(data['time'], "%H:%M:%S").time(),
            link=data['link']
        )
        db.session.add(new_class)

    db.session.commit()
    return jsonify({'message': 'Sample parent virtual classes added successfully'}), 201

@api.route('/messagesP', methods=['GET'])
def get_messages():
    messages = MessageP.query.all()
    return jsonify([message.serialize() for message in messages]), 200

@api.route('/messages/<int:id>', methods=['GET'])
def get_message(id):
    message = MessageP.query.get(id)
    if message is None:
        return jsonify({"error": "Message not found"}), 404
    return jsonify(message.serialize()), 200

@api.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    new_message = MessageP(
        parent_id=data['parent_id'],
        content=data['content'],
        sender=data['sender']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.serialize()), 201

@api.route('/messages/<int:id>', methods=['PUT'])
def update_message(id):
    message = MessageP.query.get(id)
    if message is None:
        return jsonify({"error": "Message not found"}), 404
    data = request.get_json()
    message.parent_id = data.get('parent_id', message.parent_id)
    message.content = data.get('content', message.content)
    message.sender = data.get('sender', message.sender)
    db.session.commit()
    return jsonify(message.serialize()), 200

@api.route('/messages/<int:id>', methods=['DELETE'])
def delete_message(id):
    message = MessageP.query.get(id)
    if message is None:
        return jsonify({"error": "Message not found"}), 404
    db.session.delete(message)
    db.session.commit()
    return jsonify({"message": "Message deleted"}), 200

@api.route('/parent_notifications', methods=['GET'])
def get_parent_notifications():
    notifications = ParentNotification.query.all()
    return jsonify([notification.serialize() for notification in notifications]), 200

@api.route('/parent_notifications/<int:id>', methods=['GET'])
def get_parent_notification(id):
    notification = ParentNotification.query.get(id)
    if notification is None:
        return jsonify({"error": "Notification not found"}), 404
    return jsonify(notification.serialize()), 200

@api.route('/parent_notifications', methods=['POST'])
def create_parent_notification():
    data = request.get_json()
    new_notification = ParentNotification(
        parent_id=data['parent_id'],
        content=data['content'],
        status=data.get('status', 'unread')
    )
    db.session.add(new_notification)
    db.session.commit()
    return jsonify(new_notification.serialize()), 201

@api.route('/parent_notifications/<int:id>', methods=['PUT'])
def update_parent_notification(id):
    notification = ParentNotification.query.get(id)
    if notification is None:
        return jsonify({"error": "Notification not found"}), 404
    data = request.get_json()
    notification.parent_id = data.get('parent_id', notification.parent_id)
    notification.content = data.get('content', notification.content)
    notification.status = data.get('status', notification.status)
    db.session.commit()
    return jsonify(notification.serialize()), 200

@api.route('/parent_notifications/<int:id>', methods=['DELETE'])
def delete_parent_notification(id):
    notification = ParentNotification.query.get(id)
    if notification is None:
        return jsonify({"error": "Notification not found"}), 404
    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200

@api.route('/parent_tasks', methods=['GET'])
def get_parent_tasks():
    tasks = ParentTask.query.all()
    return jsonify([task.serialize() for task in tasks]), 200

@api.route('/parent_tasks/<int:id>', methods=['GET'])
def get_parent_task(id):
    task = ParentTask.query.get(id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.serialize()), 200

@api.route('/parent_tasks', methods=['POST'])
def create_parent_task():
    data = request.get_json()
    new_task = ParentTask(
        parent_id=data['parent_id'],
        title=data['title'],
        description=data['description'],
        due_date=datetime.strptime(data['due_date'], "%Y-%m-%d").date(),
        status=data['status']
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.serialize()), 201

@api.route('/parent_tasks/<int:id>', methods=['PUT'])
def update_parent_task(id):
    task = ParentTask.query.get(id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    data = request.get_json()
    task.parent_id = data.get('parent_id', task.parent_id)
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.due_date = datetime.strptime(data.get('due_date', task.due_date.isoformat()), "%Y-%m-%d").date()
    task.status = data.get('status', task.status)
    db.session.commit()
    return jsonify(task.serialize()), 200

@api.route('/parent_tasks/<int:id>', methods=['DELETE'])
def delete_parent_task(id):
    task = ParentTask.query.get(id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200

@api.route('/parent_attendances', methods=['GET'])
def get_parent_attendances():
    attendances = ParentAttendance.query.all()
    return jsonify([attendance.serialize() for attendance in attendances]), 200

@api.route('/parent_attendances/<int:id>', methods=['GET'])
def get_parent_attendance(id):
    attendance = ParentAttendance.query.get(id)
    if attendance is None:
        return jsonify({"error": "Attendance not found"}), 404
    return jsonify(attendance.serialize()), 200

@api.route('/parent_attendances', methods=['POST'])
def create_parent_attendance():
    data = request.get_json()
    new_attendance = ParentAttendance(
        parent_id=data['parent_id'],
        class_id=data['class_id'],
        date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
        status=data['status']
    )
    db.session.add(new_attendance)
    db.session.commit()
    return jsonify(new_attendance.serialize()), 201

@api.route('/parent_attendances/<int:id>', methods=['PUT'])
def update_parent_attendance(id):
    attendance = ParentAttendance.query.get(id)
    if attendance is None:
        return jsonify({"error": "Attendance not found"}), 404
    data = request.get_json()
    attendance.parent_id = data.get('parent_id', attendance.parent_id)
    attendance.class_id = data.get('class_id', attendance.class_id)
    attendance.date = datetime.strptime(data.get('date', attendance.date.isoformat()), "%Y-%m-%d").date()
    attendance.status = data.get('status', attendance.status)
    db.session.commit()
    return jsonify(attendance.serialize()), 200

@api.route('/parent_attendances/<int:id>', methods=['DELETE'])
def delete_parent_attendance(id):
    attendance = ParentAttendance.query.get(id)
    if attendance is None:
        return jsonify({"error": "Attendance not found"}), 404
    db.session.delete(attendance)
    db.session.commit()
    return jsonify({"message": "Attendance deleted"}), 200


@api.route('/parent_grades', methods=['GET'])
def get_parent_grades():
    parent_grades = ParentGrade.query.all()
    return jsonify([pg.serialize() for pg in parent_grades])

@api.route('/parent_grades/<int:id>', methods=['GET'])
def get_parent_grade(id):
    parent_grade = ParentGrade.query.get(id)
    if parent_grade is None:
        return jsonify({"error": "ParentGrade not found"}), 404
    return jsonify(parent_grade.serialize())

@api.route('/parent_grades', methods=['POST'])
def create_parent_grade():
    data = request.get_json()
    new_parent_grade = ParentGrade(
        parent_id=data['parent_id'],
        class_id=data['class_id'],
        grade=data['grade'],
        date=data['date']
    )
    db.session.add(new_parent_grade)
    db.session.commit()
    return jsonify(new_parent_grade.serialize()), 201

@api.route('/parent_grades/<int:id>', methods=['PUT'])
def update_parent_grade(id):
    parent_grade = ParentGrade.query.get(id)
    if parent_grade is None:
        return jsonify({"error": "ParentGrade not found"}), 404
    data = request.get_json()
    parent_grade.parent_id = data.get('parent_id', parent_grade.parent_id)
    parent_grade.class_id = data.get('class_id', parent_grade.class_id)
    parent_grade.grade = data.get('grade', parent_grade.grade)
    parent_grade.date = data.get('date', parent_grade.date)
    db.session.commit()
    return jsonify(parent_grade.serialize())

@api.route('/parent_grades/<int:id>', methods=['DELETE'])
def delete_parent_grade(id):
    parent_grade = ParentGrade.query.get(id)
    if parent_grade is None:
        return jsonify({"error": "ParentGrade not found"}), 404
    db.session.delete(parent_grade)
    db.session.commit()
    return jsonify({"message": "ParentGrade deleted"}), 200

@api.route('/parent_payment_histories', methods=['GET'])
def get_parent_payment_histories():
    parent_payment_histories = ParentPaymentHistory.query.all()
    return jsonify([pph.serialize() for pph in parent_payment_histories])

@api.route('/parent_payment_histories/<int:id>', methods=['GET'])
def get_parent_payment_history(id):
    parent_payment_history = ParentPaymentHistory.query.get(id)
    if parent_payment_history is None:
        return jsonify({"error": "ParentPaymentHistory not found"}), 404
    return jsonify(parent_payment_history.serialize())

@api.route('/parent_payment_histories', methods=['POST'])
def create_parent_payment_history():
    data = request.get_json()
    new_parent_payment_history = ParentPaymentHistory(
        parent_id=data['parent_id'],
        amount=data['amount'],
        concept=data['concept'],
        status=data['status'],
        due_date=data['due_date']
    )
    db.session.add(new_parent_payment_history)
    db.session.commit()
    return jsonify(new_parent_payment_history.serialize()), 201

@api.route('/parent_payment_histories/<int:id>', methods=['PUT'])
def update_parent_payment_history(id):
    parent_payment_history = ParentPaymentHistory.query.get(id)
    if parent_payment_history is None:
        return jsonify({"error": "ParentPaymentHistory not found"}), 404
    data = request.get_json()
    parent_payment_history.parent_id = data.get('parent_id', parent_payment_history.parent_id)
    parent_payment_history.amount = data.get('amount', parent_payment_history.amount)
    parent_payment_history.concept = data.get('concept', parent_payment_history.concept)
    parent_payment_history.status = data.get('status', parent_payment_history.status)
    parent_payment_history.due_date = data.get('due_date', parent_payment_history.due_date)
    db.session.commit()
    return jsonify(parent_payment_history.serialize())

@api.route('/parent_payment_histories/<int:id>', methods=['DELETE'])
def delete_parent_payment_history(id):
    parent_payment_history = ParentPaymentHistory.query.get(id)
    if parent_payment_history is None:
        return jsonify({"error": "ParentPaymentHistory not found"}), 404
    db.session.delete(parent_payment_history)
    db.session.commit()
    return jsonify({"message": "ParentPaymentHistory deleted"}), 200

@api.route('/parent_subscriptions', methods=['GET'])
def get_parent_subscriptions():
    parent_subscriptions = ParentSubscription.query.all()
    return jsonify([ps.serialize() for ps in parent_subscriptions])

@api.route('/parent_subscriptions/<int:id>', methods=['GET'])
def get_parent_subscription(id):
    parent_subscription = ParentSubscription.query.get(id)
    if parent_subscription is None:
        return jsonify({"error": "ParentSubscription not found"}), 404
    return jsonify(parent_subscription.serialize())

@api.route('/parent_subscriptions', methods=['POST'])
def create_parent_subscription():
    data = request.get_json()
    new_parent_subscription = ParentSubscription(
        parent_id=data['parent_id'],
        plan_type=data['plan_type'],
        start_date=data['start_date'],
        end_date=data['end_date']
    )
    db.session.add(new_parent_subscription)
    db.session.commit()
    return jsonify(new_parent_subscription.serialize()), 201

@api.route('/parent_subscriptions/<int:id>', methods=['PUT'])
def update_parent_subscription(id):
    parent_subscription = ParentSubscription.query.get(id)
    if parent_subscription is None:
        return jsonify({"error": "ParentSubscription not found"}), 404
    data = request.get_json()
    parent_subscription.parent_id = data.get('parent_id', parent_subscription.parent_id)
    parent_subscription.plan_type = data.get('plan_type', parent_subscription.plan_type)
    parent_subscription.start_date = data.get('start_date', parent_subscription.start_date)
    parent_subscription.end_date = data.get('end_date', parent_subscription.end_date)
    db.session.commit()
    return jsonify(parent_subscription.serialize())

@api.route('/parent_subscriptions/<int:id>', methods=['DELETE'])
def delete_parent_subscription(id):
    parent_subscription = ParentSubscription.query.get(id)
    if parent_subscription is None:
        return jsonify({"error": "ParentSubscription not found"}), 404
    db.session.delete(parent_subscription)
    db.session.commit()
    return jsonify({"message": "ParentSubscription deleted"}), 200

@api.route('/parent_courses', methods=['GET'])
def get_parent_courses():
    parent_courses = ParentCourse.query.all()
    return jsonify([pc.serialize() for pc in parent_courses])

@api.route('/parent_courses/<int:id>', methods=['GET'])
def get_parent_course(id):
    parent_course = ParentCourse.query.get(id)
    if parent_course is None:
        return jsonify({"error": "ParentCourse not found"}), 404
    return jsonify(parent_course.serialize())

@api.route('/parent_courses', methods=['POST'])
def create_parent_course():
    data = request.get_json()
    new_parent_course = ParentCourse(
        parent_id=data['parent_id'],
        course_id=data['course_id'],
        enrollment_date=data['enrollment_date']
    )
    db.session.add(new_parent_course)
    db.session.commit()
    return jsonify(new_parent_course.serialize()), 201

@api.route('/parent_courses/<int:id>', methods=['PUT'])
def update_parent_course(id):
    parent_course = ParentCourse.query.get(id)
    if parent_course is None:
        return jsonify({"error": "ParentCourse not found"}), 404
    data = request.get_json()
    parent_course.parent_id = data.get('parent_id', parent_course.parent_id)
    parent_course.course_id = data.get('course_id', parent_course.course_id)
    parent_course.enrollment_date = data.get('enrollment_date', parent_course.enrollment_date)
    db.session.commit()
    return jsonify(parent_course.serialize())

@api.route('/parent_courses/<int:id>', methods=['DELETE'])
def delete_parent_course(id):
    parent_course = ParentCourse.query.get(id)
    if parent_course is None:
        return jsonify({"error": "ParentCourse not found"}), 404
    db.session.delete(parent_course)
    db.session.commit()
    return jsonify({"message": "ParentCourse deleted"}), 200

@api.route('/parent_services', methods=['GET'])
def get_parent_services():
    parent_services = ParentService.query.all()
    return jsonify([ps.serialize() for ps in parent_services])

@api.route('/parent_services/<int:id>', methods=['GET'])
def get_parent_service(id):
    parent_service = ParentService.query.get(id)
    if parent_service is None:
        return jsonify({"error": "ParentService not found"}), 404
    return jsonify(parent_service.serialize())

@api.route('/parent_services', methods=['POST'])
def create_parent_service():
    data = request.get_json()
    new_parent_service = ParentService(
        parent_id=data['parent_id'],
        service_id=data['service_id'],
        enrollment_date=data['enrollment_date']
    )
    db.session.add(new_parent_service)
    db.session.commit()
    return jsonify(new_parent_service.serialize()), 201

@api.route('/parent_services/<int:id>', methods=['PUT'])
def update_parent_service(id):
    parent_service = ParentService.query.get(id)
    if parent_service is None:
        return jsonify({"error": "ParentService not found"}), 404
    data = request.get_json()
    parent_service.parent_id = data.get('parent_id', parent_service.parent_id)
    parent_service.service_id = data.get('service_id', parent_service.service_id)
    parent_service.enrollment_date = data.get('enrollment_date', parent_service.enrollment_date)
    db.session.commit()
    return jsonify(parent_service.serialize())

@api.route('/parent_services/<int:id>', methods=['DELETE'])
def delete_parent_service(id):
    parent_service = ParentService.query.get(id)
    if parent_service is None:
        return jsonify({"error": "ParentService not found"}), 404
    db.session.delete(parent_service)
    db.session.commit()
    return jsonify({"message": "ParentService deleted"}), 200

@api.route('/parent_events', methods=['GET'])
def get_parent_events():
    parent_events = ParentEvent.query.all()
    return jsonify([pe.serialize() for pe in parent_events])

@api.route('/parent_events/<int:id>', methods=['GET'])
def get_parent_event(id):
    parent_event = ParentEvent.query.get(id)
    if parent_event is None:
        return jsonify({"error": "ParentEvent not found"}), 404
    return jsonify(parent_event.serialize())

@api.route('/parent_events', methods=['POST'])
def create_parent_event():
    data = request.get_json()
    new_parent_event = ParentEvent(
        parent_id=data['parent_id'],
        event_id=data['event_id'],
        enrollment_date=data['enrollment_date']
    )
    db.session.add(new_parent_event)
    db.session.commit()
    return jsonify(new_parent_event.serialize()), 201

@api.route('/parent_events/<int:id>', methods=['PUT'])
def update_parent_event(id):
    parent_event = ParentEvent.query.get(id)
    if parent_event is None:
        return jsonify({"error": "ParentEvent not found"}), 404
    data = request.get_json()
    parent_event.parent_id = data.get('parent_id', parent_event.parent_id)
    parent_event.event_id = data.get('event_id', parent_event.event_id)
    parent_event.enrollment_date = data.get('enrollment_date', parent_event.enrollment_date)
    db.session.commit()
    return jsonify(parent_event.serialize())

@api.route('/parent_events/<int:id>', methods=['DELETE'])
def delete_parent_event(id):
    parent_event = ParentEvent.query.get(id)
    if parent_event is None:
        return jsonify({"error": "ParentEvent not found"}), 404
    db.session.delete(parent_event)
    db.session.commit()
    return jsonify({"message": "ParentEvent deleted"}), 200




@api.route('/fill-database', methods=['POST'])
def fill_database():
    try:
        # Crear usuarios de prueba
        for _ in range(20):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password_hash=generate_password_hash('password'),
                role=fake.random_element(elements=('parent', 'teacher', 'admin')),
                profile_picture=fake.image_url(),
                created_at=datetime.utcnow()
            )
            db.session.add(user)
        db.session.commit()

        # Crear padres de prueba
        users = User.query.filter_by(role='parent').all()
        for user in users:
            parent = Parent(
                user_id=user.id,
                emergency_contact=fake.phone_number(),
            )
            db.session.add(parent)
        db.session.commit()

        # Crear niños de prueba
        parents = Parent.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 3)):  # Cada padre tiene entre 1 y 3 hijos
                child = Child(
                    parent_id=parent.id,
                    name=fake.first_name(),
                    date_of_birth=fake.date_of_birth(minimum_age=1, maximum_age=10),
                    allergies=fake.text(max_nb_chars=200),
                    birth_certificate=fake.file_name(),
                    immunization_records=fake.file_name()
                )
                db.session.add(child)
        db.session.commit()

        # Crear profesores de prueba
        users = User.query.filter_by(role='teacher').all()
        for user in users:
            teacher = Teacher(
                user_id=user.id,
                qualifications=fake.text(max_nb_chars=200),
                teaching_experience=fake.text(max_nb_chars=200),
                certifications=fake.file_name(),
                background_check=fake.file_name()
            )
            db.session.add(teacher)
        db.session.commit()

        # Crear clases de prueba
        teachers = Teacher.query.all()
        for _ in range(10):
            class_ = Class(
                teacher_id=random.choice(teachers).id if teachers else None,
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200),
                age=fake.random_element(elements=('3-5', '6-8', '9-12')),
                time=fake.time(),
                image=fake.image_url()
            )
            db.session.add(class_)
        db.session.commit()

        # Crear inscripciones de prueba
        children = Child.query.all()
        classes = Class.query.all()
        for child in children:
            enrollment = Enrollment(
                child_id=child.id,
                class_id=random.choice(classes).id,
                enrollment_date=fake.date_this_year()
            )
            db.session.add(enrollment)
        db.session.commit()

        # Crear programas de prueba
        for _ in range(5):
            program = Program(
                teacher_id=random.choice(teachers).id if teachers else None,
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200),
                age=random.randint(3, 12),
                time=fake.time()
            )
            db.session.add(program)
        db.session.commit()

        # Crear suscripciones de prueba
        parents = Parent.query.all()
        for parent in parents:
            subscription = Subscription(
                parent_id=parent.id,
                plan_type=fake.random_element(elements=('basic', 'premium', 'gold')),
                start_date=fake.date_this_year(),
                end_date=fake.date_between(start_date='+30d', end_date='+1y')
            )
            db.session.add(subscription)
        db.session.commit()

        # Crear informes de progreso de prueba
        children = Child.query.all()
        teachers = Teacher.query.all()
        for child in children:
            progress_report = ProgressReport(
                child_id=child.id,
                teacher_id=random.choice(teachers).id,
                report_date=fake.date_this_year(),
                content=fake.text(max_nb_chars=500)
            )
            db.session.add(progress_report)
        db.session.commit()

        # Crear eventos de prueba
        for _ in range(5):
            event = Event(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                start_time=fake.date_time_this_year(),
                end_time=fake.date_time_this_year(),
                image=fake.image_url()
            )
            db.session.add(event)
        db.session.commit()

        # Crear mensajes de prueba
        users = User.query.all()
        for _ in range(50):
            sender = random.choice(users)
            receiver = random.choice(users)
            while receiver.id == sender.id:  # Asegurarse de que el remitente y el receptor no sean el mismo
                receiver = random.choice(users)
            message = Message(
                sender_id=sender.id,
                receiver_id=receiver.id,
                content=fake.text(max_nb_chars=200),
                timestamp=fake.date_time_this_year()
            )
            db.session.add(message)
        db.session.commit()

        # Crear tareas de prueba
        teachers = Teacher.query.all()
        for teacher in teachers:
            for _ in range(random.randint(1, 5)):
                task = Task(
                    teacher_id=teacher.id,
                    title=fake.sentence(),
                    description=fake.text(max_nb_chars=200),
                    due_date=fake.date_this_year(),
                    status=fake.random_element(elements=('pending', 'completed', 'in progress'))
                )
                db.session.add(task)
        db.session.commit()

        # Crear asistencias de prueba
        children = Child.query.all()
        classes = Class.query.all()
        for child in children:
            for _ in range(random.randint(1, 5)):
                attendance = Attendance(
                    child_id=child.id,
                    class_id=random.choice(classes).id,
                    date=fake.date_this_year(),
                    status=fake.random_element(elements=('present', 'absent', 'late'))
                )
                db.session.add(attendance)
        db.session.commit()

        # Crear calificaciones de prueba
        for child in children:
            for _ in range(random.randint(1, 5)):
                grade = Grade(
                    child_id=child.id,
                    class_id=random.choice(classes).id,
                    grade=fake.random_element(elements=('A', 'B', 'C', 'D', 'F')),
                    date=fake.date_this_year()
                )
                db.session.add(grade)
        db.session.commit()

        # Crear pagos de prueba
        parents = Parent.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                payment = Payment(
                    parent_id=parent.id,
                    amount=random.uniform(50, 500),
                    date=fake.date_this_year()
                )
                db.session.add(payment)
        db.session.commit()

        # Crear cursos de prueba
        for _ in range(5):
            course = Course(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                price=random.uniform(50, 200),
                age=random.randint(3, 12)
            )
            db.session.add(course)
        db.session.commit()

        # Crear notificaciones de prueba
        users = User.query.all()
        for user in users:
            for _ in range(random.randint(1, 5)):
                notification = Notification(
                    user_id=user.id,
                    content=fake.text(max_nb_chars=200),
                    date=fake.date_time_this_year(),
                    status=fake.random_element(elements=('unread', 'read'))
                )
                db.session.add(notification)
        db.session.commit()

        # Crear contactos de prueba
        for _ in range(10):
            contact = Contact(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            subject=fake.sentence(),
            phone_number=fake.numerify(text='###########'),  # Número de 11 dígitos
            message=fake.text(max_nb_chars=200)
        )
            db.session.add(contact)
        db.session.commit()

        # Crear suscripciones a boletines de prueba
        for _ in range(10):
            newsletter = Newsletter(
                email=fake.email()
            )
            db.session.add(newsletter)
        db.session.commit()

        # Crear actividades de prueba
        for _ in range(10):
            activity = Activity(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                image=fake.image_url(),
                age_range=fake.random_element(elements=('3-5', '6-8', '9-12')),
                time=fake.time(),
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200)
            )
            db.session.add(activity)
        db.session.commit()

        # Crear clases virtuales de prueba
        teachers = Teacher.query.all()
        for _ in range(5):
            virtual_class = VirtualClass(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                date=fake.date_this_year(),
                time=fake.time(),
                duration=fake.random_element(elements=('1 hour', '2 hours', '3 hours')),
                teacher=random.choice(teachers).user.username,
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200)
            )
            db.session.add(virtual_class)
        db.session.commit()

        return jsonify({"message": "Database filled with test data successfully!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500








@api.route('/fill-all-models', methods=['POST'])
def fill_all_models():
    parent_ids = [parent.id for parent in db.session.query(Parent).all()]
    try:
        # Crear usuarios de prueba (necesarios para relaciones)
        for _ in range(20):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password_hash=generate_password_hash('password'),
                role=fake.random_element(elements=('parent', 'teacher', 'admin')),
                profile_picture=fake.image_url(),
                created_at=datetime.utcnow()
            )
            db.session.add(user)
        db.session.commit()

        # Crear padres de prueba
        users = User.query.filter_by(role='parent').all()
        for user in users:
            parent = Parent(
                user_id=user.id,
                emergency_contact=fake.phone_number(),
            )
            db.session.add(parent)
        db.session.commit()

        # Crear niños de prueba
        parents = Parent.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 3)):  # Cada padre tiene entre 1 y 3 hijos
                child = Child(
                    parent_id=parent.id,
                    name=fake.first_name(),
                    date_of_birth=fake.date_of_birth(minimum_age=1, maximum_age=10),
                    allergies=fake.text(max_nb_chars=200),
                    birth_certificate=fake.file_name(),
                    immunization_records=fake.file_name()
                )
                db.session.add(child)
        db.session.commit()

        # Crear profesores de prueba
        users = User.query.filter_by(role='teacher').all()
        for user in users:
            teacher = Teacher(
                user_id=user.id,
                qualifications=fake.text(max_nb_chars=200),
                teaching_experience=fake.text(max_nb_chars=200),
                certifications=fake.file_name(),
                background_check=fake.file_name()
            )
            db.session.add(teacher)
        db.session.commit()

        # Crear clases de prueba
        teachers = Teacher.query.all()
        for _ in range(10):
            class_ = Class(
                teacher_id=random.choice(teachers).id if teachers else None,
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200),
                age=fake.random_element(elements=('3-5', '6-8', '9-12')),
                time=fake.time(),
                image=fake.image_url()
            )
            db.session.add(class_)
        db.session.commit()

        # Crear inscripciones de prueba
        children = Child.query.all()
        classes = Class.query.all()
        for child in children:
            enrollment = Enrollment(
                child_id=child.id,
                class_id=random.choice(classes).id,
                enrollment_date=fake.date_this_year()
            )
            db.session.add(enrollment)
        db.session.commit()

        # Crear programas de prueba
        for _ in range(5):
            program = Program(
                teacher_id=random.choice(teachers).id if teachers else None,
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200),
                age=random.randint(3, 12),
                time=fake.time()
            )
            db.session.add(program)
        db.session.commit()

        # Crear suscripciones de prueba
        parents = Parent.query.all()
        for parent in parents:
            subscription = Subscription(
                parent_id=parent.id,
                plan_type=fake.random_element(elements=('basic', 'premium', 'gold')),
                start_date=fake.date_this_year(),
                end_date=fake.date_between(start_date='+30d', end_date='+1y')
            )
            db.session.add(subscription)
        db.session.commit()

        # Crear informes de progreso de prueba
        children = Child.query.all()
        teachers = Teacher.query.all()
        for child in children:
            progress_report = ProgressReport(
                child_id=child.id,
                teacher_id=random.choice(teachers).id,
                report_date=fake.date_this_year(),
                content=fake.text(max_nb_chars=500)
            )
            db.session.add(progress_report)
        db.session.commit()

        # Crear eventos de prueba
        for _ in range(5):
            event = Event(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                start_time=fake.date_time_this_year(),
                end_time=fake.date_time_this_year(),
                image=fake.image_url()
            )
            db.session.add(event)
        db.session.commit()

        # Crear mensajes de prueba
        users = User.query.all()
        for _ in range(50):
            sender = random.choice(users)
            receiver = random.choice(users)
            while receiver.id == sender.id:  # Asegurarse de que el remitente y el receptor no sean el mismo
                receiver = random.choice(users)
            message = Message(
                sender_id=sender.id,
                receiver_id=receiver.id,
                content=fake.text(max_nb_chars=200),
                timestamp=fake.date_time_this_year()
            )
            db.session.add(message)
        db.session.commit()

        # Crear tareas de prueba
        teachers = Teacher.query.all()
        for teacher in teachers:
            for _ in range(random.randint(1, 5)):
                task = Task(
                    teacher_id=teacher.id,
                    title=fake.sentence(),
                    description=fake.text(max_nb_chars=200),
                    due_date=fake.date_this_year(),
                    status=fake.random_element(elements=('pending', 'completed', 'in progress'))
                )
                db.session.add(task)
        db.session.commit()

        # Crear asistencias de prueba
        children = Child.query.all()
        classes = Class.query.all()
        for child in children:
            for _ in range(random.randint(1, 5)):
                attendance = Attendance(
                    child_id=child.id,
                    class_id=random.choice(classes).id,
                    date=fake.date_this_year(),
                    status=fake.random_element(elements=('present', 'absent', 'late'))
                )
                db.session.add(attendance)
        db.session.commit()

        # Crear calificaciones de prueba
        for child in children:
            for _ in range(random.randint(1, 5)):
                grade = Grade(
                    child_id=child.id,
                    class_id=random.choice(classes).id,
                    grade=fake.random_element(elements=('A', 'B', 'C', 'D', 'F')),
                    date=fake.date_this_year()
                )
                db.session.add(grade)
        db.session.commit()

        # Crear pagos de prueba
        parents = Parent.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                payment = Payment(
                    parent_id=parent.id,
                    amount=random.uniform(50, 500),
                    date=fake.date_this_year()
                )
                db.session.add(payment)
        db.session.commit()

        # Crear cursos de prueba
        for _ in range(5):
            course = Course(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                price=random.uniform(50, 200),
                age=random.randint(3, 12)
            )
            db.session.add(course)
        db.session.commit()

        # Crear notificaciones de prueba
        users = User.query.all()
        for user in users:
            for _ in range(random.randint(1, 5)):
                notification = Notification(
                    user_id=user.id,
                    content=fake.text(max_nb_chars=200),
                    date=fake.date_time_this_year(),
                    status=fake.random_element(elements=('unread', 'read'))
                )
                db.session.add(notification)
        db.session.commit()

        # Crear contactos de prueba
        for _ in range(10):
            contact = Contact(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                subject=fake.sentence(),
                phone_number=fake.numerify(text='###########'),  # Número de 11 dígitos
                message=fake.text(max_nb_chars=200)
            )
            db.session.add(contact)
        db.session.commit()

        # Crear suscripciones a boletines de prueba
        for _ in range(10):
            newsletter = Newsletter(
                email=fake.email()
            )
            db.session.add(newsletter)
        db.session.commit()

        # Crear actividades de prueba
        for _ in range(10):
            activity = Activity(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                image=fake.image_url(),
                age_range=fake.random_element(elements=('3-5', '6-8', '9-12')),
                time=fake.time(),
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200)
            )
            db.session.add(activity)
        db.session.commit()

        # Crear clases virtuales de prueba
        teachers = Teacher.query.all()
        for _ in range(5):
            virtual_class = VirtualClass(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                date=fake.date_this_year(),
                time=fake.time(),
                duration=fake.random_element(elements=('1 hour', '2 hours', '3 hours')),
                teacher=random.choice(teachers).user.username,
                capacity=random.randint(10, 30),
                price=random.uniform(50, 200)
            )
            db.session.add(virtual_class)
        db.session.commit()

        # Crear horarios de prueba
        for _ in range(10):
            schedule = Schedule(
                class_name=fake.word(),
                teacher=fake.name(),
                dayOfWeek=fake.random_element(elements=('Mon', 'Tue', 'Wed', 'Thu', 'Fri')),
                startTime=fake.time(),
                endTime=fake.time(),
                capacity=random.randint(10, 30),
                enrolled=random.randint(0, 30),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(schedule)
        db.session.commit()

        # Crear GetInTouch de prueba
        for _ in range(10):
            getintouch = Getintouch(
                name=fake.name(),
                email=fake.email(),
                subject=fake.sentence(),
                phone_number=fake.numerify(text='###########'),  # Número de 11 dígitos
                message=fake.text(max_nb_chars=200)
            )
            db.session.add(getintouch)
        db.session.commit()

        # Crear clientes de prueba
        for _ in range(10):
            client = Client(
                name=fake.name(),
                email=fake.email(),
                phone=fake.numerify(text='###########'),  # Número de 11 dígitos
                status=fake.random_element(elements=('Active', 'Inactive')),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(client)
        db.session.commit()

        # Crear correos electrónicos de prueba
        for _ in range(10):
            email = Email(
                to_name=fake.name(),
                user_email=fake.email(),
                message=fake.text(max_nb_chars=200),
                date=fake.date_time_this_year(),
                scheduled_date=fake.date_time_this_year()
            )
            db.session.add(email)
        db.session.commit()

        # Crear suscripciones a eventos de prueba
        for _ in range(10):
            eventsuscription = Eventsuscriptions(
                full_name=fake.name(),
                events_selection=fake.word(),
                parent_name=fake.name(),
                special_request=fake.text(max_nb_chars=200)
            )
            db.session.add(eventsuscription)
        db.session.commit()

        # Crear videos de prueba
        users = User.query.all()
        for _ in range(10):
            video = Video(
                title=fake.word(),
                url=fake.url(),
                user_id=random.choice(users).id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(video)
        db.session.commit()

        # Crear cuentas inactivas de prueba
        for _ in range(10):
            inactive_account = InactiveAccount(
                name=fake.name(),
                email=fake.email(),
                last_active=fake.date_time_this_year(),
                type=fake.random_element(elements=('parent', 'teacher', 'admin')),
                reason=fake.text(max_nb_chars=200),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(inactive_account)
        db.session.commit()

        # Crear aprobaciones de prueba
        for _ in range(10):
            approval = Approval(
                type=fake.word(),
                name=fake.name(),
                details=fake.text(max_nb_chars=200),
                status=fake.random_element(elements=('pending', 'approved', 'rejected')),
                date=fake.date_this_year(),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(approval)
        db.session.commit()

        # Crear administradores de prueba
        users = User.query.filter_by(role='admin').all()
        for user in users:
            admin = AdminD(
                user_id=user.id,
                position=fake.job(),
                department=fake.word()
            )
            db.session.add(admin)
        db.session.commit()

        # Crear servicios de prueba
        for _ in range(10):
            service = Service(
                name=fake.word(),
                description=fake.text(max_nb_chars=200),
                image=fake.image_url()
            )
            db.session.add(service)
        db.session.commit()

        # Crear actividades de padres de prueba
        parents = Parent.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_activity = ParentActivity(
                    parent_id=parent.id,
                    name=fake.word(),
                    date=fake.date_this_year(),
                    time=fake.time(),
                    duration=fake.random_element(elements=('1 hour', '2 hours', '3 hours')),
                    status=fake.random_element(elements=('pending', 'completed', 'in progress')),
                    location=fake.address()
                )
                db.session.add(parent_activity)
        db.session.commit()

        # Crear cursos de padres de prueba
        courses = Course.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_course = ParentCourse(
                    parent_id=parent.id,
                    course_id=random.choice(courses).id,
                    enrollment_date=fake.date_this_year()
                )
                db.session.add(parent_course)
        db.session.commit()

        # Crear asistencias de padres de prueba
        classes = Class.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_attendance = ParentAttendance(
                    parent_id=parent.id,
                    class_id=random.choice(classes).id,
                    date=fake.date_this_year(),
                    status=fake.random_element(elements=('present', 'absent', 'late'))
                )
                db.session.add(parent_attendance)
        db.session.commit()

        # Crear eventos de padres de prueba
        events = Event.query.all()
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_event = ParentEvent(
                    parent_id=parent.id,
                    event_id=random.choice(events).id,
                    enrollment_date=fake.date_this_year()
                )
                db.session.add(parent_event)
        db.session.commit()

        # Crear calificaciones de padres de prueba
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_grade = ParentGrade(
                    parent_id=parent.id,
                    class_id=random.choice(classes).id,
                    grade=fake.random_element(elements=('A', 'B', 'C', 'D', 'F')),
                    date=fake.date_this_year()
                )
                db.session.add(parent_grade)
        db.session.commit()

        # Crear notificaciones de padres de prueba
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_notification = ParentNotification(
                    parent_id=parent.id,
                    content=fake.text(max_nb_chars=200),
                    date=fake.date_time_this_year(),
                    status=fake.random_element(elements=('unread', 'read'))
                )
                db.session.add(parent_notification)
        db.session.commit()

        # Crear pagos de padres de prueba
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_payment = ParentPayment(
                    parent_id=parent.id,
                    amount=random.uniform(50, 500),
                    concept=fake.word(),
                    status=fake.random_element(elements=('pending', 'completed', 'failed')),
                    due_date=fake.date_this_year()
                )
                db.session.add(parent_payment)
        db.session.commit()

        # Crear historial de pagos de padres de prueba
        for parent in parents:
            for _ in range(random.randint(1, 5)):
                parent_payment_history = ParentPaymentHistory(
                    parent_id=parent.id,
                    amount=random.uniform(50, 500),
                    concept=fake.word(),
                    status=fake.random_element(elements=('pending', 'completed', 'failed')),
                    due_date=fake.date_this_year()
                )
                db.session.add(parent_payment_history)
        db.session.commit()
        # Crear datos de prueba para MessageP
        for _ in range(10):
            if not parent_ids:
                break  # Salir si no hay IDs de padres disponibles

            parent_id = random.choice(parent_ids)  # Elegir un ID de padre existente aleatoriamente
            message = MessageP(
                parent_id=parent_id,
                content=fake.sentence(),
                sender=fake.name()
            )
            db.session.add(message)
        db.session.commit()
       
        # Crear datos de prueba para Schedule
        for _ in range(10):
            schedule = Schedule(
                class_name=fake.word(),
                teacher=fake.name(),
                dayOfWeek=fake.random_element(elements=('Mon', 'Tue', 'Wed', 'Thu', 'Fri')),
                startTime=fake.time(),
                endTime=fake.time(),
                capacity=random.randint(10, 30),
                enrolled=random.randint(0, 30),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(schedule)
        db.session.commit()

    # Crear datos de prueba para ParentSchedule
        for _ in range(10):
            if not parent_ids:
                break  # Salir si no hay IDs de padres disponibles

            parent_id = random.choice(parent_ids)  # Elegir un ID de padre existente aleatoriamente
            parent_schedule = ParentSchedule(
                parent_id=parent_id,
                day=fake.random_element(elements=('Mon', 'Tue', 'Wed', 'Thu', 'Fri')),
                activities=', '.join(fake.words(nb=5))
            )
            db.session.add(parent_schedule)
        db.session.commit()
        # Crear datos de prueba para MessageP
  
                    
        return jsonify({"message": "All models filled with test data successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@api.route('/settings', methods=['GET'])
def get_settings():
    settings = Settings.query.all()
    settings = list(map(lambda x: x.serialize(), settings))
    return jsonify(settings), 200


@api.route('/settings/<int:id>', methods=['PUT'])
#@jwt_required()
def update_settings(id):
    settings = Settings.query.get(id)
    if settings is None:
        return jsonify({"error": "Error update settings"}), 404
    
    data = request.json
           
    settings.name_daycare = data.get('name_daycare', settings.name_daycare)
    settings.admin_email = data.get('admin_email', settings.admin_email)
    settings.max_capacity = data.get('max_capacity', settings.max_capacity)
    settings.phone = data.get('phone', settings.phone)
    settings.address = data.get('address', settings.address)
    settings.schedule_attention = data.get('schedule_attention', settings.schedule_attention)
    settings.facebook = data.get('facebook', settings.facebook)
    settings.twitter = data.get('twitter', settings.twitter)
    settings.instagram = data.get('instagram', settings.instagram)
    settings.linkedin= data.get('linkedin', settings.linkedin)
    settings.image = data.get('image', settings.image)

    db.session.commit()

    return jsonify(settings.serialize()), 200

#ruta para crear nuevo usuario admin
@api.route('/signup/admin', methods=['POST'])
def signup_admin():
    data = request.json
  
    if not data:
        raise APIException("No input data provided", status_code=400)

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    position = data.get('position')
    department = data.get('department')

    if not all([username, email, password, position, department]):
        raise APIException("Missing required fields", status_code=400)

    if User.query.filter_by(email=email).first():
        raise APIException("User already exists", status_code=400)

    hashed_password = generate_password_hash(password)
    
    # Crear el nuevo usuario
    new_user = User(username=username, email=email, password_hash=hashed_password, role='admin')
    db.session.add(new_user)
    db.session.flush()

    # Crear el registro del admin
    new_admin = AdminD(user_id=new_user.id, position=position, department=department)
    db.session.add(new_admin)

    db.session.commit()

    return jsonify({
        "message": "Admin user created successfully",
        "user": new_user.serialize()
    }), 201

    return jsonify(settings.serialize()), 200





@api.route('/enrolled-classes', methods=['GET'])
@jwt_required()
def get_enrolled_classes():
    user_id = get_jwt_identity()
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    enrolled_classes = [Class.query.get(e.class_id).serialize() for e in enrollments]
    return jsonify(enrolled_classes), 200

@api.route('/enroll', methods=['POST'])
@jwt_required()
def enroll_in_class():
    user_id = get_jwt_identity()
    class_id = request.json.get('classId', None)

    if not class_id:
        return jsonify({"msg": "Class ID is required"}), 400

    class_to_enroll = Class.query.get(class_id)
    if not class_to_enroll:
        return jsonify({"msg": "Class not found"}), 404

    if class_to_enroll.capacity <= 0:
        return jsonify({"msg": "Class is full"}), 400

    existing_enrollment = Enrollment.query.filter_by(user_id=user_id, class_id=class_id).first()
    if existing_enrollment:
        return jsonify({"msg": "Already enrolled in this class"}), 400

    new_enrollment = Enrollment(user_id=user_id, class_id=class_id)
    class_to_enroll.capacity -= 1

    db.session.add(new_enrollment)
    db.session.commit()

    return jsonify(class_to_enroll.serialize()), 201

@api.route('/unenroll', methods=['POST'])
@jwt_required()
def unenroll_from_class():
    user_id = get_jwt_identity()
    class_id = request.json.get('classId', None)

    if not class_id:
        return jsonify({"msg": "Class ID is required"}), 400

    enrollment = Enrollment.query.filter_by(user_id=user_id, class_id=class_id).first()
    if not enrollment:
        return jsonify({"msg": "Not enrolled in this class"}), 400

    class_to_unenroll = Class.query.get(class_id)
    if not class_to_unenroll:
        return jsonify({"msg": "Class not found"}), 404

    db.session.delete(enrollment)
    class_to_unenroll.capacity += 1
    db.session.commit()

    return jsonify({"msg": "Successfully unenrolled from class"}), 200

@api.route('/my-classes', methods=['GET'])
@jwt_required()
def get_my_classes():
    user_id = get_jwt_identity()
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    enrolled_classes = [Class.query.get(e.class_id).serialize() for e in enrollments]
    return jsonify(enrolled_classes), 200

@api.route('/add-class', methods=['POST'])
@jwt_required()
def add_class():
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json
    new_class = Class(
        teacher_id=data.get('teacher_id'),
        name=data.get('name'),
        description=data.get('description'),
        capacity=data.get('capacity'),
        price=data.get('price'),
        age=data.get('age'),
        time=data.get('time'),
        image=data.get('image')
    )

    db.session.add(new_class)
    db.session.commit()

    return jsonify(new_class.serialize()), 201

@api.route('/update-class/<int:class_id>', methods=['PUT'])
@jwt_required()
def update_classP(class_id):
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403

    class_to_update = Class.query.get(class_id)
    if not class_to_update:
        return jsonify({"msg": "Class not found"}), 404

    data = request.json
    for key, value in data.items():
        setattr(class_to_update, key, value)

    db.session.commit()

    return jsonify(class_to_update.serialize()), 200

@api.route('/delete-class/<int:class_id>', methods=['DELETE'])
@jwt_required()
def delete_classP(class_id):
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403

    class_to_delete = Class.query.get(class_id)
    if not class_to_delete:
        return jsonify({"msg": "Class not found"}), 404

    db.session.delete(class_to_delete)
    db.session.commit()

    return jsonify({"msg": "Class deleted successfully"}), 200


@api.route('/teacher/classes', methods=['GET']) 
@jwt_required()
def get_teacher_classes():
    try:
        current_user_id = get_jwt_identity()
        print(f"User ID from token: {current_user_id}")
        teacher = Teacher.query.filter_by(user_id=current_user_id).first()
        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404

        classes = Class.query.filter_by(teacher_id=teacher.id).all()
        if not classes:
            return jsonify({"message": "No classes found"}), 404

        return jsonify({"classes": [cls.serialize() for cls in classes]}), 200 

    except Exception as e:
        print("Error en get_teacher_classes:", str(e))
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

