import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
import { AuthModule } from '@app/auth/auth.module';
import { AppModule } from '../app.module';
import { TaskModule } from './task.module';

export const routes: Routes = [
  {
    path: '/',
    module: AppModule,
  },
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/task',
    module: TaskModule,
  },
];

@Module({
  imports: [RouterModule.register(routes), AuthModule, TaskModule],
  exports: [],
})
export class RoutingModule {}
