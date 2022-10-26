import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

(async () => {
    try {
        const userIds: number[] = [];

        for (let i = 0; i < 20; i++) {
            const email = i === 0 ? 'user@example.com' : faker.internet.email();
            const password = 'ASDFasdf1234!';
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

        for (let i = 0; i < 5; i++) {
            const userId = userIds[0];

            const list = await prisma.list.create({
                data: {
                    title: faker.random.words(3),
                    description: faker.lorem.sentence(),
                    user_id: userId,
                    is_complete: i === 4
                }
            });

            for (let i = 0; i < 5; i++) {
                await prisma.listItem.create({
                    data: {
                        list_id: list.id,
                        title: faker.random.words(2),
                        status: faker.datatype.boolean()
                    }
                });
            }

            const memberIds = userIds.slice(
                faker.datatype.number({ min: 1, max: userIds.length - 1 })
            );
            for (const member of memberIds) {
                await prisma.membership.create({
                    data: {
                        list_id: list.id,
                        user_id: member
                    }
                });
            }
        }

        const randomUserIds = userIds.slice(
            faker.datatype.number({ min: 1, max: userIds.length - 3 })
        );

        for (const userId of randomUserIds) {
            const list = await prisma.list.create({
                data: {
                    title: faker.random.words(3),
                    description: faker.lorem.sentence(),
                    user_id: userId
                }
            });

            for (let i = 0; i < 5; i++) {
                await prisma.listItem.create({
                    data: {
                        list_id: list.id,
                        title: faker.random.words(2),
                        status: faker.datatype.boolean()
                    }
                });
            }

            await prisma.membership.create({
                data: {
                    list_id: list.id,
                    user_id: userIds[0]
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
})();
