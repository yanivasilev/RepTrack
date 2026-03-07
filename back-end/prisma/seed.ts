import { BadgeType, ExerciseType } from "../generated/prisma/enums";
import { prisma } from "../src/db";

async function main() {
    const timed = new Set([
        "Plank",
        "Side Plank",
        "Hollow Body Hold",
        "Mountain Climbers",
        "Burpee",
        "Cycling (Stationary Bike)",
        "Rowing (Erg)",
        "Stair Climber",
        "Elliptical",
        "Treadmill Walk (Incline)",
    ]);

    const exercises = [
        // BODYWEIGHT
        { name: "Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Incline Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Decline Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Diamond Push-up", isBodyweight: true, muscleGroup: "TRICEPS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Wide Grip Push-up", isBodyweight: true, muscleGroup: "CHEST", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Pike Push-up", isBodyweight: true, muscleGroup: "SHOULDERS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Handstand Push-up", isBodyweight: true, muscleGroup: "SHOULDERS", equipment: "BODYWEIGHT", experienceLevel: "ADVANCED" },
        { name: "Dips", isBodyweight: true, muscleGroup: "TRICEPS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Bench Dips", isBodyweight: true, muscleGroup: "TRICEPS", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Pull-up", isBodyweight: true, muscleGroup: "BACK", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Chin-up", isBodyweight: true, muscleGroup: "BICEPS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Inverted Row", isBodyweight: true, muscleGroup: "BACK", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Bodyweight Squat", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Jump Squat", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Lunge", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Reverse Lunge", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Walking Lunge", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Bulgarian Split Squat", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Step-up", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Single-Leg Romanian Deadlift", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Glute Bridge", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Single-Leg Glute Bridge", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Hip Thrust", isBodyweight: true, muscleGroup: "GLUTES", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Calf Raise", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Single-Leg Calf Raise", isBodyweight: true, muscleGroup: "LEGS", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Plank", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Side Plank", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Hollow Body Hold", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Dead Bug", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Bird Dog", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Crunch", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "BEGINNER" },
        { name: "Bicycle Crunch", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Leg Raise", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Hanging Knee Raise", isBodyweight: true, muscleGroup: "CORE", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Mountain Climbers", isBodyweight: true, muscleGroup: "FULL_BODY", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },
        { name: "Burpee", isBodyweight: true, muscleGroup: "FULL_BODY", equipment: "BODYWEIGHT", experienceLevel: "INTERMEDIATE" },

        // BARBELL
        { name: "Barbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Incline Barbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Close-Grip Barbell Bench Press", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Barbell Deadlift", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Romanian Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Sumo Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL", experienceLevel: "ADVANCED" },
        { name: "Barbell Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Front Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL", experienceLevel: "ADVANCED" },
        { name: "Box Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Barbell Overhead Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Push Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "BARBELL", experienceLevel: "ADVANCED" },
        { name: "Barbell Row", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Pendlay Row", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL", experienceLevel: "ADVANCED" },
        { name: "Barbell Hip Thrust", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Barbell Glute Bridge", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Barbell Lunge", isBodyweight: false, muscleGroup: "LEGS", equipment: "BARBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Good Morning", isBodyweight: false, muscleGroup: "BACK", equipment: "BARBELL", experienceLevel: "ADVANCED" },

        // DUMBBELL
        { name: "Dumbbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Incline Dumbbell Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Fly", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Pullover", isBodyweight: false, muscleGroup: "CHEST", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Shoulder Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Arnold Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Lateral Raise", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Dumbbell Front Raise", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Dumbbell Reverse Fly", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Row", isBodyweight: false, muscleGroup: "BACK", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Dumbbell Shrug", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Dumbbell Bicep Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Hammer Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Concentration Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Tricep Extension", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Skull Crushers (Dumbbells)", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Goblet Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },
        { name: "Dumbbell Romanian Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Split Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "DUMBBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Dumbbell Step-up", isBodyweight: false, muscleGroup: "LEGS", equipment: "DUMBBELL", experienceLevel: "BEGINNER" },

        // CABLE
        { name: "Cable Chest Fly", isBodyweight: false, muscleGroup: "CHEST", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Cable Crossover", isBodyweight: false, muscleGroup: "CHEST", equipment: "CABLE", experienceLevel: "INTERMEDIATE" },
        { name: "Cable Row", isBodyweight: false, muscleGroup: "BACK", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Lat Pulldown (Cable)", isBodyweight: false, muscleGroup: "BACK", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Face Pull", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Tricep Pushdown", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Overhead Tricep Extension (Cable)", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "CABLE", experienceLevel: "INTERMEDIATE" },
        { name: "Cable Bicep Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Cable Lateral Raise", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Cable Pull-Through", isBodyweight: false, muscleGroup: "GLUTES", equipment: "CABLE", experienceLevel: "INTERMEDIATE" },
        { name: "Cable Crunch", isBodyweight: false, muscleGroup: "CORE", equipment: "CABLE", experienceLevel: "BEGINNER" },
        { name: "Woodchopper (Cable)", isBodyweight: false, muscleGroup: "CORE", equipment: "CABLE", experienceLevel: "INTERMEDIATE" },

        // MACHINE
        { name: "Chest Press Machine", isBodyweight: false, muscleGroup: "CHEST", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Pec Deck Machine", isBodyweight: false, muscleGroup: "CHEST", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Seated Row Machine", isBodyweight: false, muscleGroup: "BACK", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Assisted Pull-up Machine", isBodyweight: false, muscleGroup: "BACK", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Shoulder Press Machine", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Leg Press", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Leg Extension", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Leg Curl", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Hack Squat Machine", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "INTERMEDIATE" },
        { name: "Smith Machine Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Smith Machine Bench Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Seated Calf Raise Machine", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Standing Calf Raise Machine", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },

        // KETTLEBELL
        { name: "Kettlebell Swing", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "KETTLEBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Kettlebell Goblet Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "KETTLEBELL", experienceLevel: "BEGINNER" },
        { name: "Kettlebell Deadlift", isBodyweight: false, muscleGroup: "GLUTES", equipment: "KETTLEBELL", experienceLevel: "BEGINNER" },
        { name: "Kettlebell Clean", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "KETTLEBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Kettlebell Press", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "KETTLEBELL", experienceLevel: "INTERMEDIATE" },
        { name: "Kettlebell Row", isBodyweight: false, muscleGroup: "BACK", equipment: "KETTLEBELL", experienceLevel: "BEGINNER" },
        { name: "Turkish Get-Up", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "KETTLEBELL", experienceLevel: "ADVANCED" },

        // BAND
        { name: "Band Pull-Apart", isBodyweight: false, muscleGroup: "SHOULDERS", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Band Row", isBodyweight: false, muscleGroup: "BACK", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Band Chest Press", isBodyweight: false, muscleGroup: "CHEST", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Band Bicep Curl", isBodyweight: false, muscleGroup: "BICEPS", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Band Tricep Pushdown", isBodyweight: false, muscleGroup: "TRICEPS", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Band Squat", isBodyweight: false, muscleGroup: "LEGS", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Lateral Band Walk", isBodyweight: false, muscleGroup: "GLUTES", equipment: "BAND", experienceLevel: "BEGINNER" },
        { name: "Band Pallof Press", isBodyweight: false, muscleGroup: "CORE", equipment: "BAND", experienceLevel: "INTERMEDIATE" },

        // CARDIO
        { name: "Cycling (Stationary Bike)", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Rowing (Erg)", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "MACHINE", experienceLevel: "INTERMEDIATE" },
        { name: "Stair Climber", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "INTERMEDIATE" },
        { name: "Elliptical", isBodyweight: false, muscleGroup: "FULL_BODY", equipment: "MACHINE", experienceLevel: "BEGINNER" },
        { name: "Treadmill Walk (Incline)", isBodyweight: false, muscleGroup: "LEGS", equipment: "MACHINE", experienceLevel: "BEGINNER" },
    ] as const;

    for (const ex of exercises) {
        const exerciseType = timed.has(ex.name) ? "TIMED" : "REPS";

        await prisma.exercise.upsert({
            where: { name: ex.name },
            update: {
                isBodyweight: ex.isBodyweight,
                muscleGroup: ex.muscleGroup,
                equipment: ex.equipment,
                experienceLevel: ex.experienceLevel,
                exerciseType: exerciseType,
            },
            create: {
                name: ex.name,
                isBodyweight: ex.isBodyweight,
                muscleGroup: ex.muscleGroup,
                equipment: ex.equipment,
                experienceLevel: ex.experienceLevel,
                exerciseType: exerciseType,
            },
        });
    }

    const badges = [
        { type: BadgeType.FIRST_WORKOUT, name: "First Workout", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_5, name: "5 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_15, name: "15 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_20, name: "20 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_25, name: "25 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_50, name: "50 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_75, name: "75 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_100, name: "100 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_150, name: "150 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_200, name: "200 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_300, name: "300 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_400, name: "400 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_500, name: "500 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_600, name: "600 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_750, name: "750 Workouts", icon: "Trophy" },
        { type: BadgeType.WORKOUTS_1000, name: "1000 Workouts", icon: "Trophy" },
        { type: BadgeType.TOTAL_5_HOURS, name: "5 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_10_HOURS, name: "10 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_15_HOURS, name: "15 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_20_HOURS, name: "20 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_25_HOURS, name: "25 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_50_HOURS, name: "50 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_75_HOURS, name: "75 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_100_HOURS, name: "100 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_150_HOURS, name: "150 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_200_HOURS, name: "200 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_300_HOURS, name: "300 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_500_HOURS, name: "500 Hours", icon: "Clock" },
        { type: BadgeType.TOTAL_1000_HOURS, name: "1000 Hours", icon: "Clock" },
        { type: BadgeType.STREAK_2, name: "2-Day Streak", icon: "Fire" },
        { type: BadgeType.STREAK_3, name: "5-Day Streak", icon: "Fire" },
        { type: BadgeType.STREAK_7, name: "7-Day Streak", icon: "Fire" },
        { type: BadgeType.VOLUME_1000, name: "1,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_5000, name: "5,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_10K, name: "10,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_25k, name: "25,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_50k, name: "50,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_75k, name: "75,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_100k, name: "100,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_250k, name: "250,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_500k, name: "500,000 Volume", icon: "Dumbell" },
        { type: BadgeType.VOLUME_1M, name: "1,000,000 Volume", icon: "Dumbell" },
    ] as const;

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { type: badge.type },
            update: { name: badge.name, icon: badge.icon },
            create: badge,
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
