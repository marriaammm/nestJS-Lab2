import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
    .setTitle('d-2 lap')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
