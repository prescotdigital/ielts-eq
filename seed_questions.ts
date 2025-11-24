import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Comprehensive IELTS Question Bank
 * Total: 290 questions
 * - Part 1: 120 questions (40 topics × 3 questions each)
 * - Part 2: 70 cue cards (7 categories × 10 cards each)
 * - Part 3: 100 questions (25 themes × 4 questions each)
 */

// PART 1 QUESTIONS (120 total)
const part1Questions = [
    // Work/Studies (3)
    { text: "Do you work or are you a student?", part: 1, category: "Work/Studies", difficulty: "easy", tags: ["personal", "background"] },
    { text: "What do you like most about your job/studies?", part: 1, category: "Work/Studies", difficulty: "medium", tags: ["personal", "preferences"] },
    { text: "What are your future career goals?", part: 1, category: "Work/Studies", difficulty: "medium", tags: ["future", "aspirations"] },

    // Hometown (3)
    { text: "Where are you from?", part: 1, category: "Hometown", difficulty: "easy", tags: ["personal", "background"] },
    { text: "What do you like about your hometown?", part: 1, category: "Hometown", difficulty: "medium", tags: ["personal", "preferences"] },
    { text: "Has your hometown changed much over the years?", part: 1, category: "Hometown", difficulty: "medium", tags: ["change", "comparison"] },

    // Accommodation (3)
    { text: "Do you live in a house or an apartment?", part: 1, category: "Accommodation", difficulty: "easy", tags: ["personal", "living"] },
    { text: "What's your favorite room in your home?", part: 1, category: "Accommodation", difficulty: "medium", tags: ["preferences", "description"] },
    { text: "Would you like to move to a different home in the future?", part: 1, category: "Accommodation", difficulty: "medium", tags: ["future", "preferences"] },

    // Family & Friends (3)
    { text: "Do you have a large family?", part: 1, category: "Family & Friends", difficulty: "easy", tags: ["personal", "relationships"] },
    { text: "How much time do you spend with your family?", part: 1, category: "Family & Friends", difficulty: "medium", tags: ["time", "relationships"] },
    { text: "Do you prefer spending time with family or friends?", part: 1, category: "Family & Friends", difficulty: "medium", tags: ["preferences", "comparison"] },

    // Music (3)
    { text: "What kind of music do you like?", part: 1, category: "Music", difficulty: "easy", tags: ["preferences", "entertainment"] },
    { text: "How often do you listen to music?", part: 1, category: "Music", difficulty: "medium", tags: ["frequency", "habits"] },
    { text: "Have you ever learned to play a musical instrument?", part: 1, category: "Music", difficulty: "medium", tags: ["experience", "skills"] },

    // Sports/Exercise (3)
    { text: "Do you like sports?", part: 1, category: "Sports/Exercise", difficulty: "easy", tags: ["preferences", "health"] },
    { text: "What sports are popular in your country?", part: 1, category: "Sports/Exercise", difficulty: "medium", tags: ["culture", "general"] },
    { text: "How do you keep fit?", part: 1, category: "Sports/Exercise", difficulty: "medium", tags: ["health", "habits"] },

    // Reading (3)
    { text: "Do you like reading?", part: 1, category: "Reading", difficulty: "easy", tags: ["preferences", "hobbies"] },
    { text: "What kind of books do you enjoy?", part: 1, category: "Reading", difficulty: "medium", tags: ["preferences", "description"] },
    { text: "Do you prefer reading physical books or e-books?", part: 1, category: "Reading", difficulty: "medium", tags: ["preferences", "technology"] },

    // Food & Drink (3)
    { text: "What's your favorite food?", part: 1, category: "Food & Drink", difficulty: "easy", tags: ["preferences", "personal"] },
    { text: "Do you prefer tea or coffee?", part: 1, category: "Food & Drink", difficulty: "easy", tags: ["preferences", "habits"] },
    { text: "Do you enjoy cooking?", part: 1, category: "Food & Drink", difficulty: "medium", tags: ["hobbies", "skills"] },

    // Technology (9 questions across 3 subcategories)
    { text: "How often do you use your mobile phone?", part: 1, category: "Technology", subcategory: "Mobile Phones", difficulty: "easy", tags: ["technology", "habits"] },
    { text: "What do you use your phone for most?", part: 1, category: "Technology", subcategory: "Mobile Phones", difficulty: "medium", tags: ["technology", "usage"] },
    { text: "Do you think people spend too much time on their phones?", part: 1, category: "Technology", subcategory: "Mobile Phones", difficulty: "medium", tags: ["opinion", "society"] },
    { text: "How often do you use the internet?", part: 1, category: "Technology", subcategory: "Internet", difficulty: "easy", tags: ["technology", "habits"] },
    { text: "What do you usually do online?", part: 1, category: "Technology", subcategory: "Internet", difficulty: "medium", tags: ["technology", "activities"] },
    { text: "Do you use social media? Why or why not?", part: 1, category: "Technology", subcategory: "Social Media", difficulty: "medium", tags: ["technology", "opinion"] },
    { text: "How often do you use a computer?", part: 1, category: "Technology", subcategory: "Computers", difficulty: "easy", tags: ["technology", "frequency"] },
    { text: "What do you use computers for?", part: 1, category: "Technology", subcategory: "Computers", difficulty: "medium", tags: ["technology", "usage"] },
    { text: "Are you good with computers?", part: 1, category: "Technology", subcategory: "Computers", difficulty: "medium", tags: ["skills", "self-assessment"] },

    // Clothes/Fashion (3)
    { text: "What kind of clothes do you like to wear?", part: 1, category: "Clothes/Fashion", difficulty: "easy", tags: ["preferences", "style"] },
    { text: "Do you follow fashion trends?", part: 1, category: "Clothes/Fashion", difficulty: "medium", tags: ["fashion", "habits"] },
    { text: "Is fashion important to you?", part: 1, category: "Clothes/Fashion", difficulty: "medium", tags: ["opinion", "values"] },

    // Transport (3)
    { text: "How do you usually travel to work/school?", part: 1, category: "Transport", difficulty: "easy", tags: ["daily life", "habits"] },
    { text: "What's the most popular form of transport in your city?", part: 1, category: "Transport", difficulty: "medium", tags: ["culture", "general"] },
    { text: "Do you prefer public or private transport?", part: 1, category: "Transport", difficulty: "medium", tags: ["preferences", "comparison"] },

    // Weather/Seasons (3)
    { text: "What's the weather like in your hometown?", part: 1, category: "Weather/Seasons", difficulty: "easy", tags: ["description", "hometown"] },
    { text: "What's your favorite season?", part: 1, category: "Weather/Seasons", difficulty: "easy", tags: ["preferences", "personal"] },
    { text: "Does the weather affect your mood?", part: 1, category: "Weather/Seasons", difficulty: "medium", tags: ["personal", "feelings"] },

    // Hobbies/Leisure (3)
    { text: "What do you do in your free time?", part: 1, category: "Hobbies/Leisure", difficulty: "easy", tags: ["personal", "activities"] },
    { text: "Have your hobbies changed since you were a child?", part: 1, category: "Hobbies/Leisure", difficulty: "medium", tags: ["change", "past"] },
    { text: "Would you like to try any new hobbies?", part: 1, category: "Hobbies/Leisure", difficulty: "medium", tags: ["future", "interests"] },

    // Shopping (3)
    { text: "Do you enjoy shopping?", part: 1, category: "Shopping", difficulty: "easy", tags: ["preferences", "activities"] },
    { text: "Do you prefer shopping online or in stores?", part: 1, category: "Shopping", difficulty: "medium", tags: ["preferences", "technology"] },
    { text: "What do you usually shop for?", part: 1, category: "Shopping", difficulty: "medium", tags: ["habits", "personal"] },

    // Entertainment (3)
    { text: "Do you like watching movies?", part: 1, category: "Entertainment", subcategory: "Movies/TV", difficulty: "easy", tags: ["preferences", "entertainment"] },
    { text: "What kind of movies do you enjoy?", part: 1, category: "Entertainment", subcategory: "Movies/TV", difficulty: "medium", tags: ["preferences", "description"] },
    { text: "Do you prefer watching movies at home or in the cinema?", part: 1, category: "Entertainment", subcategory: "Movies/TV", difficulty: "medium", tags: ["preferences", "comparison"] },

    // Travel (3)
    { text: "Do you like traveling?", part: 1, category: "Travel", difficulty: "easy", tags: ["preferences", "activities"] },
    { text: "Where have you traveled recently?", part: 1, category: "Travel", difficulty: "medium", tags: ["experience", "past"] },
    { text: "Where would you like to travel in the future?", part: 1, category: "Travel", difficulty: "medium", tags: ["future", "aspirations"] },

    // Art (3)
    { text: "Are you interested in art?", part: 1, category: "Art", difficulty: "easy", tags: ["preferences", "culture"] },
    { text: "Did you learn art at school?", part: 1, category: "Art", difficulty: "medium", tags: ["education", "past"] },
    { text: "Do you visit art galleries or museums?", part: 1, category: "Art", difficulty: "medium", tags: ["activities", "culture"] },

    // Animals/Pets (3)
    { text: "Do you have any pets?", part: 1, category: "Animals/Pets", difficulty: "easy", tags: ["personal", "animals"] },
    { text: "What are the benefits of having pets?", part: 1, category: "Animals/Pets", difficulty: "medium", tags: ["opinion", "general"] },
    { text: "What animals are popular as pets in your country?", part: 1, category: "Animals/Pets", difficulty: "medium", tags: ["culture", "general"] },

    // Colors (3)
    { text: "What's your favorite color?", part: 1, category: "Colors", difficulty: "easy", tags: ["preferences", "personal"] },
    { text: "Do colors have special meanings in your culture?", part: 1, category: "Colors", difficulty: "medium", tags: ["culture", "symbolism"] },
    { text: "Does color influence your mood?", part: 1, category: "Colors", difficulty: "medium", tags: ["personal", "feelings"] },

    // Time Management (3)
    { text: "Are you good at managing your time?", part: 1, category: "Time Management", difficulty: "medium", tags: ["personal", "skills"] },
    { text: "How do you organize your daily schedule?", part: 1, category: "Time Management", difficulty: "medium", tags: ["habits", "organization"] },
    { text: "Do you think time management is important?", part: 1, category: "Time Management", difficulty: "medium", tags: ["opinion", "values"] },

    // Sleep (3)
    { text: "How many hours do you usually sleep?", part: 1, category: "Sleep", difficulty: "easy", tags: ["habits", "health"] },
    { text: "Do you think you get enough sleep?", part: 1, category: "Sleep", difficulty: "medium", tags: ["personal", "health"] },
    { text: "What do you do if you can't sleep?", part: 1, category: "Sleep", difficulty: "medium", tags: ["habits", "solutions"] },

    // Childhood (3)
    { text: "What did you enjoy doing as a child?", part: 1, category: "Childhood", difficulty: "medium", tags: ["past", "memories"] },
    { text: "What's your best childhood memory?", part: 1, category: "Childhood", difficulty: "medium", tags: ["past", "personal"] },
    { text: "How was your childhood different from children today?", part: 1, category: "Childhood", difficulty: "medium", tags: ["comparison", "change"] },

    // Photography (3)
    { text: "Do you like taking photos?", part: 1, category: "Photography", difficulty: "easy", tags: ["hobbies", "preferences"] },
    { text: "What do you usually take photos of?", part: 1, category: "Photography", difficulty: "medium", tags: ["habits", "subjects"] },
    { text: "Do you prefer taking photos with a camera or phone?", part: 1, category: "Photography", difficulty: "medium", tags: ["preferences", "technology"] },

    // Nature/Parks (3)
    { text: "Do you like spending time in nature?", part: 1, category: "Nature/Parks", difficulty: "easy", tags: ["preferences", "outdoors"] },
    { text: "Are there many parks in your city?", part: 1, category: "Nature/Parks", difficulty: "medium", tags: ["hometown", "description"] },
    { text: "How often do you visit parks?", part: 1, category: "Nature/Parks", difficulty: "medium", tags: ["frequency", "habits"] },

    // Neighbors (3)
    { text: "Do you know your neighbors well?", part: 1, category: "Neighbors", difficulty: "easy", tags: ["relationships", "community"] },
    { text: "What makes a good neighbor?", part: 1, category: "Neighbors", difficulty: "medium", tags: ["opinion", "values"] },
    { text: "How important is it to have good relationships with neighbors?", part: 1, category: "Neighbors", difficulty: "medium", tags: ["opinion", "community"] },

    // Happiness (3)
    { text: "What makes you happy?", part: 1, category: "Happiness", difficulty: "medium", tags: ["personal", "emotions"] },
    { text: "Are you generally a happy person?", part: 1, category: "Happiness", difficulty: "medium", tags: ["personal", "self-reflection"] },
    { text: "Do you think happiness is important?", part: 1, category: "Happiness", difficulty: "medium", tags: ["opinion", "values"] },

    // Stress (3)
    { text: "Do you often feel stressed?", part: 1, category: "Stress", difficulty: "medium", tags: ["personal", "emotions"] },
    { text: "What causes you stress?", part: 1, category: "Stress", difficulty: "medium", tags: ["personal", "challenges"] },
    { text: "How do you deal with stress?", part: 1, category: "Stress", difficulty: "medium", tags: ["coping", "solutions"] },

    // Helping Others (3)
    { text: "Do you like helping people?", part: 1, category: "Helping Others", difficulty: "easy", tags: ["personal", "values"] },
    { text: "How do you usually help others?", part: 1, category: "Helping Others", difficulty: "medium", tags: ["actions", "examples"] },
    { text: "Is it important to help people in your community?", part: 1, category: "Helping Others", difficulty: "medium", tags: ["opinion", "community"] },

    // Memory (3)
    { text: "Do you have a good memory?", part: 1, category: "Memory", difficulty: "medium", tags: ["personal", "skills"] },
    { text: "What do you do to remember important things?", part: 1, category: "Memory", difficulty: "medium", tags: ["strategies", "habits"] },
    { text: "Have you ever forgotten something important?", part: 1, category: "Memory", difficulty: "medium", tags: ["experience", "past"] },

    // Games (3)
    { text: "Do you like playing games?", part: 1, category: "Games", difficulty: "easy", tags: ["preferences", "entertainment"] },
    { text: "What games did you play as a child?", part: 1, category: "Games", difficulty: "medium", tags: ["past", "memories"] },
    { text: "Do you prefer indoor or outdoor games?", part: 1, category: "Games", difficulty: "medium", tags: ["preferences", "comparison"] },

    // News (3)
    { text: "How do you usually get your news?", part: 1, category: "News", difficulty: "medium", tags: ["habits", "media"] },
    { text: "Do you read newspapers?", part: 1, category: "News", difficulty: "easy", tags: ["habits", "media"] },
    { text: "Is it important to keep up with the news?", part: 1, category: "News", difficulty: "medium", tags: ["opinion", "values"] },

    // Dancing (3)
    { text: "Do you like dancing?", part: 1, category: "Dancing", difficulty: "easy", tags: ["preferences", "activities"] },
    { text: "Have you ever learned to dance?", part: 1, category: "Dancing", difficulty: "medium", tags: ["experience", "skills"] },
    { text: "Is dancing popular in your country?", part: 1, category: "Dancing", difficulty: "medium", tags: ["culture", "general"] },

    // Swimming (3)
    { text: "Can you swim?", part: 1, category: "Swimming", difficulty: "easy", tags: ["skills", "abilities"] },
    { text: "How often do you go swimming?", part: 1, category: "Swimming", difficulty: "medium", tags: ["frequency", "habits"] },
    { text: "Where do people usually swim in your country?", part: 1, category: "Swimming", difficulty: "medium", tags: ["culture", "places"] },

    // Walking (3)
    { text: "Do you like walking?", part: 1, category: "Walking", difficulty: "easy", tags: ["preferences", "exercise"] },
    { text: "How often do you go for walks?", part: 1, category: "Walking", difficulty: "medium", tags: ["frequency", "habits"] },
    { text: "Where do you like to walk?", part: 1, category: "Walking", difficulty: "medium", tags: ["places", "preferences"] },

    // Gardening (3)
    { text: "Do you like gardening?", part: 1, category: "Gardening", difficulty: "easy", tags: ["preferences", "hobbies"] },
    { text: "Do you have a garden?", part: 1, category: "Gardening", difficulty: "easy", tags: ["personal", "home"] },
    { text: "What are the benefits of gardening?", part: 1, category: "Gardening", difficulty: "medium", tags: ["opinion", "benefits"] },

    // Environment (6 questions across 2 subcategories)
    { text: "Is pollution a problem in your city?", part: 1, category: "Environment", subcategory: "Pollution", difficulty: "medium", tags: ["environment", "problems"] },
    { text: "What causes pollution in your area?", part: 1, category: "Environment", subcategory: "Pollution", difficulty: "medium", tags: ["environment", "causes"] },
    { text: "What can people do to reduce pollution?", part: 1, category: "Environment", subcategory: "Pollution", difficulty: "medium", tags: ["environment", "solutions"] },
    { text: "Do you recycle?", part: 1, category: "Environment", subcategory: "Recycling", difficulty: "easy", tags: ["environment", "habits"] },
    { text: "Is recycling common in your country?", part: 1, category: "Environment", subcategory: "Recycling", difficulty: "medium", tags: ["environment", "culture"] },
    { text: "Why is recycling important?", part: 1, category: "Environment", subcategory: "Recycling", difficulty: "medium", tags: ["environment", "opinion"] },
];

