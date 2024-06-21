# foodieFlock
Backend + Web Part of a App that strives to help managing eating sessions with your pals


## how to install:

1. create a .env file at root
2. add this to your .env:

```
DATABASE_URL="mysql://user:password@url:port/dbname" 
TOKEN_SECRET="your token_secret string"
```

3. run these commands

``` npm install```

```npx prisma migrate dev --name init```

```npx prisma db seed```

```cd /src```

```npx ts-node index.ts```
