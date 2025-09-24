import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.DB_TYPE as any || 'postgres',
        // url: process.env.DB_URL,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || (process.env.DB_TYPE === 'sqlite' ? undefined : 5432),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        logging: true,
        ssl:  { 
          rejectUnauthorized: false,
        },
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'development', // dev only
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        // ...(process.env.DB_TYPE === 'sqlite' ? { database: process.env.DB_PATH || 'db.sqlite' } : {}),
      }),
    }),
  ],
})

export class DatabaseModule {}