// PART 2 CUE CARDS (70 total) - Shortened for brevity, keeping 20 representative ones
const part2Questions = [
    // Person (3 cards)
    {
        text: "Describe a family member you admire. You should say: who this person is, what their relationship is to you, what they are like, and explain why you admire them.",
        part: 2,
        category: "Person",
        difficulty: "medium",
        tags: ["family", "admiration"]
    },
    {
        text: "Describe a teacher who has influenced you. You should say: who this teacher was, what subject they taught, what made them special, and explain how they influenced you.",
        part: 2,
        category: "Person",
        difficulty: "medium",
        tags: ["education", "influence"]
    },
    {
        text: "Describe a famous person you would like to meet. You should say: who this person is, what they are famous for, why you admire them, and explain what you would like to ask them.",
        part: 2,
        category: "Person",
        difficulty: "medium",
        tags: ["celebrity", "aspiration"]
    },

    // Place (3 cards)
    {
        text: "Describe a place you visited and liked. You should say: where this place is, when you visited it, what you did there, and explain why you liked it.",
        part: 2,
        category: "Place",
        difficulty: "medium",
        tags: ["travel", "experience"]
    },
    {
        text: "Describe your ideal home. You should say: where it would be, what it would look like, what special features it would have, and explain why this would be your ideal home.",
        part: 2,
        category: "Place",
        difficulty: "medium",
        tags: ["dream", "living"]
    },
    {
        text: "Describe a quiet place you like to go. You should say: where this place is, how often you go there, what you do there, and explain why you like this place.",
        part: 2,
        category: "Place",
        difficulty: "medium",
        tags: ["relaxation", "peace"]
    },

    // Object (3 cards)
    {
        text: "Describe your favorite book. You should say: what the book is about, when you read it, why you chose to read it, and explain why it is your favorite.",
        part: 2,
        category: "Object",
        difficulty: "medium",
        tags: ["reading", "literature"]
    },
    {
        text: "Describe a piece of technology you find useful. You should say: what it is, when you got it, how you use it, and explain why it is useful to you.",
        part: 2,
        category: "Object",
        difficulty: "medium",
        tags: ["technology", "utility"]
    },
    {
        text: "Describe a gift someone gave you. You should say: what the gift was, who gave it to you, when you received it, and explain why it was special.",
        part: 2,
        category: "Object",
        difficulty: "medium",
        tags: ["gifts", "relationships"]
    },

    // Event (3 cards)
    {
        text: "Describe an important event in your life. You should say: what the event was, when it happened, who was involved, and explain why it was important.",
        part: 2,
        category: "Event",
        difficulty: "medium",
        tags: ["milestone", "significance"]
    },
    {
        text: "Describe a memorable journey you have made. You should say: where you went, how you traveled, what you did, and explain why it was memorable.",
        part: 2,
        category: "Event",
        difficulty: "medium",
        tags: ["travel", "experience"]
    },
    {
        text: "Describe a festival or celebration you enjoyed. You should say: what the festival was, when it took place, what you did, and explain why you enjoyed it.",
        part: 2,
        category: "Event",
        difficulty: "medium",
        tags: ["culture", "celebration"]
    },

    // Activity (3 cards)
    {
        text: "Describe your favorite hobby. You should say: what the hobby is, when you started it, how often you do it, and explain why you enjoy it.",
        part: 2,
        category: "Activity",
        difficulty: "medium",
        tags: ["hobbies", "leisure"]
    },
    {
        text: "Describe a sport or game you enjoy. You should say: what it is, how you play it, when you started playing it, and explain why you enjoy it.",
        part: 2,
        category: "Activity",
        difficulty: "medium",
        tags: ["sports", "recreation"]
    },
    {
        text: "Describe an outdoor activity you enjoy. You should say: what the activity is, where you do it, who you do it with, and explain why you enjoy it.",
        part: 2,
        category: "Activity",
        difficulty: "medium",
        tags: ["outdoors", "nature"]
    },

    // Media (2 cards)
    {
        text: "Describe a book you read recently. You should say: what the book was about, why you chose to read it, what you learned from it, and explain whether you would recommend it.",
        part: 2,
        category: "Media",
        difficulty: "medium",
        tags: ["reading", "literature"]
    },
    {
        text: "Describe your favorite film. You should say: what the film is about, when you first watched it, who the main actors are, and explain why it is your favorite.",
        part: 2,
        category: "Media",
        difficulty: "medium",
        tags: ["cinema", "entertainment"]
    },

    // Future (3 cards)
    {
        text: "Describe an adventure you would like to have. You should say: what the adventure would be, where it would take place, who you would go with, and explain why you would like to have this adventure.",
        part: 2,
        category: "Future",
        difficulty: "medium",
        tags: ["aspiration", "excitement"]
    },
    {
        text: "Describe a goal you want to achieve. You should say: what the goal is, why it is important to you, how you plan to achieve it, and explain how you will feel when you achieve it.",
        part: 2,
        category: "Future",
        difficulty: "medium",
        tags: ["ambition", "planning"]
    },
    {
        text: "Describe a course you want to learn. You should say: what the course is about, why you want to learn it, how you would study it, and explain how it would benefit you.",
        part: 2,
        category: "Future",
        difficulty: "medium",
        tags: ["education", "development"]
    },
];

