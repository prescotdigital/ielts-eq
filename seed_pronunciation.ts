import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const drills = [
    {
        phoneme: "th-unvoiced",
        label: "The Unvoiced /θ/ Sound",
        description: "Place your tongue between your teeth and blow air out gently without using your voice. It's like a soft hiss.",
        words: ["Think", "Thought", "Three", "Thin", "Thank", "Bath", "Mouth", "North"],
        sentences: [
            "I think I thought a thought.",
            "Three thin thieves thought a thousand thoughts.",
            "Thank you for the three things."
        ],
        order: 1
    },
    {
        phoneme: "th-voiced",
        label: "The Voiced /ð/ Sound",
        description: "Place your tongue between your teeth and use your voice to make a buzzing sound. It feels like a vibration.",
        words: ["This", "That", "Those", "These", "Them", "Father", "Mother", "Brother"],
        sentences: [
            "This is better than that.",
            "My father and mother are there.",
            "Those are the clothes I breathe in."
        ],
        order: 2
    },
    {
        phoneme: "r-l",
        label: "R vs L",
        description: "For /r/, pull your tongue back and don't touch the roof of your mouth. For /l/, touch the tip of your tongue to the gum ridge behind your upper teeth.",
        words: ["Red", "Led", "Right", "Light", "Road", "Load", "Arrive", "Alive"],
        sentences: [
            "The red light on the road.",
            "Larry arrived late and alive.",
            "Read the right lead."
        ],
        order: 3
    },
    {
        phoneme: "v-w",
        label: "V vs W",
        description: "For /v/, bite your lower lip with your upper teeth and vibrate. For /w/, round your lips like a circle and don't touch your teeth.",
        words: ["Vet", "Wet", "Vest", "West", "Vine", "Wine", "Veil", "Whale"],
        sentences: [
            "The vet went west in a vest.",
            "Will we visit the whale?",
            "Very wet vines."
        ],
        order: 4
    },
    {
        phoneme: "long-short-i",
        label: "Long /i:/ vs Short /ɪ/",
        description: "For long /i:/ (Sheep), smile wide. For short /ɪ/ (Ship), relax your mouth and make a quick sound.",
        words: ["Sheep", "Ship", "Eat", "It", "Seat", "Sit", "Feet", "Fit"],
        sentences: [
            "Sit on the seat.",
            "The sheep is on the ship.",
            "Fit the feet in."
        ],
        order: 5
    }
];

async function main() {
    console.log('Start seeding pronunciation drills...');

    for (const drill of drills) {
        const existing = await prisma.pronunciationDrill.findFirst({
            where: { phoneme: drill.phoneme }
        });

        if (!existing) {
            await prisma.pronunciationDrill.create({
                data: drill
            });
            console.log(`Created drill: ${drill.label}`);
        } else {
            console.log(`Drill already exists: ${drill.label}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
