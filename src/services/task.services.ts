import {
  TaskDetails,
  UpdateTaskDetails,
  UserTokenDetails,
} from '@app/interface';
import { Task } from '@app/models/task.schema';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaginationParams, PaginationService } from './pagination.services';
import { EventGateway, SocketEventType } from './sockets.services';

@Injectable()
export class TaskServices {
  constructor(
    @InjectModel(Task.name) public taskModel: Model<Task>,
    public taskPagination: PaginationService,
    private socket: EventGateway,
  ) {}

  async createTask(taskDetails: TaskDetails, user: UserTokenDetails) {
    const { name } = taskDetails;
    taskDetails.user = user.sub;
    await this.checkTaskNameExist(name);
    const task = await this.taskModel.create(taskDetails);

    this.socket.server
      .to(user.sub)
      .emit(SocketEventType.TASK_CREATED, JSON.stringify(task.toJSON()));
    return task;
  }

  async checkTaskNameExist(name: string) {
    const taskNameExist = await this.taskModel.findOne({ name });

    if (taskNameExist) throw new ForbiddenException('Task name already exist');
  }

  async findTaskById(taskId: string, user: UserTokenDetails) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      user: user.sub,
    });
    if (!task) throw new NotFoundException('Resource not found');
    return task;
  }

  async updateTask(
    taskId: string,
    user: UserTokenDetails,
    taskDetails: UpdateTaskDetails,
  ) {
    await this.checkTaskNameExist(taskDetails.name);
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: taskId, user: user.sub },
      { ...taskDetails },
      { new: true },
    );
    if (!updatedTask) throw new NotFoundException('Resource not found');

    this.socket.server
      .to(user.sub)
      .emit(SocketEventType.TASK_UPDATED, JSON.stringify(updatedTask.toJSON()));
    return updatedTask;
  }

  async deleteTask(taskId: string, user: UserTokenDetails) {
    const deletedTask = await this.taskModel.findOneAndDelete(
      { _id: taskId, user: user.sub },
      { new: true },
    );
    if (!deletedTask) throw new NotFoundException('Resource not found');

    this.socket.server
      .to(user.sub)
      .emit(SocketEventType.TASK_DELETED, JSON.stringify(deletedTask.toJSON()));
    return deletedTask;
  }

  async fetchAllUserTasks(
    user: UserTokenDetails,
    paginateParams: IPaginationParams,
  ): Promise<any> {
    const filters = { user: user.sub };

    return await this.taskPagination.paginate<Task>({
      MongoModel: this.taskModel,
      filters,
      paginationParams: paginateParams,
    });
  }
}