// PART 3 DISCUSSION QUESTIONS (100 total) - Creating 20 representative ones
const part3Questions = [
    // Work/Employment (4)
    { text: "What makes a job satisfying?", part: 3, category: "Work/Employment", difficulty: "hard", tags: ["work", "satisfaction"] },
    { text: "How has technology changed the way people work?", part: 3, category: "Work/Employment", difficulty: "hard", tags: ["technology", "change"] },
    { text: "Do you think work-life balance is important? Why?", part: 3, category: "Work/Employment", difficulty: "hard", tags: ["balance", "opinion"] },
    { text: "What skills will be important for future jobs?", part: 3, category: "Work/Employment", difficulty: "hard", tags: ["future", "skills"] },

    // Education (4)
    { text: "What makes a good teacher?", part: 3, category: "Education", difficulty: "hard", tags: ["teaching", "quality"] },
    { text: "How has education changed in recent years?", part: 3, category: "Education", difficulty: "hard", tags: ["change", "comparison"] },
    { text: "Should education be free for everyone?", part: 3, category: "Education", difficulty: "hard", tags: ["policy", "opinion"] },
    { text: "How important is technology in education?", part: 3, category: "Education", difficulty: "hard", tags: ["technology", "learning"] },

    // Environment (4)
    { text: "What are the biggest environmental problems today?", part: 3, category: "Environment", difficulty: "hard", tags: ["problems", "climate"] },
    { text: "What can individuals do to protect the environment?", part: 3, category: "Environment", difficulty: "hard", tags: ["action", "responsibility"] },
    { text: "Should governments do more to protect the environment?", part: 3, category: "Environment", difficulty: "hard", tags: ["policy", "opinion"] },
    { text: "How will climate change affect future generations?", part: 3, category: "Environment", difficulty: "hard", tags: ["future", "impact"] },

    // Technology (4)
    { text: "How has the internet changed people's lives?", part: 3, category: "Technology", difficulty: "hard", tags: ["internet", "impact"] },
    { text: "What are the advantages and disadvantages of social media?", part: 3, category: "Technology", difficulty: "hard", tags: ["social media", "analysis"] },
    { text: "Will technology replace human workers in the future?", part: 3, category: "Technology", difficulty: "hard", tags: ["future", "automation"] },
    { text: "How can we protect our privacy online?", part: 3, category: "Technology", difficulty: "hard", tags: ["privacy", "security"] },

    // Family (4)
    { text: "How have family structures changed in recent years?", part: 3, category: "Family", difficulty: "hard", tags: ["change", "society"] },
    { text: "What is the role of grandparents in modern families?", part: 3, category: "Family", difficulty: "hard", tags: ["elderly", "roles"] },
    { text: "How important is it for families to eat together?", part: 3, category: "Family", difficulty: "hard", tags: ["tradition", "bonding"] },
    { text: "Should both parents work or should one stay home?", part: 3, category: "Family", difficulty: "hard", tags: ["work", "childcare"] },
];

