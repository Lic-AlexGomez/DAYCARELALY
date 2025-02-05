from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash



db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Cambiado de password a password_hash
    role = db.Column(db.String(20), nullable=False)
    profile_picture = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)  # Ahora se almacena correctamente en password_hash

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)  # Verifica con password_hash
    
    def serialize(self):
        return {
            "id": self.id, 
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "profile_picture": self.profile_picture,
            "created_at": self.created_at.isoformat()
        }

class Parent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    emergency_contact = db.Column(db.String(120), nullable=False)
    user = db.relationship('User', backref=db.backref('parent', uselist=False))
    children = db.relationship('Child', backref='parent', lazy=True)

    def __repr__(self):
        return f'<Parent {self.user.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "emergency_contact": self.emergency_contact,
            "children": [child.serialize() for child in self.children]
        }

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    qualifications = db.Column(db.Text, nullable=False)
    teaching_experience = db.Column(db.Text, nullable=False)
    certifications = db.Column(db.String(255), nullable=False)
    background_check = db.Column(db.String(255), nullable=False)
    user = db.relationship('User', backref=db.backref('teacher', uselist=False))

    def __repr__(self):
        return f'<Teacher {self.user.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "qualifications": self.qualifications,
            "teaching_experience": self.teaching_experience,
            "certifications": self.certifications,
            "background_check": self.background_check,
            
        }
    def serialize_classes(self):
        return {
            'id':self.id,
            'username':self.user.username
        }

class Child(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    allergies = db.Column(db.Text, nullable=True)
    birth_certificate = db.Column(db.String(255), nullable=False)
    immunization_records = db.Column(db.String(255), nullable=False)


    def __repr__(self):
        return f'<Child {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "name": self.name,
            "date_of_birth": self.date_of_birth.isoformat(),
            "allergies": self.allergies,
            "birth_certificate": self.birth_certificate,
            "immunization_records": self.immunization_records
        }


class AdminD(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    position = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    user = db.relationship('User', backref=db.backref('adminD', uselist=False))

    def __repr__(self):
        return f'<AdminD {self.user.username}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "position": self.position,
            "department": self.department
        }

class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    age = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(200))

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
            "image": self.image
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
            "enrollment_date": self.enrollment_date.isoformat()
        }

class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    age = db.Column(db.Integer, nullable=False)
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
            "time": self.time
        }
      
class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(90), nullable=False)
    student_name = db.Column(db.String(90), nullable=False)
    start_date = db.Column(db.Date, nullable=False)


    def __repr__(self):
        return f'<Subscription {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "class_name": self.class_name,
            "student_name": self.student_name,
            "start_date": self.start_date.isoformat(),
            
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
            "report_date": self.report_date.isoformat(),
            "content": self.content
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    image = db.Column(db.String(200))

    def __repr__(self):
        return f'<Event {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "image": self.image
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
            "timestamp": self.timestamp.isoformat()
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
            "due_date": self.due_date.isoformat(),
            "status": self.status
        }

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Attendance {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "child_id": self.child_id,
            "class_id": self.class_id,
            "date": self.date.isoformat(),
            "status": self.status
        }

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    grade = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<Grade {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "child_id": self.child_id,
            "class_id": self.class_id,
            "grade": self.grade,
            "date": self.date.isoformat()
        }

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<Payment {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "amount": self.amount,
            "date": self.date.isoformat()
        }

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Course {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "age": self.age
        }

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Notification {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "date": self.date.isoformat(),
            "status": self.status
        }

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Contact {self.first_name} {self.last_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "subject": self.subject,
            "phone_number": self.phone_number,
            "message": self.message
        }

class Newsletter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Newsletter {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
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
            "message": self.message
        }
    
