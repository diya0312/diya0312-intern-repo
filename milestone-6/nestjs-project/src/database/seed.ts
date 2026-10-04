import { AppDataSource } from './data-source';
import { TaskSeed } from './entities/task-seed.entity';

async function seed() {
  await AppDataSource.initialize();

  const repository = AppDataSource.getRepository(TaskSeed);

  const tasks = [
    repository.create({
      title: 'Learn TypeORM migrations',
    }),
    repository.create({
      title: 'Practice database seeding',
    }),
    repository.create({
      title: 'Understand migration rollback',
    }),
  ];

  await repository.save(tasks);

  console.log('Sample tasks seeded successfully.');

  const savedTasks = await repository.find();
  console.table(savedTasks);

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});