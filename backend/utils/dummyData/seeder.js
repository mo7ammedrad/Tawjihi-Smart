import { readFileSync } from 'fs';
import { fakerAR } from '@faker-js/faker';
import { config } from 'dotenv';
import { connectDB } from '../../config/db.js';
import i18n from '../../config/i18n.js';
import Branch from '../../models/Branch.js';
import Cart from '../../models/Cart.js';
import Comment from '../../models/Comment.js';
import Coupon from '../../models/Coupon.js';
import Course from '../../models/Course.js';
import Enrollment from '../../models/Enrollment.js';
import Lesson from '../../models/Lesson.js';
import New from '../../models/New.js';
import Payment from '../../models/Payment.js';
import Review from '../../models/Review.js';
import Subject from '../../models/Subject.js';
import TeacherReview from '../../models/TeacherReview.js';
import User from '../../models/User.js';

config({ path: '../../config.env' });

const t = (key, options) => i18n.__({ phrase: key, locale: 'en' }, options);

const deleteData = async () => {
	try {
		await Branch.deleteMany();
		await Cart.deleteMany();
		await Comment.deleteMany();
		await Coupon.deleteMany();
		await Course.deleteMany();
		await Enrollment.deleteMany();
		await Lesson.deleteMany();
		await New.deleteMany();
		await Payment.deleteMany();
		await Review.deleteMany();
		await Subject.deleteMany();
		await TeacherReview.deleteMany();
		await User.deleteMany();
		console.log(t('seeder.all_data_deleted'));
	} catch (error) {
		console.error(t('seeder.error_deleting_data', { error }));
		process.exit(-1);
	}
};

const seedAdmin = async () => {
	try {
		await User.create({
			name: 'Admin',
			email: 'admin@tawjihi.com',
			description: 'Admin user for the application',
			password: 'admin123',
			phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
			role: 'admin',
			coverImage: fakerAR.image.personPortrait(),
		});
		console.log(t('seeder.admin_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_admin', { error }));
		process.exit(-1);
	}
};

const seedUsers = async () => {
	const generateUser = (gender) => {
		fakerAR.seed(Math.floor(Math.random() * 100000) + 1);
		const firstName = fakerAR.person.firstName(gender);
		const lastName = fakerAR.person.firstName(gender);
		return {
			name: `${firstName} ${lastName}`,
			email: fakerAR.internet.email({
				firstName,
				lastName,
				provider: 'gmail.com',
				allowSpecialCharacters: false,
			}),
			password: 12345678,
			Phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
			coverImage: fakerAR.image.personPortrait(),
			role: 'user',
			isActive: true,
		};
	};

	const users = [];
	for (let i = 0; i < 50; i += 1) {
		users.push(generateUser(fakerAR.helpers.arrayElement(['male', 'female'])));
	}
	try {
		await User.create(users);
		console.log(t('seeder.users_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_users', { error }));
		process.exit(-1);
	}
};

const seedTeachers = async () => {
	const generateTeacher = (gender) => {
		fakerAR.seed(Math.floor(Math.random() * 100000) + 1);
		const firstName = fakerAR.person.firstName(gender);
		const lastName = fakerAR.person.lastName(gender);

		return {
			name: `${firstName} ${lastName}`,
			email: fakerAR.internet.email({
				firstName,
				lastName,
				provider: 'gmail.com',
				allowSpecialCharacters: false,
			}),
			description: `وصف للمعلم ${firstName} ${lastName}`,
			password: 12345678,
			phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
			coverImage: fakerAR.image.personPortrait({ sex: gender }),
			cv: 'https://res.cloudinary.com/tawhihi/raw/upload/v1752490269/files/cvs/ycvuuocuzzztsw9gh4t4.pdf',
			role: 'teacher',
			isActive: true,
		};
	};

	const teachers = [];
	for (let i = 0; i < 11; i += 1) {
		teachers.push(generateTeacher(fakerAR.helpers.arrayElement(['male', 'female'])));
	}
	try {
		await User.create(teachers);
		console.log(t('seeder.teachers_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_teachers', { error }));
		process.exit(-1);
	}
};

const seedBranches = async () => {
	const branches = JSON.parse(readFileSync('./branches.json'));
	try {
		await Branch.create(branches);
		console.log(t('seeder.branches_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_branches', { error }));
		process.exit(-1);
	}
};

const seedSubjects = async () => {
	const subjects = JSON.parse(readFileSync('./subjects.json'));
	try {
		await Subject.create(subjects);
		console.log(t('seeder.subjects_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_subjects', { error }));
		process.exit(-1);
	}
};

(async () => {
	await connectDB(process.env.DB_URI);
})();

(async () => {
	const mode = process.argv[2];
	if (!mode || (mode !== '-d' && mode !== '-i')) {
		console.error(t('seeder.invalid_mode'));
		process.exit(-1);
	}
	try {
		if (mode === '-d') {
			await deleteData();
			process.exit(0);
		} else if (mode === '-i') {
			await seedAdmin();
			await seedUsers();
			await seedTeachers();
			await seedBranches();
			await seedSubjects();
			console.log(t('seeder.seeding_complete'));
			process.exit(0);
		}
	} catch (error) {
		console.error(t('seeder.error_in_seeding', { error }));
		process.exit(-1);
	}
})();
