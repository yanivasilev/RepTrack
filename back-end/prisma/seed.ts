import { prisma } from "../src/db";

async function main() {
    const exercises = [
        // BODYWEIGHT
        { name: "Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT" },
        { name: "Incline Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT" },
        { name: "Decline Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT" },
        { name: "Diamond Push-up", isBodyweight: true, muscleGroup: "TRICEPS", equipment: "BODYWEIGHT" },
        { name: "Wide Grip Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT" },
        { name: "Pike Push-up", isBodyweight: true, muscleGroup: "SHOULDERS", equipment: "BODYWEIGHT" },
        { name: "Handstand Push-up", isBodyweight: true, muscleGroup: "SHOULDERS", equipment: "BODYWEIGHT" },
        { name: "Dips", isBodyweight: true, muscleGroup: "TRICEPS", equipment: "BODYWEIGHT" },
        { name: "Bench Dips", isBodyweight: true, muscleGroup: "TRICEPS", equipment: "BODYWEIGHT" },
        { name: "Pull-up", isBodyweight: true, muscleGroup: "BACK", equipment: "BODYWEIGHT" },
        { name: "Chin-up", isBodyweight: true, muscleGroup: "BICEPS", equipment: "BODYWEIGHT" },
        { name: "Inverted Row", isBodyweight: true, muscleGroup: "BACK", equipment: "BODYWEIGHT" },
        { name: "Bodyweight Squat", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Jump Squat", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Lunge", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Reverse Lunge", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Walking Lunge", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Bulgarian Split Squat", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT" },
        { name: "Step-up", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Single-Leg Romanian Deadlift", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT" },
        { name: "Glute Bridge", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT" },
        { name: "Single-Leg Glute Bridge", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT" },
        { name: "Hip Thrust", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT" },
        { name: "Calf Raise", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Single-Leg Calf Raise", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT" },
        { name: "Plank", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Side Plank", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Hollow Body Hold", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Dead Bug", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Bird Dog", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Crunch", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Bicycle Crunch", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Leg Raise", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Hanging Knee Raise", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT" },
        { name: "Mountain Climbers", isBodyweight: true, muscleGroup: "FULL_BODY", equipment: "BODYWEIGHT" },
        { name: "Burpee", isBodyweight: true, muscleGroup: "FULL_BODY", equipment: "BODYWEIGHT" },

        // BARBELL
        { name: "Barbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "BARBELL" },
        { name: "Incline Barbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "BARBELL" },
        { name: "Close-Grip Barbell Bench Press", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "BARBELL" },
        { name: "Barbell Deadlift", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL" },
        { name: "Romanian Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL" },
        { name: "Sumo Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL" },
        { name: "Barbell Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL" },
        { name: "Front Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL" },
        { name: "Box Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL" },
        { name: "Barbell Overhead Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "BARBELL" },
        { name: "Push Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "BARBELL" },
        { name: "Barbell Row", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL" },
        { name: "Pendlay Row", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL" },
        { name: "Barbell Hip Thrust", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL" },
        { name: "Barbell Glute Bridge", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL" },
        { name: "Barbell Lunge", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL" },
        { name: "Good Morning", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL" },

        // DUMBBELL
        { name: "Dumbbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL" },
        { name: "Incline Dumbbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL" },
        { name: "Dumbbell Fly", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL" },
        { name: "Dumbbell Pullover", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL" },
        { name: "Dumbbell Shoulder Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL" },
        { name: "Arnold Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL" },
        { name: "Dumbbell Lateral Raise", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL" },
        { name: "Dumbbell Front Raise", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL" },
        { name: "Dumbbell Reverse Fly", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL" },
        { name: "Dumbbell Row", isBodyweight: false, muscleGroup: "BACK", equipment: "DUMBBELL" },
        { name: "Dumbbell Shrug", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL" },
        { name: "Dumbbell Bicep Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "DUMBBELL" },
        { name: "Hammer Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "DUMBBELL" },
        { name: "Concentration Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "DUMBBELL" },
        { name: "Dumbbell Tricep Extension", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "DUMBBELL" },
        { name: "Skull Crushers (Dumbbells)", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "DUMBBELL" },
        { name: "Dumbbell Goblet Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "DUMBBELL" },
        { name: "Dumbbell Romanian Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "DUMBBELL" },
        { name: "Dumbbell Split Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "DUMBBELL" },
        { name: "Dumbbell Step-up", isBodyweight: false, muscleGroup: "LEGS", equipment: "DUMBBELL" },

        // CABLE
        { name: "Cable Chest Fly", isBodyweight: false, muscleGroup: "CHEST", equipment: "CABLE" },
        { name: "Cable Crossover", isBodyweight: false, muscleGroup: "CHEST", equipment: "CABLE" },
        { name: "Cable Row", isBodyweight: false, muscleGroup: "BACK", equipment: "CABLE" },
        { name: "Lat Pulldown (Cable)", isBodyweight: false, muscleGroup: "BACK", equipment: "CABLE" },
        { name: "Face Pull", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "CABLE" },
        { name: "Tricep Pushdown", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "CABLE" },
        { name: "Overhead Tricep Extension (Cable)", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "CABLE" },
        { name: "Cable Bicep Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "CABLE" },
        { name: "Cable Lateral Raise", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "CABLE" },
        { name: "Cable Pull-Through", isBodyweight: false, muscleGroup: "GLUTES", equipment: "CABLE" },
        { name: "Cable Crunch", isBodyweight: false, muscleGroup: "CORE", equipment: "CABLE" },
        { name: "Woodchopper (Cable)", isBodyweight: false, muscleGroup: "CORE", equipment: "CABLE" },

        // MACHINE
        { name: "Chest Press Machine", isBodyweight: false, muscleGroup: "CHEST", equipment: "MACHINE" },
        { name: "Pec Deck Machine", isBodyweight: false, muscleGroup: "CHEST", equipment: "MACHINE" },
        { name: "Seated Row Machine", isBodyweight: false, muscleGroup: "BACK", equipment: "MACHINE" },
        { name: "Assisted Pull-up Machine", isBodyweight: false, muscleGroup: "BACK", equipment: "MACHINE" },
        { name: "Shoulder Press Machine", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "MACHINE" },
        { name: "Leg Press", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Leg Extension", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Leg Curl", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Hack Squat Machine", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Smith Machine Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Smith Machine Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "MACHINE" },
        { name: "Seated Calf Raise Machine", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Standing Calf Raise Machine", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },

        // KETTLEBELL
        { name: "Kettlebell Swing", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "KETTLEBELL" },
        { name: "Kettlebell Goblet Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "KETTLEBELL" },
        { name: "Kettlebell Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "KETTLEBELL" },
        { name: "Kettlebell Clean", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "KETTLEBELL" },
        { name: "Kettlebell Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "KETTLEBELL" },
        { name: "Kettlebell Row", isBodyweight: false, muscleGroup: "BACK", equipment: "KETTLEBELL" },
        { name: "Turkish Get-Up", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "KETTLEBELL" },

        // BAND
        { name: "Band Pull-Apart", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "BAND" },
        { name: "Band Row", isBodyweight: false, muscleGroup: "BACK", equipment: "BAND" },
        { name: "Band Chest Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "BAND" },
        { name: "Band Bicep Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "BAND" },
        { name: "Band Tricep Pushdown", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "BAND" },
        { name: "Band Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BAND" },
        { name: "Lateral Band Walk", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BAND" },
        { name: "Band Pallof Press", isBodyweight: false, muscleGroup: "CORE", equipment: "BAND" },

        // CARDIO
        { name: "Cycling (Stationary Bike)", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Rowing (Erg)", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "MACHINE" },
        { name: "Stair Climber", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" },
        { name: "Elliptical", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "MACHINE" },
        { name: "Treadmill Walk (Incline)", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE" }
    ] as const;

    for (const ex of exercises) {
        await prisma.exercise.upsert({
            where: { name: ex.name },
            update: {
                isBodyweight: ex.isBodyweight,
                muscleGroup: ex.muscleGroup as any,
                equipment: ex.equipment as any,
            },
            create: {
                name: ex.name,
                isBodyweight: ex.isBodyweight,
                muscleGroup: ex.muscleGroup as any,
                equipment: ex.equipment as any,
            },
        });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
