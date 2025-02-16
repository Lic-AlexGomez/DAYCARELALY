import secrets
import cloudinary,os # type: ignore
from cloudinary.uploader import upload# type: ignore
from cloudinary.utils import cloudinary_url# type: ignore
from flask import Flask, request, jsonify, Blueprint, current_app # type: ignore
from api.models import AdminProfile, db, Newsletter, User, Parent, Teacher, Child, Class, Enrollment, Program, Contact, Subscription, ProgressReport, Event, Message, Task, Attendance, Grade, Payment, Schedule, Course, Notification, Getintouch, Client, Email, Video, Eventsuscriptions, InactiveAccount, Approval, AdminD, Activity, VirtualClass,Service,Gallery, ParentVirtualClass,ParentActivity,ParentAttendance,ParentGrade,ParentCourse,ParentEvent,ParentPayment,ParentNotification,ParentPaymentHistory,ParentSchedule,ParentService,ParentSetting,ParentSubscription,ParentTask,MessageP,Settings,PasswordReset
from api.utils import APIException
from flask_cors import CORS# type: ignore
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager# type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from datetime import datetime, timedelta, timezone
from werkzeug.security import check_password_hash # type: ignore
from werkzeug.utils import secure_filename # type: ignore
from sqlalchemy.exc import SQLAlchemyError, IntegrityError# type: ignore
from werkzeug.security import generate_password_hash # type: ignore
from faker import Faker # type: ignore
import random
from email_validator import validate_email, EmailNotValidError


from flask_mail import Mail, Message

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
mail = Mail()
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    print("Datos recibidos:", data)

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    password_valid = user.check_password(data['password'])
    
    if not password_valid:
        return jsonify({"error": "Invalid email or password"}), 401
    access_token = create_access_token(identity=str(user.id))
    response = {
        "token": access_token,
        "user": user.serialize()
    }

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
@jwt_required()
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
        user.set_password(data['password'])
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
@jwt_required()
def get_parents():
    parents = Parent.query.all()
    parents = list(map(lambda x: x.serialize(), parents))
    return jsonify(parents), 200

@api.route('/parents/<int:user_id>', methods=['GET'])
@jwt_required()
def get_parent(user_id):
    parent = Parent.query.filter_by(user_id=user_id).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404
    return jsonify(parent.serialize()), 200

@api.route('/parents', methods=['POST'])
@jwt_required()
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
@jwt_required()
def get_teachers():
    teachers = Teacher.query.all()
    teachers = list(map(lambda x: x.serialize(), teachers))
    return jsonify(teachers), 200

@api.route('/teachers/classes', methods=['GET'])
@jwt_required()
def get_teachers_classes():
    teachers = Teacher.query.all()
    teachers = list(map(lambda x: x.serialize_classes(), teachers))
    return jsonify(teachers), 200

@api.route('/teachers/<int:id>', methods=['GET'])
@jwt_required()
def get_teacher(id):
    teacher = Teacher.query.get(id)
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404
    return jsonify(teacher.serialize()), 200

