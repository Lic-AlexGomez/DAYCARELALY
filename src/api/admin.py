  
import os
from flask_admin import Admin # type: ignore
from .models import db, User, Parent, Teacher, Class, Enrollment, Child, Program, Subscription, ProgressReport,Event, Course,Message,Task, Attendance, Grade, Payment, Schedule, Notification, Contact, Newsletter, Getintouch, Client, Email,Eventsuscriptions, Video, InactiveAccount, Approval, AdminD, Activity, VirtualClass,Service,Gallery, ParentActivity, ParentCourse,ParentAttendance,ParentEvent,ParentGrade,ParentNotification,ParentPayment,ParentPaymentHistory,ParentSchedule,ParentService,ParentSubscription,ParentSetting,ParentTask,ParentVirtualClass,MessageP,Settings
from flask_admin.contrib.sqla import ModelView # type: ignore

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Parent, db.session))
    admin.add_view(ModelView(Teacher, db.session))
    admin.add_view(ModelView(Class, db.session))
    admin.add_view(ModelView(Enrollment, db.session))
    admin.add_view(ModelView(Child, db.session))
    admin.add_view(ModelView(Program, db.session))
    admin.add_view(ModelView(Subscription, db.session))
    admin.add_view(ModelView(ProgressReport, db.session))
    admin.add_view(ModelView(Event, db.session))
    admin.add_view(ModelView(Course, db.session))
    admin.add_view(ModelView(Message, db.session))
    admin.add_view(ModelView(Task, db.session))
    admin.add_view(ModelView(Attendance, db.session))
    admin.add_view(ModelView(Grade, db.session))
    admin.add_view(ModelView(Payment, db.session))
    admin.add_view(ModelView(Schedule, db.session))
    admin.add_view(ModelView(Notification, db.session))
    admin.add_view(ModelView(Contact, db.session))
    admin.add_view(ModelView(Newsletter, db.session))
    admin.add_view(ModelView(Getintouch, db.session))
    admin.add_view(ModelView(Client, db.session))
    admin.add_view(ModelView(Email, db.session))
    admin.add_view(ModelView(Eventsuscriptions, db.session))
    admin.add_view(ModelView(Video, db.session))
    admin.add_view(ModelView(InactiveAccount, db.session))
    admin.add_view(ModelView(Approval, db.session))
    admin.add_view(ModelView(AdminD, db.session))
    admin.add_view(ModelView(Activity, db.session))
    admin.add_view(ModelView(VirtualClass, db.session))
    admin.add_view(ModelView(Service, db.session))
    admin.add_view(ModelView(Gallery, db.session))
    admin.add_view(ModelView(ParentActivity, db.session))
    admin.add_view(ModelView(ParentCourse, db.session))
    admin.add_view(ModelView(ParentAttendance, db.session))
    admin.add_view(ModelView(ParentEvent, db.session))
    admin.add_view(ModelView(ParentGrade, db.session))
    admin.add_view(ModelView(ParentNotification, db.session))
    admin.add_view(ModelView(ParentPayment, db.session))
    admin.add_view(ModelView(ParentPaymentHistory, db.session))
    admin.add_view(ModelView(ParentSchedule, db.session))
    admin.add_view(ModelView(ParentService, db.session))
    admin.add_view(ModelView(ParentSubscription, db.session))
    admin.add_view(ModelView(ParentSetting, db.session))
    admin.add_view(ModelView(ParentTask, db.session))
    admin.add_view(ModelView(ParentVirtualClass, db.session))
    admin.add_view(ModelView(MessageP, db.session))
    admin.add_view(ModelView(Settings, db.session))
    


    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))