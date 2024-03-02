## Assignment: Graphql
### Tasks:
1. Added logic to the graphql endpoint: ./src/routes/graphql.  
Constraints and logic for gql queries were done based on restful implementation.  
   1.1. `npm run test-queries`
   1.2. `npm run test-mutations` 
2. Limited the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.  
   Used value "5" for package.  
   2.1. `npm run test-rule`  
3. Solved `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader).  
   Only one "findMany" call used per loader => this task should be considered  to be completed.  
   3.1. `npm run test-loader`  
   3.2. `npm run test-loader-prime`  
   When you query all users, you won't use the database again when you want to find subs.  
   Pre-placed users in the appropriate dataloader cache.    

### Info:

Steps to start the check:
1. Clone this repo: `git clone https://github.com/egatsak/rsschool-nodejs-task-graphql.git`
2. Go to project dir: `cd rsschool-nodejs-task-graphql`
3. Go to development branch: `git checkout develop`
4. Install dependencies: `npm ci`
5. Create `.env` file (based on `.env.example`): `./.env`
6. Create db file: `./prisma/database.db`
7. Apply pending migrations: `npx prisma migrate deploy`
8. Seed db: `npx prisma db seed`
9. Start server: `npm run start`

### Useful things:
- Database GUI: `npx prisma studio`
- Tests modify the db, so if it seems to you that the db has become too large, you can clear it: `npx prisma migrate reset` (also triggers seeding)
- Swagger: <<base_url>>/docs

Thanks!