@api.route('/teachers', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_class(id):
    classes = Class.query.get(id)
    if not classes:
        return jsonify({"error": "Class not found"}), 404

    db.session.delete(classes)
    db.session.commit()
    return jsonify({"message": "class deleted"}), 200

@api.route('/classes/<int:id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_event(id):
    event = Event.query.get(id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"}), 200

@api.route('/events/<int:id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
def get_progress_reports():
    progress_reports = ProgressReport.query.all()
    progress_reports = list(map(lambda x: x.serialize(), progress_reports))
    return jsonify(progress_reports), 200

@api.route('/progress_reports/<int:id>', methods=['GET'])
@jwt_required()
def get_progress_report(id):
    report = ProgressReport.query.get(id)
    if not report:
        return jsonify({"error": "Progress report not found"}), 404
    return jsonify(report.serialize()), 200

@api.route('/progress_reports', methods=['POST'])
@jwt_required()
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
@jwt_required()
def get_children():
    children = Child.query.all()
    children = list(map(lambda x: x.serialize(), children))
    return jsonify(children), 200

@api.route('/children/<int:id>', methods=['GET'])
@jwt_required()
def get_child(id):
    # Buscar todos los children asociados al parent_id
    children = Child.query.filter_by(parent_id=id).all()
    if not children:
        return jsonify({"error": "Child not found"}), 404
    
    # Serializar cada child individualmente
    serialized_children = [child.serialize() for child in children]
    return jsonify(serialized_children), 200

@api.route('/children/<int:id>', methods=['POST'])
@jwt_required()
def create_child(id):
    data = request.json
    print(data)
    new_child = Child(
        parent_id=id,
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
@jwt_required()
def get_enrollments():
    enrollments = Enrollment.query.all()
    enrollments = list(map(lambda x: x.serialize(), enrollments))
    return jsonify(enrollments), 200

@api.route('/enrollments/<int:id>', methods=['GET'])
@jwt_required()
def get_enrollment(id):
    enrollment = Enrollment.query.get(id)
    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404
    return jsonify(enrollment.serialize()), 200

@api.route('/unenrolled/<int:id>', methods=['DELETE'])
@jwt_required()
def unenrolled_class(id):
    unenroll = Enrollment.query.get(id)
    if not unenroll:
        return jsonify({"error": "class not found"}), 404

    db.session.delete(unenroll)
    db.session.commit()
    return jsonify({"message": "unenrolled succesfull"}), 200

@api.route('/enrollments', methods=['POST'])
@jwt_required()
def create_enrollment():
    data = request.json
    new_enrollment = Enrollment(
        child_name=data['child_name'],
        class_name=data['class_name'],
        price=data['price'],
        enrolled_at=datetime.now().date()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def get_contacts():
    contacts = Contact.query.all()
    contacts = list(map(lambda x: x.serialize(), contacts))
    return jsonify(contacts), 200

@api.route('/contacts/<int:id>', methods=['GET'])
@jwt_required()
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
@api.route('/contacts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact deleted"}), 200


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
    
@api.route('/newsletter', methods=['GET'])
def get_newsletter():
    subscribers = Newsletter.query.all()
    return jsonify([subscriber.serialize() for subscriber in subscribers]), 200
 
@api.route('/newsletter', methods=['POST'])
def create_newsletter():
    data = request.json
    new_subscription = Newsletter(
        email=data['email']
    )
    db.session.add(new_subscription)
    db.session.commit()
    return jsonify(new_subscription.serialize()), 201

@api.route('/newsletter/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_newsletter(id):
    newsletter = Newsletter.query.get(id)
    if not newsletter:
        return jsonify({"error": "Newsletter not found"}), 404

    db.session.delete(newsletter)
    db.session.commit()
    return jsonify({"message": "Newsletter deleted"}), 200


@api.route('/getintouch', methods=['GET'])
@jwt_required()
def get_contactus():
    getintouch = Getintouch.query.all()
    getintouch = list(map(lambda x: x.serialize(), getintouch))
    return jsonify(getintouch), 200

@api.route('/getintouch/<int:id>', methods=['GET'])
@jwt_required()
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

@api.route('/getintouch/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_contactus(id):
    contactus = Getintouch.query.get(id)
    if not contactus:
        return jsonify({"error": "Contact not found"}), 404

    db.session.delete(contactus)
    db.session.commit()
    return jsonify({"message": "Contact deleted"}), 200



@api.route('/clients', methods=['GET'])
@jwt_required()
def get_clients():
    clients = Client.query.all()
    return jsonify(list(map(lambda x: x.serialize(), clients))), 200

@api.route('/clients', methods=['POST'])
@jwt_required()
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
@jwt_required()
def get_client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(client.serialize()), 200

@api.route('/clients/<int:id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
def delete_client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted successfully"}), 200

@api.route('/schedules', methods=['GET'])
@jwt_required()
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify([schedule.serialize() for schedule in schedules]), 200

@api.route('/schedules', methods=['POST'])
@jwt_required()
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
@jwt_required()
def get_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    return jsonify(schedule.serialize()), 200

@api.route('/schedules/<int:id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
def delete_schedule(id):
    schedule = Schedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully"}), 200

@api.route('/emails', methods=['GET'])
@jwt_required()
def get_emails():
    emails = Email.query.all()
    return jsonify([email.serialize() for email in emails]), 200

@api.route('/emails', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_video(id):
    video = Video.query.get(id)
    if video is None:
        return jsonify({"error": "Video not found"}), 404
    
    db.session.delete(video)
    db.session.commit()
    return jsonify({"message": "Video deleted successfully"}), 200

@api.route('/inactive-accounts', methods=['GET'])
@jwt_required()
def get_inactive_accounts():
    accounts = InactiveAccount.query.all()
    account = list(map(lambda x: x.serialize(), accounts))
    return jsonify(account), 200

@api.route('/inactive-accounts/<int:id>/reactivate', methods=['POST'])
@jwt_required()
def reactivate_account(id):
    try:
        inactive_account = InactiveAccount.query.get_or_404(id)
        user = User.query.filter_by(email=inactive_account.email).first()
        
        if user:

            user.name = inactive_account.name
            user.last_active = datetime.now(datetime.timezone.utc)
            user.is_active = True
        else:
            user = User(
                name=inactive_account.name,
                email=inactive_account.email,
                type=inactive_account.type,
                last_active= datetime.now(datetime.timezone.utc),
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
@jwt_required()
def send_reminder(id):
    account = InactiveAccount.query.get_or_404(id)
    return jsonify({'message': f'Reminder sent to {account.email}'}), 200

@api.route('/inactive-accounts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_inactive_account(id):
    account = InactiveAccount.query.get_or_404(id)
    db.session.delete(account)
    db.session.commit()
    return '', 204

    
@api.route('/approvals', methods=['GET'])
@jwt_required()
def get_approvals():
    approvals = Approval.query.all()
    approval = list(map(lambda x: x.serialize(), approvals))
    return jsonify(approval), 200


@api.route('/approvals/<int:id>', methods=['PATCH'])
@jwt_required()
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

@api.route('/activities', methods=['GET'])
#@jwt_required()
def get_activities():
    activities = Activity.query.all()
    return jsonify([activity.serialize() for activity in activities]), 200

@api.route('/activities/<int:id>', methods=['GET'])
@jwt_required()
def get_activity(id):
    activity = Activity.query.get_or_404(id)
    return jsonify(activity.serialize()), 200

@api.route('/activities', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_activity(id):
    activity = Activity.query.get_or_404(id)
    try:
        db.session.delete(activity)
        db.session.commit()
        return '', 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/virtual-classes', methods=['GET'])
@jwt_required()
def get_virtual_classes():
    virtual_classes = VirtualClass.query.all()
    return jsonify([vc.serialize() for vc in virtual_classes]), 200

@api.route('/virtual-classes/<int:id>', methods=['GET'])
@jwt_required()
def get_virtual_class(id):
    virtual_class = VirtualClass.query.get_or_404(id)
    return jsonify(virtual_class.serialize()), 200

@api.route('/virtual-classes', methods=['POST'])
@jwt_required()
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
            price=data['price'],
            meet_link= data['meet_link']
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
        virtual_class.meet_link = data.get('meet_link', virtual_class.meet_link)
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

@api.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    services = list(map(lambda x: x.serialize(), services))
    return jsonify(services), 200

@api.route('/services/<int:id>', methods=['GET'])
@jwt_required()
def get_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service.serialize()), 200

@api.route('/services', methods=['POST'])
@jwt_required()
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
@jwt_required()
def delete_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted"}), 200

@api.route('/services/<int:id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_image(id):
    image = Gallery.query.get(id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted"}), 200

@api.route('/gallery/<int:id>', methods=['PUT'])
@jwt_required()
def update_image(id):
    image = Gallery.query.get(id)
    if image is None:
        return jsonify({"error": "image not found"}), 404
    
    data = request.json
    image.name = data.get('name', image.name)
    image.image = data.get('image', image.image)

    db.session.commit()
    return jsonify(image.serialize()), 200

@api.route('/parent_activities', methods=['GET'])
@jwt_required()
def get_parent_activities():
    activities = ParentActivity.query.all()
    return jsonify([activity.serialize() for activity in activities]), 200

@api.route('/parent_activities/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_activity(id):
    activity = ParentActivity.query.filter_by(parent_id=id).all()
    if not activity:
        return jsonify({"error": "activity not found"}), 404
    
    serialized_activity = [activit.serialize() for activit in activity]
    return jsonify(serialized_activity), 200

@api.route('/parent_activities', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_activity(id):
    activity = ParentActivity.query.get(id)
    if activity is None:
        return jsonify({"error": "Activity not found"}), 404
    db.session.delete(activity)
    db.session.commit()
    return jsonify({"message": "Activity deleted"}), 200


@api.route('/parent_schedules', methods=['GET'])
@jwt_required()
def get_parent_schedules():
    schedules = ParentSchedule.query.all()
    return jsonify([schedule.serialize() for schedule in schedules]), 200

@api.route('/parent_schedules/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_schedule(id):
     schedules = ParentSchedule.query.filter_by(parent_id=id).all()
     if not schedules:
        return jsonify({"error": "Schedule not found"}), 404

     serialized_schedules = [schedule.serialize() for schedule in schedules]
     return jsonify(serialized_schedules), 200

@api.route('/parent_schedules', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_schedule(id):
    schedule = ParentSchedule.query.get(id)
    if schedule is None:
        return jsonify({"error": "Schedule not found"}), 404
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted"}), 200

@api.route('/parent_settings', methods=['GET'])
@jwt_required()
def get_parent_settings():
    settings = ParentSetting.query.all()
    return jsonify([setting.serialize() for setting in settings]), 200

@api.route('/parent_settings/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_setting(id):
    setting = ParentSetting.query.get(id)
    if setting is None:
        return jsonify({"error": "Setting not found"}), 404
    return jsonify(setting.serialize()), 200

@api.route('/parent_settings', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_setting(id):
    setting = ParentSetting.query.get(id)
    if setting is None:
        return jsonify({"error": "Setting not found"}), 404
    db.session.delete(setting)
    db.session.commit()
    return jsonify({"message": "Setting deleted"}), 200

@api.route('/parent_virtual_classes', methods=['GET'])
@jwt_required()
def get_parent_virtual_classes():
    classes = ParentVirtualClass.query.all()
    return jsonify([cls.serialize() for cls in classes]), 200

@api.route('/parent_virtual_classes/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_virtual_class(id):
    cls = ParentVirtualClass.query.filter_by(parent_id=id).all()
    if cls is None:
        return jsonify({"error": "Virtual Class not found"}), 404
    serialized_cls = [cl.serialize() for cl in cls]
    return jsonify(serialized_cls), 200

@api.route('/parent_virtual_classes', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_virtual_class(id):
    cls = ParentVirtualClass.query.get(id)
    if cls is None:
        return jsonify({"error": "Virtual class not found"}), 404
    db.session.delete(cls)
    db.session.commit()
    return jsonify({"message": "Virtual class deleted"}), 200



@api.route('/messagesP', methods=['GET'])
@jwt_required()
def get_messages():
    messages = MessageP.query.all()
    return jsonify([message.serialize() for message in messages]), 200

@api.route('/messages/<int:id>', methods=['GET'])
@jwt_required()
def get_message(id):
    message = MessageP.query.get(id)
    if message is None:
        return jsonify({"error": "Message not found"}), 404
    return jsonify(message.serialize()), 200

@api.route('/messages', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_message(id):
    message = MessageP.query.get(id)
    if message is None:
        return jsonify({"error": "Message not found"}), 404
    db.session.delete(message)
    db.session.commit()
    return jsonify({"message": "Message deleted"}), 200

@api.route('/parent_notifications', methods=['GET'])
@jwt_required()
def get_parent_notifications():
    notifications = ParentNotification.query.all()
    return jsonify([notification.serialize() for notification in notifications]), 200

@api.route('/parent_notifications/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_notification(id):
    notification = ParentNotification.query.get(id)
    if notification is None:
        return jsonify({"error": "Notification not found"}), 404
    return jsonify(notification.serialize()), 200

@api.route('/parent_notifications', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_notification(id):
    notification = ParentNotification.query.get(id)
    if notification is None:
        return jsonify({"error": "Notification not found"}), 404
    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200

@api.route('/parent_tasks', methods=['GET'])
@jwt_required()
def get_parent_tasks():
    tasks = ParentTask.query.all()
    return jsonify([task.serialize() for task in tasks]), 200

@api.route('/parent_tasks/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_task(id):
    task = ParentTask.query.get(id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.serialize()), 200

@api.route('/parent_tasks', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_task(id):
    task = ParentTask.query.get(id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200

@api.route('/parent_attendances', methods=['GET'])
@jwt_required()
def get_parent_attendances():
    attendances = ParentAttendance.query.all()
    return jsonify([attendance.serialize() for attendance in attendances]), 200

@api.route('/parent_attendances/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_attendance(id):
    attendance = ParentAttendance.query.get(id)
    if attendance is None:
        return jsonify({"error": "Attendance not found"}), 404
    return jsonify(attendance.serialize()), 200

@api.route('/parent_attendances', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_attendance(id):
    attendance = ParentAttendance.query.get(id)
    if attendance is None:
        return jsonify({"error": "Attendance not found"}), 404
    db.session.delete(attendance)
    db.session.commit()
    return jsonify({"message": "Attendance deleted"}), 200


@api.route('/parent_grades', methods=['GET'])
@jwt_required()
def get_parent_grades():
    parent_grades = ParentGrade.query.all()
    return jsonify([pg.serialize() for pg in parent_grades])

@api.route('/parent_grades/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_grade(id):
    parent_grade = ParentGrade.query.get(id)
    if parent_grade is None:
        return jsonify({"error": "ParentGrade not found"}), 404
    return jsonify(parent_grade.serialize())

@api.route('/parent_grades', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_grade(id):
    parent_grade = ParentGrade.query.get(id)
    if parent_grade is None:
        return jsonify({"error": "ParentGrade not found"}), 404
    db.session.delete(parent_grade)
    db.session.commit()
    return jsonify({"message": "ParentGrade deleted"}), 200

@api.route('/parent_payment_histories', methods=['GET'])
@jwt_required()
def get_parent_payment_histories():
    parent_payment_histories = ParentPaymentHistory.query.all()
    return jsonify([pph.serialize() for pph in parent_payment_histories])

@api.route('/parent_payment_histories/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_payment_history(id):
    parent_payment_history = ParentPaymentHistory.query.get(id)
    if parent_payment_history is None:
        return jsonify({"error": "ParentPaymentHistory not found"}), 404
    return jsonify(parent_payment_history.serialize())

@api.route('/parent_payment_histories', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_payment_history(id):
    parent_payment_history = ParentPaymentHistory.query.get(id)
    if parent_payment_history is None:
        return jsonify({"error": "ParentPaymentHistory not found"}), 404
    db.session.delete(parent_payment_history)
    db.session.commit()
    return jsonify({"message": "ParentPaymentHistory deleted"}), 200

@api.route('/parent_subscriptions', methods=['GET'])
@jwt_required()
def get_parent_subscriptions():
    parent_subscriptions = ParentSubscription.query.all()
    return jsonify([ps.serialize() for ps in parent_subscriptions])

@api.route('/parent_subscriptions/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_subscription(id):
    parent_subscription = ParentSubscription.query.get(id)
    if parent_subscription is None:
        return jsonify({"error": "ParentSubscription not found"}), 404
    return jsonify(parent_subscription.serialize())

@api.route('/parent_subscriptions', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_subscription(id):
    parent_subscription = ParentSubscription.query.get(id)
    if parent_subscription is None:
        return jsonify({"error": "ParentSubscription not found"}), 404
    db.session.delete(parent_subscription)
    db.session.commit()
    return jsonify({"message": "ParentSubscription deleted"}), 200

@api.route('/parent_courses', methods=['GET'])
@jwt_required()
def get_parent_courses():
    parent_courses = ParentCourse.query.all()
    return jsonify([pc.serialize() for pc in parent_courses])

@api.route('/parent_courses/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_course(id):
    parent_course = ParentCourse.query.get(id)
    if parent_course is None:
        return jsonify({"error": "ParentCourse not found"}), 404
    return jsonify(parent_course.serialize())

@api.route('/parent_courses', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_course(id):
    parent_course = ParentCourse.query.get(id)
    if parent_course is None:
        return jsonify({"error": "ParentCourse not found"}), 404
    db.session.delete(parent_course)
    db.session.commit()
    return jsonify({"message": "ParentCourse deleted"}), 200

@api.route('/parent_services', methods=['GET'])
@jwt_required()
def get_parent_services():
    parent_services = ParentService.query.all()
    return jsonify([ps.serialize() for ps in parent_services])

@api.route('/parent_services/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_service(id):
    parent_service = ParentService.query.get(id)
    if parent_service is None:
        return jsonify({"error": "ParentService not found"}), 404
    return jsonify(parent_service.serialize())

@api.route('/parent_services', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_service(id):
    parent_service = ParentService.query.get(id)
    if parent_service is None:
        return jsonify({"error": "ParentService not found"}), 404
    db.session.delete(parent_service)
    db.session.commit()
    return jsonify({"message": "ParentService deleted"}), 200

@api.route('/parent_events', methods=['GET'])
@jwt_required()
def get_parent_events():
    parent_events = ParentEvent.query.all()
    return jsonify([pe.serialize() for pe in parent_events])

@api.route('/parent_events/<int:id>', methods=['GET'])
@jwt_required()
def get_parent_event(id):
    parent_event = ParentEvent.query.get(id)
    if parent_event is None:
        return jsonify({"error": "ParentEvent not found"}), 404
    return jsonify(parent_event.serialize())

@api.route('/parent_events', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_parent_event(id):
    parent_event = ParentEvent.query.get(id)
    if parent_event is None:
        return jsonify({"error": "ParentEvent not found"}), 404
    db.session.delete(parent_event)
    db.session.commit()
    return jsonify({"message": "ParentEvent deleted"}), 200
    
@api.route('/settings', methods=['GET'])
# @jwt_required()
def get_settings():
    settings = Settings.query.all()
    return jsonify([ps.serialize() for ps in settings]),200

@api.route('/settings/<int:id>', methods=['PUT'])
@jwt_required()
def update_settings(id):
    user_id = get_jwt_identity()
    settings = Settings.query.get(id)
    if not settings:
        return jsonify({"message": "Settings not found"}), 404

    data = request.json
    for key, value in data.items():
        if hasattr(settings, key):
            setattr(settings, key, value)

    try:
        db.session.commit()
        return jsonify(settings.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating settings", "error": str(e)}), 500
    
@api.route('/settings', methods=['POST'])
@jwt_required()
def create_settings():
    data = request.json
    settings = Settings(
        name_daycare=data.get('name_daycare'),
        admin_email=data.get('admin_email'),
        max_capacity=data.get('max_capacity'),
        phone=data.get('phone'),
        address=data.get('address'),
        schedule_attention=data.get('schedule_attention'),
        facebook=data.get('facebook'),
        twitter=data.get('twitter'),
        instagram=data.get('instagram'),
        linkedin=data.get('linkedin'),
        image=data.get('image')
    )
    db.session.add(settings)
    db.session.commit()
    return jsonify(settings.serialize()), 201


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
    
    result = []
    for enrollment in enrollments:
        class_obj = Class.query.get(enrollment.class_id)
        if class_obj:
            # Combinar los datos de la inscripción y de la clase
            result.append({
                "id": enrollment.id,
                "child_name": enrollment.child_name,
                "enrolled_at": enrollment.enrolled_at.isoformat(),
                "class": class_obj.serialize()
            })
    
    return jsonify(result), 200


@api.route('/enroll', methods=['POST'])
@jwt_required()
def enroll_in_class():
    user_id = get_jwt_identity()
    data = request.json
    print("Received data:", data)  # 👈 Para depurar en la consola

    # Validar que se envíe un valor para classId y que sea convertible a entero
    try:
        class_id = int(data.get('classId', None))
        if class_id is None:
            raise ValueError("Class ID is required")
    except (ValueError, TypeError) as e:
        print("Invalid class ID:", e)
        return jsonify({"error": "Class ID must be an integer"}), 400

    if not data.get('child_name'):
        return jsonify({"error": "Child name cannot be empty"}), 400

    class_to_enroll = Class.query.get(class_id)
    if not class_to_enroll:
        return jsonify({"error": "Class not found"}), 404

    if class_to_enroll.capacity <= 0:
        return jsonify({"error": "Class is full"}), 400

    try:
        new_enrollment = Enrollment(
            user_id=user_id,
            class_id=class_id,
            child_name=data['child_name'],
            enrolled_at=datetime.now(timezone.utc)
        )

        db.session.add(new_enrollment)
        class_to_enroll.capacity -= 1
        db.session.commit()

      
        return jsonify(new_enrollment.serialize()), 201

    except Exception as e:
        db.session.rollback()  # Deshacer cambios en caso de error
        print("Error during enrollment:", e)
        return jsonify({"error": "An error occurred while processing enrollment"}), 500

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

@api.route('/enrollments/<int:enrollment_id>', methods=['DELETE'])
@jwt_required()  
def delete_enrollment(enrollment_id):
    try:
     
        enrollment = Enrollment.query.get(enrollment_id)

        if not enrollment:
            return jsonify({"success": False, "error": "Enrollment not found"}), 404

   
        db.session.delete(enrollment)
        db.session.commit()

        return jsonify({"success": True, "message": "Enrollment deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    
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


@api.route('/parent_payments', methods=['GET'])
@jwt_required()
def get_parent_payments():
    payments = ParentPayment.query.all()
    return jsonify([payment.serialize() for payment in payments]), 200

@api.route('/parent_payments/<int:user_id>', methods=['GET'])
@jwt_required()
def get_parent_payment(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"El user_id {user_id} no existe"}), 400
    parent = Parent.query.filter_by(user_id=user.id).first()
    if not parent:
        return jsonify({"error": f"No se encontró parent para el user_id {user_id}"}), 400
    payments = ParentPayment.query.filter_by(parent_id=parent.id).all()
    if payments is None or len(payments) == 0:
        return jsonify([]), 200  

    serialized_payments = [payment.serialize() for payment in payments]
    return jsonify(serialized_payments), 200



@api.route('/parent_payments', methods=['POST'])
def create_parent_payments():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    print("Datos recibidos en el backend:", data)
    payments_list = []
    user_id = None
    if isinstance(data, list):
        payments_list = data
        if len(payments_list) > 0:
            user_id = payments_list[0].get("user_id")
    elif isinstance(data, dict):
        if "payments" in data:
            payments_list = data["payments"]
            user_id = data.get("user_id")
        else:
            payments_list = [data]
            user_id = data.get("user_id")
    else:
        return jsonify({"error": "Formato de datos no soportado"}), 400

    if not user_id:
        return jsonify({"error": "El user_id es obligatorio"}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"El user_id {user_id} no existe"}), 400
    parent = Parent.query.filter_by(user_id=user.id).first()
    if not parent:
        return jsonify({"error": f"No se encontró parent para el user_id {user_id}"}), 400

    payments = []
    try:
        for payment_data in payments_list:
            required_fields = ["amount", "concept", "status", "due_date", "payer_email"]
            for field in required_fields:
                if field not in payment_data:
                    return jsonify({"error": f"El campo '{field}' es obligatorio en cada pago."}), 400

            new_payment = ParentPayment(
                parent_id=parent.id,
                amount=float(payment_data['amount']),
                concept=payment_data['concept'],
                status=payment_data['status'],
                due_date=datetime.strptime(payment_data['due_date'], "%Y-%m-%d").date(),
                paypal_order_id=payment_data.get('paypal_order_id'), 
                payer_email=payment_data['payer_email'],
                child_name=payment_data.get('child_name'),      
                class_name=payment_data.get('class_name')          
            )
            db.session.add(new_payment)
            payments.append(new_payment)
        db.session.commit()
        return jsonify({
            "message": "Pagos registrados exitosamente",
            "payments": [payment.serialize() for payment in payments]
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al procesar los pagos: {str(e)}"}), 500



@api.route('/parent_payments/<int:id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
def delete_parent_payment(id):
    payment = ParentPayment.query.get(id)
    if payment is None:
        return jsonify({"error": "Payment not found"}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({"message": "Payment deleted"}), 200




@api.route('/reset-password', methods=['POST'])
def reset_password_request():
    data = request.json
    email = data.get('email')
    print("Email:", email)
    print("Data:", data)
    # Validar formato del email
    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400

    # Comprobar si el usuario existe
    user = User.query.filter_by(email=email).first()
    print("User:", user)
    if user:
        # Generar token y almacenarlo en la base de datos
        token = secrets.token_urlsafe(32)
        reset = PasswordReset(
            user_id=user.id,
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        )
        db.session.add(reset)
        db.session.commit()

       
        reset_url = f"{'https://glorious-adventure-7v7q99qvg6vpfqx6-3000.app.github.dev/'}reset-password/{token}"

    
        msg = Message("Password Reset Request",
                      sender=current_app.config['MAIL_DEFAULT_SENDER'],
                      recipients=[user.email])
        msg.body = f"To reset your password, visit the following link: {reset_url}"
        try:
            mail.send(msg)
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to send reset email. Please try again later."}), 500

        return jsonify({"message": "Password reset instructions sent"}), 200

    return jsonify({"error": "Email not found"}), 404


@api.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    print(f"Reset token received: {token}")  # Depuración
    reset = PasswordReset.query.filter_by(token=token).first()
    if reset:
        print(f"Reset found: {reset}")
    else:
        print("No reset found for this token.")
    if reset.expires_at.tzinfo is None:
       reset.expires_at = reset.expires_at.replace(tzinfo=timezone.utc)

    # Ahora comparas ambos datetime como objetos 'aware'
    if reset and reset.expires_at > datetime.now(timezone.utc):
        print("Token is valid.")
        user = User.query.get(reset.user_id)
        print(f"User found: {user}")
        user.set_password(request.json['new_password'])
        db.session.delete(reset)
        db.session.commit()
        return jsonify({"message": "Password reset successfully"}), 200
    else:
        print("Invalid or expired token.")
        return jsonify({"error": "Invalid or expired token"}), 400



@api.route("/admin-profile", methods=['GET', 'PUT'])
@jwt_required()
def admin_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({"msg": "Access denied"}), 403

    if request.method == 'GET':
        admin = AdminProfile.query.filter_by(user_id=current_user_id).first()
        if not admin:
            return jsonify({"msg": "Admin profile not found"}), 404
        return jsonify(admin.to_dict()), 200

    elif request.method == 'PUT':
        admin = AdminProfile.query.filter_by(user_id=current_user_id).first()
        if not admin:
            admin = AdminProfile(user_id=current_user_id)
            db.session.add(admin)

        data = request.json
        admin.name = data.get('name', admin.name)
        admin.phone = data.get('phone', admin.phone)
        admin.address = data.get('address', admin.address)
        admin.position = data.get('position', admin.position)
        admin.bio = data.get('bio', admin.bio),
        admin.image = data.get('image', admin.image)
        
        if 'join_date' in data:
            admin.join_date = datetime.strptime(data['join_date'], '%Y-%m-%d').date()
        print(data)
        db.session.commit()
        return jsonify(admin.to_dict()), 200

@api.route("/upload-profile-photo", methods=['POST'])
@jwt_required()
def upload_profile_photo():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({"msg": "Access denied"}), 403

    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(api.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        user.profile_picture = filename
        db.session.commit()

        return jsonify({"msg": "File uploaded successfully", "url": filename}), 200

    return jsonify({"msg": "File type not allowed"}), 400

# Helper function to check allowed file extensions
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS    


@api.route('/fill-database', methods=['POST'])
def fill_database():
    try:
        # Verificar si ya existen datos en las tablas
        if User.query.count() > 0:
            return jsonify({"message": "La base de datos ya contiene datos."}), 200

        # Crear usuarios de prueba
        simple_users = [
            {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password_hash": generate_password_hash("password1"),
                "role": "parent",
                "profile_picture": None,
                "created_at": datetime.now(timezone.utc)
            },
            {
                "username": "janesmith",
                "email": "janesmith@example.com",
                "password_hash": generate_password_hash("password2"),
                "role": "teacher",
                "profile_picture": None,
                "created_at": datetime.now(timezone.utc)
            },
            {
                "username": "adminuser",
                "email": "admin@example.com",
                "password_hash": generate_password_hash("admin123"),
                "role": "admin",
                "profile_picture": None,
                "created_at": datetime.now(timezone.utc)
            }
        ]

        for user_data in simple_users:
            new_user = User(
                username=user_data["username"],
                email=user_data["email"],
                password_hash=user_data["password_hash"],
                role=user_data["role"],
                profile_picture=user_data["profile_picture"],
                created_at=user_data["created_at"]
            )
            db.session.add(new_user)

        db.session.commit()

        # Crear padres de prueba
        parents = [
            {
                "user_id": 1,  # johndoe
                "emergency_contact": "123-456-7890"
            }
        ]

        for parent_data in parents:
            new_parent = Parent(
                user_id=parent_data["user_id"],
                emergency_contact=parent_data["emergency_contact"]
            )
            db.session.add(new_parent)

        db.session.commit()

        # Crear profesores de prueba
        teachers = [
            {
                "user_id": 2,  # janesmith
                "qualifications": "PhD in Mathematics",
                "teaching_experience": "10 years",
                "certifications": "https://example.com/certifications/janesmith",
                "background_check": "https://example.com/background/janesmith"
            }
        ]

        for teacher_data in teachers:
            new_teacher = Teacher(
                user_id=teacher_data["user_id"],
                qualifications=teacher_data["qualifications"],
                teaching_experience=teacher_data["teaching_experience"],
                certifications=teacher_data["certifications"],
                background_check=teacher_data["background_check"]
            )
            db.session.add(new_teacher)

        db.session.commit()

        # Crear niños de prueba
        children = [
            {
                "parent_id": 1,  # johndoe
                "name": "Alice Doe",
                "date_of_birth": datetime(2018, 5, 12),
                "allergies": "None",
                "birth_certificate": "https://example.com/birth_certificate",
                "immunization_records": "https://example.com/immunization_records"
            }
        ]

        for child_data in children:
            new_child = Child(
                parent_id=child_data["parent_id"],
                name=child_data["name"],
                date_of_birth=child_data["date_of_birth"],
                allergies=child_data["allergies"],
                birth_certificate=child_data["birth_certificate"],
                immunization_records=child_data["immunization_records"]
            )
            db.session.add(new_child)

        db.session.commit()

        # Crear clases de prueba
        classes = [
            {
                "teacher_id": 1,  # janesmith
                "name": "Math 101",
                "description": "Introduction to Mathematics",
                "capacity": 20,
                "price": 100.0,
                "age": "6-8",
                "time": "10:00",
                "image": "https://example.com/math101.jpg"
            }
        ]

        for class_data in classes:
            new_class = Class(
                teacher_id=class_data["teacher_id"],
                name=class_data["name"],
                description=class_data["description"],
                capacity=class_data["capacity"],
                price=class_data["price"],
                age=class_data["age"],
                time=class_data["time"],
                image=class_data["image"]
            )
            db.session.add(new_class)

        db.session.commit()

        # Crear inscripciones de prueba
        enrollments = [
            {
                "user_id": 1,  # johndoe
                "class_id": 1,  # Math 101
                "enrolled_at": datetime.now(timezone.utc)
            }
        ]

        for enrollment_data in enrollments:
            new_enrollment = Enrollment(
                user_id=enrollment_data["user_id"],
                class_id=enrollment_data["class_id"],
                enrolled_at=enrollment_data["enrolled_at"]
            )
            db.session.add(new_enrollment)

        db.session.commit()

        # Crear programas de prueba
        programs = [
            {
                "teacher_id": 1,  # janesmith
                "name": "Science Program",
                "description": "Hands-on science experiments",
                "capacity": 15,
                "price": 150.0,
                "age": 8,
                "time": "14:00"
            }
        ]

        for program_data in programs:
            new_program = Program(
                teacher_id=program_data["teacher_id"],
                name=program_data["name"],
                description=program_data["description"],
                capacity=program_data["capacity"],
                price=program_data["price"],
                age=program_data["age"],
                time=program_data["time"]
            )
            db.session.add(new_program)

        db.session.commit()

        # Crear suscripciones de prueba
        subscriptions = [
            {
                "class_name": "Math 101",
                "student_name": "Alice Doe",
                "start_date": datetime.now(timezone.utc)
            }
        ]

        for subscription_data in subscriptions:
            new_subscription = Subscription(
                class_name=subscription_data["class_name"],
                student_name=subscription_data["student_name"],
                start_date=subscription_data["start_date"]
            )
            db.session.add(new_subscription)

        db.session.commit()

        # Crear informes de progreso de prueba
        progress_reports = [
            {
                "child_id": 1,  # Alice Doe
                "teacher_id": 1,  # janesmith
                "report_date": datetime.now(timezone.utc),
                "content": "Alice is doing great in Math!"
            }
        ]

        for report_data in progress_reports:
            new_report = ProgressReport(
                child_id=report_data["child_id"],
                teacher_id=report_data["teacher_id"],
                report_date=report_data["report_date"],
                content=report_data["content"]
            )
            db.session.add(new_report)

        db.session.commit()

        # Crear eventos de prueba
        events = [
            {
                "name": "School Festival",
                "description": "Annual school festival",
                "start_time": datetime.now(timezone.utc) + timedelta(days=10),
                "end_time": datetime.now(timezone.utc) + timedelta(days=11),
                "image": "https://example.com/festival.jpg"
            }
        ]

        for event_data in events:
            new_event = Event(
                name=event_data["name"],
                description=event_data["description"],
                start_time=event_data["start_time"],
                end_time=event_data["end_time"],
                image=event_data["image"]
            )
            db.session.add(new_event)

        db.session.commit()

       

        # Crear tareas de prueba
        tasks = [
            {
                "teacher_id": 1,  # janesmith
                "title": "Prepare lesson plan",
                "description": "Prepare lesson plan for next week",
                "due_date": datetime.now(timezone.utc) + timedelta(days=7),
                "status": "pending"
            }
        ]

        for task_data in tasks:
            new_task = Task(
                teacher_id=task_data["teacher_id"],
                title=task_data["title"],
                description=task_data["description"],
                due_date=task_data["due_date"],
                status=task_data["status"]
            )
            db.session.add(new_task)

        db.session.commit()

        # Crear asistencias de prueba
        attendances = [
            {
                "child_id": 1,  # Alice Doe
                "class_id": 1,  # Math 101
                "date": datetime.now(timezone.utc),
                "status": "present"
            }
        ]

        for attendance_data in attendances:
            new_attendance = Attendance(
                child_id=attendance_data["child_id"],
                class_id=attendance_data["class_id"],
                date=attendance_data["date"],
                status=attendance_data["status"]
            )
            db.session.add(new_attendance)

        db.session.commit()

        # Crear calificaciones de prueba
        grades = [
            {
                "child_id": 1,  # Alice Doe
                "class_id": 1,  # Math 101
                "grade": "A",
                "date": datetime.now(timezone.utc)
            }
        ]

        for grade_data in grades:
            new_grade = Grade(
                child_id=grade_data["child_id"],
                class_id=grade_data["class_id"],
                grade=grade_data["grade"],
                date=grade_data["date"]
            )
            db.session.add(new_grade)

        db.session.commit()

        # Crear pagos de prueba
        payments = [
            {
                "parent_id": 1,  # johndoe
                "amount": 100.0,
                "date": datetime.now(timezone.utc)
            }
        ]

        for payment_data in payments:
            new_payment = Payment(
                parent_id=payment_data["parent_id"],
                amount=payment_data["amount"],
                date=payment_data["date"]
            )
            db.session.add(new_payment)

        db.session.commit()

        # Crear cursos de prueba
        courses = [
            {
                "name": "Art Class",
                "description": "Introduction to Art",
                "price": 50.0,
                "age": 6
            }
        ]

        for course_data in courses:
            new_course = Course(
                name=course_data["name"],
                description=course_data["description"],
                price=course_data["price"],
                age=course_data["age"]
            )
            db.session.add(new_course)

        db.session.commit()

        # Crear notificaciones de prueba
        notifications = [
            {
                "user_id": 1,  # johndoe
                "content": "Your payment was received.",
                "date": datetime.now(timezone.utc),
                "status": "unread"
            }
        ]

        for notification_data in notifications:
            new_notification = Notification(
                user_id=notification_data["user_id"],
                content=notification_data["content"],
                date=notification_data["date"],
                status=notification_data["status"]
            )
            db.session.add(new_notification)

        db.session.commit()

        # Crear contactos de prueba
        contacts = [
            {
                "first_name": "John",
                "last_name": "Doe",
                "email": "johndoe@example.com",
                "subject": "Inquiry",
                "phone_number": "123-456-7890",
                "message": "I have a question about the program."
            }
        ]

        for contact_data in contacts:
            new_contact = Contact(
                first_name=contact_data["first_name"],
                last_name=contact_data["last_name"],
                email=contact_data["email"],
                subject=contact_data["subject"],
                phone_number=contact_data["phone_number"],
                message=contact_data["message"]
            )
            db.session.add(new_contact)

        db.session.commit()

        # Crear suscripciones a boletines de prueba
        newsletters = [
            {
                "email": "johndoe@example.com"
            }
        ]

        for newsletter_data in newsletters:
            new_newsletter = Newsletter(
                email=newsletter_data["email"]
            )
            db.session.add(new_newsletter)

        db.session.commit()

        # Crear GetInTouch de prueba
        getintouch_entries = [
            {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "subject": "Inquiry",
                "phone_number": "123-456-7890",
                "message": "I have a question about the program."
            }
        ]

        for getintouch_data in getintouch_entries:
            new_getintouch = Getintouch(
                name=getintouch_data["name"],
                email=getintouch_data["email"],
                subject=getintouch_data["subject"],
                phone_number=getintouch_data["phone_number"],
                message=getintouch_data["message"]
            )
            db.session.add(new_getintouch)

        db.session.commit()

        # Crear clientes de prueba
        clients = [
            {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "phone": "123-456-7890",
                "status": "Active"
            }
        ]

        for client_data in clients:
            new_client = Client(
                name=client_data["name"],
                email=client_data["email"],
                phone=client_data["phone"],
                status=client_data["status"]
            )
            db.session.add(new_client)

        db.session.commit()

        # Crear horarios de prueba
        schedules = [
            {
                "class_name": "Math 101",
                "teacher": "Jane Smith",
                "dayOfWeek": "Monday",
                "startTime": "10:00",
                "endTime": "11:00",
                "capacity": 20,
                "enrolled": 15
            }
        ]

        for schedule_data in schedules:
            new_schedule = Schedule(
                class_name=schedule_data["class_name"],
                teacher=schedule_data["teacher"],
                dayOfWeek=schedule_data["dayOfWeek"],
                startTime=schedule_data["startTime"],
                endTime=schedule_data["endTime"],
                capacity=schedule_data["capacity"],
                enrolled=schedule_data["enrolled"]
            )
            db.session.add(new_schedule)

        db.session.commit()

        # Crear correos electrónicos de prueba
        emails = [
            {
                "to_name": "John Doe",
                "user_email": "johndoe@example.com",
                "message": "Your payment was received.",
                "date": datetime.now(timezone.utc),
                "scheduled_date": datetime.now(timezone.utc) + timedelta(days=1)
            }
        ]

        for email_data in emails:
            new_email = Email(
                to_name=email_data["to_name"],
                user_email=email_data["user_email"],
                message=email_data["message"],
                date=email_data["date"],
                scheduled_date=email_data["scheduled_date"]
            )
            db.session.add(new_email)

        db.session.commit()

        # Crear suscripciones a eventos de prueba
        eventsuscriptions = [
            {
                "full_name": "John Doe",
                "events_selection": "School Festival",
                "parent_name": "John Doe",
                "special_request": "No special requests"
            }
        ]

        for eventsuscription_data in eventsuscriptions:
            new_eventsuscription = Eventsuscriptions(
                full_name=eventsuscription_data["full_name"],
                events_selection=eventsuscription_data["events_selection"],
                parent_name=eventsuscription_data["parent_name"],
                special_request=eventsuscription_data["special_request"]
            )
            db.session.add(new_eventsuscription)

        db.session.commit()

        # Crear videos de prueba
        videos = [
            {
                "title": "Math Lesson 1",
                "url": "https://example.com/math_lesson_1",
                "user_id": 2  # janesmith
            }
        ]

        for video_data in videos:
            new_video = Video(
                title=video_data["title"],
                url=video_data["url"],
                user_id=video_data["user_id"]
            )
            db.session.add(new_video)

        db.session.commit()

        # Crear cuentas inactivas de prueba
        inactive_accounts = [
            {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "last_active": datetime.now(timezone.utc) - timedelta(days=30),
                "type": "parent",
                "reason": "Inactivity"
            }
        ]

        for inactive_account_data in inactive_accounts:
            new_inactive_account = InactiveAccount(
                name=inactive_account_data["name"],
                email=inactive_account_data["email"],
                last_active=inactive_account_data["last_active"],
                type=inactive_account_data["type"],
                reason=inactive_account_data["reason"]
            )
            db.session.add(new_inactive_account)

        db.session.commit()

        # Crear aprobaciones de prueba
        approvals = [
            {
                "type": "Inscripción",
                "name": "John Doe",
                "details": "Solicitud de inscripción para el programa de verano",
                "status": "pending",
                "date": datetime.now(timezone.utc)
            }
        ]

        for approval_data in approvals:
            new_approval = Approval(
                type=approval_data["type"],
                name=approval_data["name"],
                details=approval_data["details"],
                status=approval_data["status"],
                date=approval_data["date"]
            )
            db.session.add(new_approval)

        db.session.commit()

        # Crear actividades de prueba
        activities = [
            {
                "name": "Art Class",
                "description": "Introduction to Art",
                "image": "https://example.com/art_class.jpg",
                "age_range": "6-8",
                "time": "14:00",
                "capacity": 15,
                "price": 50.0
            }
        ]

        for activity_data in activities:
            new_activity = Activity(
                name=activity_data["name"],
                description=activity_data["description"],
                image=activity_data["image"],
                age_range=activity_data["age_range"],
                time=activity_data["time"],
                capacity=activity_data["capacity"],
                price=activity_data["price"]
            )
            db.session.add(new_activity)

        db.session.commit()

        # Crear clases virtuales de prueba
        virtual_classes = [
            {
                "name": "Yoga for Kids",
                "description": "A fun and engaging yoga class for children.",
                "date": datetime.now(timezone.utc) + timedelta(days=5),
                "time": datetime.strptime("10:00", "%H:%M").time(),
                "duration": "1 hour",
                "teacher": "Jane Smith",
                "capacity": 20,
                "price": 15.0
            }
        ]

        for virtual_class_data in virtual_classes:
            new_virtual_class = VirtualClass(
                name=virtual_class_data["name"],
                description=virtual_class_data["description"],
                date=virtual_class_data["date"],
                time=virtual_class_data["time"],
                duration=virtual_class_data["duration"],
                teacher=virtual_class_data["teacher"],
                capacity=virtual_class_data["capacity"],
                price=virtual_class_data["price"]
            )
            db.session.add(new_virtual_class)

        db.session.commit()

        # Crear servicios de prueba
        services = [
            {
                "name": "Daycare Service",
                "description": "Full-day daycare service",
                "image": "https://example.com/daycare_service.jpg"
            }
        ]

        for service_data in services:
            new_service = Service(
                name=service_data["name"],
                description=service_data["description"],
                image=service_data["image"]
            )
            db.session.add(new_service)

        db.session.commit()

        # Crear galerías de prueba
        galleries = [
            {
                "name": "School Festival 2023",
                "image": "https://example.com/festival_2023.jpg"
            }
        ]

        for gallery_data in galleries:
            new_gallery = Gallery(
                name=gallery_data["name"],
                image=gallery_data["image"]
            )
            db.session.add(new_gallery)

        db.session.commit()

        # Crear actividades de padres de prueba
        parent_activities = [
            {
                "parent_id": 1,  # johndoe
                "name": "Parent-Teacher Meeting",
                "date": datetime.now(timezone.utc) + timedelta(days=7),
                "time": datetime.strptime("18:00", "%H:%M").time(),
                "duration": "1 hour",
                "status": "pending",
                "location": "School Office"
            }
        ]

        for parent_activity_data in parent_activities:
            new_parent_activity = ParentActivity(
                parent_id=parent_activity_data["parent_id"],
                name=parent_activity_data["name"],
                date=parent_activity_data["date"],
                time=parent_activity_data["time"],
                duration=parent_activity_data["duration"],
                status=parent_activity_data["status"],
                location=parent_activity_data["location"]
            )
            db.session.add(new_parent_activity)

        db.session.commit()

        # Crear horarios de padres de prueba
        parent_schedules = [
            {
                "parent_id": 1,  # johndoe
                "day": "Monday",
                "activities": "Parent-Teacher Meeting, Yoga Class"
            }
        ]

        for parent_schedule_data in parent_schedules:
            new_parent_schedule = ParentSchedule(
                parent_id=parent_schedule_data["parent_id"],
                day=parent_schedule_data["day"],
                activities=parent_schedule_data["activities"]
            )
            db.session.add(new_parent_schedule)

        db.session.commit()

        # Crear pagos de padres de prueba
        parent_payments = [
            {
                "parent_id": 1,  # johndoe
                "amount": 100.0,
                "concept": "Daycare Fee",
                "status": "completed",
                "due_date": datetime.now(timezone.utc) + timedelta(days=30),
                "paypal_order_id": "PAYPAL12345",
                "payer_email": "johndoe@example.com"
            }
        ]

        for parent_payment_data in parent_payments:
            new_parent_payment = ParentPayment(
                parent_id=parent_payment_data["parent_id"],
                amount=parent_payment_data["amount"],
                concept=parent_payment_data["concept"],
                status=parent_payment_data["status"],
                due_date=parent_payment_data["due_date"],
                paypal_order_id=parent_payment_data["paypal_order_id"],
                payer_email=parent_payment_data["payer_email"]
            )
            db.session.add(new_parent_payment)

        db.session.commit()

        # Crear configuraciones de padres de prueba
        parent_settings = [
            {
                "parent_id": 1,  # johndoe
                "notifications": True,
                "language": "es"
            }
        ]

        for parent_setting_data in parent_settings:
            new_parent_setting = ParentSetting(
                parent_id=parent_setting_data["parent_id"],
                notifications=parent_setting_data["notifications"],
                language=parent_setting_data["language"]
            )
            db.session.add(new_parent_setting)

        db.session.commit()

        # Crear clases virtuales de padres de prueba
        parent_virtual_classes = [
            {
                "parent_id": 1,  # johndoe
                "name": "Yoga for Kids",
                "date": datetime.now(timezone.utc) + timedelta(days=5),
                "time": datetime.strptime("10:00", "%H:%M").time(),
                "link": "https://example.com/yoga_class"
            }
        ]

        for parent_virtual_class_data in parent_virtual_classes:
            new_parent_virtual_class = ParentVirtualClass(
                parent_id=parent_virtual_class_data["parent_id"],
                name=parent_virtual_class_data["name"],
                date=parent_virtual_class_data["date"],
                time=parent_virtual_class_data["time"],
                link=parent_virtual_class_data["link"]
            )
            db.session.add(new_parent_virtual_class)

        db.session.commit()

        # Crear mensajes de padres de prueba
        parent_messages = [
            {
                "parent_id": 1,  # johndoe
                "content": "Hello, how is Alice doing?",
                "sender": "teacher",
                "timestamp": datetime.now(timezone.utc)
            }
        ]

        for parent_message_data in parent_messages:
            new_parent_message = MessageP(
                parent_id=parent_message_data["parent_id"],
                content=parent_message_data["content"],
                sender=parent_message_data["sender"],
                timestamp=parent_message_data["timestamp"]
            )
            db.session.add(new_parent_message)

        db.session.commit()

        # Crear notificaciones de padres de prueba
        parent_notifications = [
            {
                "parent_id": 1,  # johndoe
                "content": "Your payment was received.",
                "date": datetime.now(timezone.utc),
                "status": "unread"
            }
        ]

        for parent_notification_data in parent_notifications:
            new_parent_notification = ParentNotification(
                parent_id=parent_notification_data["parent_id"],
                content=parent_notification_data["content"],
                date=parent_notification_data["date"],
                status=parent_notification_data["status"]
            )
            db.session.add(new_parent_notification)

        db.session.commit()

        # Crear tareas de padres de prueba
        parent_tasks = [
            {
                "parent_id": 1,  # johndoe
                "title": "Prepare lunch",
                "description": "Prepare lunch for Alice",
                "due_date": datetime.now(timezone.utc) + timedelta(days=1),
                "status": "pending"
            }
        ]

        for parent_task_data in parent_tasks:
            new_parent_task = ParentTask(
                parent_id=parent_task_data["parent_id"],
                title=parent_task_data["title"],
                description=parent_task_data["description"],
                due_date=parent_task_data["due_date"],
                status=parent_task_data["status"]
            )
            db.session.add(new_parent_task)

        db.session.commit()

        # Crear asistencias de padres de prueba
        parent_attendances = [
            {
                "parent_id": 1,  # johndoe
                "class_id": 1,  # Math 101
                "date": datetime.now(timezone.utc),
                "status": "present"
            }
        ]

        for parent_attendance_data in parent_attendances:
            new_parent_attendance = ParentAttendance(
                parent_id=parent_attendance_data["parent_id"],
                class_id=parent_attendance_data["class_id"],
                date=parent_attendance_data["date"],
                status=parent_attendance_data["status"]
            )
            db.session.add(new_parent_attendance)

        db.session.commit()

        # Crear calificaciones de padres de prueba
        parent_grades = [
            {
                "parent_id": 1,  # johndoe
                "class_id": 1,  # Math 101
                "grade": "A",
                "date": datetime.now(timezone.utc)
            }
        ]

        for parent_grade_data in parent_grades:
            new_parent_grade = ParentGrade(
                parent_id=parent_grade_data["parent_id"],
                class_id=parent_grade_data["class_id"],
                grade=parent_grade_data["grade"],
                date=parent_grade_data["date"]
            )
            db.session.add(new_parent_grade)

        db.session.commit()

        # Crear historial de pagos de padres de prueba
        parent_payment_histories = [
            {
                "parent_id": 1,  # johndoe
                "amount": 100.0,
                "concept": "Daycare Fee",
                "status": "completed",
                "due_date": datetime.now(timezone.utc) + timedelta(days=30)
            }
        ]

        for parent_payment_history_data in parent_payment_histories:
            new_parent_payment_history = ParentPaymentHistory(
                parent_id=parent_payment_history_data["parent_id"],
                amount=parent_payment_history_data["amount"],
                concept=parent_payment_history_data["concept"],
                status=parent_payment_history_data["status"],
                due_date=parent_payment_history_data["due_date"]
            )
            db.session.add(new_parent_payment_history)

        db.session.commit()

        # Crear suscripciones de padres de prueba
        parent_subscriptions = [
            {
                "parent_id": 1,  # johndoe
                "plan_type": "premium",
                "start_date": datetime.now(timezone.utc),
                "end_date": datetime.now(timezone.utc) + timedelta(days=365)
            }
        ]

        for parent_subscription_data in parent_subscriptions:
            new_parent_subscription = ParentSubscription(
                parent_id=parent_subscription_data["parent_id"],
                plan_type=parent_subscription_data["plan_type"],
                start_date=parent_subscription_data["start_date"],
                end_date=parent_subscription_data["end_date"]
            )
            db.session.add(new_parent_subscription)

        db.session.commit()

        # Crear cursos de padres de prueba
        parent_courses = [
            {
                "parent_id": 1,  # johndoe
                "course_id": 1,  # Art Class
                "enrollment_date": datetime.now(timezone.utc)
            }
        ]

        for parent_course_data in parent_courses:
            new_parent_course = ParentCourse(
                parent_id=parent_course_data["parent_id"],
                course_id=parent_course_data["course_id"],
                enrollment_date=parent_course_data["enrollment_date"]
            )
            db.session.add(new_parent_course)

        db.session.commit()

        # Crear servicios de padres de prueba
        parent_services = [
            {
                "parent_id": 1,  # johndoe
                "service_id": 1,  # Daycare Service
                "enrollment_date": datetime.now(datetime.timezone.utc)
            }
        ]

        for parent_service_data in parent_services:
            new_parent_service = ParentService(
                parent_id=parent_service_data["parent_id"],
                service_id=parent_service_data["service_id"],
                enrollment_date=parent_service_data["enrollment_date"]
            )
            db.session.add(new_parent_service)

        db.session.commit()

        # Crear eventos de padres de prueba
        parent_events = [
            {
                "parent_id": 1,  # johndoe
                "event_id": 1,  # School Festival
                "enrollment_date": datetime.now(datetime.timezone.utc)
            }
        ]

        for parent_event_data in parent_events:
            new_parent_event = ParentEvent(
                parent_id=parent_event_data["parent_id"],
                event_id=parent_event_data["event_id"],
                enrollment_date=parent_event_data["enrollment_date"]
            )
            db.session.add(new_parent_event)

        db.session.commit()

        # Crear configuraciones de prueba
        settings = [
            {
                "name_daycare": "Happy Kids Daycare",
                "admin_email": "admin@example.com",
                "max_capacity": "100",
                "phone": "123-456-7890",
                "address": "123 Main St, City, Country",
                "schedule_attention": "Mon-Fri 8:00 AM - 6:00 PM",
                "facebook": "https://facebook.com/happykids",
                "twitter": "https://twitter.com/happykids",
                "instagram": "https://instagram.com/happykids",
                "linkedin": "https://linkedin.com/company/happykids",
                "image": "https://example.com/daycare_logo.jpg"
            }
        ]

        for setting_data in settings:
            new_setting = Settings(
                name_daycare=setting_data["name_daycare"],
                admin_email=setting_data["admin_email"],
                max_capacity=setting_data["max_capacity"],
                phone=setting_data["phone"],
                address=setting_data["address"],
                schedule_attention=setting_data["schedule_attention"],
                facebook=setting_data["facebook"],
                twitter=setting_data["twitter"],
                instagram=setting_data["instagram"],
                linkedin=setting_data["linkedin"],
                image=setting_data["image"]
            )
            db.session.add(new_setting)

        db.session.commit()

        return jsonify({"message": "Base de datos llenada exitosamente con datos de prueba."}), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": f"Error de integridad en la base de datos: {str(e)}"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@api.route('/create_admin', methods=['POST'])
def create_admin():
    data = {
        'username': "admin",
        'email': "admin@daycare.com",
        'password': "admin123",
        'role': "admin",
        'position': "Administrator",
        'department': "Management"
    }

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    position = data.get('position')
    department = data.get('department')

    if User.query.filter_by(email=email).first():
        raise APIException("User already exists", status_code=400)

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password, role=role)
    db.session.add(new_user)
    db.session.flush()

    new_admin = AdminD(user_id=new_user.id, position=position, department=department)
    db.session.add(new_admin)

    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "Admin created successfully",
        "token": access_token,
        "admin": new_user.serialize()
    }), 201

@api.route('/teacher/students', methods=['GET'])
@jwt_required()
def get_teacher_students():
    try:
        current_user_id = get_jwt_identity()
        print(f"User ID from token: {current_user_id}")
        teacher = Teacher.query.filter_by(user_id=current_user_id).first()
        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404
        
        teacher_classes = Class.query.filter_by(teacher_id=teacher.id).all()
        if not teacher_classes:
            print("No classes found for teacher")
            return jsonify({"message": "No classes found for this teacher"}), 404
        teacher_class_ids = [cls.id for cls in teacher_classes]
        print("Teacher class IDs:", teacher_class_ids)
        
        enrollments = db.session.query(Enrollment, Class)\
            .join(Class, Enrollment.class_id == Class.id)\
            .filter(Enrollment.class_id.in_(teacher_class_ids)).all()
        
        if not enrollments:
            print("No enrollments found for teacher's classes")
            return jsonify({"message": "No enrollments found for teacher's classes"}), 404
        
        students = []
        for enrollment, class_info in enrollments:
            students.append({
                "id": enrollment.id,
                "child_name": enrollment.child_name,
                "class_name": class_info.name,
                "price": class_info.price,  
                "enrolled_at": enrollment.enrolled_at.isoformat(),
                "time": class_info.time,
                "capacity": class_info.capacity
            })
        print("Students serialized:", students)

        return jsonify({"students": students}), 200

    except Exception as e:
        print("Error in get_teacher_students:", str(e))
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

# routes protegidas retornar home
@api.route('/admini', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()

    if current_user is None:
        return jsonify({"msg": "Missing Authorization Header"}), 422
    return jsonify(current_user), 200
@api.route('/paren', methods=['GET'])
@jwt_required()
def protectedP():
    current_user = get_jwt_identity()

    if current_user is None:
        return jsonify({"msg": "Missing Authorization Header"}), 401
    return jsonify(current_user), 200
@api.route('/teache', methods=['GET'])
@jwt_required()
def protectedT():
    current_user = get_jwt_identity()

    if current_user is None:
        return jsonify({"msg": "Missing Authorization Header"}), 401
    return jsonify(current_user), 200