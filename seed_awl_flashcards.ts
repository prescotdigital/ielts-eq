import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Academic Word List (AWL) - 570 essential academic words
// Organized by sublist (1 = most frequent, 10 = least frequent)
// This is a curated selection of the most important AWL words

const awlWords = [
    // SUBLIST 1 (Most Frequent - 60 words)
    {
        word: "analyze",
        definition: "to examine something in detail in order to understand it better or discover more about it",
        example: "Scientists analyze data to find patterns and draw conclusions.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "approach",
        definition: "a way of dealing with something or thinking about something",
        example: "We need a new approach to solving this environmental problem.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "area",
        definition: "a particular subject or range of activity",
        example: "His research focuses on the area of artificial intelligence.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "assess",
        definition: "to make a judgment about the nature or quality of something",
        example: "Teachers assess students' progress through regular testing.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "assume",
        definition: "to think or accept that something is true but without having proof of it",
        example: "We cannot assume that everyone has access to the internet.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "authority",
        definition: "the power or right to give orders, make decisions, and enforce obedience",
        example: "The government has the authority to create new laws.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "available",
        definition: "able to be used or obtained; at someone's disposal",
        example: "This information is available on our website.",
        partOfSpeech: "adjective",
        sublist: 1
    },
    {
        word: "benefit",
        definition: "an advantage or profit gained from something",
        example: "The benefits of regular exercise include better health and more energy.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "concept",
        definition: "an abstract idea or general notion",
        example: "Democracy is an important political concept.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "consist",
        definition: "to be composed or made up of",
        example: "The exam consists of three parts: reading, writing, and speaking.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "constitute",
        definition: "to be or be equivalent to something",
        example: "Women constitute 60% of the student body.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "context",
        definition: "the circumstances that form the setting for an event, statement, or idea",
        example: "You need to understand the historical context of this document.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "contract",
        definition: "a written or spoken agreement intended to be enforceable by law",
        example: "She signed a two-year employment contract.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "create",
        definition: "to bring something into existence",
        example: "The company plans to create 500 new jobs.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "data",
        definition: "facts and statistics collected together for reference or analysis",
        example: "The researchers collected data from over 10,000 participants.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "define",
        definition: "to state or describe exactly the nature, scope, or meaning of",
        example: "It is difficult to define what makes a good teacher.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "derive",
        definition: "to obtain something from a specified source",
        example: "Many English words are derived from Latin.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "distribute",
        definition: "to give shares of something to each of a number of recipients",
        example: "The organization distributes food to homeless people.",
        partOfSpeech: "verb",
        sublist: 1
    },
    {
        word: "economy",
        definition: "the system of production, distribution, and consumption of goods and services",
        example: "The country's economy is heavily dependent on tourism.",
        partOfSpeech: "noun",
        sublist: 1
    },
    {
        word: "environment",
        definition: "the surroundings or conditions in which a person, animal, or plant lives",
        example: "We must protect the environment for future generations.",
        partOfSpeech: "noun",
        sublist: 1
    },

    // SUBLIST 2 (60 words)
    {
        word: "achieve",
        definition: "to successfully complete something or reach a goal",
        example: "She achieved her goal of graduating with honors.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "acquire",
        definition: "to gain possession of something",
        example: "Children acquire language skills naturally through exposure.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "administration",
        definition: "the management of a business, institution, or organization",
        example: "The hospital administration decided to hire more nurses.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "affect",
        definition: "to have an influence on or cause a change in something",
        example: "Climate change affects weather patterns worldwide.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "appropriate",
        definition: "suitable or proper in the circumstances",
        example: "Wearing formal clothes is appropriate for a job interview.",
        partOfSpeech: "adjective",
        sublist: 2
    },
    {
        word: "aspect",
        definition: "a particular part or feature of something",
        example: "We need to consider all aspects of the problem.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "assist",
        definition: "to help someone do something",
        example: "The teacher assisted students with their research projects.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "category",
        definition: "a class or division of people or things regarded as having particular shared characteristics",
        example: "Products are organized into different categories.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "chapter",
        definition: "a main division of a book",
        example: "Please read chapters 1 through 5 for next week.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "commission",
        definition: "an instruction or command to do something",
        example: "The artist received a commission to paint a portrait.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "community",
        definition: "a group of people living in the same place or having a particular characteristic in common",
        example: "The local community organized a festival.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "complex",
        definition: "consisting of many different and connected parts; complicated",
        example: "Climate change is a complex issue with no simple solutions.",
        partOfSpeech: "adjective",
        sublist: 2
    },
    {
        word: "compute",
        definition: "to calculate or reckon a figure or amount",
        example: "The program computes the total cost automatically.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "conclude",
        definition: "to arrive at a judgment or opinion by reasoning",
        example: "The researchers concluded that more study was needed.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "conduct",
        definition: "to organize and carry out",
        example: "The university conducted a survey of student satisfaction.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "consequent",
        definition: "following as a result or effect",
        example: "The drought and consequent food shortages caused many problems.",
        partOfSpeech: "adjective",
        sublist: 2
    },
    {
        word: "construct",
        definition: "to build or make something",
        example: "Workers are constructing a new bridge across the river.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "consume",
        definition: "to use up a resource",
        example: "Americans consume more energy per person than most other nations.",
        partOfSpeech: "verb",
        sublist: 2
    },
    {
        word: "credit",
        definition: "public acknowledgment or praise, typically given for achievement",
        example: "She deserves credit for making the project successful.",
        partOfSpeech: "noun",
        sublist: 2
    },
    {
        word: "culture",
        definition: "the customs, arts, social institutions, and achievements of a particular nation or people",
        example: "Students should learn about different cultures around the world.",
        partOfSpeech: "noun",
        sublist: 2
    },

    // SUBLIST 3 (60 words)
    {
        word: "alternative",
        definition: "one of two or more available possibilities",
        example: "Solar power is an alternative to fossil fuels.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "circumstance",
        definition: "a fact or condition connected with or relevant to an event or action",
        example: "Under the circumstances, we had to cancel the event.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "comment",
        definition: "a verbal or written remark expressing an opinion or reaction",
        example: "The professor made several comments on my essay.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "compensate",
        definition: "to give someone something, typically money, in recognition of loss or suffering",
        example: "The company compensated workers for overtime hours.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "component",
        definition: "a part or element of a larger whole",
        example: "Trust is an important component of a successful relationship.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "consent",
        definition: "permission for something to happen or agreement to do something",
        example: "Patients must give their consent before treatment begins.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "considerable",
        definition: "notably large in size, amount, or extent",
        example: "The project required considerable time and effort.",
        partOfSpeech: "adjective",
        sublist: 3
    },
    {
        word: "constant",
        definition: "occurring continuously over a period of time",
        example: "The patient needs constant medical attention.",
        partOfSpeech: "adjective",
        sublist: 3
    },
    {
        word: "constraint",
        definition: "a limitation or restriction",
        example: "Budget constraints forced us to reduce staff.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "contribute",
        definition: "to give something in order to help achieve or provide something",
        example: "Everyone contributed ideas to improve the project.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "convene",
        definition: "to come or bring together for a meeting or activity",
        example: "The committee will convene next month to discuss the proposal.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "coordinate",
        definition: "to bring the different elements of a complex activity together",
        example: "We need to coordinate our efforts to meet the deadline.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "core",
        definition: "the central or most important part of something",
        example: "Communication is at the core of effective teamwork.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "corporate",
        definition: "relating to a large company or group",
        example: "She works for a large corporate law firm.",
        partOfSpeech: "adjective",
        sublist: 3
    },
    {
        word: "correspond",
        definition: "to have a close similarity or be equivalent to something",
        example: "The statistics correspond with our predictions.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "criteria",
        definition: "a standard by which something may be judged or decided",
        example: "The criteria for admission include academic performance and test scores.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "deduce",
        definition: "to arrive at a conclusion by reasoning",
        example: "From the evidence, we can deduce that he was present at the scene.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "demonstrate",
        definition: "to clearly show the existence or truth of something by giving proof or evidence",
        example: "The experiment demonstrates the importance of clean water.",
        partOfSpeech: "verb",
        sublist: 3
    },
    {
        word: "document",
        definition: "a piece of written, printed, or electronic matter that provides information or evidence",
        example: "Please sign and return the document by Friday.",
        partOfSpeech: "noun",
        sublist: 3
    },
    {
        word: "dominate",
        definition: "to have power and influence over",
        example: "Technology companies dominate the stock market.",
        partOfSpeech: "verb",
        sublist: 3
    },

    // SUBLIST 4 (60 words)
    {
        word: "access",
        definition: "the means or opportunity to approach or enter a place",
        example: "All students have access to the university library.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "adequate",
        definition: "satisfactory or acceptable in quality or quantity",
        example: "Make sure you get adequate sleep before the exam.",
        partOfSpeech: "adjective",
        sublist: 4
    },
    {
        word: "annual",
        definition: "occurring once every year",
        example: "The company holds an annual meeting for shareholders.",
        partOfSpeech: "adjective",
        sublist: 4
    },
    {
        word: "apparent",
        definition: "clearly visible or understood; obvious",
        example: "It was apparent that she had not prepared for the presentation.",
        partOfSpeech: "adjective",
        sublist: 4
    },
    {
        word: "approximate",
        definition: "close to the actual, but not completely accurate",
        example: "The approximate cost of the project is $50,000.",
        partOfSpeech: "adjective",
        sublist: 4
    },
    {
        word: "attitude",
        definition: "a settled way of thinking or feeling about something",
        example: "A positive attitude can help you overcome challenges.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "attribute",
        definition: "a quality or feature regarded as characteristic of someone or something",
        example: "Patience is an important attribute for teachers.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "civil",
        definition: "relating to ordinary citizens and their concerns",
        example: "Civil rights are protected by the constitution.",
        partOfSpeech: "adjective",
        sublist: 4
    },
    {
        word: "code",
        definition: "a system of words, letters, or signs used to represent a message in secret form",
        example: "The message was written in code.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "commit",
        definition: "to pledge or bind to a certain course or policy",
        example: "The government committed to reducing carbon emissions.",
        partOfSpeech: "verb",
        sublist: 4
    },
    {
        word: "communicate",
        definition: "to share or exchange information, news, or ideas",
        example: "It's important to communicate clearly with your team.",
        partOfSpeech: "verb",
        sublist: 4
    },
    {
        word: "concentrate",
        definition: "to focus all one's attention on a particular object or activity",
        example: "I can't concentrate with all this noise.",
        partOfSpeech: "verb",
        sublist: 4
    },
    {
        word: "conference",
        definition: "a formal meeting for discussion",
        example: "She attended an international conference on climate change.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "contrast",
        definition: "the state of being strikingly different from something else",
        example: "There is a sharp contrast between rich and poor neighborhoods.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "cycle",
        definition: "a series of events that are regularly repeated in the same order",
        example: "The water cycle describes how water moves through the environment.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "debate",
        definition: "a formal discussion on a particular topic",
        example: "There is ongoing debate about the best approach to education.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "despite",
        definition: "without being affected by; in spite of",
        example: "Despite the rain, the concert continued as planned.",
        partOfSpeech: "preposition",
        sublist: 4
    },
    {
        word: "dimension",
        definition: "a measurable extent of some kind, such as length, breadth, or height",
        example: "We need to consider all dimensions of the problem.",
        partOfSpeech: "noun",
        sublist: 4
    },
    {
        word: "domestic",
        definition: "relating to the home or family relations",
        example: "Domestic violence is a serious social problem.",
        partOfSpeech: "adjective",
        sublist: 4
    },
    {
        word: "emerge",
        definition: "to become apparent or prominent",
        example: "New technologies continue to emerge every year.",
        partOfSpeech: "verb",
        sublist: 4
    },

    // SUBLIST 5 (60 words - selection)
    {
        word: "academic",
        definition: "relating to education and scholarship",
        example: "She has an excellent academic record.",
        partOfSpeech: "adjective",
        sublist: 5
    },
    {
        word: "adjust",
        definition: "to alter or move something slightly in order to achieve the desired result",
        example: "You may need to adjust your study methods for university.",
        partOfSpeech: "verb",
        sublist: 5
    },
    {
        word: "alter",
        definition: "to change or cause to change in character or composition",
        example: "Climate change is altering weather patterns globally.",
        partOfSpeech: "verb",
        sublist: 5
    },
    {
        word: "amendment",
        definition: "a minor change or addition designed to improve a text or piece of legislation",
        example: "The committee proposed several amendments to the constitution.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "aware",
        definition: "having knowledge or perception of a situation or fact",
        example: "Students should be aware of the exam requirements.",
        partOfSpeech: "adjective",
        sublist: 5
    },
    {
        word: "capacity",
        definition: "the maximum amount that something can contain or produce",
        example: "The stadium has a seating capacity of 50,000 people.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "challenge",
        definition: "a task or situation that tests someone's abilities",
        example: "Learning a new language is a challenging but rewarding experience.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "clause",
        definition: "a unit of grammatical organization",
        example: "A complex sentence contains multiple clauses.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "compound",
        definition: "a thing that is composed of two or more separate elements",
        example: "Water is a compound made of hydrogen and oxygen.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "conflict",
        definition: "a serious disagreement or argument",
        example: "The conflict between the two countries lasted for decades.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "consult",
        definition: "to seek information or advice from someone",
        example: "You should consult a doctor if symptoms persist.",
        partOfSpeech: "verb",
        sublist: 5
    },
    {
        word: "contact",
        definition: "the state of physical touching or communication",
        example: "Please contact me if you have any questions.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "decline",
        definition: "to become smaller, fewer, or less; decrease",
        example: "Sales have declined by 20% this year.",
        partOfSpeech: "verb",
        sublist: 5
    },
    {
        word: "discrete",
        definition: "individually separate and distinct",
        example: "The process can be divided into discrete steps.",
        partOfSpeech: "adjective",
        sublist: 5
    },
    {
        word: "draft",
        definition: "a preliminary version of a piece of writing",
        example: "Please submit a draft of your essay by next week.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "enable",
        definition: "to give someone the authority or means to do something",
        example: "Technology enables people to work from anywhere.",
        partOfSpeech: "verb",
        sublist: 5
    },
    {
        word: "energy",
        definition: "power derived from physical or chemical resources",
        example: "Renewable energy sources include solar and wind power.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "enforce",
        definition: "to compel observance of or compliance with",
        example: "Police enforce traffic laws to keep roads safe.",
        partOfSpeech: "verb",
        sublist: 5
    },
    {
        word: "entity",
        definition: "a thing with distinct and independent existence",
        example: "The company operates as a separate legal entity.",
        partOfSpeech: "noun",
        sublist: 5
    },
    {
        word: "equivalent",
        definition: "equal in value, amount, function, or meaning",
        example: "A Master's degree is roughly equivalent to five years of work experience.",
        partOfSpeech: "adjective",
        sublist: 5
    }
];

async function main() {
    console.log('🌱 Seeding AWL flashcards...');

    // Clear existing flashcards
    // await prisma.flashcard.deleteMany({});
    // console.log('Cleared existing flashcards');

    // Insert AWL words
    for (const word of awlWords) {
        await prisma.flashcard.create({
            data: word
        });
    }

    console.log(`✅ Seeded ${awlWords.length} AWL flashcards`);
    console.log(`📊 Breakdown by sublist:`);

    for (let i = 1; i <= 5; i++) {
        const count = awlWords.filter(w => w.sublist === i).length;
        console.log(`   Sublist ${i}: ${count} words`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
