import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { EntitiesModule } from './entities/entities.module';
import { FieldsModule } from './fields/fields.module';
import { ExportModule } from './export/export.module';
import { RelationsModule } from './relations/relations.module';

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Database
    PrismaModule,
    // Feature modules
    AuthModule,
    ProjectsModule,
    EntitiesModule,
    FieldsModule,
    ExportModule,
    RelationsModule,
  ],
})
export class AppModule { }
