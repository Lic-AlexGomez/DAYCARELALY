
@api.route('/add_simple_data_user', methods=['POST'])
def add_simple_data_user():
    try:
        if User.query.count() > 0:
            return jsonify({"message": "La tabla User ya contiene datos."}), 200
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


        
@api.route('/create_admin', methods=['POST'])
def create_admin():
    # Datos predefinidos para el usuario administrador
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