import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

(async () => {
    try {
        console.log('Seeding Users');

        const userIds: number[] = [];

        for (let i = 0; i < 20; i++) {
            const email = faker.internet.email();
            const password = 'asdfasdf1234';
            const first_name = faker.name.firstName();
            const last_name = faker.name.lastName();
            const username = email.split('@')[0];

            const user = await prisma.user.upsert({
                where: {
                    email
                },
                update: {},
                create: {
                    email,
                    first_name,
                    last_name,
                    username,
                    role: 'USER',
                    password: bcrypt.hashSync(
                        password,
                        parseInt(process.env.BCRYPT_SALT_ROUNDS as string)
                    )
                }
            });

            userIds.push(user.id);
        }

        console.log('Seeder finsihed');
    } catch (err) {
        console.error(err);
    }
})();
