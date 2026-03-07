import { Exercise } from "../../../../libs/types/common/exercises/Exercise";
import Button from "../../../buttons/Button";

type AddExerciseButtonProps = {
    selectedExercise: Exercise | null;
    loading?: boolean;
    onSelect: (exercise: Exercise) => Promise<void> | void;
}

export default function AddExerciseButton({ selectedExercise, loading = false, onSelect }: AddExerciseButtonProps) {
    const disabled = !selectedExercise || loading;

    return (
        <Button
            label={loading ? "ADDING..." : selectedExercise ? "ADD SELECTED" : "SELECT AN EXERCISE"}
            disabled={disabled}
            onPress={async () => {
                if (!selectedExercise) return;
                await onSelect(selectedExercise);
            }}
            colour="green"
        />
    );
}