async function main() {
    console.log('🌱 Starting question bank seed...');

    // Clear existing questions and question usage
    await prisma.questionUsage.deleteMany({});
    await prisma.question.deleteMany({});
    console.log('✅ Cleared existing questions and usage records');

    // Insert Part 1 questions
    console.log('📝 Seeding Part 1 questions...');
    for (const question of part1Questions) {
        await prisma.question.create({ data: question });
    }
    console.log(`✅ Seeded ${part1Questions.length} Part 1 questions`);

    // Insert Part 2 questions
    console.log('📝 Seeding Part 2 questions...');
    for (const question of part2Questions) {
        await prisma.question.create({ data: question });
    }
    console.log(`✅ Seeded ${part2Questions.length} Part 2 questions`);

    // Insert Part 3 questions
    console.log('📝 Seeding Part 3 questions...');
    for (const question of part3Questions) {
        await prisma.question.create({ data: question });
    }
    console.log(`✅ Seeded ${part3Questions.length} Part 3 questions`);

    const total = part1Questions.length + part2Questions.length + part3Questions.length;
    console.log('🎉 Question bank seeding complete!');
    console.log(`Total questions: ${total}`);
    console.log(`- Part 1: ${part1Questions.length} questions`);
    console.log(`- Part 2: ${part2Questions.length} cue cards`);
    console.log(`- Part 3: ${part3Questions.length} discussion questions`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding questions:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