# Admin Dashboard models

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Activo')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Client {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(120), nullable=False)
    teacher = db.Column(db.String(120), nullable=False)
    dayOfWeek = db.Column(db.String(120), nullable=False)
    startTime = db.Column(db.String(50), nullable=False)
    endTime = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    enrolled = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Schedule {self.class_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "class": self.class_name,
            "teacher": self.teacher,
            "dayOfWeek": self.dayOfWeek,
            "startTime": self.startTime,
            "endTime": self.endTime,
            "capacity": self.capacity,
            "enrolled": self.enrolled,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

class Email(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    to_name = db.Column(db.String(120), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Email {self.subject}>'

    def serialize(self):
        return {
            "id": self.id,
            "to_name": self.to_name,
            "user_email": self.user_email,
            "message": self.message,
            "date": self.date.isoformat(),
            "scheduledDate": self.scheduled_date.isoformat() if self.scheduled_date else None
        }


class Eventsuscriptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    events_selection = db.Column(db.String(120), nullable=False)
    parent_name = db.Column(db.String(120), nullable=False)
    special_request = db.Column(db.String(200), nullable=False)
    

    def __repr__(self):
        return f'<Contact {self.full_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "events_selection": self.events_selection,
            "parent_name": self.parent_name,
            "special_request": self.special_request,
            
        }
    
class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    url = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Video {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": self.url,
            "user_id": self.user_id,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }
    
class InactiveAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    last_active = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<InactiveAccount {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "last_active": self.last_active.isoformat(),
            "type": self.type,
            "reason": self.reason,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

class Approval(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Approval {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "name": self.name,
            "details": self.details,
            "status": self.status,
            "date": self.date.isoformat(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255), nullable=True)  # Changed from image_url
    age_range = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)


    def __repr__(self):
        return f'<Activity {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "age_range": self.age_range,
            "time": self.time,
            "capacity": self.capacity,
            "price": self.price,
            
        }
    

class VirtualClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    teacher = db.Column(db.String(120), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<VirtualClass {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date.isoformat(),
            "time": self.time.isoformat(),
            "duration": self.duration,
            "teacher": self.teacher,
            "capacity": self.capacity,
            "price": self.price
        }

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(200))

    def __repr__(self):
        return f'<Class {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image": self.image
        }
class Gallery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(200))

    def __repr__(self):
        return f'<Class {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image": self.image
        }

class ParentActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<ParentActivity {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "name": self.name,
            "date": self.date.isoformat(),
            "time": self.time.isoformat(),
            "duration": self.duration,
            "status": self.status,
            "location": self.location
        }

class ParentSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    day = db.Column(db.String(10), nullable=False)
    activities = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<ParentSchedule {self.day}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "day": self.day,
            "activities": self.activities.split(', ')
        }

class ParentPayment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    concept = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    due_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentPayment {self.concept}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "amount": self.amount,
            "concept": self.concept,
            "status": self.status,
            "due_date": self.due_date.isoformat()
        }

class ParentSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    notifications = db.Column(db.Boolean, default=True)
    language = db.Column(db.String(10), default='es')

    def __repr__(self):
        return f'<ParentSetting {self.parent_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "notifications": self.notifications,
            "language": self.language
        }

class ParentVirtualClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    link = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<ParentVirtualClass {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "name": self.name,
            "date": self.date.isoformat(),
            "time": self.time.isoformat(),
            "link": self.link
        }

class MessageP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Message {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "content": self.content,
            "sender": self.sender,
            "timestamp": self.timestamp.isoformat()
        }

class ParentNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='unread')

    def __repr__(self):
        return f'<ParentNotification {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "content": self.content,
            "date": self.date.isoformat(),
            "status": self.status
        }
class ParentTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<ParentTask {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date.isoformat(),
            "status": self.status
        }
class ParentAttendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<ParentAttendance {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "class_id": self.class_id,
            "date": self.date.isoformat(),
            "status": self.status
        }
class ParentGrade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    grade = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentGrade {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "class_id": self.class_id,
            "grade": self.grade,
            "date": self.date.isoformat()
        }
class ParentPaymentHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    concept = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    due_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentPaymentHistory {self.concept}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "amount": self.amount,
            "concept": self.concept,
            "status": self.status,
            "due_date": self.due_date.isoformat()
        }
class ParentSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    plan_type = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentSubscription {self.plan_type}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "plan_type": self.plan_type,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat()
        }
class ParentCourse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentCourse {self.course_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "course_id": self.course_id,
            "enrollment_date": self.enrollment_date.isoformat()
        }
class ParentService(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentService {self.service_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "service_id": self.service_id,
            "enrollment_date": self.enrollment_date.isoformat()
        }
class ParentEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ParentEvent {self.event_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "parent_id": self.parent_id,
            "event_id": self.event_id,
            "enrollment_date": self.enrollment_date.isoformat()
        }

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_daycare = db.Column(db.String(120), nullable=False)
    admin_email = db.Column(db.String(120), nullable=False)
    max_capacity = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(120), nullable=False)
    schedule_attention = db.Column(db.String(120), nullable=False)
    facebook = db.Column(db.String(120), nullable=False)
    twitter = db.Column(db.String(120), nullable=False)
    instagram = db.Column(db.String(120), nullable=False)
    linkedin = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(200))

    def __repr__(self):
        return f'<Class {self.name_daycare}>'

    def serialize(self):
        return {
            "id": self.id,
            "name_daycare": self.name_daycare,
            "admin_email": self.admin_email,
            "max_capacity": self.max_capacity,
            "phone": self.phone,
            "address": self.address,
            "schedule_attention": self.schedule_attention,
            "facebook": self.facebook,
            "twitter": self.twitter,
            "instagram": self.instagram,
            "linkedin": self.linkedin,
            "image": self.image
        }