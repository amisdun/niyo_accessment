import { CurrentUser } from '@app/decorator';
import { TaskDto, UpdateTaskDto } from '@app/dto';
import { AuthGuard } from '@app/guards';
import {
  TaskDetails,
  UpdateTaskDetails,
  UserTokenDetails,
} from '@app/interface';
import { IPaginationParams } from '@app/services';
import { TaskServices } from '@app/services/task.services';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SortOrder } from 'mongoose';

@ApiBearerAuth('authorization')
@ApiTags('Task')
@UseGuards(AuthGuard)
@Controller()
export class TaskController {
  constructor(
    @Inject(forwardRef(() => TaskServices))
    private readonly taskService: TaskServices,
  ) {}

  @ApiForbiddenResponse({ description: 'Task name already exist' })
  @ApiBody({ type: TaskDto })
  @ApiOkResponse({ status: 200, type: TaskDto })
  @Post()
  async createTask(
    @Body() taskDetails: TaskDto,
    @CurrentUser() user: UserTokenDetails,
  ) {
    return this.taskService.createTask(taskDetails as TaskDetails, user);
  }

  @ApiOkResponse({ status: 200, type: [TaskDto] })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit of data to return, default is 10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page number, default is 1',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'field to be sorted by, default is createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Order to sort field by, default is asc(ascending order)',
  })
  @Get()
  async getAllTask(
    @Query('page', new DefaultValuePipe(1)) page: any,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('asc')) sortOder: SortOrder,
    @CurrentUser() user: UserTokenDetails,
  ) {
    const paginateDetails: IPaginationParams = {
      page,
      limit,
      sortCriteria: { [sortBy]: sortOder },
    };
    return await this.taskService.fetchAllUserTasks(user, paginateDetails);
  }

  @ApiParam({ name: 'id', description: 'Id of the task to fetch' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Get(':id')
  async getTaskById(
    @Param('id') taskId: string,
    @CurrentUser() user: UserTokenDetails,
  ) {
    return this.taskService.findTaskById(taskId, user);
  }

  @ApiBody({ type: UpdateTaskDto })
  @ApiParam({ name: 'id', description: 'Id of the task to update' })
  @ApiForbiddenResponse({ description: 'Task name already exist' })
  @ApiOkResponse({ status: 200, type: TaskDto })
  @Put(':id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDetails: UpdateTaskDetails,
    @CurrentUser() user: UserTokenDetails,
  ) {
    return await this.taskService.updateTask(taskId, user, updateTaskDetails);
  }

  @ApiOkResponse({ status: 200 })
  @ApiForbiddenResponse({ description: 'Task name already exist' })
  @ApiParam({ name: 'id', description: 'Id of the task to delete' })
  @Delete(':id')
  async deleteTask(
    @Param('id') taskId: string,
    @CurrentUser() user: UserTokenDetails,
  ) {
    return await this.taskService.deleteTask(taskId, user);
  }
}
