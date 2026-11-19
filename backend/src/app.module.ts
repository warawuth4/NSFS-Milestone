import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { MilestonesModule } from './milestones/milestones.module';
import { SprintsModule } from './sprints/sprints.module';
import { EpicsModule } from './epics/epics.module';
import { StoriesModule } from './stories/stories.module';
import { TasksModule } from './tasks/tasks.module';
import { AcceptanceCriteriaModule } from './acceptance-criteria/acceptance-criteria.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    MilestonesModule,
    SprintsModule,
    EpicsModule,
    StoriesModule,
    TasksModule,
    AcceptanceCriteriaModule,
  ],
})
export class AppModule {}
