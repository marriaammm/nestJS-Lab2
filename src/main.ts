import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { JwtMiddleware } from './middleware/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('d-2 lap')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use((req: any, res: any, next: any) => {

    if (req.path === '/users/sign-up' || req.path === '/users/sign-in') {
      return next();
    }
    const jwtMiddleware = new JwtMiddleware();
    jwtMiddleware.use(req, res, next);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();