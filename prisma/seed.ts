import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    await prisma.foodsessiondecisiontype.create({
        data: {
            name: "unset", 
        }
    });

    await prisma.foodsessiondecisiontype.create({
        data: {
            name: "roulette", 
        }
    });

    await prisma.foodsessiondecisiontype.create({
        data: {
            name: "poll", 
        }
    });

    await prisma.foodsessiondecisiontype.create({
        data: {
            name: "swyping", 
        }
    });

    await prisma.foodsessiondecisiontype.create({
        data: {
            name: "individual", 
        }
    });

    console.log("created types");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })