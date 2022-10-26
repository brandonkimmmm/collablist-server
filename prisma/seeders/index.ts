import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

(async () => {
    try {
        console.log('Seeding Admin');

        const email = process.env.ADMIN_EMAIL as string;
        const password = process.env.ADMIN_PASSWORD as string;
        const first_name = process.env.ADMIN_FIRST_NAME as string;
        const last_name = process.env.ADMIN_LAST_NAME as string;
        const username = email.split('@')[0];

        await prisma.user.upsert({
            where: {
                email
            },
            update: {},
            create: {
                email,
                first_name,
                last_name,
                username,
                role: 'ADMIN',
                password: bcrypt.hashSync(
                    password,
                    parseInt(process.env.BCRYPT_SALT_ROUNDS as string)
                )
            }
        });

        console.log('Seeder finsihed');
    } catch (err) {
        console.error(err);
    }
})();
