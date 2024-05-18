import { Task, TaskSchema, User, UserSchema } from '@app/models';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

const modelsSchema = new Map();
modelsSchema.set(User, UserSchema);
modelsSchema.set(Task, TaskSchema);

const modelFeature = new Set<ModelDefinition>();

for (const [key, value] of modelsSchema) {
  modelFeature.add({
    name: key.name,
    schema: value,
  });
}

const imports = [
  MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return { uri: config.get<string>('MONGODB_URI_DEV') };
    },
  }),
  MongooseModule.forFeature([...modelFeature]),
];

@Global()
@Module({
  imports: [...imports],
  exports: [...imports],
})
export class DatabaseModule {}
